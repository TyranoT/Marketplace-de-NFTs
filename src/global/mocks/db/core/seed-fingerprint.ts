import { MockDb } from './mock-db'

const FNV_OFFSET = 0x811c9dc5
const FNV_PRIME = 0x01000193

let cached: string | undefined

/**
 * Impressão digital do conteúdo da semente.
 *
 * `seedVersion` cobre mudança de **formato**; isto cobre mudança de **dado**:
 * trocar o nome do colecionador, o preço de um NFT ou a quantidade de um item
 * do carrinho deixa o que está no `localStorage` derivado de uma semente que
 * não existe mais. Sem isso, editar a semente não tem efeito visível até
 * alguém limpar o navegador à mão — e essa pegadinha custou uma sessão de
 * depuração para descobrir.
 *
 * Calculada uma vez e projetada à mão, sem passar por `toSnapshot()`: o
 * snapshot carrega a própria impressão digital, e chamá-lo aqui seria
 * recursão infinita.
 */
export function seedFingerprint(): string {
  cached ??= digest(seedSignature())

  return cached
}

function seedSignature(): string {
  const seed = MockDb.seed()

  return JSON.stringify({
    cart: seed.cart.toSnapshot(),
    availability: [...seed.availability],
    prices: [...seed.prices],
    users: [...seed.users.values()].map((user) => user.toSnapshot()),
    wallets: [...seed.wallets.values()].map((wallet) => wallet.toSnapshot()),
  })
}

function digest(value: string): string {
  let state = FNV_OFFSET

  for (const char of value) {
    state ^= char.charCodeAt(0)
    state = Math.imul(state, FNV_PRIME) >>> 0
  }

  return state.toString(16).padStart(8, '0')
}
