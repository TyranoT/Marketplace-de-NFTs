# Arquitetura

Decisões de projeto do marketplace **Kurio**, com o raciocínio por trás delas.
Este documento cresce a cada entrega; hoje cobre a camada de dados e a tela de
carrinho.

## Stack

| Responsabilidade | Escolha                                            |
| ---------------- | -------------------------------------------------- |
| Interface        | React 19                                           |
| Roteamento       | TanStack Router (file-based) sobre TanStack Start  |
| Estado remoto    | TanStack Query v5                                  |
| Cliente HTTP     | Axios                                              |
| Mocking          | MSW (Service Worker, no navegador)                 |
| Estilização      | Tailwind CSS v4 (CSS-first, sem `tailwind.config`) |
| Componentes      | shadcn/ui sobre `@base-ui/react`                   |
| Build / deploy   | Vite 8 + Nitro → Vercel                            |

## Organização

```
src/global/     código compartilhado: api, mocks, componentes de UI, dados, helpers
src/features/   uma pasta por domínio (layout, marketplace, cart)
src/routes/     rotas finas, que delegam para uma composição da feature
```

Configuração mora em `global`; features consomem. Uma feature só importa outra
pela API pública do barrel (`index.ts`).

---

## Camada de dados

### Cliente HTTP

`src/global/api/http.ts` — instância única do Axios, `baseURL: '/api'` relativo
(funciona em dev, preview e Vercel sem variável de ambiente, e é o caminho que
o Service Worker intercepta).

Os interceptors fazem **apenas** o que é transporte: injetam `x-request-id` e
convertem qualquer falha em `ApiError` (`src/global/api/api-error.ts`), que
classifica o erro em `network | timeout | canceled | unauthorized | forbidden |
not_found | conflict | validation | server | unknown`.

O código de negócio devolvido pela API (`COUPON_EXPIRED`,
`QUANTITY_EXCEEDS_AVAILABILITY`, …) atravessa intacto até o hook da feature,
que o traduz para texto em `to-cart-error-message.ts`. Nenhuma regra de negócio
vive no cliente HTTP, e nenhuma resposta é substituída ou fabricada nele.

### Política de cache e retentativas

`src/global/api/query-client.ts`:

| Opção                  | Valor                                | Motivo                                                                                                                                                                                |
| ---------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `staleTime`            | 30s                                  | O carrinho muda por ação do próprio usuário; refazer a consulta a cada foco não traz informação nova.                                                                                 |
| `gcTime`               | 5min                                 | Voltar ao carrinho logo depois deve ser instantâneo.                                                                                                                                  |
| `refetchOnWindowFocus` | `false`                              | Evita sobrescrever um estado que o usuário acabou de alterar.                                                                                                                         |
| `retry`                | só `network` e `server`, até 2 vezes | **Nunca repetir 4xx**: cupom inválido, edição esgotada e conflito de disponibilidade são vereditos do servidor, não falhas transitórias — repetir só atrasaria a resposta ao usuário. |
| `retryDelay`           | exponencial, teto de 8s              |                                                                                                                                                                                       |
| `networkMode`          | `always`                             | Ver abaixo.                                                                                                                                                                           |

**Por que `networkMode: 'always'`** — no modo padrão (`online`), uma falha de
rede deixa a consulta _pausada_: sem erro, sem dado e sem fim. A interface fica
presa no esqueleto, sem nada a dizer nem a tentar. Com `always`, a falha vira
erro de verdade, com mensagem e botão de nova tentativa. É também o modo
coerente com um backend simulado que vive num Service Worker local, onde "o
navegador está offline" não descreve a indisponibilidade que se quer
representar.

### O `QueryClient` é criado por request

Em `getRouter()` (`src/router.tsx`), e não em escopo de módulo: `getRouter()`
roda uma vez por request no servidor, e um singleton vazaria cache de um
visitante para o próximo na mesma instância do Nitro.

`setupRouterSsrQueryIntegration` cuida da desidratação **e** envolve a árvore
com o `QueryClientProvider` através de `router.options.Wrap` — acima do shell,
e portanto acima do `Header`, que consulta a contagem do carrinho.

### Precisão dos valores em ETH

`src/global/helpers/eth-amount.ts` faz toda a aritmética em `bigint` de 18
casas (wei). `0.1 + 0.2 !== 0.3` em ponto flutuante, e o desafio exige que os
valores mantenham precisão nos cálculos e na apresentação.

- ETH é nativamente de 18 decimais: o modelo é o do domínio, não uma invenção.
- `bigint` é ES2020 e o projeto já compila para ES2022 — zero dependência nova.
- **O mesmo módulo é usado pela interface e pelos handlers do MSW.** Cliente e
  "servidor" compartilhando a aritmética é o que torna impossível o total
  exibido divergir do total da resposta — inclusive durante a atualização
  otimista.

