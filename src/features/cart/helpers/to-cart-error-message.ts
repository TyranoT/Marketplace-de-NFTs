import { isApiError } from '@/global/api'

/**
 * Traduz o código de negócio devolvido pela API para texto de interface.
 *
 * O mapa vive na feature, e não no cliente HTTP, porque é cópia: o transporte
 * só carrega o código, quem decide como falar com o usuário é a tela.
 */
const MESSAGE_BY_CODE: Record<string, string> = {
  COUPON_INVALID: 'Cupom inválido. Confira o código e tente novamente.',
  COUPON_EXPIRED: 'Este cupom expirou.',
  COUPON_NOT_APPLICABLE: 'Este cupom não se aplica aos itens do carrinho.',
  QUANTITY_EXCEEDS_AVAILABILITY:
    'A quantidade pedida passa da disponibilidade desta edição.',
  EDITION_SOLD_OUT: 'Esta edição está esgotada.',
  CART_ITEM_NOT_FOUND: 'Este item não está mais no seu carrinho.',
  NFT_NOT_FOUND: 'Este NFT saiu do catálogo.',
  INVALID_QUANTITY: 'A quantidade mínima é 1.',
}

const MESSAGE_BY_KIND: Record<string, string> = {
  network: 'Sem conexão com o mercado. Verifique sua rede e tente novamente.',
  timeout: 'O mercado demorou a responder. Tente novamente.',
  server: 'O mercado está instável. Tente novamente em instantes.',
}

export function toCartErrorMessage(error: unknown): string | undefined {
  if (!isApiError(error)) return undefined

  /** Consulta cancelada é substituição de dado, não falha para o usuário. */
  if (error.kind === 'canceled') return undefined

  if (error.code && MESSAGE_BY_CODE[error.code])
    return MESSAGE_BY_CODE[error.code]

  return MESSAGE_BY_KIND[error.kind] ?? 'Não foi possível concluir a ação.'
}
