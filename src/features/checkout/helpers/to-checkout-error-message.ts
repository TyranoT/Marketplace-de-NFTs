import { isApiError } from '@/global/api'
import { toCartErrorMessage } from '@/features/cart'

/**
 * Os códigos do carrinho continuam valendo na compra — estoque é a mesma
 * regra. Aqui ficam só os vereditos que nascem no checkout.
 */
const MESSAGE_BY_CODE: Record<string, string> = {
  CART_EMPTY: 'Seu carrinho está vazio. Adicione um NFT antes de finalizar.',
  WALLET_NOT_SUPPORTED: 'Escolha uma carteira compatível para pagar.',
}

export function toCheckoutErrorMessage(error: unknown): string | undefined {
  if (!isApiError(error)) return undefined

  if (error.code && MESSAGE_BY_CODE[error.code])
    return MESSAGE_BY_CODE[error.code]

  /**
   * `CHECKOUT_INVALID` chega com o campo recusado no texto: é informação que
   * o servidor tem e a tela não teria como reconstruir.
   */
  if (error.code === 'CHECKOUT_INVALID') return error.message

  return toCartErrorMessage(error)
}
