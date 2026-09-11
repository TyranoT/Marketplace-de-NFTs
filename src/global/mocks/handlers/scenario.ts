import { HttpResponse, http } from 'msw'
import { mockDb } from '../db'
import { realtimeServer } from '../realtime'
import { cancelSettlements } from '../realtime/order-events'
import { getScenario, resetScenario, setScenario } from '../scenario/config'
import type { MockScenario } from '../scenario/config'

type ResetBody = {
  scenario?: Partial<MockScenario>
}

/**
 * Controle da simulação exposto como endpoint, e não como função exportada,
 * para ser chamado de dentro da página — pelo painel `/dev` e pelos testes,
 * com `page.evaluate`. Não dá para usar `request.post()` do Playwright: o
 * MSW só existe no navegador, e uma requisição de fora iria ao servidor real.
 */
export const scenarioHandlers = [
  http.post('/api/__mock/reset', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as ResetBody

    resetScenario()
    /** Um pedido da vida anterior não pode liquidar sobre o banco novo. */
    cancelSettlements()
    mockDb.$reset()

    if (body.scenario) setScenario(body.scenario)

    /** Depois do reset gravado: quem ouvir já encontra o banco novo. */
    realtimeServer.emitReset()

    return new HttpResponse(null, { status: 204 })
  }),

  /** Ajusta o cenário preservando o estado atual do carrinho. */
  http.post('/api/__mock/scenario', async ({ request }) => {
    const body = (await request.json()) as Partial<MockScenario>

    return HttpResponse.json(setScenario(body))
  }),

  http.get('/api/__mock/scenario', () => HttpResponse.json(getScenario())),
]
