import { parseEth, toMoney } from '../../../helpers/eth-amount'
import type { MockOrder } from './mock-order'
import type { OrderItemSnapshot, OrderTotalsSnapshot } from './order-snapshot'
import type { CartTotals } from '../../../api/contracts/cart'
import type { Order, OrderItem } from '../../../api/contracts/order'

/**
 * O pedido é guardado em strings decimais; o wire pede `Money`. Esta é a
 * única classe do domínio de pedidos que conhece o formato de saída.
 */
export class OrderContractMapper {
  toContract(order: MockOrder): Order {
    const snapshot = order.toSnapshot()

    return {
      id: snapshot.id,
      transactionHash: snapshot.transactionHash,
      status: snapshot.status,
      items: snapshot.items.map((item) => this.toContractItem(item)),
      totals: this.toContractTotals(snapshot.totals),
      couponCode: snapshot.couponCode,
      profile: snapshot.profile,
      walletId: snapshot.walletId,
      walletLabel: snapshot.walletLabel,
      createdAt: snapshot.createdAt,
    }
  }

  private toContractItem(item: OrderItemSnapshot): OrderItem {
    return {
      nftId: item.nftId,
      name: item.name,
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt,
      editionId: item.editionId,
      editionLabel: item.editionLabel,
      quantity: item.quantity,
      unitPrice: toMoney(parseEth(item.unitPrice)),
      lineTotal: toMoney(parseEth(item.lineTotal)),
    }
  }

  private toContractTotals(totals: OrderTotalsSnapshot): CartTotals {
    return {
      subtotal: toMoney(parseEth(totals.subtotal)),
      discount: toMoney(parseEth(totals.discount)),
      networkFee: toMoney(parseEth(totals.networkFee)),
      total: toMoney(parseEth(totals.total)),
    }
  }
}

export const orderContractMapper = new OrderContractMapper()
