import { createFileRoute } from '@tanstack/react-router'
import { RegisterScreen } from '@/features/auth'
import { toSafeRedirect } from '@/global/config/auth-redirect'

export const Route = createFileRoute('/criar-conta')({
  head: () => ({ meta: [{ title: 'Criar conta · Kurio' }] }),
  ssr: false,
  staticData: {
    header: { divider: false },
    mobileTabBar: false,
  },
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: RegisterRoute,
})

function RegisterRoute() {
  const { redirect } = Route.useSearch()

  return <RegisterScreen redirectTo={toSafeRedirect(redirect)} />
}
