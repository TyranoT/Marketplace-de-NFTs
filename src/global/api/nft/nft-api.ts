import { request } from '../request'
import type {
  NftDetailResource,
  NftListQuery,
  NftListResponse,
} from '../contracts/nft'

type Signal = { signal?: AbortSignal }

/**
 * `URLSearchParams` em vez do objeto direto do Axios: coleção e rede são
 * repetíveis (`?collection=music&collection=games`), e o formato padrão do
 * Axios para arrays não é o que o handler lê.
 */
function toSearchParams(query: NftListQuery): URLSearchParams {
  const params = new URLSearchParams()

  if (query.q?.trim()) params.set('q', query.q.trim())
  for (const id of query.collection ?? []) params.append('collection', id)
  for (const id of query.network ?? []) params.append('network', id)
  if (query.minPrice) params.set('minPrice', query.minPrice)
  if (query.maxPrice) params.set('maxPrice', query.maxPrice)
  if (query.tab) params.set('tab', query.tab)
  if (query.sort) params.set('sort', query.sort)
  if (query.exclude) params.set('exclude', query.exclude)
  params.set('page', String(query.page))
  params.set('pageSize', String(query.pageSize))

  return params
}

export function getNfts(query: NftListQuery, { signal }: Signal = {}) {
  return request<NftListResponse>({
    method: 'GET',
    url: `/nfts?${toSearchParams(query).toString()}`,
    signal,
  })
}

export function getNft(nftId: string, { signal }: Signal = {}) {
  return request<NftDetailResource>({
    method: 'GET',
    url: `/nfts/${nftId}`,
    signal,
  })
}
