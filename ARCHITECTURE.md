# Arquitetura

Decisões de projeto do marketplace **Kurio**, com o raciocínio por trás delas.
Este documento cresce a cada entrega; hoje cobre a camada de dados, a tela de
carrinho, o checkout, a conta do colecionador, a autenticação e a área de
perfil.

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
src/features/   uma pasta por domínio (layout, marketplace, cart, checkout, auth, profile)
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
persistência), `nft/` (catálogo, preço e disponibilidade), `cart/` (carrinho,
cupom, totais e o contrato de saída), `order/` (a compra) e `user/` (conta,
carteiras e sessão). A raiz do `db/` guarda só o `index.ts`, que é a API
pública consumida pelos handlers.

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

`localStorage['kurio.mock.db.v1']`, com duas guardas. `seedVersion` cobre
mudança de **formato**; `seedFingerprint` — um resumo do conteúdo da semente —
cobre mudança de **dado**. Divergência em qualquer uma descarta e ressemeia, em
vez de quebrar em silêncio. É o que sustenta "manter o carrinho após refresh".

A impressão digital existe porque a versão sozinha era uma pegadinha: trocar o
nome do colecionador ou o preço de um NFT na semente não tinha efeito visível,
porque o `localStorage` seguia válido e derivado da semente anterior. Custava
uma sessão de depuração até alguém lembrar de limpar o navegador. Por isso a
semente também é **determinística** — o sal da senha do colecionador é fixo,
senão o banco-semente seria diferente de si mesmo a cada carga e o resumo
nunca fecharia.

O cenário-semente reproduz **exatamente** o frame do Figma — Emerald Ape #042
(2), Violet Nomad #314 (6), Ivory Baron #088 (9), subtotal 26.83 ETH, taxa
0.016, total **26.846 ETH** — para a tela servir de baseline de regressão
visual.

`POST /api/__mock/reset` restaura o cenário conhecido. É endpoint, e não função exportada, para ser chamado de dentro da
página — pelo painel `/dev` e pelos testes, com `page.evaluate`. **Não** dá
para usar `request.post()` do Playwright: o MSW só existe no navegador, e uma
requisição feita de fora da página vai ao servidor real, não ao mock.

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

### Mobile

O frame mobile chegou depois da primeira entrega, e a lista empilhada que
existia como adaptação declarada saiu. Medidas do PNG em 2x (828×1792 →
**414×896**, iPhone XR, como os outros frames mobile):

| Elemento        | Medida                                                |
| --------------- | ----------------------------------------------------- |
| Margens         | 28 → conteúdo de **358**                              |
| Card do item    | **358 × 112**, `--surface-card`, 7 entre cards        |
| Arte            | **101 quadrada**, encostada na borda esquerda do card |
| Topo            | círculo de voltar (44) + título de **20px bold**      |
| Painel inferior | de ~554 à base, cantos no topo                        |
| Botão           | **366 × 60**, cápsula com gradiente                   |

Três decisões que o frame não resolvia sozinho:

1. **A lixeira é um quarto controle.** O desenho a mostra numa linha só, no
   lugar do `+`. Cada linha tem `−`, quantidade, `+` e remover: sem isso não
   haveria como tirar um item do carrinho no mobile, e o desktop tem a coluna de
   ações justamente para essa ação. O `−` apagado em quantidade 1 e o `+`
   apagado no limite da edição estão no frame e saem de graça do `min`/`max` do
   `QuantityStepper`.
2. **Topo próprio, sem barra de navegação.** O cabeçalho do site já era
   `md:block`, então no mobile ele nunca aparecia; o que entrou foi o topo com
   voltar e título, e a trilha passou a `hidden md:block`. A rota declara
   `mobileTabBar: false`, como o detalhe do NFT: o painel do carrinho ocupa
   aquele lugar, e o frame não mostra as duas barras juntas.
3. **Rodapé fixo.** Cupom, totais e ação grudados na base, com a lista rolando
   atrás, para o total e o botão ficarem sempre à vista. O conteúdo ganha
   `pb-84` no mobile para o fim não ficar coberto, e o painel **não** aparece
   com o carrinho vazio ou em erro — um botão de finalizar sobre uma tela sem
   itens não teria o que finalizar.

O `QuantityStepper` ganhou a variante `tone`: `solid` (círculo da marca com
glifo escuro) segue o padrão de todos os consumidores atuais, e `outline`
(círculo escuro com glifo claro) é o do frame mobile do carrinho.

O `CartCouponForm` ganhou `variant`: `stacked` é o campo rotulado do desktop e
`inline` é a cápsula do mobile. Uma variante em vez de um segundo componente,
porque o comportamento — aparar o código, submeter, mostrar o veredito — é o
mesmo.

**Divergência do frame**: o subtotal desenhado (8.92 ETH) não fecha com os
próprios itens que ele mostra (1.19 + 1.39 + 3.58 + 1.98 = 8.14), e as edições e
quantidades são um cenário diferente do frame desktop. Como no resto da tela, o
que aparece vem da API — o frame vale pelo layout, não pelos números.

### Provisório declarado

- **"Conectar e finalizar"** leva a `/pagamento`. Enquanto essa tela não
  existia o botão ficava desabilitado, porque uma ação fora do escopo não pode
  aparentar sucesso funcional.

---

## Checkout

`/pagamento`, também `ssr: false` e pelo mesmo motivo do carrinho: o que se
está pagando vive no `localStorage` do visitante e é servido pelo Service
Worker.

### A compra é uma transação

