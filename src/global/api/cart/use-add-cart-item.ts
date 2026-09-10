import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addCartItem } from './cart-api'
import { cartKeys, useCartScope } from './cart-keys'
import type { ApiError } from '../api-error'
import type { AddCartItemInput, Cart } from '../contracts/cart'

/**
 * Pessimista de propósito: o `id` da linha é atribuído pelo servidor, então
 * uma versão otimista precisaria de identificador provisório e reconciliação
 * — complexidade sem ganho perceptível para o usuário.
 */
export function useAddCartItem() {
  const queryClient = useQueryClient()
  const scope = useCartScope()
  const key = cartKeys.detail(scope)

  return useMutation<Cart, ApiError, AddCartItemInput>({
    scope: { id: `cart-${scope}` },
    mutationFn: addCartItem,
    onSuccess: (cart) => queryClient.setQueryData(key, cart),
  })
}
