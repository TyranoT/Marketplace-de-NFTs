import { MockUser } from './mock-user'
import { MockWallet } from './mock-wallet'
import type { WalletSnapshot } from './user-snapshot'

const SEED_AT = new Date(0).toISOString()

const SEED_USER_ID = 'user-kurio-01'

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
  const user = buildSeedUser()

  return new Map([[user.id, user]])
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
