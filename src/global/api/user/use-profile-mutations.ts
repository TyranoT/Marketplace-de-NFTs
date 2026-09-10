import { useMutation, useQueryClient } from '@tanstack/react-query'
import { changePassword, setAvatar, updateProfile } from './user-api'
import { userKeys } from './user-keys'
import type { ApiError } from '../api-error'
import type {
  ChangePasswordInput,
  UpdateProfileInput,
  User,
} from '../contracts/user'

/**
 * Sem otimismo em nenhuma das três: obrigatoriedade, unicidade e conferência
 * de senha são exatamente o veredito que se está pedindo ao servidor.
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation<User, ApiError, UpdateProfileInput>({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      queryClient.setQueryData(userKeys.me(), user)

      return queryClient.invalidateQueries({ queryKey: userKeys.wallets() })
    },
  })
}

export function useChangePassword() {
  const queryClient = useQueryClient()

  return useMutation<User, ApiError, ChangePasswordInput>({
    mutationFn: changePassword,
    onSuccess: (user) => queryClient.setQueryData(userKeys.me(), user),
  })
}

export function useSetAvatar() {
  const queryClient = useQueryClient()

  return useMutation<User, ApiError, string | null>({
    mutationFn: setAvatar,
    onSuccess: (user) => queryClient.setQueryData(userKeys.me(), user),
  })
}
