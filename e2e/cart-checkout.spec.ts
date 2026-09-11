import { expect, test } from '@playwright/test'
import {
  api,
  chooseWallet,
  login,
  readCart,
  resetMock,
  visible,
} from './support/mock'
import type { Page } from '@playwright/test'

/**
 * §9, itens 5, 6 e 7: carrinho, compra completa, recusa, clique repetido e
 * timeout com recuperação do mesmo pedido.
 */

const TITLES = {
  pending: 'Confirmando a transação na rede...',
  confirmed: 'Seus NFTs agora estão na sua carteira',
  declined: 'A transação foi recusada',
}

type Order = { id: string; status: string }

async function orders(page: Page): Promise<Array<Order>> {
  return (await api<Array<Order>>(page, 'GET', '/api/orders')).body
}

function submitButton(page: Page) {
  return visible(page.getByRole('button', { name: 'Confirmar compra' })).first()
}

/** Carteira escolhida e envio. Com conta, o formulário vem preenchido. */
async function submitCheckout(page: Page) {
  const submit = submitButton(page)

  await expect(submit).toBeVisible()

  await chooseWallet(page)
  await submit.click()
}

function statusHeading(page: Page, title: string) {
  return page.getByRole('dialog').getByRole('heading', { name: title })
}

test.describe('carrinho', () => {
  test('quantidade, remoção, cupom e persistência após refresh', async ({
    page,
  }) => {
    await resetMock(page)
    await page.goto('/carrinho')

    const increase = visible(
      page.getByRole('button', {
        name: 'Aumentar quantidade de Emerald Ape #042',
      }),
    )
    /** O `<output>` leva o valor no nome: "Quantidade de X: 3". */
    const quantity = visible(
      page.getByLabel('Quantidade de Emerald Ape #042: 3', { exact: true }),
    )
    const removeIvory = visible(
      page.getByRole('button', {
        name: 'Remover Ivory Baron #088 do carrinho',
      }),
    )

    await increase.click()
    await expect(quantity).toBeVisible()

    await removeIvory.click()
    await expect(
      page.getByText('Ivory Baron #088 removido do carrinho.'),
    ).toBeAttached()
    await expect(removeIvory).toHaveCount(0)

    const coupon = visible(
      page.getByRole('textbox', { name: 'Código promocional' }),
    )
    const apply = visible(page.getByRole('button', { name: 'Aplicar' }))

    await coupon.fill('EXPIRADO')
    await apply.click()
    await expect(visible(page.getByText('Este cupom expirou.'))).toBeVisible()

    await coupon.fill('KURIO10')
    await apply.click()
    await expect(visible(page.getByText('Cupom aplicado:'))).toBeVisible()

    /** O estado mora no banco simulado, e não na memória da tela. */
    await page.reload()
    await expect(quantity).toBeVisible()
    await expect(removeIvory).toHaveCount(0)
    await expect(visible(page.getByText('Cupom aplicado:'))).toBeVisible()
    expect((await readCart(page)).coupon?.code).toBe('KURIO10')
  })
})

