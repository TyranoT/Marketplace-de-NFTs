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

          /**
           * Esvazia antes de escrever: a mesma frase duas vezes seguidas não
           * muda o conteúdo da região viva, e a segunda adição passava em
           * silêncio.
           */
          setStatus('')
          requestAnimationFrame(() =>
            setStatus(
              quantity === 1
                ? '1 item adicionado ao carrinho.'
                : `${quantity} itens adicionados ao carrinho.`,
            ),
          )
        },
        onError: (mutationError) => setError(toCartErrorMessage(mutationError)),
      },
    )
  }

  return { add, isPending: addItem.isPending, status, error }
}
