import { expect, test } from '@playwright/test'
import { resetMock, setScenario, visible } from './support/mock'

/**
 * §9, item 12: esqueleto durante carregamento lento, feedback de falha e
 * recuperação após nova tentativa. O cenário é trocado sem recarregar a
 * página — é o que deixa ver a mesma tela falhar e se recompor.
 */

test('esqueleto enquanto o catálogo carrega devagar', async ({ page }) => {
  await resetMock(page, { latency: 'slow' })
  await page.goto('/')

  await expect(page.getByText('Carregando NFTs…')).toBeAttached()
  await expect(
    page.locator('#catalogo [aria-hidden="true"]').first(),
  ).toBeVisible()

  await expect(page.getByText(/\d+ NFTs encontrados\./)).toBeAttached({
    timeout: 15_000,
  })
  await expect(page.locator('#catalogo li h3').first()).toBeVisible()
})

test('catálogo com 503 avisa e se recupera ao tentar de novo', async ({
  page,
}) => {
  await resetMock(page, { forceStatus: 503 })
  await page.goto('/')

  await expect(
    page.getByText('Não foi possível carregar o catálogo'),
  ).toBeVisible({ timeout: 20_000 })

  await setScenario(page, { forceStatus: 0 })
  await page.getByRole('button', { name: 'Tentar novamente' }).first().click()

  await expect(page.locator('#catalogo li h3').first()).toBeVisible()
})

test('carrinho sem conexão avisa e se recupera ao tentar de novo', async ({
  page,
}) => {
  await resetMock(page, { offline: true })
  await page.goto('/carrinho')

  await expect(
    page.getByText('Não foi possível carregar seu carrinho'),
  ).toBeVisible({ timeout: 20_000 })

  await setScenario(page, { offline: false })
  await visible(page.getByRole('button', { name: 'Tentar novamente' }))
    .first()
    .click()

  await expect(
    visible(
      page.getByRole('button', {
        name: 'Aumentar quantidade de Emerald Ape #042',
      }),
    ),
  ).toBeVisible()
})
