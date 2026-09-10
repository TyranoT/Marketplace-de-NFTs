import {
  ENS_SUFFIXES,
  NETWORKS,
  WALLET_TYPES,
  findCheckoutWallet,
} from '../../../data'
import { isWalletAddress } from '../../../helpers/wallet-address'
import { CartRuleError } from '../cart/cart-rule-error'
import { cartService } from '../cart/cart-service'
import { mockDb } from '../core'
import { CheckoutRuleError } from './checkout-rule-error'
import { orderContractMapper } from './order-contract-mapper'
import { buildTransactionHash } from './transaction-hash'
import type {
  CollectorProfileSnapshot,
  OrderItemSnapshot,
  OrderSnapshot,
} from './order-snapshot'
import type { Cart, CartItem } from '../../../api/contracts/cart'
import type { Order } from '../../../api/contracts/order'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type CheckoutData = {
  profile: CollectorProfileSnapshot
  walletId: string
}

/**
 * A compra. Roda inteira dentro de `$transaction`: ou o pedido nasce com o
 * estoque baixado e o carrinho limpo, ou nada disso aconteceu.
 *
 * A validação do perfil repete a do formulário de propósito — quem decide se
 * uma compra vale é o servidor, e é esse caminho que o cliente precisa saber
 * tratar.
 */
export class CheckoutService {
  checkout(data: CheckoutData): Order {
    return mockDb.$transaction(() => {
      const cart = cartService.readCart()

      if (cart.items.length === 0) throw CheckoutRuleError.cartEmpty()

      const walletLabel = this.walletLabelFor(data.walletId)

      this.assertProfile(data.profile)
      this.assertStock(cart.items)
      this.consumeStock(cart.items)

      const order = mockDb.order.create({
        data: this.buildSnapshot(cart, data, walletLabel),
      })

      mockDb.cartItem.deleteMany()
      mockDb.cart.update({
        where: { id: cart.id },
        data: {
          couponCode: null,
          version: cart.version + 1,
          updatedAt: new Date().toISOString(),
        },
      })

      return orderContractMapper.toContract(order)
    })
  }

  /**
   * A carteira pode ser uma das opções fixas do frame ou uma carteira salva
   * pelo colecionador — o frame de carteiras diz que elas ficam disponíveis
   * no pagamento. Nenhuma das duas: a compra não sabe para onde mandar o NFT.
   */
  private walletLabelFor(walletId: string): string {
    const fixed = findCheckoutWallet(walletId)

    if (fixed) return fixed.label

    const saved = mockDb.wallet.findUnique({ where: { id: walletId } })

    if (saved) return saved.nickname

    throw CheckoutRuleError.walletNotSupported()
  }

  private assertProfile(profile: CollectorProfileSnapshot): void {
    const required = [
      ['Nome de exibição', profile.displayName],
      ['Nome de usuário', profile.username],
      ['Nome do perfil', profile.profileName],
      ['Código de indicação', profile.referralCode],
    ] as const

    for (const [label, value] of required) {
      if (!value.trim()) {
        throw CheckoutRuleError.invalidProfile(label, 'campo obrigatório')
      }
    }

    if (!isWalletAddress(profile.walletAddress)) {
      throw CheckoutRuleError.invalidProfile(
        'Endereço da carteira',
        'use 0x seguido de 40 caracteres hexadecimais',
      )
    }

    if (!EMAIL.test(profile.email)) {
      throw CheckoutRuleError.invalidProfile('E-mail', 'endereço inválido')
    }

    if (!NETWORKS.some(({ id }) => id === profile.network)) {
      throw CheckoutRuleError.invalidProfile('Rede', 'rede não suportada')
    }

    if (!WALLET_TYPES.some(({ id }) => id === profile.walletType)) {
      throw CheckoutRuleError.invalidProfile(
        'Tipo de carteira',
        'carteira não suportada',
      )
    }

    if (!ENS_SUFFIXES.some(({ id }) => id === profile.ensSuffix)) {
      throw CheckoutRuleError.invalidProfile('Nome ENS', 'sufixo inválido')
    }
  }

  private assertStock(items: Array<CartItem>): void {
    for (const item of items) {
      const units = this.unitsFor(item)

      if (units === 0) throw CartRuleError.editionSoldOut()

      if (item.quantity > units) {
        throw CartRuleError.quantityExceedsAvailability(units)
      }
    }
  }

  private consumeStock(items: Array<CartItem>): void {
    for (const item of items) {
      mockDb.availability.update({
        where: { nftId: item.nftId, editionId: item.editionId },
        data: { units: this.unitsFor(item) - item.quantity },
      })
    }
  }

  private unitsFor(item: CartItem): number {
    return (
      mockDb.availability.findUnique({
        where: { nftId: item.nftId, editionId: item.editionId },
      })?.units ?? 0
    )
  }

  private buildSnapshot(
    cart: Cart,
    data: CheckoutData,
    walletLabel: string,
  ): OrderSnapshot {
    const id = `KURIO-${String(mockDb.order.count() + 1).padStart(4, '0')}`
    const createdAt = new Date().toISOString()

    return {
      id,
      transactionHash: buildTransactionHash(`${id}:${createdAt}`),
      status: 'confirmed',
      items: cart.items.map((item) => toOrderItem(item)),
      totals: {
        subtotal: cart.totals.subtotal.amount,
        discount: cart.totals.discount.amount,
        networkFee: cart.totals.networkFee.amount,
        total: cart.totals.total.amount,
      },
      couponCode: cart.coupon?.code,
      profile: data.profile,
      walletId: data.walletId,
      walletLabel,
      createdAt,
    }
  }
}

function toOrderItem(item: CartItem): OrderItemSnapshot {
  return {
    nftId: item.nftId,
    name: item.name,
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt,
    editionId: item.editionId,
    editionLabel: item.editionLabel,
    quantity: item.quantity,
    unitPrice: item.unitPrice.amount,
    lineTotal: item.lineTotal.amount,
  }
}

export const checkoutService = new CheckoutService()
