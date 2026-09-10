import { keepPreviousData } from '@tanstack/react-query'
import { getNft, getNfts } from './nft-api'
import { nftKeys } from './nft-keys'
import type { NftListQuery } from '../contracts/nft'

/**
 * `keepPreviousData` mantém a grade anterior enquanto a próxima página
 * carrega: sem isso, cada clique na paginação apagaria a lista e o rodapé
 * saltaria para o topo da tela.
 */
export function nftListQueryOptions(query: NftListQuery) {
  return {
    queryKey: nftKeys.list(query),
    queryFn: ({ signal }: { signal: AbortSignal }) =>
      getNfts(query, { signal }),
    placeholderData: keepPreviousData,
  }
}

export function nftDetailQueryOptions(nftId: string) {
  return {
    queryKey: nftKeys.detail(nftId),
    queryFn: ({ signal }: { signal: AbortSignal }) => getNft(nftId, { signal }),
  }
}
