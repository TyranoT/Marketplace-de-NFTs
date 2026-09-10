import { cartKeys } from '../api/cart'
import { orderKeys } from '../api/order'
import type { QueryClient } from '@tanstack/react-query'
import type { CartScope } from '../api/cart'
import type { Order } from '../api/contracts/order'
import type { OrderUpdatedEvent } from '../api/contracts/realtime'

/**
 * Aplica `order.updated` no cache.
 *
 * Duas guardas, e a segunda não é redundante: a versão descarta evento
 * atrasado, mas **terminal é terminal** por uma razão diferente — um pedido
 * confirmado não volta a pendente nem vira recusado, mesmo que chegue um
 * evento com versão maior. É a regra que o enunciado chama de estado final.
 */
export function applyOrderUpdated(
  queryClient: QueryClient,
  event: OrderUpdatedEvent,
  scope: CartScope,
): void {
  const key = orderKeys.detail(event.orderId)
  const current = queryClient.getQueryData<Order>(key)

  if (!current) {
    /** Sem cache não há o que remendar: quem precisar, que busque. */
    void queryClient.invalidateQueries({ queryKey: key })

    return
  }

  if (current.status !== 'pending') return

  queryClient.setQueryData<Order>(key, {
    ...current,
    status: event.status,
    version: event.version,
    updatedAt: event.emittedAt,
    transactionHash: event.transactionHash ?? current.transactionHash,
    declineReason: event.declineReason,
  })

  /**
   * A confirmação esvazia o carrinho no servidor e a recusa devolve o
   * estoque. Nos dois casos o que está em cache deixou de valer.
   */
  void queryClient.invalidateQueries({ queryKey: cartKeys.detail(scope) })
}
