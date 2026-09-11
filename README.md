# Kurio — Marketplace de NFTs

Marketplace de NFTs com catálogo, detalhe, carrinho, pagamento, conta do
colecionador e atualização em tempo real por Socket.IO. Toda a API é simulada
com MSW, na camada de rede, e o mesmo mock serve o desenvolvimento, a
demonstração publicada e os testes.

- **Aplicação publicada:** https://kurio-eight.vercel.app
- **Decisões, contratos, limitações e desvios do Figma:** [`ARCHITECTURE.md`](./ARCHITECTURE.md)

## Requisitos

- Node.js 24 (verificado com a 24.18.0) e npm.
- Nenhum serviço externo: a aplicação roda a partir de um checkout limpo.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

A aplicação sobe em http://localhost:3000, já com os mocks ligados.

## Variáveis de ambiente

| Variável            | Padrão | Para quê                                                                                                      |
| ------------------- | ------ | ------------------------------------------------------------------------------------------------------------- |
| `VITE_ENABLE_MOCKS` | ligada | Camada MSW. Fica ligada também no build de demonstração; `false` desliga e aponta para uma API real.          |
| `VITE_SITE_URL`     | vazia  | URL absoluta usada em `og:url` e nas imagens de compartilhamento. Sem ela, as tags saem com caminho relativo. |

## Credenciais fictícias

| Conta        | E-mail                   | Senha       | Observação                                                   |
| ------------ | ------------------------ | ----------- | ------------------------------------------------------------ |
| Colecionador | `colecionador@kurio.art` | `kurio2026` | Tem carteira principal: o pagamento vem preenchido.          |
| Curadora     | `curadora@kurio.art`     | `kurio2026` | Sem carteira. Serve para conferir o isolamento entre contas. |

Cupons do cenário-semente:

| Código     | Efeito                                |
| ---------- | ------------------------------------- |
| `KURIO10`  | 10% de desconto                       |
| `KURIO25`  | 25% de desconto                       |
| `ETH005`   | 0,05 ETH de desconto                  |
| `EXPIRADO` | Recusado: cupom vencido               |
| `MINIMO30` | Recusado abaixo de 30 ETH de subtotal |

## Comandos

| Comando                   | O que faz                                                      |
| ------------------------- | -------------------------------------------------------------- |
| `npm run dev`             | Desenvolvimento com mocks, na porta 3000                       |
| `npm run build`           | Build otimizado (o mesmo que vai para o deploy)                |
| `npm run preview`         | Serve o build localmente                                       |
| `npm run typecheck`       | Verificação de tipos (`tsc --noEmit`)                          |
| `npm run lint`            | ESLint                                                         |
| `npm run check`           | Prettier, sem alterar arquivos                                 |
| `npm run test:e2e`        | Testes Playwright (sobe o servidor de desenvolvimento sozinho) |
| `npm run test:e2e:update` | Regera as baselines da regressão visual                        |
| `npm run test:e2e:report` | Abre o relatório HTML da última execução                       |

Na primeira vez, instale o navegador do Playwright com
`npx playwright install chromium`.

