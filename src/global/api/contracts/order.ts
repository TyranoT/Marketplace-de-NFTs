import type { CartTotals } from './cart'
import type { Money } from './money'
import type { NftEditionId } from '../../type'

export type CollectorProfile = {
  displayName: string
  username: string
  network: string
  profileName: string
  walletAddress: string
  secondaryWallet?: string
  walletType: string
  referralCode: string
  email: string
  ensSuffix: string
  note?: string
}

/**
 * A linha do pedido é uma cópia do que estava no carrinho, e não uma
 * referência ao catálogo: uma mudança de preço não pode reescrever uma compra
 * que já aconteceu.
 */
export type OrderItem = {
  nftId: string
  name: string
  imageUrl: string
  imageAlt: string
  editionId: NftEditionId
  editionLabel: string
  quantity: number
  unitPrice: Money
  lineTotal: Money
}

/**
 * Ciclo do pedido. `pending` é o estado em que a compra nasce e de onde
 * `order.updated` a tira; `confirmed` e `declined` são terminais e nunca
 * regridem.
 */
export type OrderStatus = 'pending' | 'confirmed' | 'declined'

export type Order = {
  id: string
  /** Hash da transação simulada, exibido abreviado na confirmação. */
  transactionHash: string
  status: OrderStatus
  /** Sobe a cada transição; ordena os eventos `order.updated`. */
  version: number
  updatedAt: string
  /** Por que foi recusado. Só existe em `declined`. */
  declineReason?: string
  items: Array<OrderItem>
  totals: CartTotals
  couponCode?: string
  profile: CollectorProfile
  walletId: string
  walletLabel: string
  createdAt: string
}

export type CheckoutInput = {
  profile: CollectorProfile
  walletId: string
  /**
   * Versão do carrinho que o colecionador estava vendo ao confirmar.
   *
   * Divergindo da corrente, o servidor recusa: o preço mudou entre a
   * revisão e o envio, e cobrar um valor que ninguém viu não é opção. O
   * bloqueio na interface existe para avisar antes; este é o que decide.
   */
  cartVersion: number
}
