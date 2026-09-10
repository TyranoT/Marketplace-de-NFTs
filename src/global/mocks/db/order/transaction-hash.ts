const HASH_LENGTH = 64
const FNV_OFFSET = 0x811c9dc5
const FNV_PRIME = 0x01000193

/**
 * Hash simulado, derivado do próprio pedido. Determinístico de propósito: a
 * mesma compra produz o mesmo hash, o que torna o cenário reproduzível sem
 * depender de `Math.random`.
 */
export function buildTransactionHash(seed: string): string {
  let state = FNV_OFFSET
  let digits = ''

  for (let round = 0; digits.length < HASH_LENGTH; round += 1) {
    for (const char of `${seed}:${round}`) {
      state ^= char.charCodeAt(0)
      state = Math.imul(state, FNV_PRIME) >>> 0
    }

    digits += state.toString(16).padStart(8, '0')
  }

  return `0x${digits.slice(0, HASH_LENGTH).toUpperCase()}`
}
