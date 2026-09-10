import { createFileRoute } from '@tanstack/react-router'
import { Footer } from '@/features/layout'
import { CheckoutScreen, CheckoutScreenSkeleton } from '@/features/checkout'

/**
 * Rota exclusivamente do cliente, pelo mesmo motivo do carrinho: o que se
 * está pagando vive no `localStorage` do visitante e é servido pelo Service
 * Worker do MSW — nada disso existe no servidor.
 */
export const Route = createFileRoute('/pagamento')({
  ssr: false,
  staticData: {
    header: { active: 'market', divider: true },
  },
  component: CheckoutRoute,
  pendingComponent: CheckoutPendingRoute,
})

function CheckoutRoute() {
  return (
    <div className="flex flex-col gap-24">
      <CheckoutScreen />
      <Footer />
    </div>
  )
}

function CheckoutPendingRoute() {
  return (
    <div className="flex flex-col gap-24">
      <CheckoutScreenSkeleton />
      <Footer />
    </div>
  )
}
