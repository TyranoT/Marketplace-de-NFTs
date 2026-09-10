import { toMoney } from '../../../helpers/eth-amount'
import { ARTWORKS } from '../../../data/artwork'
import { NFT_EDITIONS } from '../../../data/nft-detail-defaults'
import { cartTotalsCalculator } from './cart-totals-calculator'
import type { CartLine } from './cart-line'
import type { CartTotalsInWei } from './cart-totals-calculator'
import type { Coupon } from './coupon'
import type { MockCart } from './mock-cart'
import type {
  AppliedCoupon,
  Cart,
  CartItem,
  CartTotals,
} from '../../../api/contracts/cart'
import type { NftEditionId } from '../../../type'

/**
 * Única classe que conhece o formato de wire. É o que mantém `Wei` longe da
 * resposta HTTP — `JSON.stringify` lança em bigint — sem espalhar `toMoney`
 * pelo domínio.
 */
export class CartContractMapper {
  toContract(
    cart: MockCart,
    lines: Array<CartLine>,
    coupon: Coupon | null,
  ): Cart {
    return {
      id: cart.id,
      items: lines.map((line) => this.toContractItem(line)),
      coupon: coupon ? this.toAppliedCoupon(coupon) : undefined,
      totals: this.toContractTotals(
        cartTotalsCalculator.calculate(lines, coupon ?? undefined),
      ),
      updatedAt: cart.updatedAt,
      version: cart.version,
    }
  }

  private toContractItem(line: CartLine): CartItem {
    const artwork = ARTWORKS[line.nft.artworkKey]

    return {
      id: line.item.id,
      nftId: line.item.nftId,
      name: line.nft.name,
      imageUrl: artwork.src,
      imageAlt: artwork.alt,
      editionId: line.item.editionId,
      editionLabel: this.editionLabelFor(line.item.editionId),
      quantity: line.item.quantity,
      unitPrice: toMoney(line.unitPrice),
      lineTotal: toMoney(line.lineTotal),
      available: line.available,
      version: line.version,
    }
  }

  private toAppliedCoupon(coupon: Coupon): AppliedCoupon {
    const { amountOff } = coupon

    return {
      code: coupon.code,
      label: coupon.label,
      percentOff: coupon.percentOff,
      amountOff: amountOff ? toMoney(amountOff) : undefined,
      expiresAt: coupon.expiresAt,
    }
  }

  private toContractTotals(totals: CartTotalsInWei): CartTotals {
    return {
      subtotal: toMoney(totals.subtotal),
      discount: toMoney(totals.discount),
      networkFee: toMoney(totals.networkFee),
      total: toMoney(totals.total),
    }
  }

  private editionLabelFor(editionId: NftEditionId): string {
    return NFT_EDITIONS.find(({ id }) => id === editionId)?.label ?? editionId
  }
}

export const cartContractMapper = new CartContractMapper()
