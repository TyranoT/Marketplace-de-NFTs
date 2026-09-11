import { formatMoney } from '@/global/helpers/eth-amount'
import { toTokenId } from '@/global/data/to-token-id'
import { CART_COPY } from '@/features/cart'
import { buildQuantityLabel } from '../constants/checkout-copy'
import type { CartItem } from '@/global/api'

type CheckoutSummaryItemProps = {
  item: Pick<
    CartItem,
    'name' | 'imageUrl' | 'imageAlt' | 'quantity' | 'lineTotal'
  >
}

/** Card de 405×70 do frame: arte de 60, identidade, quantidade e subtotal. */
export function CheckoutSummaryItem({ item }: CheckoutSummaryItemProps) {
  const tokenId = toTokenId(item.name)

  return (
    <li className="flex items-center gap-3 bg-surface-card p-1.25">
      <img
        src={item.imageUrl}
        alt={item.imageAlt}
        width={60}
        height={60}
        loading="lazy"
        className="size-15 shrink-0 object-cover"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-16 leading-5 font-bold text-text-primary">
          {item.name}
        </p>

        {tokenId ? (
          <p className="text-13 leading-4 text-text-secondary">
            {CART_COPY.tokenIdLabel} {tokenId}
          </p>
        ) : null}
      </div>

      <span className="shrink-0 text-13 leading-4 text-text-secondary">
        {/** "(x 2)" é lido literalmente; o leitor de tela ouve a frase. */}
        <span aria-hidden="true">{buildQuantityLabel(item.quantity)}</span>
        <span className="sr-only">
          {item.quantity === 1 ? '1 edição' : `${item.quantity} edições`}
        </span>
      </span>

      <span className="shrink-0 pr-2 text-16 leading-4 font-bold text-highlight">
        <span className="sr-only">Subtotal: </span>
        {formatMoney(item.lineTotal)}
      </span>
    </li>
  )
}
