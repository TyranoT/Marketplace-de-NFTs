import { HttpResponse } from 'msw'
import { RuleError } from '../db'
import { applyLatency, nextRequestIndex } from '../scenario/delay'
import { errorResponse, maybeFail } from '../scenario/failure'

/**
 * Latência, falha simulada e tradução de `RuleError` para HTTP.
 *
 * Estava copiada em `cart.ts`, `checkout.ts` e `user.ts`; o catálogo seria a
 * quarta cópia. Cada handler segue traduzindo só o seu domínio — nenhuma
 * regra de negócio mudou de lugar.
 */
export async function withScenario<TData>(run: () => TData, status = 200) {
  const index = nextRequestIndex()
  await applyLatency(index)

  const failure = maybeFail()

  if (failure) return failure

  try {
    const data = run()

    return data === undefined
      ? new HttpResponse(null, { status: 204 })
      : HttpResponse.json(data, { status })
  } catch (error) {
    if (error instanceof RuleError) {
      return errorResponse(error.status, error.code, error.message)
    }

    throw error
  }
}
