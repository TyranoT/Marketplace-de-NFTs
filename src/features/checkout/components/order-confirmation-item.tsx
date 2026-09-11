import { formatMoney } from '@/global/helpers/eth-amount'
import { toTokenId } from '@/global/data/to-token-id'
import { CART_COPY } from '@/features/cart'
import { buildQuantityLabel } from '../constants/checkout-copy'
import type { OrderItem } from '@/global/api'

type OrderConfirmationItemProps = {
  item: OrderItem
}

export function OrderConfirmationItem({ item }: OrderConfirmationItemProps) {
  const tokenId = toTokenId(item.name)

  return (
    <li className="flex items-center gap-4 py-2.5">
      <img
        src={item.imageUrl}
        alt={item.imageAlt}
        width={80}
        height={80}
        loading="lazy"
        className="size-20 shrink-0 object-cover"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-16 leading-5 font-bold text-text-primary">
          {item.name}
        </p>

        {tokenId ? (
          <p className="text-13 leading-4 text-text-secondary">
            {CART_COPY.tokenIdLabel} {tokenId}
          </p>
        ) : null}
      </div>

      <span className="w-12 shrink-0 text-center text-13 leading-4 text-text-secondary">
        {/** "(x 2)" é lido literalmente; o leitor de tela ouve a frase. */}
        <span aria-hidden="true">{buildQuantityLabel(item.quantity)}</span>
        <span className="sr-only">
          {item.quantity === 1 ? '1 edição' : `${item.quantity} edições`}
        </span>
      </span>

      <span className="w-20 shrink-0 text-right text-16 leading-4 font-bold text-highlight">
        <span className="sr-only">Subtotal: </span>
        {formatMoney(item.lineTotal)}
      </span>
    </li>
  )
}
