import { useQuery } from '@tanstack/react-query'
import { nftDetailQueryOptions } from './nft-query-options'
import type { ApiError } from '../api-error'
import type { NftDetailResource } from '../contracts/nft'

export function useNftDetail(nftId: string) {
  return useQuery<NftDetailResource, ApiError>(nftDetailQueryOptions(nftId))
}