**Arredondamento**: o desconto percentual é **truncado (floor)** em 18 casas.
Determinístico e reproduzível nos testes.

**Regra invariável**: `Wei` (bigint) nunca cruza a fronteira de rede —
`JSON.stringify` lança em bigint. No wire, todo valor é
`Money = { amount: string; currency: 'ETH' }`.

`Nft.price` no catálogo passou de `'1.19 ETH'` (string de exibição) para
`Money`. `NftSummary.price` e `NftDetail.price` continuam strings formatadas,
então nenhum componente de apresentação mudou.

> Nota: `formatEth` em `features/marketplace/helpers` continua existindo e é
> outra coisa — formata um intervalo numérico com vírgula pt-BR para o filtro
> de faixa de preço. Dinheiro usa `formatMoney`, com ponto decimal, como o
> Figma.

---

## Mocking com MSW

`src/global/mocks/`, iniciado em `src/client.tsx` **antes** de hidratar.

O `await startMocks()` não é opcional: `worker.start()` só resolve quando o
Service Worker está de fato _controlando_ a página. Hidratar antes disso
deixaria a primeira consulta — a contagem do carrinho no cabeçalho — escapar da
interceptação e bater em 404 real.

`src/global/mocks/start-mocks.ts` importa `./browser` dinamicamente sob uma
guarda de ambiente, o que mantém `msw/browser` e todos os handlers fora do
bundle do servidor (verificado no `.output/server`).

**Ligado por padrão**, inclusive no build de demonstração. `VITE_ENABLE_MOCKS=false`
desliga e libera o caminho para uma API real.

### Onde a regra de negócio mora

Tudo em `mocks/db/`, dividido por domínio: `core/` (o cliente do banco e sua
persistência), `nft/` (catálogo, preço e disponibilidade) e `cart/` (carrinho,
cupom, totais e o contrato de saída). A raiz do `db/` guarda só o `index.ts`,
que é a API pública consumida pelos handlers.

**As operações seguem o formato do Prisma Client.** `MockDbClient` expõe um
delegate por modelo e as operações de sessão prefixadas com `$`:

```ts
mockDb.cartItem.findFirst({ where: { nftId, editionId } })
mockDb.cartItem.update({ where: { id }, data: { quantity } })
mockDb.coupon.findUnique({ where: { code } })
mockDb.$transaction(() => { ... })
```

O vocabulário de leitura — `findMany`, `findFirst`, `findUnique`, `count` — é
escrito uma vez só, na classe abstrata `ModelDelegate`: cada modelo declara
apenas de onde vêm suas linhas e como uma linha casa com o filtro. Quem aceita
escrita implementa também a interface `WritableDelegate` (`create`, `update`,
`delete`). A familiaridade do formato é a documentação: quem já usou Prisma lê
o serviço sem precisar aprender uma API inventada para este projeto.

Toda escrita passa por `$transaction`, que persiste uma vez só no fim e desfaz
o que já tinha mudado se a regra recusar no meio do caminho.

A regra de negócio fica em `CartService`, como num app real em que o service
usa o client: disponibilidade, cupom e quantidade são decididos lá e em nenhum
outro lugar. `MockDb` guarda só as linhas, `MockDbStore` cuida do
`localStorage` e `CartContractMapper` é a única classe que conhece o formato de
wire. Os handlers só traduzem HTTP ↔ serviço.

É o que mantém componentes, hooks e cliente Axios livres de caminhos
alternativos de negócio, e o que permite a interface otimista reproduzir o
cálculo do servidor sem duplicar a regra.

### Estado e reset

`localStorage['kurio.mock.db.v1']`, com `seedVersion`: formato divergente é
descartado e ressemeado, em vez de quebrar em silêncio. É o que sustenta
"manter o carrinho após refresh".

O cenário-semente reproduz **exatamente** o frame do Figma — Emerald Ape #042
(2), Violet Nomad #314 (6), Ivory Baron #088 (9), subtotal 26.83 ETH, taxa
0.016, total **26.846 ETH** — para a tela servir de baseline de regressão
visual.

`POST /api/__mock/reset` restaura o cenário conhecido. É endpoint, e não função
exportada, para o Playwright preparar o estado com `request.post()` no
`beforeEach`, sem `page.evaluate` nem esperar a aplicação montar.

### Cenários de rede

Configuráveis por query string e persistidos: `?mock=slow`, `?mock=offline`,
`?mock=outOfOrder`, `?mockSeed=7`, `?mockFail=0.3`, `?mockStatus=409`.
Também em runtime, por `POST /api/__mock/scenario` — necessário para exercitar
falha e recuperação numa mesma sessão: carregar a lista com sucesso, derrubar a
próxima escrita e ver a interface se recompor. Se o único caminho fosse a query
string, o próprio carregamento inicial já falharia.

