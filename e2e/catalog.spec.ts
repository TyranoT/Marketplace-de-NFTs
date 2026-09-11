import { expect, test } from '@playwright/test'
import { api, openWith, resetMock } from './support/mock'
import type { Page } from '@playwright/test'

/**
 * §9, itens 1 e 2: busca, filtros combinados, ordenação, paginação,
 * histórico, acesso direto ao detalhe e recurso inexistente.
 *
 * A grade é conferida contra a própria API, com a consulta que a URL
 * descreve: o teste não repete os dados da semente, e prova que a tela
 * mostra exatamente o que o handler respondeu.
 */

type NftList = { items: Array<{ name: string }>; total: number }

/** A URL guarda listas em JSON (`["ethereum"]`); a API, em parâmetros repetidos. */
function apiQueryOf(pageUrl: string): string {
  const query = new URLSearchParams({ pageSize: '9' })

  for (const [key, raw] of new URL(pageUrl).searchParams) {
    let value: unknown = raw

    try {
      value = JSON.parse(raw)
    } catch {
      /** Texto puro, como o termo da busca. */
    }

    for (const item of Array.isArray(value) ? value : [value]) {
      query.append(key, String(item))
    }
  }

  return query.toString()
}

async function expectGridMatchesUrl(page: Page): Promise<NftList> {
  const { body } = await api<NftList>(
    page,
    'GET',
    `/api/nfts?${apiQueryOf(page.url())}`,
  )

  if (body.total === 0) {
    await expect(
      page.getByText('Nenhum NFT encontrado com os filtros selecionados.'),
    ).toBeAttached()

    return body
  }

  await expect(page.locator('#catalogo li h3')).toHaveText(
    body.items.map(({ name }) => name),
  )

  return body
}

test.beforeEach(async ({ page }) => {
  await resetMock(page)
})

test('filtros combinados, ordenação, paginação e restauração pelo histórico', async ({
  page,
}) => {
  const width = page.viewportSize()?.width ?? 0
  const hasSidebar = width >= 1024

  await page.goto('/')
  await expectGridMatchesUrl(page)

  await page.getByRole('link', { name: 'Página 2' }).click()
  await expect(page).toHaveURL(/page=2/)
  await expectGridMatchesUrl(page)

  /** O seletor de ordenação existe a partir do tablet. */
  if (width >= 768) {
    await page.getByRole('combobox', { name: 'Ordenar por:' }).click()
    await page.getByRole('option', { name: 'Preço: menor primeiro' }).click()
    await expect(page).toHaveURL(/sort=price-asc/)
    await expectGridMatchesUrl(page)
  }

  const filters = hasSidebar
    ? page.getByRole('complementary', { name: 'Filtros do catálogo' })
    : page.getByRole('dialog')

  if (!hasSidebar) {
    await openWith(page.getByRole('button', { name: 'Abrir filtros' }), filters)
  }

  await filters.getByRole('checkbox', { name: 'Ethereum' }).click()
  await expect(page).toHaveURL(/ethereum/)
  await filters.getByRole('checkbox', { name: 'Polygon' }).click()
  await expect(page).toHaveURL(/polygon/)

  if (!hasSidebar) {
    await page.getByRole('button', { name: 'Fechar filtros' }).click()
  }

  await expectGridMatchesUrl(page)

  /** Filtro novo recomeça da primeira página: a segunda pode nem existir. */
  expect(new URL(page.url()).searchParams.get('page') ?? '1').toBe('1')

  const filteredUrl = page.url()

  await page.goBack()
  await expect(page).not.toHaveURL(filteredUrl)
  await expectGridMatchesUrl(page)

  await page.goForward()
  await expect(page).toHaveURL(filteredUrl)
  await expectGridMatchesUrl(page)

  await page.reload()
  await expect(page).toHaveURL(filteredUrl)
  await expectGridMatchesUrl(page)

  if (hasSidebar) {
    await expect(
      filters.getByRole('checkbox', { name: 'Ethereum' }),
    ).toBeChecked()
  }
})

test('busca pelo termo e volta pelo histórico', async ({ page, isMobile }) => {
  await page.goto('/')
  await expectGridMatchesUrl(page)

  const search = page.getByRole('searchbox', {
    name: 'Buscar NFTs e coleções',
  })

  if (isMobile) {
    /** No mobile a busca é o campo fixo do topo, com debounce. */
    await search.fill('Nomad')
  } else {
    await openWith(page.getByRole('button', { name: 'Abrir busca' }), search)
    await search.fill('Nomad')
    await search.press('Enter')
  }

  await expect(page).toHaveURL(/q=Nomad/)

  const result = await expectGridMatchesUrl(page)

  expect(result.items.map(({ name }) => name)).toEqual(
    expect.arrayContaining(['Sage Nomad #009', 'Violet Nomad #314']),
  )

  await page.goBack()
  await expect(page).not.toHaveURL(/q=Nomad/)
  await expectGridMatchesUrl(page)
})

test('do card ao detalhe e de volta à mesma busca', async ({ page }) => {
  await page.goto('/?q=Emerald')
  await expectGridMatchesUrl(page)

  await page
    .locator('#catalogo li a')
    .filter({ hasText: 'Emerald Ape #042' })
    .click()

  await expect(page).toHaveURL(/\/nft\/emerald-ape-042/)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Emerald Ape #042' }).first(),
  ).toBeVisible()

  await page.goBack()
  await expect(page).toHaveURL(/q=Emerald/)
  await expectGridMatchesUrl(page)
})

test('acesso direto ao detalhe', async ({ page }) => {
  await page.goto('/nft/emerald-ape-042')

  await expect(
    page.getByRole('heading', { level: 1, name: 'Emerald Ape #042' }).first(),
  ).toBeVisible()
  await expect(page).toHaveTitle(/Emerald Ape #042/)
})

test('NFT inexistente mostra o aviso e o caminho de volta', async ({
  page,
}) => {
  await page.goto('/nft/nao-existe')

  await expect(
    page.getByRole('heading', { level: 1, name: 'NFT não encontrado' }),
  ).toBeVisible()

  await page.getByRole('link', { name: 'Voltar para o início' }).click()
  await expect(page).toHaveURL(/\/(\?.*)?$/)
})
