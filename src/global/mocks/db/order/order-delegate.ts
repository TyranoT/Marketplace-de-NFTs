import { ModelDelegate } from '../core/model-delegate'
import { MockOrder } from './mock-order'
import type { MockDbStore } from '../core/mock-db-store'
import type { OrderSnapshot } from './order-snapshot'

export type OrderWhere = {
  id?: string
  walletId?: string
}

/** Pedido não é editado nem removido: só nasce e é consultado. */
export class OrderDelegate extends ModelDelegate<MockOrder, OrderWhere> {
  constructor(private readonly store: MockDbStore) {
    super()
  }

  create(args: { data: OrderSnapshot }): MockOrder {
    const order = MockOrder.fromSnapshot(args.data)

    this.store.load().orders.set(order.id, order)

    return order
  }

  protected list(): Array<MockOrder> {
    return [...this.store.load().orders.values()]
  }

  protected matches(order: MockOrder, where: OrderWhere): boolean {
    return (
      (!where.id || order.id === where.id) &&
      (!where.walletId || order.walletId === where.walletId)
    )
  }
}
