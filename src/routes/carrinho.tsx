import { createFileRoute } from '@tanstack/react-router'
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
  head: () => ({ meta: [{ title: 'Carrinho · Kurio' }] }),
  ssr: false,
  staticData: {
    header: { active: 'market', divider: true },
    /** O painel fixo do carrinho ocupa o lugar da barra de navegação. */
    mobileTabBar: false,
  },
  /** Sem rodapé: a tela termina no painel de totais, e não em navegação. */
  component: CartScreen,
  pendingComponent: CartScreenSkeleton,
})
