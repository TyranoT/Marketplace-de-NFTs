import { z } from 'zod'
import { CATALOG_PAGE_SIZE } from '../constants/catalog'
import { DEFAULT_PRICE_RANGE, PRICE_BOUNDS } from '../constants/filters'
import type { NftListQuery } from '@/global/api/contracts/nft'

/**
 * O estado do catálogo vive na URL, e não em `useState`.
 *
 * O enunciado pede que busca, filtros, ordenação e paginação sobrevivam a
 * refresh e à navegação pelo histórico — o que só a URL garante. Cada campo
 * tem `.catch(...)`: a URL é entrada de fora, e um `?sort=xyz` colado por
 * alguém não pode quebrar a tela, só cair no padrão.
 */
export const catalogSearchSchema = z.object({
  q: z.string().trim().min(1).optional().catch(undefined),
  collection: z.array(z.string()).optional().catch(undefined),
  network: z.array(z.string()).optional().catch(undefined),
  minPrice: z.number().optional().catch(undefined),
  maxPrice: z.number().optional().catch(undefined),
  tab: z.enum(['all', 'new', 'trending']).default('all').catch('all'),
  sort: z
    .enum(['recent', 'price-asc', 'price-desc'])
    .default('recent')
    .catch('recent'),
  page: z.number().int().min(1).default(1).catch(1),
})

export type CatalogSearch = z.infer<typeof catalogSearchSchema>

/**
 * A faixa de preço só entra na consulta quando difere do intervalo cheio.
 * Mandar os limites sempre encheria a URL de ruído e criaria uma chave de
 * cache diferente para o que é, na prática, "sem filtro de preço".
 */
export function toListQuery(search: CatalogSearch): NftListQuery {
  return {
    q: search.q,
    collection: search.collection,
    network: search.network,
    minPrice:
      search.minPrice !== undefined && search.minPrice > PRICE_BOUNDS[0]
        ? String(search.minPrice)
        : undefined,
    maxPrice:
      search.maxPrice !== undefined && search.maxPrice < PRICE_BOUNDS[1]
        ? String(search.maxPrice)
        : undefined,
    tab: search.tab,
    sort: search.sort,
    page: search.page,
    pageSize: CATALOG_PAGE_SIZE,
  }
}

export function priceRangeOf(search: CatalogSearch): [number, number] {
  return [
    search.minPrice ?? DEFAULT_PRICE_RANGE[0],
    search.maxPrice ?? DEFAULT_PRICE_RANGE[1],
  ]
}
