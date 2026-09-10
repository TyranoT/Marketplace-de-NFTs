import { ModelDelegate } from '../core/model-delegate'
import { MockOrder } from './mock-order'
import type { MockDbStore } from '../core/mock-db-store'
import type { OrderSnapshot } from './order-snapshot'

export type OrderWhere = {
  id?: string
  walletId?: string
}

/**
 * Pedido nasce, é consultado e liquidado uma única vez. Não é removido, e a
 * única escrita depois da criação é a transição de status.
 */
export class OrderDelegate extends ModelDelegate<MockOrder, OrderWhere> {
  constructor(private readonly store: MockDbStore) {
    super()
  }

  create(args: { data: OrderSnapshot }): MockOrder {
    const order = MockOrder.fromSnapshot(args.data)

    this.store.load().orders.set(order.id, order)

    return order
  }

  update(args: { where: { id: string }; data: MockOrder }): MockOrder {
    this.store.load().orders.set(args.where.id, args.data)

    return args.data
  }

  /** Pendentes cuja hora já passou, na ordem em que foram criados. */
  findDue(now: number = Date.now()): Array<MockOrder> {
    return this.list().filter((order) => order.isDue(now))
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
