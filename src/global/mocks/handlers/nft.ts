import { http } from 'msw'
import { nftService } from '../db'
import { withScenario } from './with-scenario'
import type {
  NftCatalogSort,
  NftCatalogTab,
  NftListQuery,
} from '../../api/contracts/nft'

const DEFAULT_PAGE_SIZE = 9
const MAX_PAGE_SIZE = 100

const TABS: Array<NftCatalogTab> = ['all', 'new', 'trending']
const SORTS: Array<NftCatalogSort> = ['recent', 'price-asc', 'price-desc']

/**
 * Só tradução de HTTP: a consulta vira `NftListQuery` e o serviço decide o
 * resto. Parâmetro inválido cai no padrão em vez de recusar — a URL é
 * entrada de fora, e uma busca não deve quebrar porque alguém digitou
 * `?sort=xyz`.
 */
function toQuery(url: URL): NftListQuery {
  const { searchParams } = url

  const tab = searchParams.get('tab')
  const sort = searchParams.get('sort')
  const page = Number(searchParams.get('page') ?? 1)
  const pageSize = Number(searchParams.get('pageSize') ?? DEFAULT_PAGE_SIZE)

  return {
    q: searchParams.get('q') ?? undefined,
    collection: searchParams.getAll('collection'),
    network: searchParams.getAll('network'),
    minPrice: searchParams.get('minPrice') ?? undefined,
    maxPrice: searchParams.get('maxPrice') ?? undefined,
    exclude: searchParams.get('exclude') ?? undefined,
    tab: TABS.includes(tab as NftCatalogTab) ? (tab as NftCatalogTab) : 'all',
    sort: SORTS.includes(sort as NftCatalogSort)
      ? (sort as NftCatalogSort)
      : 'recent',
    page: Number.isInteger(page) && page > 0 ? page : 1,
    pageSize:
      Number.isInteger(pageSize) && pageSize > 0
        ? Math.min(pageSize, MAX_PAGE_SIZE)
        : DEFAULT_PAGE_SIZE,
  }
}

export const nftHandlers = [
  http.get('/api/nfts', ({ request }) =>
    withScenario(() => nftService.list(toQuery(new URL(request.url)))),
  ),

  http.get('/api/nfts/:nftId', ({ params }) =>
    withScenario(() => nftService.detail(String(params.nftId))),
  ),
]
