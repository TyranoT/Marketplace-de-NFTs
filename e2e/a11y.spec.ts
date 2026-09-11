import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'

/**
 * Varredura de acessibilidade com o axe nas telas principais.
 *
 * Falha em violações `serious` e `critical` das regras WCAG 2.1 A/AA. As de
 * impacto menor aparecem no relatório, mas não reprovam: são as que exigem
 * julgamento, e um teste que reprova por elas vira ruído que alguém desliga.
 */

const ROUTES = [
  { name: 'início', path: '/' },
  { name: 'detalhe do NFT', path: '/nft/emerald-ape-042' },
  { name: 'carrinho', path: '/carrinho' },
  { name: 'pagamento', path: '/pagamento' },
  { name: 'perfil', path: '/perfil' },
]

/**
 * O reset é feito **de dentro da página**. O MSW só existe no navegador: um
 * `request.post()` do Playwright iria ao servidor de verdade, e não ao mock.
 */
async function resetScenario(page: Page) {
  await page.goto('/')
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller))
  await page.evaluate(() => fetch('/api/__mock/reset', { method: 'POST' }))
}

/** Espera o conteúdo sair do esqueleto antes de auditar. */
async function waitForContent(page: Page) {
  await expect(page.locator('main').first()).toBeVisible()
  await expect(page.locator('[aria-busy="true"]')).toHaveCount(0, {
    timeout: 10_000,
  })
}

async function seriousViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  return results.violations
    .filter(({ impact }) => impact === 'serious' || impact === 'critical')
    .map(({ id, impact, help, nodes }) => ({
      id,
      impact,
      help,
      alvos: nodes.slice(0, 3).map(({ target }) => target.join(' ')),
    }))
}

test.beforeEach(async ({ page }) => {
  await resetScenario(page)
})

for (const route of ROUTES) {
  test(`sem violações graves: ${route.name}`, async ({ page }) => {
    await page.goto(route.path)
    await waitForContent(page)

    expect(await seriousViolations(page)).toEqual([])
  })
}

test('sem violações graves: diálogo de login', async ({ page, isMobile }) => {
  test.skip(isMobile, 'no mobile o login é tela cheia, coberta pelo perfil')

  await page.goto('/')
  await waitForContent(page)
  /**
   * O HTML do servidor já mostra o botão antes de o React hidratar, e um
   * clique nesse intervalo não tem handler — o diálogo não abria e o teste
   * falhava de forma intermitente. Repete o clique até o diálogo aparecer.
   */
  const dialog = page.getByRole('dialog', { name: 'Entrar ou criar conta' })

  await expect(async () => {
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(dialog).toBeVisible({ timeout: 1_000 })
  }).toPass({ timeout: 10_000 })

  expect(await seriousViolations(page)).toEqual([])
})

test('o skip link leva o foco ao conteúdo', async ({ page }) => {
  await page.goto('/')
  await waitForContent(page)

  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Pular para o conteúdo' })
  await expect(skip).toBeFocused()

  await page.keyboard.press('Enter')
  await expect(page.locator('#conteudo')).toBeFocused()
})
