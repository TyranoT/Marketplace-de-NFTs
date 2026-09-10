import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createWallet,
  deleteWallet,
  getWallets,
  updateWallet,
} from './user-api'
import { userKeys } from './user-keys'
import type { ApiError } from '../api-error'
import type { Wallet, WalletInput } from '../contracts/user'

/** Desligada no servidor, como as outras consultas que o cabeçalho alcança. */
export function useWallets() {
  return useQuery<Array<Wallet>, ApiError>({
    queryKey: userKeys.wallets(),
    queryFn: ({ signal }) => getWallets({ signal }),
    enabled: typeof window !== 'undefined',
  })
}

/** As três mutações compartilham escopo: elas escrevem a mesma lista. */
const WALLET_SCOPE = { id: 'wallets' }

export function useCreateWallet() {
  const queryClient = useQueryClient()

  return useMutation<Wallet, ApiError, WalletInput>({
    scope: WALLET_SCOPE,
    mutationFn: createWallet,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: userKeys.wallets() }),
  })
}

export function useUpdateWallet() {
  const queryClient = useQueryClient()

  return useMutation<Wallet, ApiError, { walletId: string; data: WalletInput }>(
    {
      scope: WALLET_SCOPE,
      mutationFn: ({ walletId, data }) => updateWallet(walletId, data),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: userKeys.wallets() }),
    },
  )
}

export function useDeleteWallet() {
  const queryClient = useQueryClient()

  return useMutation<Wallet, ApiError, { walletId: string }>({
    scope: WALLET_SCOPE,
    mutationFn: ({ walletId }) => deleteWallet(walletId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: userKeys.wallets() }),
  })
}
