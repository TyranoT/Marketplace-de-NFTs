import { QuantityStepper } from '@/global/components/ui/quantity-stepper'
import { formatMoney } from '@/global/helpers/eth-amount'
import { cn } from '@/global/helpers/cn'
import {
  buildDecreaseLabel,
  buildIncreaseLabel,
  buildQuantityLabel,
} from '../constants/cart-copy'
import { CART_ROW_HEIGHT } from '../constants/cart-layout'
import { CartItemIdentity } from './cart-item-identity'
import { CartRemoveButton } from './cart-remove-button'
import type { CartItem } from '@/global/api'

type CartTableRowProps = {
  item: CartItem
  isPending: boolean
  registerRemoveButton: (
    itemId: string,
    element: HTMLButtonElement | null,
  ) => void
  onQuantityChange: (itemId: string, quantity: number) => void
  onRemove: (item: CartItem) => void
}

export function CartTableRow({
  item,
  isPending,
  registerRemoveButton,
  onQuantityChange,
  onRemove,
}: CartTableRowProps) {
  return (
    <tr
      className={cn(
        CART_ROW_HEIGHT,
        '[&>td]:bg-surface-card [&>td]:align-middle',
        '[&>td:first-child]:rounded-l-md [&>td:last-child]:rounded-r-md',
      )}
    >
      <td className="p-0">
        <img
          src={item.imageUrl}
          alt={item.imageAlt}
          loading="lazy"
          decoding="async"
          width={70}
          height={70}
          className="size-17.5 rounded-md object-cover"
        />
      </td>

      <td className="pl-4">
        <CartItemIdentity name={item.name} />
      </td>

      <td className="text-16 leading-4 text-brand-muted">
        {formatMoney(item.unitPrice)}
      </td>

      <td>
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
      </td>

      <td
        className={cn(
          'text-16 leading-4 font-bold text-highlight transition-opacity',
          /** Total provisório enquanto a mutation não confirma. */
          isPending && 'opacity-60',
        )}
      >
        {formatMoney(item.lineTotal)}
      </td>

      <td className="pr-4.5 text-right">
        <CartRemoveButton
          name={item.name}
          disabled={isPending}
          buttonRef={(element) => registerRemoveButton(item.id, element)}
          onRemove={() => onRemove(item)}
        />
      </td>
    </tr>
  )
}
