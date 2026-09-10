import { NFTS } from '../../../data/nfts'
import { MockCart } from '../cart/mock-cart'
import { MockCartItem } from '../cart/mock-cart-item'
import { AvailabilityDelegate, PriceDelegate } from '../nft'
import { MockOrder } from '../order/mock-order'
import { MockUser } from '../user/mock-user'
import { MockWallet } from '../user/mock-wallet'
import { buildSeedUsers, buildSeedWallets } from '../user/user-seed'
import { seedFingerprint } from './seed-fingerprint'
import { SEED_VERSION } from './snapshot'
import type { MockDbSnapshot } from './snapshot'
import type { SessionSnapshot } from '../user/user-snapshot'

const SEED_CART_ID = 'cart-guest'

/**
 * Cenário conhecido do carrinho, idêntico ao frame do Figma: três itens com
 * quantidades 2, 6 e 9, cujo subtotal fecha em 26.83 ETH. Manter a paridade
 * com o design é o que permite usar a tela como baseline de regressão visual.
 */
const SEED_ITEMS = [
  { nftId: 'emerald-ape-042', quantity: 2 },
  { nftId: 'violet-nomad-314', quantity: 6 },
  { nftId: 'ivory-baron-088', quantity: 9 },
]

/**
 * As linhas do banco simulado, sem nenhuma operação: quem consulta e escreve
 * é o `MockDbClient`, pelos delegates. Aqui ficam só o estado e a conversão
 * de e para o que é persistido.
 */
export class MockDb {
  constructor(
    readonly cart: MockCart,
    readonly availability: Map<string, number>,
    readonly prices: Map<string, string>,
    readonly orders: Map<string, MockOrder>,
    readonly users: Map<string, MockUser>,
    readonly wallets: Map<string, MockWallet>,
    private currentSession?: SessionSnapshot,
  ) {}

  static seed(): MockDb {
    const items = SEED_ITEMS.flatMap(({ nftId, quantity }) => {
      const nft = NFTS.find((entry) => entry.id === nftId)

      if (!nft) return []

      return [new MockCartItem(`item-${nftId}`, nftId, nft.edition, quantity)]
    })

    return new MockDb(
      MockCart.seeded(SEED_CART_ID, items),
      AvailabilityDelegate.seed(),
      PriceDelegate.seed(),
      new Map(),
      buildSeedUsers(),
      buildSeedWallets(),
    )
  }

  static fromSnapshot(snapshot: MockDbSnapshot): MockDb {
    return new MockDb(
      MockCart.fromSnapshot(snapshot.cart),
      new Map(Object.entries(snapshot.availability)),
      new Map(Object.entries(snapshot.prices)),
      new Map(
        snapshot.orders.map((order) => [
          order.id,
          MockOrder.fromSnapshot(order),
        ]),
      ),
      new Map(
        snapshot.users.map((user) => [user.id, MockUser.fromSnapshot(user)]),
      ),
      new Map(
        snapshot.wallets.map((wallet) => [
          wallet.id,
          MockWallet.fromSnapshot(wallet),
        ]),
      ),
      snapshot.session,
    )
  }

  get session(): SessionSnapshot | undefined {
    return this.currentSession
  }

  setSession(session: SessionSnapshot | undefined): void {
    this.currentSession = session
  }

  toSnapshot(): MockDbSnapshot {
    return {
      seedVersion: SEED_VERSION,
      seedFingerprint: seedFingerprint(),
      cart: this.cart.toSnapshot(),
      availability: Object.fromEntries(this.availability),
      prices: Object.fromEntries(this.prices),
      orders: [...this.orders.values()].map((order) => order.toSnapshot()),
      users: [...this.users.values()].map((user) => user.toSnapshot()),
      wallets: [...this.wallets.values()].map((wallet) => wallet.toSnapshot()),
      session: this.currentSession,
    }
  }
}
