import { expect } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'

/**
 * Apoio comum dos testes.
 *
 * Tudo que fala com a API simulada passa por `page.evaluate`: o MSW só
 * existe dentro da página, e um `request.post()` do Playwright iria ao
 * servidor de verdade, e não ao mock.
 */

export const COLLECTOR = {
  email: 'colecionador@kurio.art',
  password: 'kurio2026',
}

export const CURATOR = { email: 'curadora@kurio.art', password: 'kurio2026' }

export type MockScenario = Partial<{
  latency: 'none' | 'fast' | 'slow' | 'variable'
  failureRate: number
  forceStatus: number
  outOfOrder: boolean
  offline: boolean
  orderOutcome: 'confirmed' | 'declined' | 'manual'
  orderSettleDelayMs: number
  checkoutResponseLost: boolean
}>

export type ApiResult<T> = { status: number; body: T }

export type CartBody = {
  version: number
  coupon: { code: string } | null
  items: Array<{
    id: string
    nftId: string
    editionId: string
    name: string
    quantity: number
  }>
}

export async function api<T = unknown>(
  page: Page,
  method: string,
  url: string,
  body?: unknown,
  headers: Record<string, string> = {},
): Promise<ApiResult<T>> {
  await waitForMock(page)

  const result = await page.evaluate(
    async (request) => {
      const response = await fetch(request.url, {
        method: request.method,
        headers: {
          ...(request.body === undefined
            ? {}
            : { 'Content-Type': 'application/json' }),
          ...request.headers,
        },
        body:
          request.body === undefined ? undefined : JSON.stringify(request.body),
      })
      const text = await response.text()

      return {
        status: response.status,
        body: (text ? JSON.parse(text) : null) as unknown,
      }
    },
    { method, url, body, headers },
  )

  return result as ApiResult<T>
}

/**
 * Espera o MSW responder nesta página.
 *
 * Service Worker controlando a página não basta: os handlers rodam no
 * documento, e até o `worker.start()` terminar a requisição passa direto
 * ao servidor de desenvolvimento — que responde o HTML da aplicação. Cada
 * navegação é um documento novo, então a espera vale a cada chamada.
 */
export async function waitForMock(page: Page) {
  /**
   * Um laço dentro da página, e não `waitForFunction`: com predicado
   * assíncrono, ele recebe a Promise — que é verdadeira — e retorna na hora.
   */
  await page.evaluate(async () => {
    const deadline = Date.now() + 15_000

    while (Date.now() < deadline) {
      try {
        const response = await fetch('/api/__mock/scenario')

        if ((response.headers.get('content-type') ?? '').includes('json')) {
          return
        }
      } catch {
        /** Ainda subindo. */
      }

      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    throw new Error('O MSW não respondeu em 15 s.')
  })
}

/**
 * Cenário conhecido antes de cada teste. Sem latência por padrão: a espera
 * artificial só entra onde o teste é sobre ela.
 */
export async function resetMock(page: Page, scenario: MockScenario = {}) {
  await page.goto('/')

  /**
   * O servidor de desenvolvimento pode recarregar a página na primeira
   * visita, quando o Vite otimiza uma dependência sob demanda. Se isso cai
   * no meio do reset, o contexto da página some junto; o reset é idempotente,
   * então basta repeti-lo no documento novo.
   */
  await expect(async () => {
    await api(page, 'POST', '/api/__mock/reset', {
      scenario: { latency: 'none', ...scenario },
    })
  }).toPass({ timeout: 20_000 })
}

export async function setScenario(page: Page, scenario: MockScenario) {
  await api(page, 'POST', '/api/__mock/scenario', scenario)
}

export async function login(page: Page, account = COLLECTOR) {
  const { status } = await api(page, 'POST', '/api/session', account)

  expect(status).toBe(201)
}

export async function readCart(page: Page): Promise<CartBody> {
  return (await api<CartBody>(page, 'GET', '/api/cart')).body
}

/** Mesma escrita do painel `/dev`: banco simulado e evento `nft.updated`. */
export async function changeNft(
  page: Page,
  nftId: string,
  change: {
    price?: string
    editions?: Array<{ editionId: string; units: number }>
  },
) {
  const { status } = await api(
    page,
    'PATCH',
    `/api/__mock/nfts/${nftId}`,
    change,
  )

  expect(status).toBe(200)
}

/**
 * Desktop e mobile convivem no mesmo DOM em várias telas, uma das cópias
 * escondida por CSS. O teste quer a que a pessoa vê.
 */
export function visible(locator: Locator): Locator {
  return locator.filter({ visible: true })
}

/**
 * Garante uma carteira escolhida no pagamento. Com conta, o grupo lista as
 * carteiras salvas e a principal já vem marcada; sem conta, lista as opções
 * fixas. O teste não depende de qual aparece.
 */
export async function chooseWallet(page: Page) {
  const radio = visible(page.getByRole('radio')).first()

  await expect(radio).toBeVisible()

  if ((await radio.getAttribute('aria-checked')) !== 'true') await radio.click()
}

/**
 * O HTML do servidor mostra o botão antes de o React hidratar, e um clique
 * nesse intervalo não tem handler. Repete até o alvo aparecer.
 */
export async function openWith(trigger: Locator, target: Locator) {
  await expect(async () => {
    await trigger.click()
    await expect(target).toBeVisible({ timeout: 1_000 })
  }).toPass({ timeout: 10_000 })
}
