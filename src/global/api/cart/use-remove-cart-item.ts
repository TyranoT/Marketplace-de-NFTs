import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeItemLocally } from './apply-quantity-locally'
import { removeCartItem } from './cart-api'
import { cartKeys, useCartScope } from './cart-keys'
import type { ApiError } from '../api-error'
import type { Cart } from '../contracts/cart'

type Context = { previous?: Cart }

/** Também otimista: a linha some na hora e volta se o servidor recusar. */
export function useRemoveCartItem() {
  const queryClient = useQueryClient()
  const scope = useCartScope()
  const key = cartKeys.detail(scope)

  return useMutation<Cart, ApiError, { itemId: string }, Context>({
    scope: { id: `cart-${scope}` },

    mutationFn: ({ itemId }) => removeCartItem(itemId),

    onMutate: async ({ itemId }) => {
      await queryClient.cancelQueries({ queryKey: key })

      const previous = queryClient.getQueryData<Cart>(key)

      if (previous)
        queryClient.setQueryData(key, removeItemLocally(previous, itemId))

      return { previous }
    },

    onError: (_error, _input, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
    },

    onSuccess: (cart) => queryClient.setQueryData(key, cart),

    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: cartKeys.all }) <= 1) {
        void queryClient.invalidateQueries({ queryKey: key })
      }
    },
  })
}
