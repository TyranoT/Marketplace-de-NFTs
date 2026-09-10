import { minEth, parseEth, percentOfEth } from '../../../helpers/eth-amount'
import type { Wei } from '../../../helpers/eth-amount'

export type CouponRule = {
  label: string
  percentOff?: string
  amountOff?: string
  /** ISO. Comparado com `Date.now()`, então o relógio do Playwright controla. */
  expiresAt: string
  /** Subtotal mínimo em ETH para o cupom valer. */
  minSubtotal?: string
}

/** Um cupom que sabe se está válido e quanto desconta. */
export class Coupon {
  constructor(
    readonly code: string,
    private readonly rule: CouponRule,
  ) {}

  get label(): string {
    return this.rule.label
  }

  get percentOff(): string | undefined {
    return this.rule.percentOff
  }

  get amountOff(): Wei | undefined {
    return this.rule.amountOff ? parseEth(this.rule.amountOff) : undefined
  }

  get expiresAt(): string {
    return this.rule.expiresAt
  }

  get minSubtotal(): string | undefined {
    return this.rule.minSubtotal
  }

  isExpired(): boolean {
    return Date.parse(this.rule.expiresAt) <= Date.now()
  }

  isApplicableTo(subtotal: Wei): boolean {
    return !this.rule.minSubtotal || subtotal >= parseEth(this.rule.minSubtotal)
  }

  /** Desconto fixo nunca ultrapassa o subtotal — total negativo não existe. */
  discountFor(subtotal: Wei): Wei {
    if (this.rule.percentOff) {
      return percentOfEth(subtotal, this.rule.percentOff)
    }

    return this.rule.amountOff
      ? minEth(parseEth(this.rule.amountOff), subtotal)
      : 0n
  }
}
