import { Link } from '@tanstack/react-router'
import { Container } from '@/global/components/ui/container'
import { SITE } from '@/global/config/site'
import { AUTH_COPY } from '../constants/auth-copy'
import { AuthNotice } from '../components/auth-notice'
import { AuthProviders } from '../components/auth-providers'
import type { LinkProps } from '@tanstack/react-router'

type AuthScreenProps = {
  title: string
  footerQuestion: string
  footerAction: string
  footerTo: LinkProps['to']
  notice?: string
  onUnavailable: (message: string) => void
  children: React.ReactNode
}

/**
 * Moldura das duas telas de autenticação no mobile: a marca no topo, o título,
 * o formulário, o divisor "Ou continue com", os provedores e o rodapé em texto.
 *
 * É tela, e não o diálogo do desktop, porque é o que os frames mobile mostram —
 * inclusive sem a barra de navegação inferior, que só se desliga por rota.
 */
export function AuthScreen({
  title,
  footerQuestion,
  footerAction,
  footerTo,
  notice,
  onUnavailable,
  children,
}: AuthScreenProps) {
  return (
    <Container as="main" className="flex min-h-dvh flex-col gap-8 pt-17 pb-10">
      <p className="text-center text-28 leading-7 font-bold tracking-[6px] text-text-primary">
        {SITE.name.toUpperCase()}
      </p>

      <h1 className="mt-14 text-center text-20 leading-6 font-bold text-text-primary">
        {title}
      </h1>

      {children}

      <div className="flex flex-col gap-4">
        {/** Filetes dos dois lados do texto, como no frame. */}
        <div className="flex items-center gap-4">
          <span aria-hidden="true" className="h-px flex-1 bg-line-soft" />
          <span className="text-14 leading-4 text-foreground">
            {AUTH_COPY.providersDivider}
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-line-soft" />
        </div>

        <AuthProviders onUnavailable={onUnavailable} />

        <AuthNotice message={notice} tone="info" />
      </div>

      <p className="text-center text-15 leading-5 text-text-secondary">
        {footerQuestion}{' '}
        <Link
          to={footerTo}
          className="text-brand transition-colors hover:text-highlight"
        >
          {footerAction}
        </Link>
      </p>

      {/** Sem isso, ninguém descobre como entrar na conta de exemplo. */}
      <p className="mt-auto text-center text-12 leading-4 text-brand-muted">
        {AUTH_COPY.demoHint}
      </p>
    </Container>
  )
}
