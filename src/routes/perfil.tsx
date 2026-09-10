import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Footer } from '@/features/layout'
import { ProfileShell } from '@/features/profile'

/**
 * Rota de layout: a sidebar "Meu perfil" é a mesma nas duas telas, então vive
 * aqui em vez de ser repetida em cada uma.
 *
 * `ssr: false` pelo mesmo motivo do carrinho e do pagamento: sessão e perfil
 * vivem no `localStorage` servido pelo Service Worker, e o servidor não tem
 * como conhecê-los.
 */
export const Route = createFileRoute('/perfil')({
  ssr: false,
  staticData: {
    header: { active: 'home', divider: true },
  },
  component: ProfileLayoutRoute,
})

function ProfileLayoutRoute() {
  return (
    <div className="flex flex-col gap-24">
      <ProfileShell>
        <Outlet />
      </ProfileShell>

      <Footer />
    </div>
  )
}
