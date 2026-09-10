import { QuantityStepper } from '@/global/components/ui/quantity-stepper'
import { formatMoney } from '@/global/helpers/eth-amount'
import { cn } from '@/global/helpers/cn'
import {
  CART_COPY,
  buildDecreaseLabel,
  buildIncreaseLabel,
  buildQuantityLabel,
} from '../constants/cart-copy'
import { CartItemIdentity } from './cart-item-identity'
import { CartRemoveButton } from './cart-remove-button'
import type { CartItem } from '@/global/api'

type CartItemCardProps = {
  item: CartItem
  isPending: boolean
  onQuantityChange: (itemId: string, quantity: number) => void
  onRemove: (item: CartItem) => void
}

export function CartItemCard({
  item,
  isPending,
  onQuantityChange,
  onRemove,
}: CartItemCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-md bg-surface-card p-3">
      <div className="flex items-center gap-3">
        <img
          src={item.imageUrl}
          alt={item.imageAlt}
          loading="lazy"
          decoding="async"
          width={70}
          height={70}
          className="size-17.5 shrink-0 rounded-md object-cover"
        />

        <CartItemIdentity name={item.name} />

        <CartRemoveButton
          name={item.name}
          disabled={isPending}
          onRemove={() => onRemove(item)}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <QuantityStepper
          shape="pill"
          size="sm"
          value={item.quantity}
          max={item.available}
          disabled={isPending}
          decreaseLabel={buildDecreaseLabel(item.name)}
          increaseLabel={buildIncreaseLabel(item.name)}
          valueLabel={buildQuantityLabel(item.name)}
          onIncrease={() => onQuantityChange(item.id, item.quantity + 1)}
          onDecrease={() => onQuantityChange(item.id, item.quantity - 1)}
        />

        <div className="flex flex-col items-end gap-0.5">
          <span className="text-12 leading-4 text-text-secondary">
            {CART_COPY.columnTotal}
          </span>
          <span
            className={cn(
              'text-16 leading-4 font-bold text-highlight transition-opacity',
              isPending && 'opacity-60',
            )}
          >
            {formatMoney(item.lineTotal)}
          </span>
        </div>
      </div>
    </article>
  )
}
