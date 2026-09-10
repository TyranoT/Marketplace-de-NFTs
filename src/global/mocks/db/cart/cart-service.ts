import { parseEth } from '../../../helpers/eth-amount'
import { mockDb } from '../core'
import { CartLine } from './cart-line'
import { CartRuleError } from './cart-rule-error'
import { cartContractMapper } from './cart-contract-mapper'
import type { Coupon } from './coupon'
import type { MockCart } from './mock-cart'
import type { Cart } from '../../../api/contracts/cart'
import type { NftEditionId } from '../../../type'

const MINIMUM_ITEM_QUANTITY = 1

/**
 * As regras do carrinho, escritas em cima do banco simulado. Disponibilidade,
 * cupom e quantidade são decididos aqui e em nenhum outro lugar — é o que
 * mantém uma fonte única de verdade, compartilhada com a atualização otimista
 * da interface.
 */
export class CartService {
  readCart(): Cart {
    return this.toContract()
  }

  addItem(nftId: string, editionId: NftEditionId, quantity: number): Cart {
    return this.commit(() => {
      if (!mockDb.nft.findUnique({ where: { id: nftId } })) {
        throw CartRuleError.nftNotFound()
      }

      const available = this.availableFor(nftId, editionId)

      if (available === 0) throw CartRuleError.editionSoldOut()

      const existing = mockDb.cartItem.findFirst({
        where: { nftId, editionId },
      })
      const nextQuantity = (existing?.quantity ?? 0) + quantity

      if (nextQuantity > available) {
        throw CartRuleError.quantityExceedsAvailability(available)
      }

      if (existing) {
        mockDb.cartItem.update({
          where: { id: existing.id },
          data: { quantity: nextQuantity },
        })

        return
      }

      mockDb.cartItem.create({ data: { nftId, editionId, quantity } })
    })
  }

  updateItem(itemId: string, quantity: number): Cart {
    return this.commit(() => {
      const item = mockDb.cartItem.findUnique({ where: { id: itemId } })

      if (!item) throw CartRuleError.cartItemNotFound()

      if (quantity < MINIMUM_ITEM_QUANTITY) {
        throw CartRuleError.invalidQuantity()
      }

      const available = this.availableFor(item.nftId, item.editionId)

      if (quantity > available) {
        throw CartRuleError.quantityExceedsAvailability(available)
      }

      mockDb.cartItem.update({ where: { id: itemId }, data: { quantity } })
    })
  }

  removeItem(itemId: string): Cart {
    return this.commit(() => {
      mockDb.cartItem.delete({ where: { id: itemId } })
    })
  }

  applyCoupon(code: string): Cart {
    return this.commit(() => {
      const coupon = mockDb.coupon.findUnique({ where: { code } })

      if (!coupon) throw CartRuleError.couponInvalid()

      if (coupon.isExpired()) throw CartRuleError.couponExpired()

      const { minSubtotal } = coupon

      if (minSubtotal && !coupon.isApplicableTo(this.subtotal())) {
        throw CartRuleError.couponNotApplicable(minSubtotal)
      }

      mockDb.cart.update({
        where: { id: this.currentCart().id },
        data: { couponCode: coupon.code },
      })
    })
  }

  removeCoupon(): Cart {
    return this.commit(() => {
      mockDb.cart.update({
        where: { id: this.currentCart().id },
        data: { couponCode: null },
      })
    })
  }

  /** Toda escrita sobe a versão do carrinho e persiste uma vez só, no fim. */
  private commit(run: () => void): Cart {
    return mockDb.$transaction(() => {
      run()

      const cart = this.currentCart()

      mockDb.cart.update({
        where: { id: cart.id },
        data: {
          version: cart.version + 1,
          updatedAt: new Date().toISOString(),
        },
      })

      return this.toContract()
    })
  }

  private toContract(): Cart {
    const cart = this.currentCart()

    return cartContractMapper.toContract(
      cart,
      this.lines(),
      this.appliedCoupon(cart),
    )
  }

  /** Item cujo NFT saiu do catálogo é descartado em vez de quebrar a leitura. */
  private lines(): Array<CartLine> {
    return mockDb.cartItem.findMany().flatMap((item) => {
      const nft = mockDb.nft.findUnique({ where: { id: item.nftId } })

      if (!nft) return []

      const price = mockDb.price.findUnique({ where: { nftId: item.nftId } })

      return [
        new CartLine(
          item,
          nft,
          parseEth(price?.amount ?? nft.price.amount),
          this.availableFor(item.nftId, item.editionId),
        ),
      ]
    })
  }

  private subtotal() {
    return CartLine.sum(this.lines())
  }

  private availableFor(nftId: string, editionId: NftEditionId): number {
    return (
      mockDb.availability.findUnique({ where: { nftId, editionId } })?.units ??
      0
    )
  }

  private appliedCoupon(cart: MockCart): Coupon | null {
    const code = cart.couponCode

    return code ? mockDb.coupon.findUnique({ where: { code } }) : null
  }

  private currentCart(): MockCart {
    const cart = mockDb.cart.findFirst()

    if (!cart) throw new Error('Banco simulado sem carrinho.')

    return cart
  }
}

export const cartService = new CartService()
