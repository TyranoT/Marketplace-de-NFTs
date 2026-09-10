import { useMutation, useQueryClient } from '@tanstack/react-query'
import { applyCartCoupon, removeCartCoupon } from './cart-api'
import { cartKeys, useCartScope } from './cart-keys'
import type { ApiError } from '../api-error'
import type { ApplyCouponInput, Cart } from '../contracts/cart'

/**
 * Sem otimismo: validade, expiração e aplicabilidade do cupom são exatamente
 * o veredito que se está pedindo ao servidor. Antecipá-lo seria inventar a
 * resposta.
 */
export function useApplyCoupon() {
  const queryClient = useQueryClient()
  const scope = useCartScope()
  const key = cartKeys.detail(scope)

  return useMutation<Cart, ApiError, ApplyCouponInput>({
    scope: { id: `cart-${scope}` },
    mutationFn: applyCartCoupon,
    onSuccess: (cart) => queryClient.setQueryData(key, cart),
  })
}

export function useRemoveCoupon() {
  const queryClient = useQueryClient()
  const scope = useCartScope()
  const key = cartKeys.detail(scope)

  return useMutation<Cart, ApiError, void>({
    scope: { id: `cart-${scope}` },
    mutationFn: removeCartCoupon,
    onSuccess: (cart) => queryClient.setQueryData(key, cart),
  })
}
