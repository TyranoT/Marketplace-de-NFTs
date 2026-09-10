import { useQuery } from '@tanstack/react-query'
import { request } from '../request'
import { orderKeys } from './order-keys'
import type { ApiError } from '../api-error'
import type { Order } from '../contracts/order'

export function getOrder(orderId: string, signal?: AbortSignal) {
  return request<Order>({ method: 'GET', url: `/orders/${orderId}`, signal })
}

/**
 * Recupera um pedido pelo id.
 *
 * É o caminho de volta depois de recarregar a página no meio da compra: o
 * id do pendente fica guardado, e esta consulta traz o estado atual — que
 * pode já ter sido liquidado enquanto a página não existia.
 *
 * Sem `staleTime`: um pedido pendente é justamente o dado que não se pode
 * considerar fresco.
 */
export function useOrder(orderId: string | undefined) {
  return useQuery<Order, ApiError>({
    queryKey: orderKeys.detail(orderId ?? ''),
    queryFn: ({ signal }) => getOrder(orderId!, signal),
    enabled: Boolean(orderId) && typeof window !== 'undefined',
    staleTime: 0,
  })
}
