import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login, logout, register } from './user-api'
import { userKeys } from './user-keys'
import type { ApiError } from '../api-error'
import type { LoginInput, RegisterInput, User } from '../contracts/user'

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation<User, ApiError, RegisterInput>({
    mutationFn: register,
    onSuccess: (user) => {
      queryClient.setQueryData(userKeys.me(), user)

      return queryClient.invalidateQueries({ queryKey: userKeys.wallets() })
    },
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation<User, ApiError, LoginInput>({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(userKeys.me(), user)

      return queryClient.invalidateQueries({ queryKey: userKeys.wallets() })
    },
  })
}

/**
 * Sair limpa o cache inteiro, e não só as chaves de usuário: o carrinho é
 * consultado por escopo, e deixar no cache o que foi lido como autenticado
 * mostraria dados da conta a quem já saiu dela.
 */
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, void>({
    mutationFn: logout,
    onSuccess: () => queryClient.clear(),
  })
}
