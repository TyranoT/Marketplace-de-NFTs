import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cartKeys, useCartScope } from '../cart'
import { postCheckout } from './checkout-api'
import type { ApiError } from '../api-error'
import type { CheckoutInput, Order } from '../contracts/order'

/**
 * Sem otimismo: estoque, cupom e validade do perfil são exatamente o veredito
 * que se está pedindo ao servidor. Em caso de sucesso o carrinho ficou vazio
 * do outro lado, então o cache é invalidado em vez de adivinhado.
 */
export function useCheckout() {
  const queryClient = useQueryClient()
  const scope = useCartScope()

  return useMutation<Order, ApiError, CheckoutInput>({
    scope: { id: `cart-${scope}` },
    mutationFn: postCheckout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cartKeys.all }),
  })
}
