import { MockUser } from './mock-user'
import { MockWallet } from './mock-wallet'
import type { WalletSnapshot } from './user-snapshot'

const SEED_AT = new Date(0).toISOString()

const SEED_USER_ID = 'user-kurio-01'
const SECOND_USER_ID = 'user-kurio-02'

/** Fixo, e não sorteado: a semente precisa ser idêntica a cada carga. */
const SEED_SALT = 'kurio-seed-salt'

/**
 * Credenciais da demonstração. Ficam no código de propósito, e documentadas
 * no `ARCHITECTURE.md`: sem elas ninguém entra na própria aplicação.
 */
export const SEED_CREDENTIALS = {
  email: 'colecionador@kurio.art',
  password: 'kurio2026',
}

/**
 * Segunda conta, sem carteira. O §6 pede pelo menos dois usuários, e é com
 * duas contas que se verifica que um não vê o carrinho nem os pedidos do
 * outro.
 */
export const SECOND_CREDENTIALS = {
  email: 'curadora@kurio.art',
  password: 'kurio2026',
}

/**
 * Uma carteira principal e nenhuma secundária — o estado exato do frame, que
 * diz "Você ainda não adicionou uma carteira secundária".
 */
const SEED_WALLET: WalletSnapshot = {
  id: 'wallet-primary',
  userId: SEED_USER_ID,
  role: 'primary',
  nickname: 'Carteira principal',
  displayName: 'Italo Monteiro',
  network: 'ethereum',
  profileName: 'Kurio Collector',
  address: '0x8f2A55949038A9610f50FB23b5883Af3B4A88C4B',
  walletType: 'metamask',
  referralCode: 'KURIO-2026',
  email: SEED_CREDENTIALS.email,
  ensName: 'italomonteiro',
  ensSuffix: 'eth',
  createdAt: SEED_AT,
  updatedAt: SEED_AT,
}

export function buildSeedUsers(): Map<string, MockUser> {
  const users = [buildSeedUser(), buildSecondUser()]

  return new Map(users.map((user) => [user.id, user]))
}

function buildSecondUser(): MockUser {
  return MockUser.create(
    {
      id: SECOND_USER_ID,
      displayName: 'Ana Curadora',
      username: 'ana',
      email: SECOND_CREDENTIALS.email,
      ensName: 'anacuradora',
      ensSuffix: 'eth',
      createdAt: SEED_AT,
      updatedAt: SEED_AT,
    },
    SECOND_CREDENTIALS.password,
    SEED_SALT,
  )
}

function buildSeedUser(): MockUser {
  return MockUser.create(
    {
      id: SEED_USER_ID,
      displayName: 'Italo Monteiro',
      username: 'italo',
      email: SEED_CREDENTIALS.email,
      ensName: 'italomonteiro',
      ensSuffix: 'eth',
      createdAt: SEED_AT,
      updatedAt: SEED_AT,
    },
    SEED_CREDENTIALS.password,
    SEED_SALT,
  )
}

export function buildSeedWallets(): Map<string, MockWallet> {
  return new Map([[SEED_WALLET.id, MockWallet.fromSnapshot(SEED_WALLET)]])
}
