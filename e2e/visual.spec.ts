import { expect, test } from '@playwright/test'
import { resetMock, visible } from './support/mock'
import type { Page } from '@playwright/test'

/**
 * Regressão visual de início, detalhe, carrinho e pagamento, em desktop e
 * mobile, sobre o cenário-semente — os dados são sempre os mesmos.
 *
 * As baselines ficam versionadas em `visual.spec.ts-snapshots/`. Foram
 * geradas no Windows; em outro sistema o antialiasing das fontes difere, e
 * elas precisam ser regeradas com `npm run test:e2e:update`.
 */

const SCREENS: Array<{
  name: string
  path: string
  ready: (page: Page) => Promise<void>
}> = [
  {
    name: 'inicio',
    path: '/',
    ready: (page) =>
      expect(page.locator('#catalogo li h3').first()).toBeVisible(),
  },
  {
    name: 'detalhe',
    path: '/nft/emerald-ape-042',
    ready: (page) =>
      expect(
        page
          .getByRole('heading', { level: 1, name: 'Emerald Ape #042' })
          .first(),
      ).toBeVisible(),
  },
  {
    name: 'carrinho',
    path: '/carrinho',
    ready: (page) =>
      expect(
        visible(
          page.getByRole('button', {
            name: 'Aumentar quantidade de Emerald Ape #042',
          }),
        ),
      ).toBeVisible(),
  },
  {
    name: 'pagamento',
    path: '/pagamento',
    ready: (page) =>
      expect(
        visible(page.getByRole('button', { name: 'Confirmar compra' })).first(),
      ).toBeVisible(),
  },
]

/** Imagens com `loading="lazy"` só carregam quando entram na tela. */
async function settle(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 40))
    }

    window.scrollTo(0, 0)
  })
  await page.waitForFunction(
    () => [...document.images].every((image) => image.complete),
    undefined,
    { timeout: 15_000 },
  )
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('[aria-busy="true"]')).toHaveCount(0)
}

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name === 'tablet',
    'o §9 pede a regressão visual em desktop e mobile',
  )
  await resetMock(page)
})

for (const screen of SCREENS) {
  test(`regressão visual: ${screen.name}`, async ({ page }) => {
    await page.goto(screen.path)
    await screen.ready(page)
    await settle(page)

    await expect(page).toHaveScreenshot(`${screen.name}.png`, {
      fullPage: true,
    })
  })
}
