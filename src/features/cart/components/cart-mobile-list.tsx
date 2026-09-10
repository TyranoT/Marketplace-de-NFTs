import { CartMobileItem } from './cart-mobile-item'
import type { CartItem } from '@/global/api'

type CartMobileListProps = {
  items: Array<CartItem>
  pendingItemId?: string
  registerRemoveButton: (
    itemId: string,
    element: HTMLButtonElement | null,
  ) => void
  onQuantityChange: (itemId: string, quantity: number) => void
  onRemove: (item: CartItem) => void
}

/** Lista do frame mobile: cards de 358×112 com 7 entre eles. */
export function CartMobileList({
  items,
  pendingItemId,
  registerRemoveButton,
  onQuantityChange,
  onRemove,
}: CartMobileListProps) {
  return (
    <ul className="flex flex-col gap-1.75 lg:hidden">
      {items.map((item) => (
        <li key={item.id}>
          <CartMobileItem
            item={item}
            isPending={pendingItemId === item.id}
            registerRemoveButton={registerRemoveButton}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
          />
        </li>
      ))}
    </ul>
  )
}
