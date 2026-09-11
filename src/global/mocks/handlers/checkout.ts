import { HttpResponse, http } from 'msw'
import { RuleError, checkoutService } from '../db'
import { getScenario, setScenario } from '../scenario/config'
import { applyLatency, nextRequestIndex } from '../scenario/delay'
import { errorResponse, maybeFail } from '../scenario/failure'
import { scheduleSettlement } from '../realtime/order-events'
import type { CheckoutInput } from '../../api/contracts/order'

/**
 * Como nos handlers do carrinho: só tradução de HTTP. A compra inteira, com
 * validação, estoque e criação do pedido, é do `CheckoutService`.
 *
 * O pedido nasce **pendente** e o agendamento da liquidação acontece fora da
 * transação — um rollback não pode deixar um temporizador agendado para um
 * pedido que não existe.
 */
export const checkoutHandlers = [
  http.post('/api/checkout', async ({ request }) => {
    const body = (await request.json()) as CheckoutInput

    /**
     * `Idempotency-Key` identifica a **tentativa de compra**, e por isso é
     * diferente do `x-request-id`, que é por requisição: uma retentativa
     * após timeout reusa a mesma chave de propósito.
     */
    const idempotencyKey = request.headers.get('Idempotency-Key') ?? undefined

    const index = nextRequestIndex()
    await applyLatency(index)

    const failure = maybeFail()

    if (failure) return failure

    try {
      const order = checkoutService.checkout(body, { idempotencyKey })

      scheduleSettlement(order, getScenario().orderSettleDelayMs)

      /**
       * O pedido existe, mas a resposta não chega ao cliente. Só a
       * idempotência resolve: a nova tentativa, com a mesma chave, recebe
       * este mesmo pedido em vez de criar outro.
       */
      if (getScenario().checkoutResponseLost) {
        setScenario({ checkoutResponseLost: false })

        return HttpResponse.error()
      }

      return HttpResponse.json(order, { status: 201 })
    } catch (error) {
      if (error instanceof RuleError) {
        return errorResponse(error.status, error.code, error.message)
      }

      throw error
    }
  }),
]