`mock` escolhe **um** modo, e escolhê-lo desliga os outros — sem isso um
`?mock=offline` gravado sobreviveria a um `?mock=fast` seguinte, e a sessão
continuaria offline sem nada na URL que explicasse o motivo.

Toda aleatoriedade vem de `mulberry32(seed)`, nunca de `Math.random()`, para os
cenários serem reproduzíveis. `outOfOrder` alterna a latência por índice de
requisição (800ms / 120ms), garantindo de forma determinística que a segunda
resposta chegue antes da primeira — é o cenário que exercita `cancelQueries` e
o `signal` repassado ao Axios.

### Cupons

| Código     | Efeito                                                |
| ---------- | ----------------------------------------------------- |
| `KURIO10`  | −10%                                                  |
| `KURIO25`  | −25%                                                  |
| `ETH005`   | −0.05 ETH                                             |
| `EXPIRADO` | 422 `COUPON_EXPIRED`                                  |
| `MINIMO30` | 409 `COUPON_NOT_APPLICABLE` (exige subtotal ≥ 30 ETH) |

Qualquer outro código → 422 `COUPON_INVALID`. A expiração é comparada com
`Date.now()`, então o relógio do Playwright controla o cenário.

---

## Contrato REST do carrinho

| Método | Rota                                         | Erros de negócio                                                                       |
| ------ | -------------------------------------------- | -------------------------------------------------------------------------------------- |
| GET    | `/api/cart`                                  | —                                                                                      |
| POST   | `/api/cart/items`                            | 409 `EDITION_SOLD_OUT`, 409 `QUANTITY_EXCEEDS_AVAILABILITY`, 404 `NFT_NOT_FOUND`       |
| PATCH  | `/api/cart/items/:itemId`                    | 409 `QUANTITY_EXCEEDS_AVAILABILITY`, 404 `CART_ITEM_NOT_FOUND`, 422 `INVALID_QUANTITY` |
| DELETE | `/api/cart/items/:itemId`                    | 404 `CART_ITEM_NOT_FOUND`                                                              |
| POST   | `/api/cart/coupon`                           | 422 `COUPON_INVALID`, 422 `COUPON_EXPIRED`, 409 `COUPON_NOT_APPLICABLE`                |
| DELETE | `/api/cart/coupon`                           | —                                                                                      |
| POST   | `/api/__mock/reset` · `/api/__mock/scenario` | —                                                                                      |

**Toda mutation devolve o `Cart` inteiro, com os totais recalculados pelo
servidor.** É a única forma de garantir que o resumo exibido seja o resumo da
API, e não uma soma feita na interface. Também permite `setQueryData` direto no
`onSuccess`, sem um refetch obrigatório.

Erros seguem `{ error: { code, message, details? } }`.

`CartItem.version` e `Cart.version` já existem, embora nada os use ainda: sem
eles os eventos de tempo real da próxima fase não teriam como ser descartados
quando chegarem atrasados ou duplicados.

## Estado do carrinho

Chaves com escopo desde já — `['cart', scope, 'detail']`, hoje sempre `'guest'`
— para que autenticação e logout isolem os dados por construção, sem reescrever
o cache depois.

### Atualização otimista

`useUpdateCartItem` (o stepper de quantidade) e `useRemoveCartItem`.

O stepper foi escolhido por ser a interação de maior frequência e por ter uma
falha de negócio real para exercitar o rollback
(`409 QUANTITY_EXCEEDS_AVAILABILITY`), em vez de um erro artificial.
`useAddCartItem` é pessimista de propósito: o `id` da linha é atribuído pelo
servidor, e uma versão otimista exigiria identificador provisório e
reconciliação, sem ganho perceptível.

Quatro detalhes que sustentam o comportamento:

1. `cancelQueries` **antes** de fotografar o estado: sem isso, um GET já em voo
   aterrissa depois da escrita otimista e a desfaz sozinho.
2. `applyQuantityLocally` recalcula subtotal, desconto, taxa e total com o mesmo
   `eth-amount.ts` do repositório. Sem isso a linha muda e o total congela.
3. `scope: { id: 'cart-<scope>' }` serializa a fila de mutations. Sem isso,
   cliques rápidos geram PATCHes concorrentes e vence o último a _responder_,
   não o último clicado.
4. Os totais otimistas são provisórios: o resumo recebe `aria-busy` e a linha em
   voo é atenuada, para ninguém ler um valor provisório como resposta da API.

### Aplicar cupom é pessimista

Validade, expiração e aplicabilidade são exatamente o veredito que se está
pedindo ao servidor. Antecipá-lo seria inventar a resposta.

---

## Tela de carrinho

### A rota é `ssr: false`

