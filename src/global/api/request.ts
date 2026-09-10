import { http } from './http'
import type { AxiosRequestConfig } from 'axios'

/**
 * Envelope tipado das chamadas. Recebe o `signal` do TanStack Query para que
 * uma consulta substituída seja abortada, em vez de aterrissar fora de ordem.
 */
export async function request<TData>(
  config: AxiosRequestConfig,
): Promise<TData> {
  const response = await http.request<TData>(config)

  return response.data
}