| Método | Rota            | Erros de negócio                                                                                                                  |
| ------ | --------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/checkout` | 422 `CART_EMPTY`, 422 `CHECKOUT_INVALID`, 422 `WALLET_NOT_SUPPORTED`, 409 `QUANTITY_EXCEEDS_AVAILABILITY`, 409 `EDITION_SOLD_OUT` |

`CheckoutService` (`mocks/db/order/`) roda tudo dentro de
`mockDb.$transaction`: valida o perfil, **revalida o estoque**, reserva as
unidades e cria o pedido **pendente**. Ou o pedido nasce com tudo isso feito,
ou nada aconteceu — a transação restaura o snapshot anterior quando uma regra
recusa no meio do caminho. O carrinho não é esvaziado aqui: ver "Ciclo de vida
do pedido".

O pedido **congela** nome, arte, edição e valores de cada linha, em vez de
apontar para o catálogo: uma mudança de preço não pode reescrever uma compra
que já aconteceu. Ele é persistido, então `orders` entrou no snapshot e
`SEED_VERSION` subiu para **2** — um `localStorage` no formato antigo é
descartado e ressemeado, como já era a regra.

`transactionHash` é derivado do próprio pedido por FNV-1a, e não de
`Math.random`: a mesma compra produz o mesmo hash, o que mantém o cenário
reproduzível.

**A validação do perfil existe nos dois lados de propósito.** O zod recusa no
formulário para o colecionador não esperar uma ida ao servidor; o
`CheckoutService` recusa de novo porque quem decide se uma compra vale é o
servidor, e é esse caminho de erro que o cliente precisa saber tratar.

### Formulário

`react-hook-form` + `zod`, com um detalhe: **o resolver é escrito à mão**
(`helpers/checkout-schema.ts`, doze linhas). `@hookform/resolvers` ainda
declara peer de zod 3 por causa de `@typeschema`, e conflita com o zod 4 que já
estava na árvore via `@tanstack/router-generator`. Entre forçar
`--legacy-peer-deps` no projeto inteiro e escrever uma função pura que chama
`safeParse`, a função sai mais barata e não mente sobre a árvore de
dependências.

`CheckoutField` amarra rótulo, controle e mensagem por `aria-describedby` num
lugar só — a alternativa era repetir a amarração em doze campos, e é
exatamente o tipo de coisa que se esquece num deles.

O botão de submit vive na coluna direita, fora do `<form>`: o atributo
`form="checkout-form"` é o que permite a um botão fora da árvore submetê-lo,
sem duplicar estado entre as colunas.

**"Usar outra carteira?"** é um checkbox redondo. O frame desenha um círculo,
mas a pergunta é de sim ou não: um rádio de opção única nunca desmarca, e
deixaria o colecionador preso na escolha. A semântica é de checkbox — só a
pintura é redonda.

### Confirmação

É um diálogo sobre a página, como no frame `Confirmação de Pedido`, e não uma
rota. Tem três composições: pendente (espera, sem promessa), confirmado (o
frame) e recusado (com o motivo). Fechar leva ao início só quando a compra foi
confirmada — o carrinho comprado não existe mais. Numa recusa a tela fica onde
está: os itens foram preservados, e mandar embora quem acabou de falhar tiraria
dele o caminho de tentar de novo.

Uma divergência consciente: **o recibo mostra a linha de desconto** quando há
cupom. O frame não a tem porque seu cenário não tem cupom; omiti-la numa compra
com desconto exibiria um total menor sem dizer por quê.

"Ver no Etherscan" aponta para o hash simulado e carrega um `title` dizendo que
a transação é de demonstração — o gesto do frame sem a promessa que ele faria.

### Fidelidade e provisório

Medidas do PNG em 2x (2880×3314): conteúdo 1200 em colunas de **762 / 33 /
405**, formulário em duas sub-colunas de **369 + 24**, controles de **40**,
cards do resumo **405×70** e o diálogo **578×821** com barra da marca de 10px
no rodapé.

O frame mobile de pagamento não foi exportado. Abaixo de `lg` a tela empilha —
formulário e depois o resumo, deixando a ação no fim da leitura como no
desktop; na faixa de metadados do diálogo os quatro campos caem em 2×2, porque
num card de 360px eles não cabem em uma linha. Funciona, mas não é fiel a um
design: não havia design a seguir.

## Conta do colecionador

`mocks/db/user/` traz três modelos — usuário, carteira e sessão — no mesmo
formato de delegate dos outros domínios.

### Contrato

| Método         | Rota                        | Erros de negócio                                                              |
| -------------- | --------------------------- | ----------------------------------------------------------------------------- |
| POST           | `/api/session`              | 401 `INVALID_CREDENTIALS`                                                     |
| DELETE         | `/api/session`              | —                                                                             |
| GET            | `/api/me`                   | 401 `NOT_AUTHENTICATED`                                                       |
| PATCH          | `/api/me`                   | 422 `PROFILE_INVALID`                                                         |
| PATCH          | `/api/me/password`          | 422 `PASSWORD_INCORRECT`, 422 `PASSWORD_MISMATCH`, 422 `PASSWORD_TOO_SHORT`   |
| PATCH          | `/api/me/avatar`            | 422 `AVATAR_INVALID`, 422 `AVATAR_TOO_LARGE`                                  |
| GET / POST     | `/api/me/wallets`           | 422 `WALLET_INVALID`, 409 `WALLET_ADDRESS_TAKEN`, 409 `PRIMARY_WALLET_EXISTS` |
| PATCH / DELETE | `/api/me/wallets/:walletId` | 404 `WALLET_NOT_FOUND`, 409 `PRIMARY_WALLET_REQUIRED`                         |

Toda escrita passa por `requireUser()` **antes** de qualquer validação de
campo: responder "e-mail inválido" a quem não está autenticado é contar o que
não deveria. Pela mesma razão, e-mail inexistente e senha errada devolvem o
mesmo `INVALID_CREDENTIALS` — distinguir os dois entrega ao curioso a lista de
quem tem conta.

### Senha

Guardada como digesto com sal, nunca em texto claro — nem em memória depois de
recebida, nem no `localStorage`. `MockUser` não expõe digesto nem sal: a senha
entra e sai por `matchesPassword` e `replacePassword`, o que torna impossível um
mapper ou um handler deixá-la escapar por descuido.

**O digesto não é criptografia**, e o arquivo diz isso. `crypto.subtle` seria o
caminho honesto e existe nos dois lados, mas é assíncrono e contaminaria de
`await` uma camada inteira que hoje é síncrona, do delegate ao handler. Um
backend real usaria argon2id ou bcrypt.

### Credenciais da demonstração

`colecionador@kurio.art` / `kurio2026`. Ficam no código de propósito
(`db/user/user-seed.ts`): sem elas ninguém entra na própria aplicação. A
semente traz **uma** carteira principal e nenhuma secundária, que é o estado
exato do frame de carteiras.

### Carteiras alimentam o pagamento

O frame de carteiras diz que elas ficam disponíveis no pagamento, e o
formulário desenhado ali é o do checkout mais o apelido. Não é acidente: uma
carteira guarda exatamente o conjunto que a compra pede, então o preenchimento
do checkout é uma cópia, e não um mapeamento inventado.

Com sessão, as opções de "Carteira e rede" são as carteiras salvas e o
formulário nasce preenchido pela principal. **Sem conta, valem as três opções
fixas do frame de pagamento** — comprar não pode exigir cadastro. O
`CheckoutService` aceita as duas origens e devolve `WALLET_NOT_SUPPORTED`
quando o id não é nenhuma delas.

A carteira principal não é removível: sem ela não há para onde mandar o NFT
comprado.

### Carrinho e pedidos têm dono

Até aqui, só a **chave do cache** tinha escopo: o banco simulado guardava um
carrinho só, e os pedidos não sabiam de quem eram. Quem entrasse numa conta via
o carrinho de quem tinha entrado antes, e um pedido podia ser lido por
qualquer um — exposição de dados entre usuários, que o §11 trata como
eliminatória.

- `MockDb.carts` é um mapa por dono: o id do usuário, ou `guest` para o
  visitante. `MockDb.cart` devolve o de quem tem a sessão, e os delegates
  continuam lendo dali — nenhuma regra do carrinho precisou mudar.
- **Entrar ou se cadastrar adota o carrinho do visitante**
  (`CartService.adoptGuestCart`): os itens se somam aos da conta, limitados à
  disponibilidade, e o cupom do visitante só vale se a conta não tiver o seu.
  Roda dentro da transação do login, e o carrinho do visitante fica vazio.
- Sair não mostra mais o carrinho da conta: o visitante volta ao dele, vazio.
- **Todo pedido tem `ownerId`.** `GET /api/orders/:id` de outro dono responde
  404, e não 403 — dizer que o pedido existe já contaria a quem não comprou
  que alguém comprou. Uma chave de idempotência reusada por outra conta é
  conflito (409), e não devolve o pedido alheio.
- `order.updated` vai ao **dono do pedido**, e não a quem está logado quando o
  pedido liquida.
- O pedido pendente guardado no navegador tem a conta na chave
  (`kurio.checkout.pending.v1:<escopo>`).
- `SEED_VERSION` subiu para **7**.

Há duas contas na semente, para dar para verificar isso: `colecionador@kurio.art`
e `curadora@kurio.art`, as duas com a senha `kurio2026`. A segunda nasce sem
carteira. `e2e/isolation.spec.ts` cobre a troca de conta.

Sair zera o cache inteiro, e não só as chaves de usuário: deixar no cache o
que foi lido como autenticado mostraria dados da conta a quem já saiu dela. É
`resetQueries`, e não `clear` — `clear` tira as consultas sem avisar quem as
observa, e o cabeçalho seguia mostrando a conta que tinha acabado de sair. O
teste de isolamento pegou isso.

### Divergências e leituras dos frames

1. **"Apelido da carteira" no frame de perfil** edita o apelido da carteira
   principal, e não um segundo campo de mesmo nome no usuário — guardar o mesmo
   conceito em dois lugares é como eles divergem. `PATCH /api/me` aceita
   `primaryWalletNickname` e escreve na carteira.
2. **"Nome ENS"** aparece no perfil como sufixo **e** nome; no frame de
   pagamento, só o sufixo. O usuário e a carteira guardam os dois; o checkout
   manda só o sufixo, e por isso o campo do contrato passou a se chamar
   `ensSuffix` — que é o que ele sempre foi.

## Entrar e criar conta

Um diálogo só, com duas abas, aberto pelo "Entrar" do cabeçalho — como nos
frames `Login` e `Cadastro`. Card de 500 centrado, `#241612`, barra da marca no
rodapé: a mesma linguagem do modal de confirmação de pedido.

