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

const TAP_TARGET = 'relative flex size-11 items-center justify-center'

type MobileTabItemProps = {
  item: MobileNavItem
}

export function MobileTabItem({ item }: MobileTabItemProps) {
  const { Icon, className } = TAB_ICONS[item.key]

  /**
   * Sem destino, o item é anunciado como indisponível. Antes era um botão
   * sem ação que parecia funcionar — o que o enunciado proíbe.
   */
  if (!item.to) {
    return (
      <button
        type="button"
        aria-disabled="true"
        aria-label={`${item.label} (em breve)`}
        className={cn(TAP_TARGET, 'cursor-not-allowed text-text-secondary/60')}
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
        <>
          <Icon
            className={cn(
              className,
              isActive ? 'text-highlight' : 'text-text-secondary',
            )}
          />
          {/**
           * O ativo não pode depender só da cor: os dois tons são próximos
           * demais para quem enxerga pouco contraste. O ponto é o segundo
           * sinal; o `aria-current` do Link é o de quem usa leitor de tela.
           */}
          {isActive ? (
            <span
              aria-hidden="true"
              className="absolute bottom-0.5 size-1 rounded-full bg-highlight"
            />
          ) : null}
        </>
      )}
    </Link>
  )
}
