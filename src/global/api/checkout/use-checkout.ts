import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cartKeys, useCartScope } from '../cart'
import { orderKeys } from '../order'
import { postCheckout } from './checkout-api'
import type { ApiError } from '../api-error'
import type { CheckoutInput, Order } from '../contracts/order'

export type CheckoutVariables = CheckoutInput & {
  /**
   * Identifica a **tentativa de compra**, não a requisição. Quem chama é
   * responsável por reusá-la numa retentativa: gerar outra criaria um
   * segundo pedido, que é exatamente o que a idempotência existe para
   * evitar.
   */
  idempotencyKey: string
}

/**
 * Sem otimismo: estoque, cupom e validade do perfil são exatamente o
 * veredito que se está pedindo ao servidor.
 *
 * O pedido nasce `pending` e o carrinho **não** é esvaziado aqui — quem o
 * limpa é a confirmação, do lado do servidor. Ainda assim o cache é
 * invalidado, porque a versão do carrinho mudou.
 */
export function useCheckout() {
  const queryClient = useQueryClient()
  const scope = useCartScope()

  return useMutation<Order, ApiError, CheckoutVariables>({
    scope: { id: `cart-${scope}` },
    mutationFn: ({ idempotencyKey, ...input }) =>
      postCheckout(input, idempotencyKey),
    onSuccess: (order) => {
      queryClient.setQueryData(orderKeys.detail(order.id), order)

      return queryClient.invalidateQueries({ queryKey: cartKeys.all })
    },
  })
}
