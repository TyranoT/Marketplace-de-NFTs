import { useRouterState } from '@tanstack/react-router'
import { ScanLine } from 'lucide-react'
import {
  MOBILE_NAV_ITEMS,
  MOBILE_SCAN_LABEL,
  MOBILE_TAB_BAR_NOTCH,
  MOBILE_TAB_BAR_NOTCH_PATH,
} from '../constants/mobile-nav'
import { MobileTabItem } from './mobile-tab-item'

/**
 * Barra de navegação inferior do mobile.
 *
 * A barra é full-bleed: as duas laterais esticam com a tela e o recorte do
 * botão de escanear fica no centro, com largura fixa, para não deformar.
 * As laterais terminam em `calc(50%+70px)` — metade do recorte menos ~5px —
 * e passam por baixo das bordas opacas do SVG, evitando emenda visível em
 * larguras fracionárias.
 */
export function MobileTabBar() {
  const isEnabled = useRouterState({
    select: (state) => state.matches.at(-1)?.staticData.mobileTabBar ?? true,
  })

  if (!isEnabled) return null

  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-40 md:hidden"
    >
      <div className="relative h-23.75">
        <div className="absolute inset-y-0 left-0 right-[calc(50%+70px)] rounded-tl-[29px] bg-surface-card" />
        <div className="absolute inset-y-0 right-0 left-[calc(50%+70px)] rounded-tr-[29px] bg-surface-card" />

        <svg
          aria-hidden="true"
          width={MOBILE_TAB_BAR_NOTCH.width}
          height={MOBILE_TAB_BAR_NOTCH.height}
          viewBox={`0 0 ${MOBILE_TAB_BAR_NOTCH.width} ${MOBILE_TAB_BAR_NOTCH.height}`}
          className="absolute top-0 left-1/2 -translate-x-1/2 text-surface-card"
        >
          <path d={MOBILE_TAB_BAR_NOTCH_PATH} fill="currentColor" />
        </svg>

        {/**
         * Escanear não existe na demonstração. O botão fica, porque é o centro
         * do frame, mas anuncia que está indisponível em vez de parecer que
         * funciona.
         */}
        <button
          type="button"
          aria-disabled="true"
          aria-label={`${MOBILE_SCAN_LABEL} (em breve)`}
          className="absolute -top-8.25 left-1/2 flex size-16.5 -translate-x-1/2 cursor-not-allowed items-center justify-center rounded-full bg-linear-to-b from-primary/50 to-primary text-foreground"
        >
          <ScanLine className="size-6.5" />
        </button>

        <ul>
          {MOBILE_NAV_ITEMS.map((item) => (
            <li
              key={item.key}
              className="absolute bottom-11.25 -translate-x-1/2 translate-y-1/2"
              style={{ left: `${item.position}%` }}
            >
              <MobileTabItem item={item} />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
