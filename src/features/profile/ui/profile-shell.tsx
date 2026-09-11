import { useEffect } from 'react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { Container } from '@/global/components/ui/container'
import { MobileTopBar } from '@/global/components/ui/mobile-top-bar'
import { Skeleton } from '@/global/components/ui/skeleton'
import { useMe } from '@/global/api/user'
import { useDeviceTier } from '@/global'
import { toSafeRedirect } from '@/global/config/auth-redirect'
import { ProfileSidebar } from '../components/profile-sidebar'
import { AuthRequired } from '../components/auth-required'
import { PROFILE_COPY } from '../constants/profile-copy'
import { PROFILE_NAV_ITEMS, toMobileTarget } from '../constants/profile-nav'

/**
 * Sidebar de 310 e conteúdo de 862, com 28,5 entre elas — medidas no frame de
 * 1440, em `fr` proporcional como no carrinho.
 */
const PROFILE_GRID =
  'grid gap-y-6 lg:grid-cols-[minmax(0,310fr)_minmax(0,862fr)] lg:items-start lg:gap-x-7'

type ProfileShellProps = {
  children: React.ReactNode
}

/**
 * A casca da área de perfil, que muda de composição por dispositivo — decisão
 * que o CSS não expressa, e por isso vem do `useDeviceTier`.
 *
 * No mobile não há sidebar: quem navega é a lista de seções, e cada tela volta
 * pelo topo. Deslogado, o mobile vai para a tela de login (os frames são tela
 * cheia, sem barra de navegação) e o desktop mostra o painel com o diálogo.
 */
export function ProfileShell({ children }: ProfileShellProps) {
  const me = useMe()
  const navigate = useNavigate()
  const isMobile = useDeviceTier() === 'mobile'

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const isAnonymous = !me.isPending && !me.data

  useEffect(() => {
    if (!isAnonymous || !isMobile) return

    void navigate({
      to: '/entrar',
      search: { redirect: toSafeRedirect(pathname) },
      replace: true,
    })
  }, [isAnonymous, isMobile, navigate, pathname])

  if (me.isPending) {
    return (
      <Container as="main" className="md:pt-8">
        <div role="status" aria-busy="true" className={PROFILE_GRID}>
          <span className="sr-only">{PROFILE_COPY.loadingLabel}</span>
          <Skeleton className="hidden h-101.75 w-full lg:block" />
          <Skeleton className="h-150 w-full" />
        </div>
      </Container>
    )
  }

  if (!me.data) {
    /** No mobile o efeito acima já está levando para `/entrar`. */
    return isMobile ? null : (
      <Container as="main" className="md:pt-8">
        <AuthRequired />
      </Container>
    )
  }

  return (
    <Container as="main" className="pb-10 md:pt-8">
      {/** O título da seção aberta; na lista, o nome da área. */}
      <MobileTopBar title={toMobileTitle(pathname)} />

      <div className={`mt-4 ${PROFILE_GRID}`}>
        <div className="hidden lg:block">
          <ProfileSidebar />
        </div>

        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  )
}

function toMobileTitle(pathname: string): string {
  const match = PROFILE_NAV_ITEMS.find(
    (item) => item.to && toMobileTarget(item) === pathname,
  )

  return match?.label ?? PROFILE_COPY.sidebarHeading
}
