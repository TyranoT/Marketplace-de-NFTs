import { HttpResponse, http } from 'msw'
import { CartRuleError, cartService } from '../db'
import { applyLatency, nextRequestIndex } from '../scenario/delay'
import { errorResponse, maybeFail } from '../scenario/failure'
import type { Cart } from '../../api/contracts/cart'
import type { NftEditionId } from '../../type'

/**
 * Os handlers só traduzem HTTP para o serviço. Nenhuma regra de carrinho
 * vive aqui — é o que mantém uma fonte única de verdade para disponibilidade,
 * cupom e totais, compartilhada com a atualização otimista da interface.
 */
async function withScenario(run: () => Cart) {
  const index = nextRequestIndex()
  await applyLatency(index)

  const failure = maybeFail()

  if (failure) return failure

  try {
    return HttpResponse.json(run())
  } catch (error) {
    if (error instanceof CartRuleError) {
      return errorResponse(error.status, error.code, error.message)
    }

    throw error
  }
}

export const cartHandlers = [
  http.get('/api/cart', () => withScenario(() => cartService.readCart())),

  http.post('/api/cart/items', async ({ request }) => {
    const body = (await request.json()) as {
      nftId: string
      editionId: NftEditionId
      quantity: number
    }

    return withScenario(() =>
      cartService.addItem(body.nftId, body.editionId, body.quantity),
    )
  }),

  http.patch('/api/cart/items/:itemId', async ({ request, params }) => {
    const body = (await request.json()) as { quantity: number }

    return withScenario(() =>
      cartService.updateItem(String(params.itemId), body.quantity),
    )
  }),

  http.delete('/api/cart/items/:itemId', ({ params }) =>
    withScenario(() => cartService.removeItem(String(params.itemId))),
  ),

  http.post('/api/cart/coupon', async ({ request }) => {
    const body = (await request.json()) as { code: string }

    return withScenario(() => cartService.applyCoupon(body.code))
  }),

  http.delete('/api/cart/coupon', () =>
    withScenario(() => cartService.removeCoupon()),
  ),
]
