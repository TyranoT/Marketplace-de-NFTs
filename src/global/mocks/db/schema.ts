import type { NftEditionId } from '../../type'

export type MockCartItem = {
  id: string
  nftId: string
  editionId: NftEditionId
  quantity: number
}

export type MockCart = {
  id: string
  items: Array<MockCartItem>
  couponCode?: string
  version: number
  updatedAt: string
}

export type MockDb = {
  /**
   * Sobe junto com qualquer mudança de formato do seed. Divergência força
   * reseed, evitando que um `localStorage` antigo quebre o app em silêncio.
   */
  seedVersion: number
  cart: MockCart
  /** Chave `${nftId}:${editionId}`. */
  availability: Record<string, number>
  /** Preço corrente por NFT, em string decimal. Muda com `nft.updated`. */
  prices: Record<string, string>
}

export const SEED_VERSION = 1

export function availabilityKey(nftId: string, editionId: NftEditionId) {
  return `${nftId}:${editionId}`
}
