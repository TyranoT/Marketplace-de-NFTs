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
 * As duas esferas que se cruzam ao fundo do banner mobile, em coordenadas do
 * próprio banner (366 x 190, medido no frame Mobile/Início do Figma).
 *
 * Ambas são maiores que o banner e ficam recortadas pelas bordas do card; o
 * losango claro no meio é só a sobreposição das duas, não uma terceira forma.
 */
export const MOBILE_HERO_ORBS = [
  { cx: 72, cy: 93, rx: 96, ry: 111.5 },
  { cx: 197, cy: 112, rx: 124, ry: 122 },
]
