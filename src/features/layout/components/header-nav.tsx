import { cn } from '@/global/helpers/cn'
import { NAV_ITEMS } from '../constants/nav'
import type { NavKey } from '../type'

type HeaderNavProps = {
  active: NavKey
}

export function HeaderNav({ active }: HeaderNavProps) {
  return (
    <nav aria-label="Principal">
      <ul className="flex items-start gap-10">
        {NAV_ITEMS.map(({ key, label }) => {
          const isActive = key === active

          return (
            <li key={key} className="flex flex-col gap-6">
              <span
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'text-16 whitespace-nowrap',
                  isActive
                    ? 'font-bold text-highlight'
                    : 'font-normal text-foreground',
                )}
              >
                {label}
              </span>
              {isActive ? <span className="h-0.75 bg-primary" /> : null}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
