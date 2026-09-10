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

export type Order = {
  id: string
  /** Hash da transação simulada, exibido abreviado na confirmação. */
  transactionHash: string
  status: 'confirmed'
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
}
