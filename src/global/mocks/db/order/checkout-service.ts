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
import { fnv1a } from '../core/fnv'
import { getScenario } from '../../scenario/config'
import { CheckoutRuleError } from './checkout-rule-error'
import { orderContractMapper } from './order-contract-mapper'
import { OrderRuleError } from './order-rule-error'
import { currentOwnerId } from '../user/session-guard'
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
  cartVersion: number
}

export type CheckoutOptions = {
  /** Header `Idempotency-Key`. Ausente, a tentativa não é deduplicada. */
  idempotencyKey?: string
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
  checkout(data: CheckoutData, options: CheckoutOptions = {}): Order {
    return mockDb.$transaction(() => {
      /**
       * A idempotência vem antes de qualquer regra: uma retentativa após
       * timeout precisa recuperar o pedido que já nasceu, e não ser julgada
       * de novo contra um estoque que ela mesma já consumiu.
       */
      const replayed = this.replay(data, options.idempotencyKey)

      if (replayed) return replayed

      const cart = cartService.readCart()

      if (cart.items.length === 0) throw CheckoutRuleError.cartEmpty()

      /**
       * Antes de qualquer outra regra: se o carrinho mudou desde a revisão,
       * nada mais importa. Validar o perfil primeiro só faria o colecionador
       * corrigir campos de um pedido que seria recusado de qualquer forma.
       */
      if (cart.version !== data.cartVersion) {
        throw CheckoutRuleError.quoteOutdated(cart.version)
      }

      const walletLabel = this.walletLabelFor(data.walletId)

      this.assertProfile(data.profile)
      this.assertStock(cart.items)
      this.consumeStock(cart.items)

      const order = mockDb.order.create({
        data: this.buildSnapshot(cart, data, walletLabel),
      })

      if (options.idempotencyKey) {
        mockDb.idempotency.create({
          data: {
            key: options.idempotencyKey,
            requestHash: requestHashOf(data),
            orderId: order.id,
          },
        })
      }

      /**
       * O carrinho **não** é esvaziado aqui. O pedido nasce pendente, e uma
       * recusa precisa devolver o colecionador ao carrinho que ele tinha —
       * é o "preservar os itens em falhas" do enunciado. Quem limpa é a
       * confirmação, no `OrderService`.
       */
      return orderContractMapper.toContract(order)
    })
  }

  /**
   * Retentativa com a mesma chave.
   *
   * Mesmo conteúdo devolve o pedido que já nasceu — é o que faz o cenário
   * "timeout depois de criar o pedido" recuperar em vez de comprar duas
   * vezes. Conteúdo diferente é conflito: a chave identifica uma tentativa,
   * e reusá-la para outra compra esconderia um pedido.
   */
  private replay(data: CheckoutData, key?: string): Order | undefined {
    if (!key) return undefined

    const known = mockDb.idempotency.findUnique({ where: { key } })

    if (!known) return undefined

    if (known.requestHash !== requestHashOf(data)) {
      throw OrderRuleError.idempotencyKeyReused()
    }

    const order = mockDb.order.findUnique({ where: { id: known.orderId } })

    /**
     * A chave é de outra conta: devolver o pedido dela seria mostrar a compra
     * de outra pessoa. É conflito, como a chave reusada com outro conteúdo.
     */
    if (order && order.ownerId !== currentOwnerId()) {
      throw OrderRuleError.idempotencyKeyReused()
    }

    if (!order) return undefined

    return orderContractMapper.toContract(order)
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
      /**
       * Nasce pendente: quem decide o desfecho é a liquidação, e ela chega
       * por `order.updated`. Exibir "confirmado" antes disso mostraria uma
       * compra que a simulação ainda não aprovou.
       */
      status: 'pending',
      version: 1,
      updatedAt: createdAt,
      settleAt: new Date(
        Date.now() + getScenario().orderSettleDelayMs,
      ).toISOString(),
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
      ownerId: currentOwnerId(),
      createdAt,
    }
  }
}

/**
 * Resumo do conteúdo da tentativa. É o que distingue "reenvio do mesmo
 * pedido" de "chave reusada para outra compra".
 */
function requestHashOf(data: CheckoutData): string {
  return fnv1a(
    JSON.stringify({
      walletId: data.walletId,
      cartVersion: data.cartVersion,
      profile: data.profile,
    }),
  )
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
