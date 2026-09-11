import { expect, test } from '@playwright/test'
import {
  COLLECTOR,
  login,
  openWith,
  resetMock,
  setScenario,
} from './support/mock'
import type { Page } from '@playwright/test'

/**
 * §9, item 3: cadastro, login, expiração de sessão e logout. A troca de
 * usuário, com o isolamento do que cada conta vê, está em
 * `isolation.spec.ts`.
 */

test.skip(
  ({ isMobile }) => isMobile,
  'no mobile, entrar e criar conta são telas cheias; aqui é o diálogo',
)

async function openAuthDialog(page: Page) {
  const dialog = page.getByRole('dialog', { name: 'Entrar ou criar conta' })

  await page.goto('/')
  await openWith(
    page.getByRole('banner').getByRole('button', { name: 'Entrar' }),
    dialog,
  )

  return dialog
}

test.beforeEach(async ({ page }) => {
  await resetMock(page)
})

test('cadastro recusa e-mail repetido e inicia a sessão', async ({ page }) => {
  const dialog = await openAuthDialog(page)

  await dialog.getByRole('tab', { name: 'Criar conta' }).click()
  await dialog.getByLabel('Nome de usuário').fill('novata')
  await dialog.getByLabel('Digite seu e-mail').fill(COLLECTOR.email)
  await dialog.getByLabel('Senha', { exact: true }).fill('senhaforte1')
  await dialog.getByLabel('Confirmar senha').fill('senhaforte1')
  await dialog.getByRole('button', { name: 'Criar conta' }).click()

  await expect(dialog.getByText('Este e-mail já tem uma conta.')).toBeVisible()

  await dialog.getByLabel('Digite seu e-mail').fill('novata@kurio.art')
  await dialog.getByRole('button', { name: 'Criar conta' }).click()

  await expect(dialog).toBeHidden()
  await expect(
    page.getByRole('button', { name: 'Menu da conta de novata' }),
  ).toBeVisible()
})

test('login com senha errada avisa; certa entra; sair volta a visitante', async ({
  page,
}) => {
  const dialog = await openAuthDialog(page)

  await dialog.getByLabel('E-mail').fill(COLLECTOR.email)
  await dialog.getByLabel('Senha', { exact: true }).fill('senha-errada')
  await dialog.getByRole('button', { name: 'Entrar' }).click()
  await expect(dialog.getByText('E-mail ou senha incorretos.')).toBeVisible()

  await dialog.getByLabel('Senha', { exact: true }).fill(COLLECTOR.password)
  await dialog.getByRole('button', { name: 'Entrar' }).click()
  await expect(dialog).toBeHidden()

  const menu = page.getByRole('button', {
    name: 'Menu da conta de Italo Monteiro',
  })

  await expect(menu).toBeVisible()

  await menu.click()
  await page.getByRole('menuitem', { name: 'Sair' }).click()

  await expect(
    page.getByRole('banner').getByRole('button', { name: 'Entrar' }),
  ).toBeVisible()
  await expect(menu).toHaveCount(0)
})

test('sessão recusada pelo servidor leva o perfil ao pedido de login', async ({
  page,
}) => {
  await login(page)
  await page.goto('/perfil/dados')
  await expect(page.getByLabel('Nome de exibição')).toHaveValue(
    'Italo Monteiro',
  )

  /** O servidor passa a responder 401: a sessão expirou do lado dele. */
  await setScenario(page, { forceStatus: 401 })
  await page.reload()

  await expect(
    page.getByRole('heading', { name: 'Entre para ver seu perfil' }),
  ).toBeVisible()
})
