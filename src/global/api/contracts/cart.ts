import type { NftEditionId } from '../../type'
import type { Money } from './money'

export type CartItem = {
  id: string
  nftId: string
  name: string
  imageUrl: string
  imageAlt: string
  editionId: NftEditionId
  editionLabel: string
  quantity: number
  unitPrice: Money
  lineTotal: Money
  /** Unidades ainda disponíveis nesta edição. Limita o stepper. */
  available: number
  /**
   * Versão do NFT no catálogo. Existe desde já para que os eventos de tempo
   * real da próxima fase possam ser descartados quando chegarem atrasados ou
   * duplicados, sem regredir um estado mais recente.
   */
  version: number
}

export type AppliedCoupon = {
  code: string
  label: string
  percentOff?: string
  amountOff?: Money
  expiresAt: string
}

export type CartTotals = {
  subtotal: Money
  discount: Money
  networkFee: Money
  total: Money
}

/**
 * Toda mutation devolve o carrinho inteiro, com os totais recalculados pelo
 * servidor. É o que garante que o resumo exibido seja o resumo da API, e não
 * uma soma feita na interface.
 */
export type Cart = {
  id: string
  items: Array<CartItem>
  coupon?: AppliedCoupon
  totals: CartTotals
  updatedAt: string
  version: number
}

export type AddCartItemInput = {
  nftId: string
  editionId: NftEditionId
  quantity: number
}

export type UpdateCartItemInput = {
  itemId: string
  quantity: number
}

export type ApplyCouponInput = {
  code: string
}