| Método | Rota           | Erros de negócio                                                                                                  |
| ------ | -------------- | ----------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/users`   | 409 `EMAIL_TAKEN`, 409 `USERNAME_TAKEN`, 422 `PASSWORD_MISMATCH`, 422 `PASSWORD_TOO_SHORT`, 422 `PROFILE_INVALID` |
| POST   | `/api/session` | 401 `INVALID_CREDENTIALS`                                                                                         |

**O cadastro cria conta de verdade.** `MockDb` guarda `users: Map`, e não uma
conta única: a conta-semente continua existindo depois de alguém criar a sua,
então as credenciais da demonstração seguem valendo. `SEED_VERSION` subiu para
4 por isso. E-mail e apelido são identidade — dois donos quebrariam o login —,
então a unicidade vale tanto no cadastro quanto na edição de perfil, ignorando
o próprio dono.

Cadastrar já inicia a sessão: quem acabou de escolher uma senha não precisa
digitá-la de novo na tela seguinte. A conta nasce **sem carteira**, e o
pagamento cai nas opções fixas do frame até o colecionador cadastrar a dele.

**O cabeçalho de quem entrou não foi desenhado em nenhum frame.** Sem sinal de
sessão e sem caminho de saída, entrar não teria efeito visível nem volta —
então o botão passa a mostrar o apelido, com "Sair" ao lado.

A dica com as credenciais da demonstração fica no pé do modal, de propósito:
sem ela ninguém descobre como entrar na conta de exemplo.

### Consultas do cabeçalho e o SSR

`useMe` e `useWallets` nascem com `enabled: typeof window !== 'undefined'`,
pela mesma razão já registrada no carrinho: o cabeçalho é renderizado no
servidor, e uma consulta iniciada ali fica suspensa — sem rede, o servidor não
tem o que buscar. Esse estado suspenso viaja na desidratação e o cliente
hidrata travado, sem nunca disparar a busca.

## Área de perfil

`/perfil` e `/perfil/carteiras`, sobre a primeira **rota de layout** do
projeto: a sidebar "Meu perfil" é a mesma nas duas telas, então vive em
`routes/perfil.tsx` com um `<Outlet />`, em vez de ser repetida em cada uma.
`ssr: false` pelo motivo já conhecido — sessão e perfil vivem no `localStorage`
servido pelo Service Worker.

### Fidelidade ao Figma

Medidas do PNG em 2x (2880×2160): conteúdo 1200 em **310 / 28,5 / 862**,
formulário em duas sub-colunas de **416 + 29**, card da sidebar 310×**407**,
título "Meu perfil" em 20px bold, itens com pitch de ~44,5 e divisor `#915E36`
antes de "Sair". Campos de 40, como no checkout.

