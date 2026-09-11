import { X } from 'lucide-react'
import { formatMoney } from '@/global/helpers/eth-amount'
import { CART_COPY } from '../constants/cart-copy'
import type { CartChangeAlert } from '@/global/realtime'

type CartChangeNoticeProps = {
  alerts: Array<CartChangeAlert>
  onDismiss: (id: string) => void
}

/**
 * O aviso de um NFT acumula as mudanças dele. Descrevia só o preço quando
 * os dois mudavam, e a disponibilidade nova — que é o que limita a
 * quantidade — sumia do texto.
 */
function describe(alert: CartChangeAlert): string {
  const changedPrice = alert.previousPrice.amount !== alert.nextPrice.amount
  const changedAvailability = alert.previousAvailable !== alert.nextAvailable

  const price = CART_COPY.priceChanged
    .replace('{nft}', alert.name)
    .replace('{from}', formatMoney(alert.previousPrice))
    .replace('{to}', formatMoney(alert.nextPrice))
  const availability = CART_COPY.availabilityChanged
    .replace('{nft}', alert.name)
    .replace('{units}', String(alert.nextAvailable))

  if (changedPrice && changedAvailability) return `${price} ${availability}`

  return changedPrice ? price : availability
}

/**
 * O aviso de que algo mudou enquanto a tela estava aberta.
 *
 * `role="status"` e não `alert`: é informação, não falha — e o arquivo já
 * reserva `role="alert"` para erro. O resumo tem sua própria região viva
 * para os totais; esta explica a causa, que os números sozinhos não contam.
 */
export function CartChangeNotice({ alerts, onDismiss }: CartChangeNoticeProps) {
  if (alerts.length === 0) return null

  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-2">
      {alerts.map((alert) => (
        <p
          key={alert.id}
          className="flex items-start justify-between gap-4 rounded-md border border-highlight/40 bg-highlight/10 px-4 py-3 text-13 leading-5 text-text-primary"
        >
          <span>{describe(alert)}</span>

          <button
            type="button"
            onClick={() => onDismiss(alert.id)}
            aria-label={`${CART_COPY.dismissChange}: ${alert.name}`}
            className="shrink-0 text-text-secondary hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </p>
      ))}
    </div>
  )
}
