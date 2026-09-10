import { useEffect, useState } from 'react'
import type { Cart } from '@/global/api'

/**
 * Trava o envio quando a cotação muda debaixo do formulário.
 *
 * O enunciado pede que o checkout **impeça** a confirmação com uma cotação
 * desatualizada e que a mudança exija nova confirmação. O servidor também
 * recusa (409 `CART_VERSION_MISMATCH`), mas descobrir isso só depois de
 * enviar é tarde: quem revisou um total precisa saber que ele mudou antes
 * de apertar o botão, não depois.
 *
 * A versão revisada é do carrinho inteiro, e não de um item: desconto e
 * taxa de rede dependem da composição, então qualquer alteração muda o
 * valor que foi revisado.
 */
export function useQuoteGuard(cart: Cart | undefined) {
  const [reviewedVersion, setReviewedVersion] = useState<number>()

  useEffect(() => {
    if (cart && reviewedVersion === undefined) setReviewedVersion(cart.version)
  }, [cart, reviewedVersion])

  const isStale =
    cart !== undefined &&
    reviewedVersion !== undefined &&
    cart.version !== reviewedVersion

  return {
    isStale,
    /** A versão a enviar é a revisada: é o valor que o colecionador viu. */
    reviewedVersion: reviewedVersion ?? cart?.version ?? 0,
    /** Reconhece a nova cotação e libera o envio. */
    acceptCurrent: () => setReviewedVersion(cart?.version),
  }
}
