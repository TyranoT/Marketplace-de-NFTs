import { Link, useRouterState } from '@tanstack/react-router'
import { Container } from '@/global/components/ui/container'
import { DEFAULT_ACTIVE_NAV } from '../constants/nav'
import { HeaderActions } from './header-actions'
import { HeaderNav } from './header-nav'

type HeaderProps = {
  /** Sobrepõe a contagem real; sem ela o cabeçalho consulta o carrinho. */
  cartCount?: number
}

export function Header({ cartCount }: HeaderProps) {
  const config = useRouterState({
    select: (state) => state.matches.at(-1)?.staticData.header,
  })
  /**
   * O padrão "Início" só vale para rotas que não configuram o cabeçalho.
   * Uma rota que configura mas não diz `active` — perfil, login — não
   * pertence a nenhum item, e marcar "Início" como página atual ali era
   * anunciar ao leitor de tela uma localização falsa.
   */
  const active = config ? config.active : DEFAULT_ACTIVE_NAV
  const hasDivider = config?.divider ?? true

  return (
    <Container
      as="header"
      className="hidden pt-6 sticky top-0 bg-ink z-20 md:block"
    >
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
