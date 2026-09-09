import type { Artwork, ArtworkKey } from '../type'

export const ARTWORKS: Record<ArtworkKey, Artwork> = {
  varsity: {
    src: '/nft/ape-varsity-500.webp',
    alt: 'Macaco de jaqueta universitária verde e óculos escuros redondos',
  },
  bucket: {
    src: '/nft/ape-bucket-500.webp',
    alt: 'Macaco de chapéu bucket e moletom roxo',
  },
  headphones: {
    src: '/nft/ape-headphones-500.webp',
    alt: 'Macaco dourado com fones de ouvido verdes e jaqueta bomber creme',
  },
  turtleneck: {
    src: '/nft/ape-turtleneck-500.webp',
    alt: 'Macaco de cabelo escuro, brinco dourado, gola alta verde e blazer creme',
  },
}

/**
 * Atributos do que é visível na arte, derivados da mesma leitura que gerou
 * o texto alternativo. Não são metadados de blockchain inventados.
 */
export const ARTWORK_ATTRIBUTES: Record<ArtworkKey, Array<string>> = {
  varsity: ['Óculos', 'Jaqueta universitária', 'Raro'],
  bucket: ['Chapéu bucket', 'Moletom roxo', 'Comum'],
  headphones: ['Fones de ouvido', 'Jaqueta bomber', 'Incomum'],
  turtleneck: ['Gola alta', 'Brinco dourado', 'Raro'],
}
