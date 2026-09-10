import { http } from 'msw'
import { orderService } from '../db'
import { emitOrderUpdated } from '../realtime/order-events'
import { withScenario } from './with-scenario'
import type { Order } from '../../api/contracts/order'

/**
 * Consulta de pedidos.
 *
 * Toda leitura pode liquidar um pendente vencido — é assim que o estado se
 * recupera depois de um refresh, sem depender de um temporizador que morreu
 * com a página. Os eventos das transições saem **depois** da resposta ser
 * montada, nunca de dentro da transação.
 */
export const orderHandlers = [
  http.get('/api/orders/:orderId', async ({ params }) => {
    let settled: Array<Order> = []

    const response = await withScenario(() => {
      settled = orderService.settleDue()

      return orderService.readOrder(String(params.orderId))
    })

    for (const order of settled) emitOrderUpdated(order)

    return response
  }),

  http.get('/api/orders', async () => {
    let settled: Array<Order> = []

    const response = await withScenario(() => {
      settled = orderService.settleDue()

      return orderService.listOrders()
    })

    for (const order of settled) emitOrderUpdated(order)

    return response
  }),
]
