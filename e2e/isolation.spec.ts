import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

/**
 * Isolamento de dados entre contas, login, logout e troca de usuário.
 *
 * "Exposição de dados entre usuários" é eliminatória no enunciado. Estes
 * testes passam pela API simulada de dentro da página — o MSW só existe no
 * navegador — e conferem o que cada conta consegue ver.
 */

const COLLECTOR = { email: 'colecionador@kurio.art', password: 'kurio2026' }
const CURATOR = { email: 'curadora@kurio.art', password: 'kurio2026' }

/** Total do carrinho-semente do visitante, o do frame do Figma. */
const SEED_TOTAL = '26.846'

type CartSummary = { items: number; total: string }

async function api<T>(page: Page, method: string, url: string, body?: unknown) {
  return page.evaluate(
    async (request) => {
      const response = await fetch(request.url, {
        method: request.method,
        headers: request.body
          ? { 'Content-Type': 'application/json' }
          : undefined,
        body: request.body ? JSON.stringify(request.body) : undefined,
      })
      const text = await response.text()

      return {
        status: response.status,
        body: (text ? JSON.parse(text) : null) as unknown,
      }
    },
    { method, url, body },
  ) as Promise<{ status: number; body: T }>
}

async function cart(page: Page): Promise<CartSummary> {
  const { body } = await api<{
    items: Array<unknown>
    totals: { total: { amount: string } }
  }>(page, 'GET', '/api/cart')

  return { items: body.items.length, total: body.totals.total.amount }
}

const login = (page: Page, account: typeof COLLECTOR) =>
  api(page, 'POST', '/api/session', account)

const logout = (page: Page) => api(page, 'DELETE', '/api/session')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller))
  await api(page, 'POST', '/api/__mock/reset')
})

test('o carrinho do visitante passa para a conta ao entrar', async ({
  page,
}) => {
  expect(await cart(page)).toEqual({ items: 3, total: SEED_TOTAL })

  expect((await login(page, COLLECTOR)).status).toBe(201)

  /** Os itens foram junto: a conta tem o que o visitante tinha. */
  expect(await cart(page)).toEqual({ items: 3, total: SEED_TOTAL })

  await logout(page)

  /** E o visitante ficou sem eles: não há cópia nos dois lugares. */
  expect((await cart(page)).items).toBe(0)
})

test('uma conta não vê o carrinho da outra', async ({ page }) => {
  await login(page, COLLECTOR)
  expect((await cart(page)).items).toBe(3)
  await logout(page)

  await login(page, CURATOR)

  /** A curadora entra com o carrinho vazio que o visitante deixou. */
  expect((await cart(page)).items).toBe(0)

  await logout(page)
  await login(page, COLLECTOR)

  /** E o do colecionador continua lá quando ele volta. */
  expect(await cart(page)).toEqual({ items: 3, total: SEED_TOTAL })
})

test('uma conta não lê o pedido da outra', async ({ page }) => {
  await login(page, COLLECTOR)

  const { body: current } = await api<{ version: number }>(
    page,
    'GET',
    '/api/cart',
  )
  const profile = {
    displayName: 'Italo Monteiro',
    username: 'italo',
    network: 'ethereum',
    profileName: 'Kurio Collector',
    walletAddress: '0x8f2A55949038A9610f50FB23b5883Af3B4A88C4B',
    walletType: 'metamask',
    referralCode: 'KURIO-2026',
    email: COLLECTOR.email,
    ensSuffix: 'eth',
  }
  const created = await page.evaluate(
    async ({ profile: collector, cartVersion }) => {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': 'isolamento-1',
        },
        body: JSON.stringify({
          profile: collector,
          walletId: 'metamask',
          cartVersion,
        }),
      })

      return { status: response.status, body: await response.json() }
    },
    { profile, cartVersion: current.version },
  )

  expect(created.status).toBe(201)
  const orderId = (created.body as { id: string }).id

  expect((await api(page, 'GET', `/api/orders/${orderId}`)).status).toBe(200)

  await logout(page)
  await login(page, CURATOR)

  /** 404, e não 403: nem a existência do pedido é revelada. */
  expect((await api(page, 'GET', `/api/orders/${orderId}`)).status).toBe(404)

  const { body: orders } = await api<Array<unknown>>(page, 'GET', '/api/orders')
  expect(orders).toEqual([])
})

test('sair e trocar de conta pela interface limpa o que era da anterior', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'o cabeçalho com o menu da conta é do desktop')

  await login(page, COLLECTOR)
  await page.goto('/carrinho')
  /**
   * O selo do cabeçalho, e não a tabela: abaixo de `lg` o carrinho é lista,
   * e a tabela não existe. O selo aparece em toda largura.
   */
  await expect(
    page.getByRole('link', { name: 'Carrinho com 17 itens' }),
  ).toBeVisible()

  await page.getByRole('button', { name: /Menu da conta de/ }).click()
  await page.getByRole('menuitem', { name: 'Sair' }).click()

  /** Depois de sair, a tela mostra o carrinho do visitante — vazio. */
  await expect(
    page.getByRole('heading', { name: 'Seu carrinho está vazio' }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: /Menu da conta de/ }),
  ).toHaveCount(0)
})
