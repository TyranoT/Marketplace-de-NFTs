import { createFileRoute } from '@tanstack/react-router'
import { Footer } from '@/features/layout'
import { CartScreen, CartScreenSkeleton } from '@/features/cart'

/**
 * Rota exclusivamente do cliente.
 *
 * O carrinho vive no `localStorage` do visitante e é servido pelo Service
 * Worker do MSW — nada disso existe no servidor. Marcá-la como `ssr: false`
 * evita renderizar no servidor um carrinho que ele não tem como conhecer, e
 * deixa o esqueleto no lugar até a hidratação.
 */
export const Route = createFileRoute('/carrinho')({
  ssr: false,
  staticData: {
    header: { active: 'market', divider: true },
  },
  component: CartRoute,
  pendingComponent: CartPendingRoute,
})

function CartRoute() {
  return (
    <div className="flex flex-col gap-24">
      <CartScreen />
      <Footer />
    </div>
  )
}

function CartPendingRoute() {
  return (
    <div className="flex flex-col gap-24">
      <CartScreenSkeleton />
      <Footer />
    </div>
  )
}