Duas leituras registradas:

1. **O item ativo do cabeçalho.** Os dois frames mostram "Início" sublinhado
   numa tela de perfil. A implementação segue o frame (`active: 'home'`), ainda
   que o perfil não seja o início.
2. **"Adicionar".** O link aparece duas vezes no frame — ao lado de "Carteira
   principal" e de "Carteira secundária". Ambos abrem o formulário de uma
   carteira **secundária**: com uma principal já existente, criar outra é
   recusado por `PRIMARY_WALLET_EXISTS`, e um botão não deve prometer o
   contrário. "Igual à carteira principal" copia os campos dela, deixando o
   apelido em branco — duas carteiras com o mesmo apelido seriam
   indistinguíveis na hora de pagar.

### Um botão, dois pedidos

O frame tem um "Salvar" só, abaixo dos campos de senha, mas são dois endpoints.
A tela salva o perfil sempre e, **se o trio de senha vier preenchido**, troca a
senha em seguida. Vazio é o caso normal, e o zod trata os três campos como um
bloco: preencher um exige os três, senão o botão mandaria metade de uma troca
de senha.

A ordem importa. Se a senha falhar, o perfil **já está salvo** — e a mensagem
diz isso ("Seus dados foram salvos, mas a senha não foi alterada") em vez de
deixar a pessoa salvar de novo o que já foi gravado.

### Sem sessão, sem redirect

`/perfil` deslogado mostra um painel com botão que abre o modal de login. Nada
de `beforeLoad` mandando para o início: quem entra pelo modal continua na
página que pediu, e o endereço segue compartilhável.

### O que a sidebar declara

Dos sete itens do frame, dois têm tela. Os outros cinco — Atividade, Lista de
interesse, Ofertas, Arquivos baixados e Suporte — aparecem porque são o mapa da
área, e ficam inertes com "em breve" ao lado, anunciado junto pelo `aria-label`.
Mesmo tratamento do botão de pagamento enquanto o checkout não existia.

### Promoções para `global`

Três coisas nasceram no checkout e ganharam um segundo consumidor aqui.
Duplicar seria pior, e importar de feature para feature também:

| Agora em                  | Antes                                              |
| ------------------------- | -------------------------------------------------- |
| `ui/form-field.tsx`       | `features/checkout/components/checkout-field.tsx`  |
| `ui/option-select.tsx`    | `features/checkout/components/checkout-select.tsx` |
| `helpers/zod-resolver.ts` | copiado no checkout **e** no auth                  |

O resolver estava escrito duas vezes e o perfil seria a terceira. Os
primitivos que faltavam entraram na vitrine `/ui`: campo de formulário, select
de opções, senha, textarea, radio e menu.

### Mobile

A área de perfil entra pelo **Tab**: `MOBILE_NAV_ITEMS` tem a chave `account`
("Minha conta"), que nasceu sem `to` esperando estas rotas, e agora aponta para
`/perfil`.

No celular a navegação é a de ajustes: `/perfil` é a **lista de seções**, e cada
item abre a própria tela com voltar no topo (`MobileTopBar`). Os cinco itens sem
tela seguem marcados "em breve". A faixa horizontal de sete itens que existia
como adaptação saiu — com sete itens ela vivia cortada e empurrava o conteúdo
para baixo.

Isso exigiu um caminho próprio para os dados do perfil: **`/perfil/dados`**. No
desktop o índice `/perfil` continua mostrando os dados, o que é o que mantém o
item da sidebar ativo; a regra que traduz um no outro é a `toMobileTarget`, num
lugar só, porque a lista e o título do topo precisam concordar.

### Autenticação em tela cheia

Os frames `Mobile/Login` e `Mobile/Cadastro` não são o diálogo do desktop: são
**tela cheia**, com a marca no topo e **sem a barra de navegação inferior** — e
`mobileTabBar: false` só existe por rota. Daí duas rotas:

| Rota           | Tela                             |
| -------------- | -------------------------------- |
| `/entrar`      | login, aceitando `?redirect=`    |
| `/criar-conta` | cadastro, que já inicia a sessão |

Medidas do PNG em 2x (828×1792 → **414×896**): conteúdo de 358, "KURIO" em
~28px com tracking, campos de **358×50** com 12,5 de gap e raio grande, botão de
**358×60**, provedores de **358×40**.

Deslogado, `/perfil` no mobile navega para `/entrar` guardando o destino, e a
pessoa volta para onde queria depois de entrar. No desktop segue o painel com o
diálogo — cada moldura tem o seu frame.

**`?redirect=` é entrada de fora**, e por isso passa por `toSafeRedirect`
(`global/config/auth-redirect.ts`): só rota conhecida atravessa. URL externa,
`//host`, `javascript:` e caminho inexistente caem no padrão `/perfil`. Sem
essa checagem, um link montado por terceiros escolheria para onde a pessoa vai
ao autenticar.

As duas molduras compartilham **schema, resolver e mensagens** — o que muda é a
pintura, num mapa de classes (`constants/auth-fields.ts`). Se a validação
divergisse entre diálogo e tela, o bug apareceria em uma e não na outra.

### Provisório declarado

Os frames mobile cobrem login e cadastro, não as telas de perfil em si. Abaixo
de `md` as sub-colunas do formulário viram uma e a lista de seções faz a
navegação — funciona e segue o padrão das outras telas mobile, mas o desenho
dessas duas telas não existe.

## Tempo real com Socket.IO

`socket.io-client` de verdade no cliente, e um servidor simulado sobre
`ws.link()` do MSW com `@mswjs/socket.io-binding`. Substituir o socket por
chamadas diretas a setters ou ao cache é eliminatório no enunciado, então o
transporte é real dos dois lados — o painel de simulação existe em parte para
tornar isso visível.

### O caminho é `/realtime`, e não `/socket.io`

