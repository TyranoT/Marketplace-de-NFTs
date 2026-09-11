import { NFTS } from '../../../data/nfts'
import { MockCart } from '../cart/mock-cart'
import { MockCartItem } from '../cart/mock-cart-item'
import {
  AvailabilityDelegate,
  NftRevisionDelegate,
  PriceDelegate,
} from '../nft'
import { MockOrder } from '../order/mock-order'
import { MockUser } from '../user/mock-user'
import { MockWallet } from '../user/mock-wallet'
import { buildSeedUsers, buildSeedWallets } from '../user/user-seed'
import { seedFingerprint } from './seed-fingerprint'
import { GUEST_OWNER } from './guest-owner'
import { SEED_VERSION } from './snapshot'
import type { IdempotencyRecord, MockDbSnapshot } from './snapshot'
import type { NftRevisionRecord } from '../nft'
import type { SessionSnapshot } from '../user/user-snapshot'

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
    readonly carts: Map<string, MockCart>,
    readonly availability: Map<string, number>,
    readonly prices: Map<string, string>,
    readonly revisions: Map<string, NftRevisionRecord>,
    readonly orders: Map<string, MockOrder>,
    readonly idempotency: Map<string, IdempotencyRecord>,
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
      /**
       * O cenário do Figma é o carrinho do visitante: é o que aparece ao
       * abrir a aplicação sem entrar, e é o baseline da regressão visual.
       */
      new Map([[GUEST_OWNER, MockCart.seeded(cartIdOf(GUEST_OWNER), items)]]),
      AvailabilityDelegate.seed(),
      PriceDelegate.seed(),
      NftRevisionDelegate.seed(),
      new Map(),
      new Map(),
      buildSeedUsers(),
      buildSeedWallets(),
    )
  }

  static fromSnapshot(snapshot: MockDbSnapshot): MockDb {
    return new MockDb(
      new Map(
        Object.entries(snapshot.carts).map(([owner, cart]) => [
          owner,
          MockCart.fromSnapshot(cart),
        ]),
      ),
      new Map(Object.entries(snapshot.availability)),
      new Map(Object.entries(snapshot.prices)),
      new Map(
        Object.entries(snapshot.nftRevisions).map(([nftId, revision]) => [
          nftId,
          { nftId, ...revision },
        ]),
      ),
      new Map(
        snapshot.orders.map((order) => [
          order.id,
          MockOrder.fromSnapshot(order),
        ]),
      ),
      new Map(Object.entries(snapshot.idempotency)),
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

  /** Quem tem a sessão, ou o visitante. */
  get owner(): string {
    return this.currentSession?.userId ?? GUEST_OWNER
  }

  /**
   * O carrinho de quem está usando a aplicação agora. Os delegates leem
   * sempre daqui, então isolar por dono não exigiu mudar nenhuma regra do
   * carrinho: o serviço continua falando com "o carrinho", e é esta linha
   * que decide de quem ele é.
   */
  get cart(): MockCart {
    return this.cartOf(this.owner)
  }

  /** Carrinho de um dono, criado vazio na primeira vez. */
  cartOf(owner: string): MockCart {
    const existing = this.carts.get(owner)

    if (existing) return existing

    const created = MockCart.seeded(cartIdOf(owner), [])
    this.carts.set(owner, created)

    return created
  }

  /**
   * Tira os itens do carrinho do visitante e o deixa vazio — é o que acontece
   * quando o visitante entra numa conta e o carrinho dele passa para ela.
   * A versão sobe, e não volta a 1: uma consulta antiga ainda em cache não
   * pode parecer atual.
   */
  detachGuestCart(): MockCart | undefined {
    const guest = this.carts.get(GUEST_OWNER)

    if (!guest) return undefined

    this.carts.set(
      GUEST_OWNER,
      new MockCart(
        cartIdOf(GUEST_OWNER),
        [],
        undefined,
        guest.version + 1,
        new Date().toISOString(),
      ),
    )

    return guest
  }

  setSession(session: SessionSnapshot | undefined): void {
    this.currentSession = session
  }

  toSnapshot(): MockDbSnapshot {
    return {
      seedVersion: SEED_VERSION,
      seedFingerprint: seedFingerprint(),
      carts: Object.fromEntries(
        [...this.carts].map(([owner, cart]) => [owner, cart.toSnapshot()]),
      ),
      availability: Object.fromEntries(this.availability),
      prices: Object.fromEntries(this.prices),
      nftRevisions: Object.fromEntries(
        [...this.revisions].map(([nftId, { version, updatedAt }]) => [
          nftId,
          { version, updatedAt },
        ]),
      ),
      orders: [...this.orders.values()].map((order) => order.toSnapshot()),
      idempotency: Object.fromEntries(this.idempotency),
      users: [...this.users.values()].map((user) => user.toSnapshot()),
      wallets: [...this.wallets.values()].map((wallet) => wallet.toSnapshot()),
      session: this.currentSession,
    }
  }
}

function cartIdOf(owner: string): string {
  return `cart-${owner}`
}