test.describe('compra', () => {
  test('compra completa, do catálogo ao recibo confirmado', async ({
    page,
  }) => {
    await resetMock(page, { orderSettleDelayMs: 300 })
    await login(page)

    await page.goto('/?q=Emerald')
    await page
      .locator('#catalogo li a')
      .filter({ hasText: 'Emerald Ape #042' })
      .click()
    await expect(page).toHaveURL(/\/nft\/emerald-ape-042/)

    await visible(page.getByRole('button', { name: /^Comprar/ }))
      .first()
      .click()
    await expect(page).toHaveURL(/\/carrinho/)

    await visible(
      page
        .getByRole('link', { name: 'Conectar e finalizar' })
        .or(page.getByRole('button', { name: 'Conectar e finalizar' })),
    )
      .first()
      .click()
    await expect(page).toHaveURL(/\/pagamento/)

    await submitCheckout(page)

    await expect(statusHeading(page, TITLES.confirmed)).toBeVisible({
      timeout: 10_000,
    })
    await expect(
      page.getByRole('dialog').getByText('ID da transação'),
    ).toBeVisible()

    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Fechar' })
      .first()
      .click()
    await expect(page).toHaveURL(/\/(\?.*)?$/)

    /** Confirmar é o que tira do carrinho o que foi comprado. */
    await expect.poll(async () => (await readCart(page)).items.length).toBe(0)
  })

  test('pagamento recusado preserva o carrinho', async ({ page }) => {
    /**
     * Relógio controlado: o pedido fica pendente por um minuto, e o teste
     * avança o tempo em vez de esperá-lo.
     */
    await resetMock(page, {
      orderOutcome: 'declined',
      orderSettleDelayMs: 60_000,
    })
    await login(page)
    await page.clock.install()
    await page.goto('/pagamento')

    await submitCheckout(page)
    await expect(statusHeading(page, TITLES.pending)).toBeVisible()

    await page.clock.fastForward(61_000)

    await expect(statusHeading(page, TITLES.declined)).toBeVisible()
    /** O texto aparece duas vezes: na tela e na região viva do leitor de tela. */
    await expect(
      visible(
        page.getByRole('dialog').getByText('Seus itens continuam no carrinho.'),
      ).first(),
    ).toBeVisible()
    expect((await readCart(page)).items).toHaveLength(3)
  })

  test('clique repetido cria um pedido só', async ({ page }) => {
    await resetMock(page, { orderOutcome: 'manual' })
    await login(page)
    await page.goto('/pagamento')

    const submit = submitButton(page)

    await expect(submit).toBeVisible()
    await chooseWallet(page)
    await submit.dblclick()

    await expect(statusHeading(page, TITLES.pending)).toBeVisible()
    expect(await orders(page)).toHaveLength(1)
  })

  test('timeout depois de criar o pedido recupera o mesmo pedido', async ({
    page,
  }) => {
    await resetMock(page, {
      orderOutcome: 'manual',
      checkoutResponseLost: true,
    })
    await login(page)
    await page.goto('/pagamento')

    await submitCheckout(page)

    /** A resposta se perdeu, mas o servidor gravou a compra. */
    await expect(
      visible(page.getByText('Não foi possível concluir a compra')).first(),
    ).toBeVisible()

    const [created] = await orders(page)

    expect(created).toBeDefined()

    /** A nova tentativa reusa a chave e recebe o pedido que já existe. */
    await submitButton(page).click()
    await expect(statusHeading(page, TITLES.pending)).toBeVisible()

    const after = await orders(page)

    expect(after).toHaveLength(1)
    expect(after[0].id).toBe(created.id)
  })

  test('mesma chave com outro conteúdo é conflito', async ({ page }) => {
    await resetMock(page, { orderOutcome: 'manual' })
    await login(page)

    const { version } = await readCart(page)
    const profile = {
      displayName: 'Italo Monteiro',
      username: 'italo',
      network: 'ethereum',
      profileName: 'Kurio Collector',
      walletAddress: '0x8f2A55949038A9610f50FB23b5883Af3B4A88C4B',
      walletType: 'metamask',
      referralCode: 'KURIO-2026',
      email: 'colecionador@kurio.art',
      ensSuffix: 'eth',
    }
    const headers = { 'Idempotency-Key': 'e2e-mesma-chave' }
    const input = { profile, walletId: 'metamask', cartVersion: version }

    const first = await api<Order>(
      page,
      'POST',
      '/api/checkout',
      input,
      headers,
    )
    const again = await api<Order>(
      page,
      'POST',
      '/api/checkout',
      input,
      headers,
    )
    const other = await api(
      page,
      'POST',
      '/api/checkout',
      { ...input, walletId: 'coinbase' },
      headers,
    )

    expect(first.status).toBe(201)
    expect(again.body.id).toBe(first.body.id)
    expect(other.status).toBe(409)
    expect(await orders(page)).toHaveLength(1)
  })
})
