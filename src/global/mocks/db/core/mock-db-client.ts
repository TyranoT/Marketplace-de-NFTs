import { CartDelegate } from '../cart/cart-delegate'
import { CartItemDelegate } from '../cart/cart-item-delegate'
import { CouponDelegate } from '../cart/coupon-delegate'
import { AvailabilityDelegate, NftDelegate, PriceDelegate } from '../nft'
import { OrderDelegate } from '../order/order-delegate'
import { MockDb } from './mock-db'
import { mockDbStore } from './mock-db-store'
import type { MockDbStore } from './mock-db-store'

/**
 * Ponto único de acesso ao banco simulado, no formato do Prisma Client: um
 * delegate por modelo e as operações de sessão prefixadas com `$`. Nenhuma
 * regra de negócio vive aqui — o cliente só lê e escreve linhas.
 */
export class MockDbClient {
  readonly nft = new NftDelegate()
  readonly coupon = new CouponDelegate()
  readonly cart: CartDelegate
  readonly cartItem: CartItemDelegate
  readonly availability: AvailabilityDelegate
  readonly price: PriceDelegate
  readonly order: OrderDelegate

  constructor(private readonly store: MockDbStore) {
    this.cart = new CartDelegate(store)
    this.cartItem = new CartItemDelegate(store)
    this.availability = new AvailabilityDelegate(store)
    this.price = new PriceDelegate(store)
    this.order = new OrderDelegate(store)
  }

  /**
   * As escritas de uma operação viram uma persistência só, e um erro no meio
   * do caminho devolve o banco ao estado anterior em vez de gravar pela
   * metade.
   */
  $transaction<TResult>(run: () => TResult): TResult {
    const before = this.store.load().toSnapshot()

    try {
      const result = run()
      this.store.save(this.store.load())

      return result
    } catch (error) {
      this.store.replace(MockDb.fromSnapshot(before))

      throw error
    }
  }

  $reset(): MockDb {
    return this.store.reset()
  }
}

export const mockDb = new MockDbClient(mockDbStore)
