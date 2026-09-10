/**
 * PRNG semeado. `Math.random()` tornaria os cenários de falha irreprodutíveis
 * — o mesmo teste passaria e falharia sem nenhuma mudança de código.
 */
export function mulberry32(seed: number) {
  let state = seed >>> 0

  return function next() {
    state = (state + 0x6d2b79f5) >>> 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}
