import { mockDb, orderService } from '../db'
import { realtimeServer } from './realtime-server'
import type { Order } from '../../api/contracts/order'

/**
 * Escopo do pedido: quem o comprou.
 *
 * Um pedido tem dono, ao contrário do catálogo. Sem escopo, o desfecho de
 * uma compra chegaria a outro colecionador conectado — o que o enunciado
 * proíbe explicitamente.
 */
function scopeOf(): string {
  return mockDb.session.findFirst()?.userId ?? 'guest'
}

/** Como `emitNftUpdated`: só depois que a transação fechou. */
export function emitOrderUpdated(order: Order, scope = scopeOf()): void {
  realtimeServer.emitOrderUpdated({
    id: crypto.randomUUID(),
    resource: `order:${order.id}`,
    version: order.version,
    emittedAt: new Date().toISOString(),
    scope,
    orderId: order.id,
    status: order.status,
    transactionHash: order.transactionHash,
    declineReason: order.declineReason,
  })
}

const timers = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * Faz a transição parecer imediata para quem está com a tela aberta.
 *
 * É só conveniência: a fonte de verdade é o `settleAt` guardado no pedido, e
 * `OrderService.readOrder` liquida sozinho o que já venceu. Um temporizador
 * não sobrevive ao recarregar a página, e depender dele deixaria o pedido
 * presto em `pending` para sempre depois de um F5.
 */
export function scheduleSettlement(order: Order, delayMs: number): void {
  if (order.status !== 'pending' || timers.has(order.id)) return

  const scope = scopeOf()

  timers.set(
    order.id,
    setTimeout(
      () => {
        timers.delete(order.id)

        /** Fora da transação: `settleDue` abre a sua. */
        for (const settled of orderService.settleDue()) {
          emitOrderUpdated(settled, scope)
        }
      },
      Math.max(0, delayMs),
    ),
  )
}

/** O reset do cenário não pode deixar temporizadores de outra vida correndo. */
export function cancelSettlements(): void {
  for (const timer of timers.values()) clearTimeout(timer)

  timers.clear()
}
