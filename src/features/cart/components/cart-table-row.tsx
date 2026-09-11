import { QuantityStepper } from '@/global/components/ui/quantity-stepper'
import { formatMoney } from '@/global/helpers/eth-amount'
import { cn } from '@/global/helpers/cn'
import {
  buildDecreaseLabel,
  buildIncreaseLabel,
  buildMaxQuantityHint,
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
      /** A linha em voo não pode depender só da opacidade para se anunciar. */
      aria-busy={isPending || undefined}
      className={cn(
        CART_ROW_HEIGHT,
        '[&>*]:bg-surface-card [&>*]:align-middle',
        '[&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md',
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

      {/**
       * Cabeçalho da linha: com ele o leitor diz de qual NFT é o preço e o
       * total que está lendo, e não só a coluna.
       */}
      <th scope="row" className="pl-4 text-left font-normal">
        <CartItemIdentity name={item.name} />
      </th>

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
          limitHint={buildMaxQuantityHint(item.name, item.available)}
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
