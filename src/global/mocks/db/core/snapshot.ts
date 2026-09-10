import type { CartSnapshot } from '../cart/cart-snapshot'
import type { OrderSnapshot } from '../order/order-snapshot'
import type {
  SessionSnapshot,
  UserSnapshot,
  WalletSnapshot,
} from '../user/user-snapshot'

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
  /** Compras concluídas, na ordem em que aconteceram. */
  orders: Array<OrderSnapshot>
  /** Só digesto e sal da senha; texto claro não é persistido. */
  users: Array<UserSnapshot>
  wallets: Array<WalletSnapshot>
  session?: SessionSnapshot
}

/** 4: uma conta deixou de ser a única — o cadastro cria contas novas. */
export const SEED_VERSION = 4
