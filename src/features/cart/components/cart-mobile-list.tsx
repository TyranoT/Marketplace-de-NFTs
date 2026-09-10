import { CartItemCard } from './cart-item-card'
import type { CartItem } from '@/global/api'

type CartMobileListProps = {
  items: Array<CartItem>
  pendingItemId?: string
  onQuantityChange: (itemId: string, quantity: number) => void
  onRemove: (item: CartItem) => void
}

/**
 * Composição provisória do mobile.
 *
 * O frame mobile do carrinho não foi exportado, então esta lista empilhada
 * garante que a rota funcione abaixo de `lg` sem inventar um layout que o
 * design ainda não definiu. Substituir quando o frame chegar.
 */
export function CartMobileList({
  items,
  pendingItemId,
  onQuantityChange,
  onRemove,
}: CartMobileListProps) {
  return (
    <ul className="flex flex-col gap-3 lg:hidden">
      {items.map((item) => (
        <li key={item.id}>
          <CartItemCard
            item={item}
            isPending={pendingItemId === item.id}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
          />
        </li>
      ))}
    </ul>
  )
}
