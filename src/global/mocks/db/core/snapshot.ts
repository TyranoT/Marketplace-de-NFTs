import type { CartSnapshot } from '../cart/cart-snapshot'

export type MockDbSnapshot = {
  /**
   * Sobe junto com qualquer mudança de formato do seed. Divergência força
   * reseed, evitando que um `localStorage` antigo quebre o app em silêncio.
   */
  seedVersion: number
  cart: CartSnapshot
  /** Chave `${nftId}:${editionId}`. */
  availability: Record<string, number>
  /** Preço corrente por NFT, em string decimal. Muda com `nft.updated`. */
  prices: Record<string, string>
}

export const SEED_VERSION = 1