A auditoria Lighthouse do §10 ainda não foi entregue — ver
[Pendências](#pendências).

## Cenários e reset

O estado do mock (catálogo, preços, estoque, carrinhos, contas, carteiras e
pedidos) fica no `localStorage` do navegador e sobrevive ao refresh. Há dois
jeitos de controlá-lo:

**Painel de simulação — `/dev`.** "Restaurar cenário-semente" volta ao estado inicial;
"Cenário de rede" troca a condição de rede; a tabela do catálogo altera preço e
unidades de qualquer NFT (a mudança sai na resposta REST e no evento Socket.IO);
"Confirmar" e "Recusar" decidem pedidos pendentes; "Derrubar conexão" desliga o socket para exercitar a reconexão.

**Parâmetros de URL.** Valem em qualquer rota e ficam gravados até outro
parâmetro ou um reset:

| Parâmetro        | Valores                                                     | Efeito                                                                      |
| ---------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------- |
| `mock`           | `none`, `fast`, `slow`, `variable`, `outOfOrder`, `offline` | Latência e condição de rede. Escolher um modo desliga os outros.            |
| `mockStatus`     | código HTTP, ou `0`                                         | Toda requisição responde com esse status. `0` desliga.                      |
| `mockFail`       | `0` a `1`                                                   | Proporção de requisições que falham com 503.                                |
| `mockSeed`       | número                                                      | Semente das falhas e da latência: a mesma semente repete a mesma sequência. |
| `mockOrder`      | `confirmed`, `declined`, `manual`                           | Desfecho do pedido pendente. `manual` espera o painel.                      |
| `mockOrderDelay` | milissegundos                                               | Quanto tempo o pedido fica pendente.                                        |
| `mockCheckout`   | `lost`                                                      | A próxima compra é gravada, mas a resposta se perde (uma vez).              |

`/?mock=fast&mockStatus=0` volta à rede normal sem apagar os dados; o reset
do painel restaura tudo.

## Reproduzir os fluxos de falha

| Cenário                         | Como                                                                                                  |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Carregamento lento e esqueletos | `/?mock=slow`                                                                                         |
| Respostas fora de ordem         | `/?mock=outOfOrder`, e troque filtros rapidamente                                                     |
| Sem conexão                     | `/carrinho?mock=offline`, depois `/carrinho?mock=fast` e "Tentar novamente"                           |
| Erro 5xx                        | `/?mockStatus=503`, depois `?mockStatus=0` e "Tentar novamente"                                       |
| Sessão expirada / 401           | Entre, abra `/perfil?mockStatus=401`                                                                  |
| Conflito de cadastro            | Crie conta com `colecionador@kurio.art`                                                               |
| Cupom inválido ou expirado      | `NAOEXISTE` ou `EXPIRADO` no carrinho                                                                 |
| Preço alterado durante a compra | Entre, abra `/pagamento`; noutra aba, mude o preço de um item em `/dev`                               |
| Edição esgotada                 | Em `/dev`, zere o estoque de um item do carrinho                                                      |
| Timeout após criar o pedido     | `/pagamento?mockCheckout=lost`, confirme, e confirme de novo: volta o mesmo pedido                    |
| Pagamento recusado              | `/pagamento?mockOrder=declined`                                                                       |
| Pedido pendente e retomada      | `/pagamento?mockOrder=manual`, confirme, recarregue a página e use "Confirmar" ou "Recusar" em `/dev` |
| Desconexão do socket            | Em `/dev`, "Derrubar conexão" e altere um preço                                                       |

## Testes E2E

```bash
npm run test:e2e                          # tudo, em desktop, tablet e mobile
npx playwright test --project=desktop     # um viewport só
npx playwright test e2e/realtime.spec.ts  # um arquivo só
```

Os testes rodam contra a aplicação com os mocks — REST pelos handlers MSW e
tempo real pelo `socket.io-client` —, cada um a partir do cenário-semente. O
relatório HTML fica em `playwright-report/` e os traces das falhas em
`test-results/`.

| §9                                                           | Arquivo                             |
| ------------------------------------------------------------ | ----------------------------------- |
| 1, 2 — catálogo, histórico, detalhe, inexistente             | `catalog.spec.ts`                   |
| 3 — cadastro, login, sessão, logout, troca de usuário        | `auth.spec.ts`, `isolation.spec.ts` |
| 5, 6, 7 — carrinho, compra, recusa, clique repetido, timeout | `cart-checkout.spec.ts`             |
| 8 — perfil, avatar, senha, carteiras                         | `profile.spec.ts`                   |
| 9, 10 — Socket.IO no checkout, desconexão, pedido pendente   | `realtime.spec.ts`                  |
| 11 — teclado, foco, validação, axe                           | `keyboard.spec.ts`, `a11y.spec.ts`  |
| 12 — esqueleto, falha e nova tentativa                       | `resilience.spec.ts`                |
| Regressão visual                                             | `visual.spec.ts`                    |

As baselines visuais foram geradas no Windows. Em outro sistema o
antialiasing das fontes muda; regere com `npm run test:e2e:update`.

## Pendências

- **Favoritos (§9, item 4)** não têm persistência nem API: o botão existe no
  detalhe, mas não há o que testar de falha e recuperação.
- **Eventos duplicados ou antigos (§9, item 10)** são descartados pelo
  `EventLedger`, mas o teste não injeta eventos repetidos: cobre desconexão e
  retomada.
- **Expiração de sessão** é simulada com `mockStatus=401`; não há prazo de
  sessão no mock.
- **Lighthouse (§10)** ainda não foi medido.
