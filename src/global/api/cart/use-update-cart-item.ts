import { useMutation, useQueryClient } from '@tanstack/react-query'
import { applyQuantityLocally } from './apply-quantity-locally'
import { updateCartItem } from './cart-api'
import { cartKeys, useCartScope } from './cart-keys'
import type { ApiError } from '../api-error'
import type { Cart, UpdateCartItemInput } from '../contracts/cart'

type Context = { previous?: Cart }

/**
 * Interação otimista do projeto: o stepper responde na hora e volta atrás se
 * o servidor recusar.
 *
 * Foi escolhida por ser a de maior frequência e por ter uma falha de negócio
 * real para exercitar o rollback — `409 QUANTITY_EXCEEDS_AVAILABILITY` quando
 * a quantidade passa da disponibilidade da edição.
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient()
  const scope = useCartScope()
  const key = cartKeys.detail(scope)

  return useMutation<Cart, ApiError, UpdateCartItemInput, Context>({
    /**
     * Serializa as mutations do carrinho. Sem isso, cliques rápidos geram
     * PATCHes concorrentes e vence o último a *responder*, não o último
     * clicado — o carrinho terminaria numa quantidade que ninguém pediu.
     */
    scope: { id: `cart-${scope}` },

    mutationFn: updateCartItem,

    onMutate: async ({ itemId, quantity }) => {
      /**
       * Cancelar antes de fotografar: um GET já em voo aterrissaria depois da
       * escrita otimista e desfaria a mudança sozinho.
       */
      await queryClient.cancelQueries({ queryKey: key })

      const previous = queryClient.getQueryData<Cart>(key)

      if (previous) {
        queryClient.setQueryData(
          key,
          applyQuantityLocally(previous, itemId, quantity),
        )
      }

      return { previous }
    },

    onError: (_error, _input, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
    },

    onSuccess: (cart) => queryClient.setQueryData(key, cart),

    onSettled: () => {
      /** Só a última mutation da fila revalida, para não refazer o GET N vezes. */
      if (queryClient.isMutating({ mutationKey: cartKeys.all }) <= 1) {
        void queryClient.invalidateQueries({ queryKey: key })
      }
    },
  })
}
