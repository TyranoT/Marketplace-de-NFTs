const FNV_OFFSET = 0x811c9dc5
const FNV_PRIME = 0x01000193

/**
 * FNV-1a de 32 bits.
 *
 * Estava escrito duas vezes — em `seed-fingerprint.ts` e em
 * `transaction-hash.ts` — e a chave de idempotência seria a terceira. Não é
 * criptografia: serve para comparar conteúdo e para derivar valores
 * determinísticos, que é o que os três casos pedem.
 */
export function fnv1a(value: string): string {
  let state = FNV_OFFSET

  for (const char of value) {
    state ^= char.charCodeAt(0)
    state = Math.imul(state, FNV_PRIME) >>> 0
  }

  return state.toString(16).padStart(8, '0')
}
