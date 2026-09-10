export type WalletRole = 'primary' | 'secondary'

/**
 * A carteira guarda o mesmo conjunto que o pagamento pede, mais o apelido —
 * é o que o frame de carteiras desenha, e é o que torna o preenchimento do
 * checkout uma cópia, e não um mapeamento inventado.
 */
export type WalletSnapshot = {
  id: string
  userId: string
  role: WalletRole
  nickname: string
  displayName: string
  network: string
  profileName: string
  address: string
  secondaryAddress?: string
  walletType: string
  referralCode: string
  email: string
  ensName: string
  ensSuffix: string
  createdAt: string
  updatedAt: string
}

export type UserSnapshot = {
  id: string
  displayName: string
  username: string
  email: string
  ensName: string
  ensSuffix: string
  /** `data:` URL. O avatar do frame é escolhido no próprio navegador. */
  avatarUrl?: string
  /**
   * Só o digesto e o sal são persistidos. A senha em texto claro não existe
   * em lugar nenhum depois de recebida.
   */
  passwordDigest: string
  passwordSalt: string
  createdAt: string
  updatedAt: string
}

/** Sessão sem comportamento: uma linha que existe ou não existe. */
export type SessionSnapshot = {
  userId: string
  startedAt: string
}