O `WebSocketHandler` do MSW reescreve `^/socket.io/` para `/` antes de casar a
rota. Com o caminho padrão, o link teria de interceptar a raiz — que é
exatamente a URL do WebSocket de HMR do Vite (`ws://localhost:3000/`).
Interceptá-la derruba o recarregamento em desenvolvimento, e o sintoma não
aponta para a causa. `path: '/realtime'` no cliente e `ws.link('/realtime')` no
servidor deixam o pathname intacto.

### `transports: ['websocket']` é obrigatório

Por padrão o `socket.io-client` abre o handshake por _long-polling_, que é
HTTP. O `ws` do MSW intercepta a classe `WebSocket`, não aquele GET: ele
escaparia pelo `onUnhandledRequest: 'bypass'`, bateria em 404 real e o cliente
entraria em `xhr poll error` reencaminhado indefinidamente.

### O batimento é nosso

O binding responde o handshake anunciando `pingInterval: 25000` e
`pingTimeout: 5000`, mas **nunca envia PING**. O `engine.io-client` arma um
temporizador de 30s reiniciado a cada pacote recebido; sem tráfego, ele derruba
a conexão por `ping timeout` e reconecta — em laço, a cada 30s, para sempre.
`RealtimeClient` envia o pacote `'2'` a cada 20s e limpa o intervalo ao
desconectar. Verificado com 50s de conexão ociosa sem queda.

### Broadcast é nosso também

O binding não tem rooms, namespaces (`nsp: '/'` é fixo no código dele) nem
broadcast; o `broadcast()` do `ws.link()` envia bytes crus, sem o enquadramento
do Socket.IO. `RealtimeServer` mantém o registro das conexões vivas — é isso
que permite a um handler HTTP emitir um evento, que é como o painel funciona.

### `socket.io-client` fora do bundle do servidor

Import dinâmico não bastou: o provider é alcançável a partir do `__root.tsx`,
que renderiza no servidor, e o Rollup emitia o chunk dos dois lados — 227kB que
o servidor nunca executa. A guarda é `if (import.meta.env.SSR) return` no topo
do efeito: o Vite substitui isso por uma constante em cada build, e no do
servidor tudo abaixo vira código morto. Conferir `.output/server/_libs` ao
mexer nesse arquivo.

### Emitir só depois do commit

`$transaction` restaura o snapshot anterior quando uma regra recusa no meio do
caminho. Emitir de dentro anunciaria uma mudança que não aconteceu, e o cliente
passaria a mostrar um preço que o servidor não tem. Todo `emitNftUpdated` sai
do handler, depois que a transação retornou.

Pela mesma razão, `NftService.applyChange` **não** abre transação própria nem
chama `cartService.commit()`: uma transação aninhada persistiria estado parcial
no `localStorage`. Uma transação por requisição, no ponto de entrada.

### Ordem, duplicata e escopo

Cada NFT tem versão própria (`NftRevisionDelegate`), incrementada por qualquer
mudança de preço ou disponibilidade. Uma só, e não uma por campo: o recurso que
o evento anuncia é o NFT, e duas versões obrigariam o cliente a decidir qual
delas ordena. `CATALOG_ITEM_VERSION = 1`, que era constante no mapper do
carrinho, deixou de existir. `SEED_VERSION` subiu para **5**, e as revisões
entraram em `seedSignature()` — sem isso a impressão digital deixaria de cobrir
o novo estado, que é a pegadinha que o próprio arquivo já documentava.

`EventLedger` responde duas perguntas diferentes, porque uma não implica a
outra: "já vi este evento?" (id, num FIFO de 500) e "este é mais novo que o que
tenho?" (versão por recurso). Um evento inédito pode chegar atrasado, e um
repetido pode trazer a versão corrente. Só eventos o alimentam — `record()` existe, mas nenhuma
resposta REST o chama ainda. É por isso que o reset do cenário precisa avisar
(`mock.reset`): ele devolve as versões a 1, e sem o aviso o cliente, que
lembra das versões mais altas que já viu, descartaria como antigas todas as
mudanças seguintes.

Evento com `scope` diferente do escopo da sessão é descartado antes de tudo.
O escopo entra nas dependências do efeito do provider: entrar, sair ou trocar
de conta refaz a conexão e zera o registro.

### Onde cada evento aterrissa

| Alvo     | Estratégia                                                                        | Por quê                                                                                                                                                                                                                                                                                              |
| -------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Detalhe  | `setQueryData`                                                                    | O evento traz preço, disponibilidade e versão — tudo que muda. Ir à rede seria pedir de volta o que acabou de chegar.                                                                                                                                                                                |
| Catálogo | remenda todas as páginas em cache + `invalidateQueries` com `refetchType: 'none'` | Remendar evita reordenar a grade sob o cursor de quem está lendo; marcar obsoleto deixa a próxima leitura natural corrigir ordenação e pertinência ao filtro de preço. As páginas **inativas** também são remendadas: com `keepPreviousData`, voltar a uma página já vista mostraria o preço antigo. |
| Carrinho | `invalidateQueries`, e só se o NFT estiver nele                                   | Mudar o preço de uma linha muda subtotal, desconto, taxa e total — cálculo que pertence ao servidor e que este projeto decidiu nunca duplicar na interface.                                                                                                                                          |

Na reconexão, `refetchQueries({ type: 'active' })` reconcilia com o REST:
enquanto esteve fora, eventos se perderam, e só o servidor sabe o estado atual.

### Cotação desatualizada no checkout

Três camadas, e as três são necessárias:

1. **Interface.** `useQuoteGuard` congela a `cart.version` que o colecionador
   revisou. Divergindo, um bloco `role="alert"` explica e o envio trava até
   "Revisar novo valor" reconhecer o novo total. É o "mudanças devem exigir
   nova confirmação" do enunciado.
2. **Servidor.** `CheckoutInput.cartVersion` é comparado com a versão corrente
   e recusado com **409 `CART_VERSION_MISMATCH`**. O portão da interface é
   conforto; este é quem decide.
3. **Gatilho.** `applyChange` sobe a versão do carrinho quando o NFT alterado
   está nele. Sem isso `cartVersion` não mudaria e o 409 nunca dispararia.

