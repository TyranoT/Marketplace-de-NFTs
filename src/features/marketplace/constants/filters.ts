import type { FilterOption, PriceRange } from '../type'

export const COLLECTION_FILTERS: Array<FilterOption> = [
  { id: 'digital-art', label: 'Arte digital', count: 33 },
  { id: 'photography', label: 'Fotografia', count: 12 },
  { id: 'music', label: 'Música', count: 65 },
  { id: '3d-art', label: 'Arte 3D', count: 39 },
  { id: 'collectibles', label: 'Colecionáveis', count: 23 },
  { id: 'generative', label: 'Generativa', count: 17 },
  { id: 'games', label: 'Jogos', count: 19 },
  { id: 'subscriptions', label: 'Assinaturas', count: 13 },
  { id: 'utility', label: 'Utilidade', count: 18 },
]

export const NETWORK_FILTERS: Array<FilterOption> = [
  { id: 'ethereum', label: 'Ethereum', count: 119 },
  { id: 'polygon', label: 'Polygon', count: 78 },
  { id: 'solana', label: 'Solana', count: 86 },
]

export const PRICE_BOUNDS: PriceRange = [0.02, 16.6]
export const PRICE_STEP = 0.01
export const DEFAULT_PRICE_RANGE: PriceRange = [0.02, 12.3]
