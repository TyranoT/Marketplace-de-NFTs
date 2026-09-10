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

  /**
   * O carrinho mudou entre a revisão e o envio. 409 e não 422: não é um
   * campo malformado, é um conflito com o estado atual do servidor — e o
   * cliente resolve mostrando a nova cotação, não corrigindo o formulário.
   */
  static quoteOutdated(currentVersion: number): CheckoutRuleError {
    return new CheckoutRuleError(
      409,
      'CART_VERSION_MISMATCH',
      `O valor do pedido mudou (versão ${currentVersion}). Revise o resumo antes de confirmar.`,
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
