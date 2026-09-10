const FNV_OFFSET = 0x811c9dc5
const FNV_PRIME = 0x01000193
const DIGEST_LENGTH = 64
const SALT_LENGTH = 16

/**
 * **Isto não é criptografia.** É um digesto determinístico cuja única função é
 * impedir que a senha do servidor simulado exista em texto claro — nem em
 * memória depois de recebida, nem no `localStorage`. Um backend de verdade
 * usaria argon2id ou bcrypt.
 *
 * `crypto.subtle` seria o caminho honesto e está disponível nos dois lados,
 * mas é assíncrono, e contaminaria de `await` uma camada inteira que hoje é
 * síncrona — do delegate ao handler.
 */
export function digestPassword(password: string, salt: string): string {
  let state = FNV_OFFSET
  let digits = ''

  for (let round = 0; digits.length < DIGEST_LENGTH; round += 1) {
    for (const char of `${salt}:${password}:${round}`) {
      state ^= char.charCodeAt(0)
      state = Math.imul(state, FNV_PRIME) >>> 0
    }

    digits += state.toString(16).padStart(8, '0')
  }

  return digits.slice(0, DIGEST_LENGTH)
}

/** Sal por senha: duas contas com a mesma senha não compartilham digesto. */
export function buildSalt(): string {
  let salt = ''

  while (salt.length < SALT_LENGTH) {
    salt += Math.random().toString(36).slice(2)
  }

  return salt.slice(0, SALT_LENGTH)
}
