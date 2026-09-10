import type { MobileNavItem } from '../type'

/**
 * Bloco central da barra, medido no frame Mobile/Início do Figma (414 x 896):
 * a barra tem 95px de altura e o recorte do botão de escanear ocupa 151.7px
 * no centro. Só esse bloco tem largura fixa — as laterais esticam com a tela.
 */
export const MOBILE_TAB_BAR_NOTCH = {
  width: 151.7,
  height: 95,
}

/**
 * Recorte central: arco de raio 48.62 centrado na aresta superior da barra,
 * com ombros que voltam ao topo nas extremidades do bloco.
 */
export const MOBILE_TAB_BAR_NOTCH_PATH =
  'M151.7 0C137.94 0 125.72 8.2 119.87 20.65C112.11 37.17 95.31 48.62 75.85 48.62C56.39 48.62 39.59 37.18 31.83 20.65C25.98 8.2 13.75 0 0 0V95H151.7Z'

/**
 * Centros dos ícones no frame de 414px — Início 46, Favoritos 118,
 * Carrinho 302, Minha conta 364 — convertidos para % da largura da barra.
 */
export const MOBILE_NAV_ITEMS: Array<MobileNavItem> = [
  { key: 'home', label: 'Início', position: 11.1, to: '/' },
  { key: 'favorites', label: 'Favoritos', position: 28.5 },
  { key: 'cart', label: 'Carrinho', position: 72.9, to: '/carrinho' },
  { key: 'account', label: 'Minha conta', position: 87.9, to: '/perfil' },
]

export const MOBILE_SCAN_LABEL = 'Escanear código'
