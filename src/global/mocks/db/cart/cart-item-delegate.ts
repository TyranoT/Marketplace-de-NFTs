import { ModelDelegate } from '../core/model-delegate'
import { CartRuleError } from './cart-rule-error'
import { MockCartItem } from './mock-cart-item'
import type { WritableDelegate } from '../core/model-delegate'
import type { MockDbStore } from '../core/mock-db-store'
import type { MockCart } from './mock-cart'
import type { NftEditionId } from '../../../type'

export type CartItemWhere = {
  id?: string
  nftId?: string
  editionId?: NftEditionId
}

export type CartItemWhereUnique = {
  id: string
}

export type CartItemCreateInput = {
  nftId: string
  editionId: NftEditionId
  quantity: number
}

export type CartItemUpdateInput = {
  quantity: number
}

export class CartItemDelegate
  extends ModelDelegate<MockCartItem, CartItemWhere>
  implements
    WritableDelegate<
      MockCartItem,
      CartItemWhereUnique,
      CartItemCreateInput,
      CartItemUpdateInput
    >
{
  constructor(private readonly store: MockDbStore) {
    super()
  }

  create(args: { data: CartItemCreateInput }): MockCartItem {
    const { nftId, editionId, quantity } = args.data
    const item = MockCartItem.create(nftId, editionId, quantity)

    this.cart().add(item)

    return item
  }

  update(args: {
    where: CartItemWhereUnique
    data: CartItemUpdateInput
  }): MockCartItem {
    const updated = this.require(args.where).withQuantity(args.data.quantity)

    this.cart().replace(updated)

    return updated
  }

  delete(args: { where: CartItemWhereUnique }): MockCartItem {
    const item = this.require(args.where)

    this.cart().remove(item.id)

    return item
  }

  /** Esvazia o carrinho de uma vez, como no fim de uma compra. */
  deleteMany(): number {
    const removed = this.cart().items.length

    this.cart().clear()

    return removed
  }

  protected list(): Array<MockCartItem> {
    return [...this.cart().items]
  }

  protected matches(item: MockCartItem, where: CartItemWhere): boolean {
    return (
      (!where.id || item.id === where.id) &&
      (!where.nftId || item.nftId === where.nftId) &&
      (!where.editionId || item.editionId === where.editionId)
    )
  }

  private require(where: CartItemWhereUnique): MockCartItem {
    const item = this.findUnique({ where })

    if (!item) throw CartRuleError.cartItemNotFound()

    return item
  }

  private cart(): MockCart {
    return this.store.load().cart
  }
}
