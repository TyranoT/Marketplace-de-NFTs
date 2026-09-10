import { ModelDelegate } from '../core/model-delegate'
import { Coupon } from './coupon'
import type { CouponRule } from './coupon'

const FAR_FUTURE = '2099-01-01T00:00:00.000Z'
const PAST = '2020-01-01T00:00:00.000Z'

/**
 * Tabela determinística de cupons. Cada linha cobre um cenário do enunciado:
 * sucesso percentual, sucesso por valor fixo, expirado e não aplicável.
 * Qualquer código fora desta tabela é inválido.
 */
const COUPON_RULES: Record<string, CouponRule> = {
  KURIO10: {
    label: 'Desconto do lançamento',
    percentOff: '10',
    expiresAt: FAR_FUTURE,
  },
  KURIO25: {
    label: 'Desconto do lançamento',
    percentOff: '25',
    expiresAt: FAR_FUTURE,
  },
  ETH005: {
    label: 'Desconto do lançamento',
    amountOff: '0.05',
    expiresAt: FAR_FUTURE,
  },
  EXPIRADO: {
    label: 'Desconto do lançamento',
    percentOff: '15',
    expiresAt: PAST,
  },
  MINIMO30: {
    label: 'Desconto do lançamento',
    percentOff: '30',
    expiresAt: FAR_FUTURE,
    minSubtotal: '30',
  },
}

export type CouponWhere = {
  code?: string
}

export class CouponDelegate extends ModelDelegate<Coupon, CouponWhere> {
  protected list(): Array<Coupon> {
    return Object.entries(COUPON_RULES).map(
      ([code, rule]) => new Coupon(code, rule),
    )
  }

  /** O código do usuário chega com espaço e caixa livres; a tabela é maiúscula. */
  protected matches(coupon: Coupon, where: CouponWhere): boolean {
    return !where.code || coupon.code === where.code.trim().toUpperCase()
  }
}
