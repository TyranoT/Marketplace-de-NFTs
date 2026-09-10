import {
  addEth,
  mulEthByQuantity,
  parseEth,
  subEth,
} from '../../../helpers/eth-amount'
import { CartLine } from './cart-line'
import type { Wei } from '../../../helpers/eth-amount'
import type { Coupon } from './coupon'

/** Taxa de rede do frame: 0.016 ETH para os três itens do cenário-semente. */
const BASE_NETWORK_FEE = '0.004'
const PER_LINE_NETWORK_FEE = '0.004'

/** Totais em wei. A conversão para `Money` acontece só no mapeamento do wire. */
export type CartTotalsInWei = {
  subtotal: Wei
  discount: Wei
  networkFee: Wei
  total: Wei
}

export class CartTotalsCalculator {
  calculate(lines: ReadonlyArray<CartLine>, coupon?: Coupon): CartTotalsInWei {
    const subtotal = CartLine.sum(lines)
    const discount = coupon?.discountFor(subtotal) ?? 0n
    const networkFee = this.networkFeeFor(lines.length)

    return {
      subtotal,
      discount,
      networkFee,
      total: addEth(subEth(subtotal, discount), networkFee),
    }
  }

  private networkFeeFor(lineCount: number): Wei {
    if (lineCount === 0) return 0n

    return addEth(
      parseEth(BASE_NETWORK_FEE),
      mulEthByQuantity(parseEth(PER_LINE_NETWORK_FEE), lineCount),
    )
  }
}

export const cartTotalsCalculator = new CartTotalsCalculator()
