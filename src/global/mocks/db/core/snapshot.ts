import type { CartSnapshot } from '../cart/cart-snapshot'
import type { OrderSnapshot } from '../order/order-snapshot'

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
  /** Compras concluídas, na ordem em que aconteceram. */
  orders: Array<OrderSnapshot>
}

/** 2: o banco passou a guardar pedidos. */
export const SEED_VERSION = 2