O botão desabilitado mantém o rótulo "Confirmar compra": reaproveitar o estado
de envio mostraria "Confirmando...", descrevendo uma compra em voo que não
existe e deixando quem lê esperando um resultado.

### Limitações do ambiente de mocks

1. Só o transporte `websocket`; o handshake por long-polling não é
   interceptável.
2. Handshake sintético, com `sid: "test"` igual para todos. A identidade real
   vem de `connection.client.id`.
3. Sem namespaces, rooms, acks ou `volatile`.
4. **A interceptação acontece na página, não no Service Worker.** Cada aba
   roda o seu próprio servidor simulado e o seu próprio banco em memória,
   todos gravando no mesmo `localStorage`. Duas pontes mantêm as abas em dia:
   o `RealtimeServer` repassa cada evento às outras abas por
   `BroadcastChannel`, descartando antes a cópia em memória delas, e o evento
   `storage` (`mocks/cross-tab.ts`) invalida a cópia quando outra aba grava
   algo que não gera evento, como o carrinho. Antes disso, um preço mudado no
   `/dev` numa aba não aparecia no catálogo aberto em outra — nem pelo evento,
   nem pelo REST.
5. Autenticação por query string (`?scope=`): o payload `auth` do Socket.IO
   viaja no pacote `40`, que o binding responde sozinho e não expõe.
6. `@mswjs/socket.io-binding` é um projeto pequeno e depende de
   `@mswjs/interceptors@^0.39`, enquanto `msw@2.15` usa `^0.41`. O `overrides`
   do `package.json` unifica em 0.41 — conferir com
   `npm ls @mswjs/interceptors` ao atualizar qualquer um dos dois.

---

## Ciclo de vida do pedido

| Método | Rota                   | Erros de negócio                                                        |
| ------ | ---------------------- | ----------------------------------------------------------------------- |
| POST   | `/api/checkout`        | os de antes + 409 `CART_VERSION_MISMATCH`, 409 `IDEMPOTENCY_KEY_REUSED` |
| GET    | `/api/orders/:orderId` | 404 `ORDER_NOT_FOUND`                                                   |
| GET    | `/api/orders`          | —                                                                       |

O pedido nasce **`pending`** e sai dali por `order.updated`, para `confirmed`
ou `declined`. Os dois são terminais: `OrderService.settle` recusa reabrir com
409 `ORDER_ALREADY_SETTLED`, e o cliente ignora evento para pedido que já não
está pendente — mesmo com versão maior, porque "terminal" é uma regra
diferente de "mais recente".

### Reservar na criação, efetivar na confirmação

A criação reserva o estoque mas **não** esvazia o carrinho. A confirmação
remove só os itens e quantidades comprados; a recusa devolve as unidades e
deixa o carrinho como estava. É o "preservar os itens em falhas; após
confirmação, remover do carrinho apenas os itens e quantidades comprados" do
enunciado, sem ter de reconstruir um carrinho que já tinha sido apagado.

### A liquidação é preguiçosa

`settleAt` fica gravado no pedido. Toda leitura (`GET /api/orders*`) liquida
os pendentes vencidos antes de responder. O temporizador de
`order-events.ts` só existe para a transição parecer imediata a quem está com
a tela aberta — um `setTimeout` não sobrevive ao recarregar, e depender dele
deixaria o pedido preso em `pending` para sempre depois de um F5.

O desfecho vem do cenário: `orderOutcome` (`confirmed`, `declined` ou
`manual`) e `orderSettleDelayMs`, também por `?mockOrder=` e
`?mockOrderDelay=`. Em `manual` o relógio não decide nada e só o painel
liquida — é como a recusa fica demonstrável sem depender de tempo. O reset
cancela os temporizadores em curso, para um pedido de antes não liquidar
sobre o banco novo.

### Idempotência

Header `Idempotency-Key`, gerado **uma vez por tentativa de compra** e
reusado nas retentativas — ao contrário do `x-request-id`, que muda a cada
requisição. O servidor guarda, por chave, o pedido e um FNV do conteúdo
(`walletId`, `cartVersion`, perfil):

- mesma chave, mesmo conteúdo → o mesmo pedido, sem julgar de novo contra um
  estoque que a própria tentativa já reservou;
- mesma chave, conteúdo diferente → 409 `IDEMPOTENCY_KEY_REUSED`;
- sem chave → segue sem deduplicar.

O FNV estava escrito duas vezes (impressão digital da semente e hash da
transação); virou `db/core/fnv.ts` antes de ganhar a terceira cópia.
`SEED_VERSION` subiu para **6**.

### Recuperação após refresh

O pedido deixou de viver no `useState` da tela. `useOrderAttempt` guarda
`{ orderId, idempotencyKey }` em `kurio.checkout.pending.v1` — chave da
aplicação, não do mock, porque descreve o que este navegador estava fazendo.
Ao montar, a tela de pagamento lê essa entrada, busca o pedido e reabre o
diálogo no estado atual, que pode já ter sido liquidado enquanto a página não
existia. A entrada só é apagada quando o pedido chega a um estado terminal e
o diálogo é fechado.

Verificado no navegador: compra pela interface em modo `manual`, F5 com o
diálogo pendente, o mesmo pedido volta (um só no banco), e a recusa forçada
pelo painel troca o diálogo por evento, sem recarregar, com o carrinho
preservado.

---

## Contrato REST do catálogo

| Método | Rota               | Erros de negócio    |
| ------ | ------------------ | ------------------- |
| GET    | `/api/nfts`        | —                   |
| GET    | `/api/nfts/:nftId` | 404 `NFT_NOT_FOUND` |

Parâmetros de `/api/nfts`: `q`, `collection` (repetível), `network`
(repetível), `minPrice`, `maxPrice`, `tab`, `sort`, `exclude`, `page`,
`pageSize`. Parâmetro inválido cai no padrão em vez de recusar — a URL é
entrada de fora, e uma busca não deve quebrar porque alguém digitou
`?sort=xyz`.

A busca normaliza acento e caixa: quem digita "oculos" espera achar "Óculos".
A faixa de preço e a ordenação comparam em **wei**, pelo mesmo motivo de todo
o resto do projeto — `Number` perderia precisão no limite da faixa.

