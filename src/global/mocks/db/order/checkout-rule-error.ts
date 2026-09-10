import { RuleError } from '../core/rule-error'

/** Regras da compra. O estoque continua sendo julgado por `CartRuleError`. */
export class CheckoutRuleError extends RuleError {
  private constructor(status: number, code: string, message: string) {
    super(status, code, message)
    this.name = 'CheckoutRuleError'
  }

  static cartEmpty(): CheckoutRuleError {
    return new CheckoutRuleError(
      422,
      'CART_EMPTY',
      'Não há NFTs no carrinho para finalizar a compra.',
    )
  }

  static invalidProfile(field: string, message: string): CheckoutRuleError {
    return new CheckoutRuleError(
      422,
      'CHECKOUT_INVALID',
      `${field}: ${message}`,
    )
  }

  static walletNotSupported(): CheckoutRuleError {
    return new CheckoutRuleError(
      422,
      'WALLET_NOT_SUPPORTED',
      'Selecione uma carteira compatível.',
    )
  }
}
