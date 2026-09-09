import type { CatalogSortOption, CatalogTab } from '../type'

export const CATALOG_TABS: Array<CatalogTab> = [
  { key: 'all', label: 'Todos os NFTs' },
  { key: 'new', label: 'Novos lançamentos' },
  { key: 'trending', label: 'Em alta' },
]

export const CATALOG_SORT_OPTIONS: Array<CatalogSortOption> = [
  { value: 'recent', label: 'Listados recentemente' },
  { value: 'price-asc', label: 'Preço: menor primeiro' },
  { value: 'price-desc', label: 'Preço: maior primeiro' },
]

export const DEFAULT_CATALOG_TAB: CatalogTab['key'] = 'all'
export const DEFAULT_CATALOG_SORT: CatalogSortOption['value'] = 'recent'
export const CATALOG_PAGE_SIZE = 9

/** Quantidade de páginas desenhada no Figma. O total real vem da API. */
export const CATALOG_PAGE_COUNT = 4
