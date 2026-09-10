export type WalletRole = 'primary' | 'secondary'

/**
 * O colecionador no wire. Nenhum campo de senha existe aqui — nem digesto,
 * nem sal: a senha entra por `/api/session` e por `/api/me/password`, e nunca
 * volta.
 */
export type User = {
  id: string
  displayName: string
  username: string
  email: string
  ensName: string
  ensSuffix: string
  avatarUrl?: string
  /** Apelido da carteira principal, que o frame de perfil também edita. */
  primaryWalletNickname?: string
  createdAt: string
  updatedAt: string
}

/**
 * Uma carteira carrega o mesmo conjunto que o pagamento pede: é o que permite
 * ao checkout nascer preenchido a partir da carteira principal.
 */
export type Wallet = {
  id: string
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

export type WalletInput = {
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
}

export type LoginInput = {
  email: string
  password: string
}

/** Campo ausente fica como está, como no `PATCH` que a rota implementa. */
export type UpdateProfileInput = {
  displayName?: string
  username?: string
  email?: string
  ensName?: string
  ensSuffix?: string
  primaryWalletNickname?: string
}

export type RegisterInput = {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export type ChangePasswordInput = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export type AvatarInput = {
  /** `null` remove. */
  avatarUrl: string | null
}
