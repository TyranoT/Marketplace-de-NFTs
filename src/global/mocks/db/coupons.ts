export type MockCoupon = {
  label: string
  percentOff?: string
  amountOff?: string
  /** ISO. Comparado com `Date.now()`, então o relógio do Playwright controla. */
  expiresAt: string
  /** Subtotal mínimo em ETH para o cupom valer. */
  minSubtotal?: string
}

const FAR_FUTURE = '2099-01-01T00:00:00.000Z'
const PAST = '2020-01-01T00:00:00.000Z'

/**
 * Tabela determinística de cupons. Cada linha cobre um cenário do enunciado:
 * sucesso percentual, sucesso por valor fixo, expirado e não aplicável.
 * Qualquer código fora desta tabela é inválido.
 */
export const MOCK_COUPONS: Record<string, MockCoupon> = {
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

export function findCoupon(code: string): MockCoupon | undefined {
  return MOCK_COUPONS[code.trim().toUpperCase()]
}
