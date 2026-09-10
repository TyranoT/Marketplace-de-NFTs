/**
 * Valores monetários no wire. `amount` é sempre string decimal: `bigint` não
 * sobrevive a `JSON.stringify` e `number` perde precisão. A conversão para
 * inteiro acontece só dentro de `eth-amount.ts`.
 */
export type Money = {
  amount: string
  currency: 'ETH'
}
