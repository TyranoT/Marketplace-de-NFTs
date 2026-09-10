import type { NftEditionId } from '../../../type'

/**
 * Formato do carrinho como ele é serializado. Vive separado das classes
 * porque é a fronteira de serialização: mudar um campo daqui invalida o banco
 * persistido, mudar uma classe não.
 */
export type CartItemSnapshot = {
  id: string
  nftId: string
  editionId: NftEditionId
  quantity: number
}

export type CartSnapshot = {
  id: string
  items: Array<CartItemSnapshot>
  couponCode?: string
  version: number
  updatedAt: string
}
