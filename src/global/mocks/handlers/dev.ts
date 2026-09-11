import { HttpResponse, http } from 'msw'
import { mockDb, nftService, orderService } from '../db'
import { emitNftUpdated } from '../realtime/nft-events'
import { emitOrderUpdated } from '../realtime/order-events'
import { realtimeServer } from '../realtime'
import { withScenario } from './with-scenario'
import type { NftChangeInput } from '../db'
import type { NftListItem } from '../../api/contracts/nft'
import type { Order, OrderStatus } from '../../api/contracts/order'

/**
 * Endpoints do painel de simulação.
 *
 * Ficam sob o prefixo `__mock`, como o reset e o cenário, e pelo mesmo
 * motivo: são chamados de dentro da página, onde o MSW existe.
 *
 * O caminho é o exigido pelo §6 — a escrita vai ao banco simulado e a mesma
 * mudança sai tanto na próxima resposta REST quanto no evento. Não são dois
 * caminhos que podem divergir; é um só.
 */
export const devHandlers = [
  http.patch('/api/__mock/nfts/:nftId', async ({ request, params }) => {
    const body = (await request.json()) as NftChangeInput
    const nftId = String(params.nftId)

    let changed: NftListItem | undefined

    const response = await withScenario(() => {
      changed = mockDb.$transaction(() => nftService.applyChange(nftId, body))

      return changed
    })

    /**
     * Fora da transação, e só quando ela concluiu: um rollback não pode
     * produzir evento.
     */
    if (changed) emitNftUpdated(changed)

    return response
  }),

  /**
   * Força o desfecho de um pedido pendente. Com `?mockOrder=manual` é o
   * único caminho, o que torna a recusa demonstrável sem depender do
   * relógio.
   */
  http.post(
    '/api/__mock/orders/:orderId/settle',
    async ({ request, params }) => {
      const body = (await request.json().catch(() => ({}))) as {
        status?: OrderStatus
        reason?: string
      }

      let settled: Order | undefined

      const response = await withScenario(() => {
        settled = orderService.settle(
          String(params.orderId),
          body.status ?? 'confirmed',
          body.reason,
        )

        return settled
      })

      if (settled) emitOrderUpdated(settled)

      return response
    },
  ),

  /**
   * Listar também liquida os pendentes vencidos, como `/api/orders` — e,
   * como lá, cada transição precisa virar evento. Sem isso, um pedido
   * liquidado pela leitura do painel mudaria de estado em silêncio, e a tela
   * de pagamento aberta noutra rota nunca saberia.
   */
  http.get('/api/__mock/orders', async () => {
    let settled: Array<Order> = []

    const response = await withScenario(() => {
      settled = orderService.settleDue()

      return orderService.listOrders()
    })

    for (const order of settled) emitOrderUpdated(order)

    return response
  }),

  /** Derruba as conexões, para exercitar reconexão e reconciliação. */
  http.post('/api/__mock/realtime/disconnect', () =>
    HttpResponse.json({ disconnected: realtimeServer.disconnectAll() }),
  ),

  http.get('/api/__mock/realtime', () =>
    HttpResponse.json({ connections: realtimeServer.connectionCount }),
  ),
]
