import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAddCartItem } from '@/global/api/cart'
import { toCartErrorMessage } from '@/features/cart/helpers/to-cart-error-message'
import type { NftEditionId } from '@/global/type'

type AddToCartInput = {
  nftId: string
  editionId: NftEditionId
  quantity: number
}

/**
 * Liga os botões de compra do detalhe ao carrinho.
 *
 * `navigateOnSuccess` separa as duas intenções do frame: "COMPRAR" leva o
 * colecionador ao carrinho para fechar a compra, enquanto "Adicionar ao
 * carrinho" no mobile guarda o item e mantém quem está navegando onde estava.
 */
export function useAddToCart({ navigateOnSuccess = false } = {}) {
  const navigate = useNavigate()
  const addItem = useAddCartItem()
  const [status, setStatus] = useState('')
  const [error, setError] = useState<string>()

  function add({ nftId, editionId, quantity }: AddToCartInput) {
    setError(undefined)

    addItem.mutate(
      { nftId, editionId, quantity },
      {
        onSuccess: () => {
          if (navigateOnSuccess) {
            void navigate({ to: '/carrinho' })

            return
          }

          setStatus('Item adicionado ao carrinho.')
        },
        onError: (mutationError) => setError(toCartErrorMessage(mutationError)),
      },
    )
  }

  return { add, isPending: addItem.isPending, status, error }
}
