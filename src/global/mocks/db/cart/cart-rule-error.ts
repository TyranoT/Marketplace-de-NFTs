/**
 * Veredito de regra do carrinho. Status HTTP, código de negócio e mensagem
 * nascem juntos nas fábricas estáticas: é o que impede o mesmo erro de existir
 * com dois textos diferentes em dois pontos do repositório.
 */
export class CartRuleError extends Error {
  private constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'CartRuleError'
  }

  static nftNotFound(): CartRuleError {
    return new CartRuleError(404, 'NFT_NOT_FOUND', 'NFT não encontrado.')
  }

  static editionSoldOut(): CartRuleError {
    return new CartRuleError(
      409,
      'EDITION_SOLD_OUT',
      'Esta edição está esgotada.',
    )
  }

  static quantityExceedsAvailability(available: number): CartRuleError {
    return new CartRuleError(
      409,
      'QUANTITY_EXCEEDS_AVAILABILITY',
      `Restam apenas ${available} unidades desta edição.`,
    )
  }

  static cartItemNotFound(): CartRuleError {
    return new CartRuleError(
      404,
      'CART_ITEM_NOT_FOUND',
      'Item não está no carrinho.',
    )
  }

  static invalidQuantity(): CartRuleError {
    return new CartRuleError(
      422,
      'INVALID_QUANTITY',
      'A quantidade mínima é 1.',
    )
  }

  static couponInvalid(): CartRuleError {
    return new CartRuleError(422, 'COUPON_INVALID', 'Cupom inválido.')
  }

  static couponExpired(): CartRuleError {
    return new CartRuleError(422, 'COUPON_EXPIRED', 'Cupom expirado.')
  }

  static couponNotApplicable(minSubtotal: string): CartRuleError {
    return new CartRuleError(
      409,
      'COUPON_NOT_APPLICABLE',
      `Este cupom exige subtotal mínimo de ${minSubtotal} ETH.`,
    )
  }
}