O carrinho vive no `localStorage` do visitante e é servido por um Service
Worker — nada disso existe no servidor. Marcar `/carrinho` como client-only
resolve três coisas de uma vez: dispensa `msw/node`, elimina qualquer risco de
mismatch de hidratação, e faz o servidor renderizar o `pendingComponent`, que é
o esqueleto com shimmer.

### A consulta do carrinho não roda no servidor

`cartQueryOptions` traz `enabled: typeof window !== 'undefined'`.

Não é otimização. O cabeçalho é renderizado no SSR e chama essa consulta; uma
consulta iniciada ali fica _suspensa_, porque no servidor não há rede. Esse
estado suspenso viajava na desidratação e o cliente hidratava já travado, sem
nunca disparar a busca — a tela ficava eternamente no esqueleto. Mantendo-a
desligada no servidor, ela nasce no cliente, onde o carrinho de fato existe.

### O badge do cabeçalho

`useCartCount()` devolve `number | undefined`. No servidor e no primeiro quadro
do cliente o valor é desconhecido, então as duas árvores são idênticas e não há
mismatch. O selo aparece só depois que a consulta resolve, e só quando há
itens. Acima de 9 mostra `9+` — a bolha tem 16px — mantendo o número exato no
`aria-label`.

### Falha em segundo plano não apaga a tela

A tela de erro só substitui o conteúdo quando não há carrinho algum para
mostrar. Uma revalidação que falha com dados em cache vira um aviso acima da
lista, que permanece no lugar: apagá-la faria o colecionador perder de vista o
que já tinha, por causa de uma falha que não o afeta.

### Acessibilidade

- A lista é uma `<table>` de verdade, com `<th scope="col">`. Sem isso um leitor
  de tela anuncia "1.19 ETH" sem dizer que aquilo é o preço.
- Steppers e lixeiras têm rótulos por item ("Diminuir quantidade de Emerald Ape
  #042"): três controles anunciados igual deixariam quem usa leitor de tela sem
  saber qual item está alterando.
- O resumo inteiro — valores e total — fica numa única região `aria-live`.
  Anunciá-los separadamente faria o leitor ler um subtotal novo ao lado de um
  total ainda antigo.
- Ao remover um item, o foco herda a posição: vai para a lixeira de quem assumiu
  aquele lugar, ou para a região da lista quando era o último. O alvo é aplicado
  em efeito, e não no retorno da mutation — naquele momento o cache já mudou,
  mas o React ainda não renderizou a lista nova.

### Fidelidade ao Figma

Medidas extraídas do PNG exportado em 2x. A coluna esquerda tem 782px, o
intervalo entre colunas 86px e o resumo 332px; as linhas têm 70px de altura com
12px entre elas; as colunas caem em 311/447/585 a partir da borda. O ritmo
vertical do resumo foi calibrado contra o frame e fecha dentro de 1.5px em
todos os elementos.

Duas divergências conscientes:

1. **ID do token** — o frame mostra `#0009` para o Violet Nomad #314 e `#0552`
   para o Ivory Baron #088, inconsistentes com o próprio nome da obra. A
   implementação usa `toTokenId(name)`, seguindo o precedente já documentado em
   `nft-detail-facts.tsx`.
2. **Badge do cabeçalho** — o frame mostra `6` com 17 unidades no carrinho. É
   decorativo; o badge real mostra a soma das quantidades.

### Provisório declarado

- **Layout mobile**: o frame mobile do carrinho não foi exportado. Abaixo de
  `lg` a tela usa uma lista empilhada (`cart-mobile-list.tsx`) que funciona, mas
  não é fiel a um design — não havia design a seguir. A tabela começa em `lg`, e
  não em `md`, porque suas colunas foram medidas para os 782px que só existem a
  partir dali; espremida em tablet ela trunca os nomes.
- **"Conectar e finalizar"** fica desabilitado enquanto `/pagamento` não
  existir: uma ação fora do escopo não pode aparentar sucesso funcional.

---

## Dívidas conhecidas

1. **Catálogo e detalhe ainda leem `src/global/data` diretamente**, sem passar
   pela camada de rede. É um estado temporário conhecido, não um esquecimento —
   `createRootRouteWithContext` e as chaves com escopo já estão no lugar
   justamente para que essa migração seja barata.
2. **`await startMocks()` antes de hidratar** custa a ativação do Service Worker
   (dezenas de ms). Irrelevante hoje, porque as outras páginas leem fixtures
   síncronas, mas vira risco de Lighthouse quando o catálogo passar pela rede.
3. **`/mockServiceWorker.js` na Vercel** foi verificado no build local (servido
   na raiz, com `text/javascript`), mas `nitro@3` é pré-release: confirmar num
   preview deploy antes de considerar fechado.
4. **Socket.IO, autenticação e as demais telas** ainda não existem. O `version`
   nos contratos e o escopo nas chaves de consulta são os pontos de encaixe já
   preparados para elas.
