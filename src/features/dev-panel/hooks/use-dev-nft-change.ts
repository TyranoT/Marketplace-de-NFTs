import { useMutation, useQueryClient } from '@tanstack/react-query'
import { request } from '@/global/api/request'
import { cartKeys, useCartScope } from '@/global/api/cart'
import { nftKeys } from '@/global/api/nft'
import type { ApiError } from '@/global/api'
import type { NftEditionId } from '@/global/type'
import type { NftListItem } from '@/global/api/contracts/nft'

export type DevNftChange = {
  nftId: string
  price?: string
  editions?: Array<{ editionId: NftEditionId; units: number }>
}

/**
 * Escrita do painel.
 *
 * Invalida o catálogo e o carrinho pelo caminho normal: o evento de tempo
 * real cuida das **outras** telas, mas quem disparou a mudança não deve
 * depender do próprio evento voltar para ver o resultado.
 */
export function useDevNftChange() {
  const queryClient = useQueryClient()
  const scope = useCartScope()

  return useMutation<NftListItem, ApiError, DevNftChange>({
    mutationFn: ({ nftId, ...data }) =>
      request<NftListItem>({
        method: 'PATCH',
        url: `/__mock/nfts/${nftId}`,
        data,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: nftKeys.all }),
        queryClient.invalidateQueries({ queryKey: cartKeys.detail(scope) }),
      ])
    },
  })
}
