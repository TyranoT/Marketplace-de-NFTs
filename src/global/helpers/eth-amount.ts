import type { Money } from '../api/contracts/money'

/**
 * Aritmética de ETH em inteiros de 18 casas (wei), sem ponto flutuante.
 *
 * O desafio exige que os valores trafeguem como strings decimais e mantenham
 * precisão nos cálculos. `0.1 + 0.2 !== 0.3` em float, então converter para
 * `bigint` na entrada e voltar para string na saída é o que garante que o
 * total exibido seja exatamente o total calculado.
 *
 * Este módulo é importado tanto pela UI (atualização otimista) quanto pelos
 * handlers do MSW. Cliente e "servidor" compartilhando a mesma aritmética é o
 * que torna impossível o resumo divergir da resposta da API.
 */

export type Wei = bigint

const DECIMALS = 18
const SCALE = 10n ** BigInt(DECIMALS)
const PERCENT_SCALE = 100n

const DECIMAL_PATTERN = /^-?\d+(\.\d+)?$/

/** `'1.19'` -> `1190000000000000000n`. Aceita string decimal simples. */
export function parseEth(amount: string): Wei {
  const trimmed = amount.trim()

  if (!DECIMAL_PATTERN.test(trimmed)) {
    throw new Error(`Valor decimal inválido: "${amount}"`)
  }

  const isNegative = trimmed.startsWith('-')
  const unsigned = isNegative ? trimmed.slice(1) : trimmed
  const [whole, fraction = ''] = unsigned.split('.')

  /**
   * Trunca em vez de arredondar: uma fixture com mais de 18 casas é erro de
   * dado, não de cálculo, e arredondar esconderia o problema.
   */
  const padded = fraction.slice(0, DECIMALS).padEnd(DECIMALS, '0')
  const value = BigInt(whole) * SCALE + BigInt(padded || '0')

  return isNegative ? -value : value
}

/** `1190000000000000000n` -> `'1.19'`. Remove zeros à direita da fração. */
export function toAmount(value: Wei): string {
  const isNegative = value < 0n
  const unsigned = isNegative ? -value : value

  const whole = unsigned / SCALE
  const fraction = (unsigned % SCALE).toString().padStart(DECIMALS, '0')
  const trimmed = fraction.replace(/0+$/, '')
  const sign = isNegative ? '-' : ''

  return trimmed ? `${sign}${whole}.${trimmed}` : `${sign}${whole}`
}

export function addEth(a: Wei, b: Wei): Wei {
  return a + b
}

export function subEth(a: Wei, b: Wei): Wei {
  return a - b
}

/** Quantidades são inteiras, então a multiplicação é exata. */
export function mulEthByQuantity(value: Wei, quantity: number): Wei {
  return value * BigInt(Math.trunc(quantity))
}

/**
 * Percentual truncado (floor) em 18 casas. Truncar em vez de arredondar é
 * decisão fixa e documentada: mantém o resultado determinístico entre a UI
 * otimista, os handlers e as baselines dos testes.
 */
export function percentOfEth(value: Wei, percent: string): Wei {
  return (value * parseEth(percent)) / (SCALE * PERCENT_SCALE)
}

export function minEth(a: Wei, b: Wei): Wei {
  return a < b ? a : b
}

export function maxEth(a: Wei, b: Wei): Wei {
  return a > b ? a : b
}

export function compareEth(a: Wei, b: Wei): -1 | 0 | 1 {
  if (a < b) return -1
  if (a > b) return 1

  return 0
}

export function isZeroEth(value: Wei): boolean {
  return value === 0n
}

/**
 * Formata para exibição com ponto decimal, como no Figma (`26.846 ETH`).
 * Difere de `formatEth` do marketplace, que usa `Intl` pt-BR com vírgula e
 * serve ao slider de faixa de preço, não a dinheiro.
 */
export function formatEthAmount(value: Wei, minFractionDigits = 2): string {
  const amount = toAmount(value)
  const [whole, fraction = ''] = amount.split('.')

  if (fraction.length >= minFractionDigits) return amount

  return `${whole}.${fraction.padEnd(minFractionDigits, '0')}`
}

/** `{ amount: '1.19', currency: 'ETH' }` -> `'1.19 ETH'`. */
export function formatMoney(money: Money, minFractionDigits = 2): string {
  return `${formatEthAmount(parseEth(money.amount), minFractionDigits)} ${money.currency}`
}

/** Constrói o `Money` do wire a partir do inteiro em wei. */
export function toMoney(
  value: Wei,
  currency: Money['currency'] = 'ETH',
): Money {
  return { amount: toAmount(value), currency }
}
