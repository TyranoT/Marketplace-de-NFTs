import { Container } from '@/global/components/ui/container'
import { Skeleton } from '@/global/components/ui/skeleton'
import { useMe } from '@/global/api/user'
import { ProfileSidebar } from '../components/profile-sidebar'
import { AuthRequired } from '../components/auth-required'
import { PROFILE_COPY } from '../constants/profile-copy'

/**
 * Sidebar de 310 e conteúdo de 862, com 28,5 entre elas — medidas no frame de
 * 1440, em `fr` proporcional como no carrinho. A sidebar só aparece para quem
 * está autenticado: sem conta, não há o que ela navegue.
 */
const PROFILE_GRID =
  'grid gap-y-6 lg:grid-cols-[minmax(0,310fr)_minmax(0,862fr)] lg:items-start lg:gap-x-7'

type ProfileShellProps = {
  children: React.ReactNode
}

export function ProfileShell({ children }: ProfileShellProps) {
  const me = useMe()

  if (me.isPending) {
    return (
      <Container as="main" className="md:pt-8">
        <div className={PROFILE_GRID}>
          <Skeleton className="h-101.75 w-full" />
          <Skeleton
            aria-label={PROFILE_COPY.loadingLabel}
            className="h-150 w-full"
          />
        </div>
      </Container>
    )
  }

  if (!me.data) {
    return (
      <Container as="main" className="md:pt-8">
        <AuthRequired />
      </Container>
    )
  }

  return (
    <Container as="main" className="md:pt-8">
      <div className={PROFILE_GRID}>
        <ProfileSidebar />
        <div>{children}</div>
      </div>
    </Container>
  )
}
