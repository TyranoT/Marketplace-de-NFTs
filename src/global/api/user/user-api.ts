import { request } from '../request'
import type {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  User,
  Wallet,
  WalletInput,
} from '../contracts/user'

type Signal = { signal?: AbortSignal }

export function login(data: LoginInput) {
  return request<User>({ method: 'POST', url: '/session', data })
}

export function register(data: RegisterInput) {
  return request<User>({ method: 'POST', url: '/users', data })
}

export function logout() {
  return request<void>({ method: 'DELETE', url: '/session' })
}

export function getMe({ signal }: Signal = {}) {
  return request<User>({ method: 'GET', url: '/me', signal })
}

export function updateProfile(data: UpdateProfileInput) {
  return request<User>({ method: 'PATCH', url: '/me', data })
}

export function changePassword(data: ChangePasswordInput) {
  return request<User>({ method: 'PATCH', url: '/me/password', data })
}

export function setAvatar(avatarUrl: string | null) {
  return request<User>({
    method: 'PATCH',
    url: '/me/avatar',
    data: { avatarUrl },
  })
}

export function getWallets({ signal }: Signal = {}) {
  return request<Array<Wallet>>({ method: 'GET', url: '/me/wallets', signal })
}

export function createWallet(data: WalletInput) {
  return request<Wallet>({ method: 'POST', url: '/me/wallets', data })
}

export function updateWallet(walletId: string, data: WalletInput) {
  return request<Wallet>({
    method: 'PATCH',
    url: `/me/wallets/${walletId}`,
    data,
  })
}

export function deleteWallet(walletId: string) {
  return request<Wallet>({ method: 'DELETE', url: `/me/wallets/${walletId}` })
}
