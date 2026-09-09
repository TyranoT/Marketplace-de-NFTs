import { Link } from '@tanstack/react-router'
import { Heart, ShoppingCart, User } from 'lucide-react'
import { cn } from '@/global/helpers/cn'
import { HouseSolidIcon } from '@/global/components/icons'
import type { ComponentType, SVGProps } from 'react'
import type { MobileNavItem, MobileNavKey } from '../type'

type TabIcon = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  className: string
}

/**
 * No Figma os quatro ícones são sólidos. `fill-current` resolve heart e user;
 * o carrinho precisa preencher só a cesta, o segundo `path` do lucide, para
 * manter as rodas vazadas.
 */
const TAB_ICONS: Record<MobileNavKey, TabIcon> = {
  home: { Icon: HouseSolidIcon, className: 'size-5.5' },
  favorites: { Icon: Heart, className: 'size-5.5 fill-current' },
  cart: {
    Icon: ShoppingCart,
    className: 'size-5 [&>path:nth-of-type(2)]:fill-current',
  },
  account: { Icon: User, className: 'size-5 fill-current' },
}

const TAP_TARGET = 'flex size-11 items-center justify-center'

type MobileTabItemProps = {
  item: MobileNavItem
}

export function MobileTabItem({ item }: MobileTabItemProps) {
  const { Icon, className } = TAB_ICONS[item.key]

  if (!item.to) {
    return (
      <button
        type="button"
        aria-label={item.label}
        className={cn(TAP_TARGET, 'text-text-secondary')}
      >
        <Icon className={className} />
      </button>
    )
  }

  return (
    <Link
      to={item.to}
      aria-label={item.label}
      activeOptions={{ exact: true }}
      className={TAP_TARGET}
    >
      {({ isActive }) => (
        <Icon
          className={cn(
            className,
            isActive ? 'text-highlight' : 'text-text-secondary',
          )}
        />
      )}
    </Link>
  )
}
