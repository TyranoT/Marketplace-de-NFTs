import { ARTWORKS } from '@/global/data/artwork'

export const MOBILE_SEARCH_PLACEHOLDER = 'Explorar coleções'

export const MOBILE_HERO = {
  eyebrow: 'Bem-vindo à Kurio',
  titleLines: ['SEJA DONO DA', 'CULTURA DIGITAL'],
  body: 'Descubra NFTs selecionados de criadores do mundo todo.',
  cta: 'EXPLORAR',
  feature: ARTWORKS.varsity,
  thumbnail: ARTWORKS.bucket,
}

/**
 * Posições horizontais em % da largura de 414px, medidas no frame
 * Mobile / Início: Home 36, Favoritos 108, Carrinho 292, Conta 354
 * (centro do ícone de 20px = posição + 10).
 */
export const MOBILE_TABS = [
  { key: 'home', label: 'Início', position: 11.1, isActive: true },
  { key: 'favorites', label: 'Favoritos', position: 28.5, isActive: false },
  { key: 'cart', label: 'Carrinho', position: 72.9, isActive: false },
  { key: 'account', label: 'Minha conta', position: 87.9, isActive: false },
] as const
