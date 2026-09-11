import { Link } from '@tanstack/react-router'
import { cn } from '@/global/helpers/cn'
import { NAV_ITEMS } from '../constants/nav'
import type { NavKey } from '../type'

type HeaderNavProps = {
  /** Ausente em telas que não pertencem a nenhum item — perfil, login. */
  active?: NavKey
}

const ITEM_CLASS = 'text-16 whitespace-nowrap'

/**
 * A navegação principal.
 *
 * Os itens eram `<span>`: um `<nav>` sem nenhum link, em que "Início" e
 * "Mercado" não navegavam nem recebiam foco. Agora os dois são links;
 * "Criadores" e "Aprenda", que não têm página, ficam como texto marcado
 * como indisponível, em vez de parecerem clicáveis.
 *
 * O `aria-current` é decidido aqui, pelo `active` da rota, e não pelo
 * `Link`: o do TanStack ignora o hash, e marcaria "Mercado" (`/#catalogo`)
 * como página atual na própria home.
 */
export function HeaderNav({ active }: HeaderNavProps) {
  return (
    <nav aria-label="Principal">
      <ul className="flex items-start gap-10">
        {NAV_ITEMS.map(({ key, label }) => {
          const isActive = key === active
          const tone = isActive
            ? 'font-bold text-highlight'
            : 'font-normal text-foreground'
          const current = isActive ? ('page' as const) : undefined

          return (
            <li key={key} className="flex flex-col gap-6">
              {key === 'home' ? (
                <Link
                  to="/"
                  aria-current={current}
                  activeProps={{ 'aria-current': current }}
                  className={cn(ITEM_CLASS, tone)}
                >
                  {label}
                </Link>
              ) : key === 'market' ? (
                <Link
                  to="/"
                  hash="catalogo"
                  aria-current={current}
                  activeProps={{ 'aria-current': current }}
                  className={cn(ITEM_CLASS, tone)}
                >
                  {label}
                </Link>
              ) : (
                <span className={cn(ITEM_CLASS, 'text-foreground/60')}>
                  {label}
                  <span className="sr-only"> (em breve)</span>
                </span>
              )}

              {isActive ? (
                <span aria-hidden="true" className="h-0.75 bg-primary" />
              ) : null}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
