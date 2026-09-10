import { useMutation, useQueryClient } from '@tanstack/react-query'
import { request } from '@/global/api/request'
import type { ApiError } from '@/global/api'

/**
 * Restaura o cenário-semente e derruba a conexão.
 *
 * Ambos reaproveitam endpoints que já existiam para o Playwright — o painel
 * só lhes dá uma superfície visível.
 */
export function useResetMocks() {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, void>({
    mutationFn: () => request<void>({ method: 'POST', url: '/__mock/reset' }),
    /** O banco voltou à semente: todo cache derivado dele é ficção. */
    onSuccess: () => queryClient.clear(),
  })
}

export function useDisconnectRealtime() {
  return useMutation<{ disconnected: number }, ApiError, void>({
    mutationFn: () =>
      request<{ disconnected: number }>({
        method: 'POST',
        url: '/__mock/realtime/disconnect',
      }),
  })
}
