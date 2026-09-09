import { Link, useRouterState } from '@tanstack/react-router'
import { Container } from '@/global/components/ui/container'
import { DEFAULT_ACTIVE_NAV } from '../constants/nav'
import { HeaderActions } from './header-actions'
import { HeaderNav } from './header-nav'

type HeaderProps = {
  cartCount?: number
}

export function Header({ cartCount = 0 }: HeaderProps) {
  const config = useRouterState({
    select: (state) => state.matches.at(-1)?.staticData.header,
  })
  const active = config?.active ?? DEFAULT_ACTIVE_NAV
  const hasDivider = config?.divider ?? true

  return (
    <Container as="header" className="hidden pt-6 md:block">
      <div className="flex items-start justify-between">
        <Link
          to="/"
          aria-label="Kurio, ir para a página inicial"
          className="w-40 text-14 font-bold tracking-[1.4px] text-foreground"
        >
          KURIO
        </Link>

        <HeaderNav active={active} />
        <HeaderActions cartCount={cartCount} />
      </div>

      {hasDivider ? <div className="h-px bg-primary/30" /> : null}
    </Container>
  )
}
