import { RuleError } from '../core/rule-error'
import type { OrderStatus } from '../../../api/contracts/order'

/** Vereditos sobre o pedido já criado. A compra em si é do `CheckoutRuleError`. */
export class OrderRuleError extends RuleError {
  private constructor(status: number, code: string, message: string) {
    super(status, code, message)
    this.name = 'OrderRuleError'
  }

  static orderNotFound(): OrderRuleError {
    return new OrderRuleError(404, 'ORDER_NOT_FOUND', 'Pedido não encontrado.')
  }

  /** Terminal é terminal: reabrir um pedido resolvido reescreveria a história. */
  static orderAlreadySettled(status: OrderStatus): OrderRuleError {
    return new OrderRuleError(
      409,
      'ORDER_ALREADY_SETTLED',
      `Este pedido já está ${status === 'confirmed' ? 'confirmado' : 'recusado'}.`,
    )
  }

  /**
   * Mesma chave de idempotência, conteúdo diferente. O enunciado pede
   * exatamente este conflito: a chave identifica uma tentativa, e reusá-la
   * para outra compra esconderia um pedido que ninguém veria nascer.
   */
  static idempotencyKeyReused(): OrderRuleError {
    return new OrderRuleError(
      409,
      'IDEMPOTENCY_KEY_REUSED',
      'Esta chave de idempotência já foi usada para outro pedido.',
    )
  }
}
