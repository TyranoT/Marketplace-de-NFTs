import { HttpResponse } from 'msw'
import { getScenario } from './config'
import { mulberry32 } from './random'
import type { ApiErrorPayload } from '../../api/api-error'

let random: (() => number) | undefined

export function errorResponse(status: number, code: string, message: string) {
  return HttpResponse.json<ApiErrorPayload>(
    { error: { code, message } },
    { status },
  )
}

/**
 * Falha de infraestrutura antes de qualquer regra de negócio. Devolve a
 * resposta pronta quando o cenário manda falhar, e `undefined` quando o
 * handler deve seguir normalmente.
 */
export function maybeFail() {
  const scenario = getScenario()

  if (scenario.offline) return HttpResponse.error()

  if (scenario.forceStatus) {
    return errorResponse(
      scenario.forceStatus,
      'SCENARIO_FORCED',
      'Falha simulada pelo cenário de mocks.',
    )
  }

  if (scenario.failureRate > 0) {
    random ??= mulberry32(scenario.seed + 1)

    if (random() < scenario.failureRate) {
      return errorResponse(
        503,
        'SERVICE_UNAVAILABLE',
        'Serviço temporariamente indisponível.',
      )
    }
  }

  return undefined
}
