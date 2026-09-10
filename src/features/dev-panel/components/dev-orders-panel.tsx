import { Button } from '@/global/components/ui/button'
import { formatMoney } from '@/global/helpers/eth-amount'
import { DEV_COPY, ORDER_STATUS_LABEL } from '../constants/dev-copy'
import { useDevOrders, useSettleOrder } from '../hooks/use-dev-orders'

/**
 * Pedidos e seus desfechos.
 *
 * Com `?mockOrder=manual` o relógio não liquida nada, e este é o único
 * caminho para um pedido sair de pendente — o que torna a recusa
 * demonstrável sem depender de tempo. Nos outros modos os botões ainda
 * servem para antecipar o desfecho.
 */
export function DevOrdersPanel() {
  const orders = useDevOrders()
  const settle = useSettleOrder()

  const list = orders.data ?? []

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-13 font-bold tracking-wide text-text-secondary uppercase">
        {DEV_COPY.ordersHeading}
      </h3>

      {settle.isError ? (
        <p role="alert" className="text-13 text-destructive">
          {settle.error.message}
        </p>
      ) : null}

      {list.length === 0 ? (
        <p className="text-13 text-text-secondary">{DEV_COPY.ordersEmpty}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {list.map((order) => (
            <li
              key={order.id}
              className="flex flex-col gap-2 border-b border-line/40 pb-3"
            >
              <p className="flex flex-wrap items-baseline justify-between gap-2 text-13">
                <span className="font-mono text-foreground">{order.id}</span>
                <span className="text-text-secondary">
                  {formatMoney(order.totals.total, 3)}
                </span>
              </p>

              <p className="text-12 text-text-secondary">
                {ORDER_STATUS_LABEL[order.status]} · v{order.version}
              </p>

              {order.status === 'pending' ? (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    disabled={settle.isPending}
                    onClick={() =>
                      settle.mutate({ orderId: order.id, status: 'confirmed' })
                    }
                    className="h-8 px-3 text-12"
                  >
                    {DEV_COPY.confirmOrder}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={settle.isPending}
                    onClick={() =>
                      settle.mutate({ orderId: order.id, status: 'declined' })
                    }
                    className="h-8 px-3 text-12"
                  >
                    {DEV_COPY.declineOrder}
                  </Button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