`NftListItem.price` é `Money`, não a string formatada de `NftSummary`: é deste
valor que o carrinho e os eventos dependem. Formatar acontece na apresentação.

### Estado do catálogo na URL

Busca, filtros, ordenação e paginação compõem `validateSearch` na rota `/`,
com zod. Cada campo tem `.catch(...)`: a URL é entrada de fora, e um
`?sort=xyz` colado por alguém cai no padrão em vez de quebrar a tela.

**Toda mudança de filtro volta para a página 1** — sem isso, quem está na
página 3 aplica um filtro com 4 resultados e vê uma tela vazia sem entender
por quê. Paginar, ao contrário, cria entrada de histórico própria: é
navegação, e o botão voltar deve desfazê-la. Filtrar usa `replace`, para o
histórico não ganhar um passo por tecla digitada na busca (que ainda tem 300ms
de espera antes de virar URL).

O intervalo de preço é local enquanto se arrasta e só vira URL no Aplicar:
escrever a cada pixel dispararia uma consulta por quadro.

A rota de detalhe passou a `ssr: false` pelo mesmo motivo do carrinho — o
catálogo agora vem da rede, e a rede é o Service Worker. O 404 é tratado por
`error.kind === 'not_found'`, que a política de retry já não repete.

As fixtures passaram de 8 para **24 NFTs**, com categoria, rede, data de
listagem e marca de "em alta". Oito itens de uma coleção só não exercitam
filtro nem paginação — não há o que recortar quando todos casam com tudo. Os
oito originais mantêm id e preço: o cenário-semente do carrinho (26.846 ETH) é
baseline de regressão visual.

---

## Painel de simulação

`/dev`. Não tem link no cabeçalho, no rodapé nem na barra de navegação, não
entra em `ALLOWED` de `auth-redirect.ts` e carrega `noindex`: existe só pela
URL.

**Funciona no build de demonstração de propósito.** Os mocks ficam ligados lá,
e é lá que o cenário de tempo real precisa ser demonstrável — guardá-lo por
`import.meta.env.DEV` o tornaria inútil exatamente onde serve. Com
`VITE_ENABLE_MOCKS=false` a tela diz que não há simulação a controlar.

Ele existe porque o §6 pede que mudanças nos dados simulados se reflitam tanto
nas respostas REST quanto nos eventos, e porque o cenário obrigatório do §7 —
o preço muda enquanto alguém navega — precisa de alguém que provoque a
mudança. Sem isso, o cenário só existiria dentro de um teste.

| Método | Rota                                 | Efeito                                                            |
| ------ | ------------------------------------ | ----------------------------------------------------------------- |
| PATCH  | `/api/__mock/nfts/:nftId`            | grava preço/disponibilidade, sobe a revisão e emite `nft.updated` |
| POST   | `/api/__mock/realtime/disconnect`    | derruba as conexões, para exercitar reconexão                     |
| GET    | `/api/__mock/realtime`               | número de conexões vivas                                          |
| GET    | `/api/__mock/orders`                 | todos os pedidos, para o painel                                   |
| POST   | `/api/__mock/orders/:orderId/settle` | força `confirmed` ou `declined` e emite `order.updated`           |

A coluna esquerda escreve por REST; a direita mostra o que o `socket.io-client`
**recebeu**, incluindo os descartes. É a prova visual de que o transporte é
real: quebre o socket e a direita fica muda enquanto o resto continua
funcionando.

---

## Acessibilidade

Antes do E2E, uma auditoria de semântica percorreu as telas contra o §8. Os
testes localizam os elementos pelo papel e pelo nome acessível
(`getByRole`, `getByLabel`), então cada correção feita depois obrigaria a
reescrever os seletores. As correções estão comentadas no próprio código; aqui
ficam as decisões e os desvios que valem em mais de um lugar.

### Primitivos, uma vez só

- **Foco visível** é o contorno global de `styles.css` (`outline-ring`, 2px,
  6.8:1). Button, Radio, Checkbox e Select tinham `outline-none` com um anel a
  50% de opacidade (≈2.5:1, abaixo de 3:1); saíram, e o global passou a valer.
  Onde o controle não tem borda própria — busca mobile, newsletter, cupom
  inline — o contorno é desenhado na cápsula com `focus-within`.
- **`--destructive`** passou de `oklch(0.577 …)` para `oklch(0.7 …)`: o
  padrão do shadcn dava 4.1:1 sobre ink e 3.7:1 sobre card, abaixo de 4.5:1
  para as mensagens de erro de 12px.
- **`QuantityStepper`** usa `aria-disabled`, e não `disabled`. Um botão
  `disabled` que está com o foco joga o foco no `<body>`, e o stepper trava a
  cada mutation e ao chegar no limite. No limite, o motivo é descrito por
  `aria-describedby` (`buildMaxQuantityHint`).
- **Paginação** são links de verdade, pela URL. Antes eram `<a href="#">` que o
  Base UI anunciava como botão (`nativeButton={false}` injeta `role="button"`).
  O primitivo recebe o `<Link>` pronto (`render`), porque só a tela sabe tipar o
  `search` da rota.
- **Obrigatórios** chegam ao leitor por `aria-required`, que `fieldProps`
  passou a emitir. O asterisco segue só visual.
- **Slider**: cada cursor tem nome ("Preço mínimo", "Preço máximo") e valor
  falado em ETH. O `aria-labelledby` que estava na raiz descia para os cursores
  e vencia o `aria-label` de cada um.
- **IDs** de formulários montados mais de uma vez na mesma página — cupom,
  filtros, seletor de edição, `WalletForm` — vêm de `useId()`. Com ids fixos, o
  rótulo e o erro de uma cópia apontavam para o campo da outra.

### Shell

Skip link "Pular para o conteúdo" como primeiro elemento do Tab; o `<main>`
(`Container as="main"`) é o alvo, com `tabIndex={-1}`. `RouteFocus` leva o
foco ao conteúdo quando o **caminho** muda — só o caminho, porque filtros e
paginação também são navegações, e roubar o foco do checkbox recém-marcado
seria pior. Cada rota tem `<title>` próprio; no detalhe, com o nome do NFT.

### O que era de mentira virou de verdade, ou foi marcado

O §3 proíbe ações fora do escopo que "aparentem sucesso funcional". Havia
várias:

