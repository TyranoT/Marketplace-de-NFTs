import { Heart, House, Scan, ShoppingCart, User } from 'lucide-react'
import { cn } from 'cn'
import { MOBILE_TABS } from '../constants/mobile'

const ICONS = {
  home: House,
  favorites: Heart,
  cart: ShoppingCart,
  account: User,
}

export function MobileTabBar() {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 md:hidden"
    >
      <div className="relative mx-auto aspect-414/126 w-full max-w-[414px]">
        <svg
          aria-hidden="true"
          viewBox="30 40 414 94.95"
          className="absolute inset-x-0 bottom-0 w-full text-surface-card"
          preserveAspectRatio="none"
        >
          <path
            d="M312.85 40C299.09 40 286.87 48.2 281.02 60.65C273.26 77.17 256.46 88.62 237 88.62C217.54 88.62 200.74 77.18 192.98 60.65C187.13 48.2 174.9 40 161.15 40H58.93C42.95 40 30 52.95 30 68.93V134.95H444V68.93C444 52.95 431.05 40 415.07 40H312.85Z"
            fill="currentColor"
          />
        </svg>

        <button
          type="button"
          aria-label="Escanear código"
          className="absolute top-0 left-1/2 flex size-[15.7%] -translate-x-1/2 items-center justify-center rounded-full bg-linear-to-b from-primary/50 to-primary text-foreground"
          style={{ aspectRatio: '1' }}
        >
          <Scan className="size-[45%]" />
        </button>

        <ul className="absolute inset-x-0 bottom-[27.8%] flex items-center">
          {MOBILE_TABS.map(({ key, label, position, isActive }) => {
            const Icon = ICONS[key]

            return (
              <li
                key={key}
                className="absolute -translate-x-1/2"
                style={{ left: `${position}%` }}
              >
                <button
                  type="button"
                  aria-label={label}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex size-11 items-center justify-center',
                    isActive ? 'text-highlight' : 'text-text-secondary',
                  )}
                >
                  <Icon className={cn('size-5', isActive && 'fill-current')} />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
