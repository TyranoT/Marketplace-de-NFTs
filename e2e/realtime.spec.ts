import { expect, test } from '@playwright/test'
import {
  api,
  changeNft,
  chooseWallet,
  login,
  readCart,
  resetMock,
  visible,
} from './support/mock'

/**
 * §9, itens 9 e 10. Os eventos saem do servidor simulado e chegam pelo
 * `socket.io-client` — nenhum teste escreve no cache da tela.
 */

const QUOTE_STALE =
  'O valor do pedido mudou enquanto você preenchia. Revise o resumo antes de confirmar.'

test('preço alterado em outra aba durante o checkout pede revisão', async ({
  page,
  context,
}) => {
  await resetMock(page)
  await login(page)
  await page.goto('/pagamento')

  const submit = visible(
    page.getByRole('button', { name: 'Confirmar compra' }),
  ).first()

  await expect(submit).toBeVisible()

  /** O painel de simulação, noutra aba, muda o preço de um item do carrinho. */
  const panel = await context.newPage()

  await panel.goto('/dev')
  await panel.waitForFunction(() => Boolean(navigator.serviceWorker.controller))
  await changeNft(panel, 'emerald-ape-042', { price: '2.50' })

  await expect(visible(page.getByText(QUOTE_STALE)).first()).toBeVisible()
  await expect(submit).toHaveAttribute('aria-disabled', 'true')

  await visible(page.getByRole('button', { name: 'Revisar novo valor' }))
    .first()
    .click()

  await expect(visible(page.getByText(QUOTE_STALE))).toHaveCount(0)
  await expect(submit).not.toHaveAttribute('aria-disabled', 'true')
})

test('preço e disponibilidade chegam ao carrinho aberto', async ({ page }) => {
  await resetMock(page)
  await page.goto('/carrinho')

  const increase = visible(
    page.getByRole('button', {
      name: 'Aumentar quantidade de Emerald Ape #042',
    }),
  )

  await expect(increase).toBeVisible()

  const emerald = (await readCart(page)).items.find(
    ({ nftId }) => nftId === 'emerald-ape-042',
  )

  expect(emerald).toBeDefined()

  await changeNft(page, 'emerald-ape-042', { price: '2.00' })
  await expect(
    visible(page.getByText(/O preço de Emerald Ape #042 mudou de/)).first(),
  ).toBeVisible()

  await changeNft(page, 'emerald-ape-042', {
    editions: [{ editionId: emerald?.editionId ?? '', units: 2 }],
  })
  await expect(
    visible(
      page.getByText(
        'A disponibilidade de Emerald Ape #042 mudou: agora restam 2 unidades.',
      ),
    ).first(),
  ).toBeVisible()

  /** Duas no carrinho, duas disponíveis: não dá para pedir a terceira. */
  await expect(increase).toHaveAttribute('aria-disabled', 'true')
})

test('desconexão: ao reconectar, a tela se reconcilia com o REST', async ({
  page,
}) => {
  await resetMock(page)
  await page.goto('/nft/violet-nomad-314')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Violet Nomad #314' }).first(),
  ).toBeVisible()

  await api(page, 'POST', '/api/__mock/realtime/disconnect')

  /** O evento desta mudança se perde: não há socket para recebê-lo. */
  await changeNft(page, 'violet-nomad-314', { price: '4.44' })

  await expect(visible(page.getByText(/4[.,]44/)).first()).toBeVisible({
    timeout: 15_000,
  })
})

test('pedido pendente é retomado após o refresh e concluído pelo evento', async ({
  page,
}) => {
  await resetMock(page, { orderOutcome: 'manual' })
  await login(page)
  await page.goto('/pagamento')

  const submit = visible(
    page.getByRole('button', { name: 'Confirmar compra' }),
  ).first()

  await expect(submit).toBeVisible()
  await chooseWallet(page)
  await submit.click()

  const dialog = page.getByRole('dialog')
  const pending = dialog.getByRole('heading', {
    name: 'Confirmando a transação na rede...',
  })

  await expect(pending).toBeVisible()

  await page.reload()
  await expect(pending).toBeVisible()

  const { body: orders } = await api<Array<{ id: string }>>(
    page,
    'GET',
    '/api/orders',
  )

  await api(page, 'POST', `/api/__mock/orders/${orders[0].id}/settle`, {
    status: 'confirmed',
  })

  await expect(
    dialog.getByRole('heading', {
      name: 'Seus NFTs agora estão na sua carteira',
    }),
  ).toBeVisible()
})