| Onde                                | Antes                                            | Agora                                                                       |
| ----------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------- |
| Busca do cabeçalho                  | ícone sem ação                                   | abre um campo; buscar leva ao catálogo com `q` na URL                       |
| "Início" e "Mercado"                | `<span>` num `<nav>` sem links                   | links (`/` e `/#catalogo`)                                                  |
| "Criadores", "Aprenda"              | texto igual aos itens ativos                     | apagados, "em breve" para o leitor                                          |
| CTAs do hero e dos promos           | botões sem ação                                  | links para a grade                                                          |
| "Abrir filtros" (mobile)            | não abria nada; abaixo de `lg` não havia filtros | diálogo com os mesmos filtros da lateral                                    |
| Compartilhar                        | botões sem ação                                  | links de compartilhamento reais (LinkedIn, e-mail, X)                       |
| Rodapé                              | 20 `href="#"`                                    | "Meu perfil" e as coleções viram destinos reais; o resto é texto "em breve" |
| Redes sociais                       | links para `#`                                   | ícones, sem link, "em breve"                                                |
| Newsletter                          | "Enviar" sem retorno                             | diz em texto que não faz parte da demonstração                              |
| "Ler mais" do journal               | 4 links `#` idênticos                            | botão que diz que o editorial está fora do escopo                           |
| Favoritos e Escanear (barra mobile) | botões mortos                                    | `aria-disabled`, "em breve"                                                 |

### Desvios conscientes do Figma

1. **"Contrato" e "Direitos autorais" desinvertidos.** O Figma troca os dois
   rótulos entre si; a tela seguia o design e punha o texto de royalties sob
   "Contrato". Informação errada para qualquer pessoa, não só para quem usa
   leitor de tela.
2. **"Carteira secundária (opcional)" com rótulo visível** no pagamento. O
   frame só tem o placeholder, que some ao digitar e levava o "(opcional)".
3. **"Sufixo ENS"** no lugar de "Nome ENS" no pagamento: o select escolhe só o
   sufixo.
4. **Maiúsculas pelo CSS** (`uppercase`) e não no texto — "COMPRAR",
   "EXPLORAR", o título do hero e o banner. Alguns leitores soletram texto
   inteiro em caixa alta.
5. **Campo de busca no cabeçalho desktop.** O frame desenha só o ícone; sem o
   campo, a busca não existia no desktop.
6. **Diálogo de filtros no mobile.** O frame tem o botão, não o conteúdo; o
   conteúdo é o mesmo da lateral.

### Limites que ficaram

- **As contagens dos filtros ("Jogos (19)") são do Figma** e não batem com o
  catálogo simulado. Por isso ficam `aria-hidden`: anunciá-las seria dar a quem
  usa leitor de tela um número que a grade desmente. O certo é a API devolver
  as facetas.
- **Login e cadastro sem rótulo visível.** O frame usa só placeholders; os
  campos têm nome por `aria-label` e o erro ligado por `aria-describedby`, mas
  o placeholder some ao digitar (WCAG 3.3.2). Mantido por fidelidade.
- **O segundo preço do card** (`secondaryPrice`) não tem rótulo: o frame não
  diz se é preço anterior ou de outra edição, e inventar o significado seria
  pior do que omitir.
- **Abrir o rascunho de carteira secundária não move o foco** para o
  formulário que aparece.

### Verificação

`e2e/a11y.spec.ts` roda o axe nas rotas principais, em desktop (1440), tablet
(768) e mobile (Pixel 7), e falha em qualquer violação `serious` ou
`critical`. O reset do cenário é feito **dentro da página**: o MSW só existe
no navegador, e um `request.post()` do Playwright iria ao servidor real, não
ao mock.

---

## Dificuldades declaradas

Coisas que a demonstração **não** faz, e por quê. Nenhuma delas está escondida
atrás de um botão que finge funcionar.

1. **Entrar com Google ou Facebook.** Os dois botões aparecem, porque são parte
   do frame, mas dependem de um provedor de identidade real: OAuth exige
   redirecionamento, `client_secret` e um servidor que troque o código pelo
   token. Um Service Worker não tem como fazer isso, e simular a volta do
   provedor seria inventar uma sessão que ninguém autorizou. O clique explica
   isso em texto.
2. **Recuperação de senha.** "Esqueceu a senha?" depende de envio de e-mail com
   token de uso único. Sem servidor de e-mail, o fluxo não tem como se
   completar — o clique diz isso em vez de abrir uma tela que não leva a nada.
3. **O digesto de senha não é criptografia.** Está descrito em "Conta do
   colecionador": `crypto.subtle` é assíncrono e contaminaria de `await` uma
   camada inteira que é síncrona. Um backend real usaria argon2id ou bcrypt.
4. **A sessão não expira e não é assinada.** É uma linha no `localStorage`, sem
   `httpOnly`, sem CSRF, sem prazo. Autenticação de verdade não moraria no
   navegador; o que existe aqui é o suficiente para a interface distinguir
   visitante de colecionador.
5. **O hash da transação é simulado.** "Ver no Etherscan" aponta para um hash
   que nenhuma rede conhece, e o botão carrega um `title` dizendo isso.
6. **Não há carteira Web3 conectada.** MetaMask, WalletConnect e Coinbase
   aparecem como escolha e como endereço digitado, não como conexão real: nada
   aqui assina transação nem lê saldo.

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
4. **A URL serializa as listas de filtro em JSON** (`?collection=["games"]`),
   que é o padrão do TanStack Router. Funciona e sobrevive ao refresh, mas o
   formato REST convencional seria `?collection=games&collection=music` — o
   cliente HTTP já monta assim; só a URL do navegador destoa.
5. **O checkout aceita visitante.** O §3 diz que checkout, perfil,
   carteiras, favoritos e pedidos exigem autenticação; hoje só perfil e
   carteiras exigem. O pedido do visitante fica com `ownerId: guest`, isolado
   das contas, mas o fluxo deveria pedir login antes de pagar.
6. **Sem testes automatizados.** Playwright não está configurado, e tudo aqui
   foi verificado à mão no navegador. Os fluxos de tempo real são justamente
   os que mais precisam de teste, porque dependem de ordem e de tempo.
