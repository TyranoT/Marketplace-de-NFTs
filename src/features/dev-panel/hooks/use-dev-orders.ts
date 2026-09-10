import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { request } from '@/global/api/request'
import type { ApiError, Order, OrderStatus } from '@/global/api'

const devOrdersKey = ['dev', 'orders'] as const

/**
 * Pedidos vistos pelo painel.
 *
 * Chave própria, e não `orderKeys`: o painel lista todos os pedidos do
 * banco simulado, enquanto o checkout acompanha só o da tentativa em curso.
 * Um intervalo curto basta — é uma ferramenta de demonstração, e o pedido
 * pendente liquida em pouco mais de um segundo.
 */
export function useDevOrders() {
  return useQuery<Array<Order>, ApiError>({
    queryKey: devOrdersKey,
    queryFn: ({ signal }) =>
      request<Array<Order>>({ method: 'GET', url: '/__mock/orders', signal }),
    refetchInterval: 2_000,
  })
}

type SettleInput = {
  orderId: string
  status: Exclude<OrderStatus, 'pending'>
}

/** Força o desfecho. O `order.updated` sai do servidor simulado, não daqui. */
export function useSettleOrder() {
  const queryClient = useQueryClient()

  return useMutation<Order, ApiError, SettleInput>({
    mutationFn: ({ orderId, status }) =>
      request<Order>({
        method: 'POST',
        url: `/__mock/orders/${orderId}/settle`,
        data: { status },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: devOrdersKey }),
  })
}
