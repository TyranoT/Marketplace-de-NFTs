import { HttpResponse, http } from 'msw'
import { resetDb } from '../db/store'
import { getScenario, resetScenario, setScenario } from '../scenario/config'
import type { MockScenario } from '../scenario/config'

type ResetBody = {
  scenario?: Partial<MockScenario>
}

/**
 * Controle da simulação exposto como endpoint, e não como função exportada,
 * para o Playwright preparar o estado com `request.post()` no `beforeEach`,
 * sem depender de `page.evaluate` nem de a aplicação já estar montada.
 */
export const scenarioHandlers = [
  http.post('/api/__mock/reset', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as ResetBody

    resetScenario()
    resetDb()

    if (body.scenario) setScenario(body.scenario)

    return new HttpResponse(null, { status: 204 })
  }),

  /** Ajusta o cenário preservando o estado atual do carrinho. */
  http.post('/api/__mock/scenario', async ({ request }) => {
    const body = (await request.json()) as Partial<MockScenario>

    return HttpResponse.json(setScenario(body))
  }),

  http.get('/api/__mock/scenario', () => HttpResponse.json(getScenario())),
]
