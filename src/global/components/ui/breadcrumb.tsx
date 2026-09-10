import { Link } from '@tanstack/react-router'
import { cn } from '@/global/helpers/cn'
import type { LinkProps } from '@tanstack/react-router'

export type BreadcrumbItem = {
  label: string
  /** Ausente quando a rota do destino ainda não existe — vira texto. */
  to?: LinkProps['to']
}

type BreadcrumbProps = {
  items: Array<BreadcrumbItem>
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Trilha de navegação" className={className}>
      <ol
        className={cn(
          'flex items-center gap-2 text-16 leading-4 font-bold text-foreground',
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={item.label} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden="true" className="text-text-secondary">
                  /
                </span>
              ) : null}

              {item.to && !isLast ? (
                <Link to={item.to}>{item.label}</Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
