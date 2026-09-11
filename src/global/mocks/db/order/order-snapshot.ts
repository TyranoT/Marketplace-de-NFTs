import type { NftEditionId } from '../../../type'
import type { OrderStatus } from '../../../api/contracts/order'

/**
 * O pedido guarda o que o colecionador viu no instante da compra — nome,
 * arte, edição e valores — em vez de apontar para o catálogo. Um preço que
 * mude depois não pode reescrever uma compra que já aconteceu.
 */
export type OrderItemSnapshot = {
  nftId: string
  name: string
  imageUrl: string
  imageAlt: string
  editionId: NftEditionId
  editionLabel: string
  quantity: number
  /** Strings decimais, como no wire: `bigint` não sobrevive ao JSON. */
  unitPrice: string
  lineTotal: string
}

export type OrderTotalsSnapshot = {
  subtotal: string
  discount: string
  networkFee: string
  total: string
}

export type CollectorProfileSnapshot = {
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

export type OrderSnapshot = {
  id: string
  /** Quem comprou: id do usuário, ou `guest`. Pedido não é visível a outro dono. */
  ownerId: string
  /** Hash simulado da transação, exibido e usado no link do explorador. */
  transactionHash: string
  status: OrderStatus
  /** Sobe a cada transição. É o que ordena os eventos `order.updated`. */
  version: number
  updatedAt: string
  /**
   * Quando o pedido pendente deve ser liquidado. Guardado, e não só agendado
   * em memória: um `setTimeout` não sobrevive ao recarregar a página, e o
   * pedido precisa ser recuperável mesmo assim.
   */
  settleAt?: string
  declineReason?: string
  items: Array<OrderItemSnapshot>
  totals: OrderTotalsSnapshot
  couponCode?: string
  profile: CollectorProfileSnapshot
  walletId: string
  walletLabel: string
  createdAt: string
}
