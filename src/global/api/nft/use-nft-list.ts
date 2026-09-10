import { useQuery } from '@tanstack/react-query'
import { nftListQueryOptions } from './nft-query-options'
import type { ApiError } from '../api-error'
import type { NftListQuery, NftListResponse } from '../contracts/nft'

export function useNftList(query: NftListQuery) {
  return useQuery<NftListResponse, ApiError>(nftListQueryOptions(query))
}
