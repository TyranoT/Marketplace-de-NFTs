import { expect, test } from '@playwright/test'
import { login, resetMock } from './support/mock'

/** §9, item 8: perfil, avatar, senha e carteiras, com erros de validação. */

test.skip(
  ({ isMobile }) => isMobile,
  'o perfil no mobile é navegado por telas; os fluxos são os mesmos',
)

/** PNG 1×1, o menor avatar válido. */
const PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
)

test.beforeEach(async ({ page }) => {
  await resetMock(page)
  await login(page)
})

test('dados do perfil: campo obrigatório e salvamento', async ({ page }) => {
  await page.goto('/perfil/dados')

  const name = page.getByLabel('Nome de exibição')
  const save = page.getByRole('button', { name: 'Salvar', exact: true })

  await expect(name).toHaveValue('Italo Monteiro')

  await name.fill('')
  await save.click()
  await expect(name).toHaveAttribute('aria-invalid', 'true')

  await name.fill('Italo M.')
  await save.click()
  await expect(page.getByText('Perfil atualizado.')).toBeVisible()

  await page.reload()
  await expect(name).toHaveValue('Italo M.')
})

test('senha atual errada é recusada', async ({ page }) => {
  await page.goto('/perfil/dados')
  await expect(page.getByLabel('Nome de exibição')).toHaveValue(
    'Italo Monteiro',
  )

  await page.getByLabel('Senha atual', { exact: true }).fill('senha-errada')
  await page.getByLabel('Nova senha', { exact: true }).fill('novaSenha1')
  await page
    .getByLabel('Confirmar nova senha', { exact: true })
    .fill('novaSenha1')
  await page.getByRole('button', { name: 'Salvar', exact: true }).click()

  await expect(page.getByText('A senha atual não confere.')).toBeVisible()
})

test('avatar é enviado e pode ser removido', async ({ page }) => {
  await page.goto('/perfil/dados')
  await expect(page.getByLabel('Nome de exibição')).toHaveValue(
    'Italo Monteiro',
  )

  await page.getByLabel('Alterar', { exact: true }).setInputFiles({
    name: 'avatar.png',
    mimeType: 'image/png',
    buffer: PIXEL,
  })

  const remove = page.getByRole('button', { name: 'Remover avatar' })

  await expect(remove).toBeVisible()
  await remove.click()
  await expect(remove).toHaveCount(0)
})

test('carteira com endereço inválido é recusada', async ({ page }) => {
  await page.goto('/perfil/carteiras')

  /**
   * Pelo papel e pelo nome acessível: o `<label>` tem o asterisco de
   * obrigatório, escondido do leitor de tela, e o `getByLabel` exato o conta.
   */
  const address = page
    .getByRole('textbox', { name: 'Endereço da carteira', exact: true })
    .first()
  const save = page.getByRole('button', { name: 'Salvar carteira' }).first()

  await expect(address).toHaveValue(/^0x/)

  await address.fill('0x123')
  await save.click()
  await expect(address).toHaveAttribute('aria-invalid', 'true')

  await address.fill('0x1111111111111111111111111111111111111111')
  await save.click()
  await expect(page.getByText('Carteira salva.')).toBeVisible()
})
