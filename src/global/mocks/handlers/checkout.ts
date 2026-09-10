import { HttpResponse, http } from 'msw'
import { RuleError, checkoutService } from '../db'
import { applyLatency, nextRequestIndex } from '../scenario/delay'
import { errorResponse, maybeFail } from '../scenario/failure'
import type { CheckoutInput } from '../../api/contracts/order'

/**
 * Como nos handlers do carrinho: só tradução de HTTP. A compra inteira, com
 * validação, estoque e limpeza do carrinho, é do `CheckoutService`.
 */
export const checkoutHandlers = [
  http.post('/api/checkout', async ({ request }) => {
    const body = (await request.json()) as CheckoutInput

    const index = nextRequestIndex()
    await applyLatency(index)

    const failure = maybeFail()

    if (failure) return failure

    try {
      return HttpResponse.json(checkoutService.checkout(body), { status: 201 })
    } catch (error) {
      if (error instanceof RuleError) {
        return errorResponse(error.status, error.code, error.message)
      }

      throw error
    }
  }),
]
