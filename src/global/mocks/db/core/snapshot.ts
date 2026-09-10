import type { CartSnapshot } from '../cart/cart-snapshot'
import type { OrderSnapshot } from '../order/order-snapshot'
import type {
  SessionSnapshot,
  UserSnapshot,
  WalletSnapshot,
} from '../user/user-snapshot'

export type IdempotencyRecord = { requestHash: string; orderId: string }

export type MockDbSnapshot = {
  /**
   * Sobe junto com qualquer mudança de formato do seed. Divergência força
   * reseed, evitando que um `localStorage` antigo quebre o app em silêncio.
   */
  seedVersion: number
  /**
   * Resumo do conteúdo da semente. Divergência também força reseed: editar
   * um dado da semente deixa o que está guardado derivado de outra.
   */
  seedFingerprint: string
  cart: CartSnapshot
  /** Chave `${nftId}:${editionId}`. */
  availability: Record<string, number>
  /** Preço corrente por NFT, em string decimal. Muda com `nft.updated`. */
  prices: Record<string, string>
  /**
   * Versão de cada NFT. É o que viaja nos eventos e o que permite descartar
   * um `nft.updated` duplicado ou atrasado sem regredir o estado.
   */
  nftRevisions: Record<string, { version: number; updatedAt: string }>
  /** Compras, na ordem em que aconteceram. */
  orders: Array<OrderSnapshot>
  /**
   * Chaves de idempotência já usadas. `requestHash` guarda o conteúdo da
   * tentativa: a mesma chave com o mesmo corpo devolve o mesmo pedido, e com
   * corpo diferente é conflito.
   */
  idempotency: Record<string, IdempotencyRecord>
  /** Só digesto e sal da senha; texto claro não é persistido. */
  users: Array<UserSnapshot>
  wallets: Array<WalletSnapshot>
  session?: SessionSnapshot
}

/** 6: o pedido ganhou ciclo de vida e o checkout, chave de idempotência. */
export const SEED_VERSION = 6
