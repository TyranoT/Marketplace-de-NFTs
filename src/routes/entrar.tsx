import { createFileRoute } from '@tanstack/react-router'
import { LoginScreen } from '@/features/auth'
import { toSafeRedirect } from '@/global/config/auth-redirect'

/**
 * Login em tela cheia, como o frame mobile — que não mostra a barra de
 * navegação inferior, e desligá-la só é possível por rota.
 *
 * `ssr: false` porque a sessão vive no `localStorage` servido pelo Service
 * Worker: renderizar no servidor uma tela que depende dela não diria a
 * verdade.
 */
export const Route = createFileRoute('/entrar')({
  ssr: false,
  staticData: {
    header: { active: 'home', divider: false },
    mobileTabBar: false,
  },
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: LoginRoute,
})

function LoginRoute() {
  const { redirect } = Route.useSearch()

  return <LoginScreen redirectTo={toSafeRedirect(redirect)} />
}
