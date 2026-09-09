import type { NavItem } from '../type'

export const NAV_ITEMS: Array<NavItem> = [
  { key: 'home', label: 'Início' },
  { key: 'market', label: 'Mercado' },
  { key: 'creators', label: 'Criadores' },
  { key: 'learn', label: 'Aprenda' },
]

export const DEFAULT_ACTIVE_NAV: NavItem['key'] = 'home'
