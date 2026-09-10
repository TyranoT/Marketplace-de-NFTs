import type { NftListQuery } from '../contracts/nft'

/**
 * Consulta normalizada para virar chave de cache.
 *
 * O hash do TanStack ordena as chaves de um objeto, mas **descarta**
 * `undefined`. Sem normalizar, `{ q: undefined, page: 1 }` e `{ page: 1 }`
 * seriam a mesma chave por acaso, e listas vazias vindas da URL criariam
 * entradas distintas para consultas equivalentes. Aqui a forma é sempre a
 * mesma: ausente vira `null`, lista vira lista ordenada.
 */
export function normalizeQuery(query: NftListQuery) {
  return {
    q: query.q?.trim() || null,
    collection: [...(query.collection ?? [])].sort(),
    network: [...(query.network ?? [])].sort(),
    minPrice: query.minPrice ?? null,
    maxPrice: query.maxPrice ?? null,
    tab: query.tab ?? 'all',
    sort: query.sort ?? 'recent',
    exclude: query.exclude ?? null,
    page: query.page,
    pageSize: query.pageSize,
  }
}

export const nftKeys = {
  all: ['nft'] as const,
  /** Prefixo de todas as listas: é por ele que um evento alcança as páginas. */
  lists: () => [...nftKeys.all, 'list'] as const,
  list: (query: NftListQuery) =>
    [...nftKeys.lists(), normalizeQuery(query)] as const,
  details: () => [...nftKeys.all, 'detail'] as const,
  detail: (id: string) => [...nftKeys.details(), id] as const,
}

/** Identidade do recurso nos eventos. Precisa casar com a do servidor. */
export function nftResourceId(nftId: string): string {
  return `nft:${nftId}`
}
