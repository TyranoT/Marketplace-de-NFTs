import { ModelDelegate } from '../core/model-delegate'
import type { MockDbStore } from '../core/mock-db-store'
import type { MockCart } from './mock-cart'

export type CartWhere = {
  id?: string
}

export type CartWhereUnique = {
  id: string
}

export type CartUpdateInput = {
  /** `null` remove o cupom; ausente deixa como está, como no Prisma. */
  couponCode?: string | null
  version?: number
  updatedAt?: string
}

/** O carrinho é linha única no banco simulado — existe um por sessão. */
export class CartDelegate extends ModelDelegate<MockCart, CartWhere> {
  constructor(private readonly store: MockDbStore) {
    super()
  }

  update(args: { where: CartWhereUnique; data: CartUpdateInput }): MockCart {
    const cart = this.findUnique(args)

    if (!cart) throw new Error(`Carrinho ${args.where.id} não existe.`)

    const { couponCode, version, updatedAt } = args.data

    if (couponCode !== undefined) cart.setCoupon(couponCode ?? undefined)
    if (version !== undefined) cart.setVersion(version)
    if (updatedAt !== undefined) cart.setUpdatedAt(updatedAt)

    return cart
  }

  /**
   * O carrinho de um dono específico. A liquidação de um pedido limpa o de
   * quem comprou, e não o de quem por acaso está logado quando ela acontece.
   */
  ownedBy(owner: string): MockCart {
    return this.store.load().cartOf(owner)
  }

  /** Esvazia o carrinho do visitante e devolve o que ele tinha. */
  detachGuest(): MockCart | undefined {
    return this.store.load().detachGuestCart()
  }

  /** Só o carrinho de quem tem a sessão: os dos outros não são consultáveis. */
  protected list(): Array<MockCart> {
    return [this.store.load().cart]
  }

  protected matches(cart: MockCart, where: CartWhere): boolean {
    return !where.id || cart.id === where.id
  }
}
