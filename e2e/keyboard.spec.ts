import { expect, test } from '@playwright/test'
import { resetMock, visible } from './support/mock'

/**
 * §9, item 11: teclado, foco de diálogos e validação de formulários. O
 * skip link e a varredura do axe estão em `a11y.spec.ts`.
 */

test.skip(
  ({ isMobile }) => isMobile,
  'teclado físico é caso de desktop e tablet',
)

test.beforeEach(async ({ page }) => {
  await resetMock(page)
})

test('diálogo de login abre pelo teclado, prende e devolve o foco', async ({
  page,
}) => {
  await page.goto('/')
  /** A grade só carrega no cliente: com ela na tela, o React já hidratou. */
  await expect(page.locator('#catalogo li h3').first()).toBeVisible()

  const trigger = page
    .getByRole('banner')
    .getByRole('button', { name: 'Entrar' })
  const dialog = page.getByRole('dialog', { name: 'Entrar ou criar conta' })
  const focusIsInside = () =>
    page.evaluate(() =>
      Boolean(
        document
          .querySelector('[role="dialog"]')
          ?.contains(document.activeElement),
      ),
    )

  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(dialog).toBeVisible()
  await expect.poll(focusIsInside).toBe(true)

  /** Armadilha de foco: Tab dá a volta dentro do diálogo. */
  for (let step = 0; step < 15; step += 1) {
    await page.keyboard.press('Tab')
  }

  expect(await focusIsInside()).toBe(true)

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('pagamento vazio leva o foco ao primeiro campo inválido', async ({
  page,
}) => {
  await page.goto('/pagamento')

  const submit = visible(
    page.getByRole('button', { name: 'Confirmar compra' }),
  ).first()

  await expect(submit).toBeVisible()
  await submit.click()

  const first = page.getByLabel('Nome de exibição')

  await expect(first).toBeFocused()
  await expect(first).toHaveAttribute('aria-invalid', 'true')
})
