import { useEffect, useId, useRef, useState } from 'react'
import { Container } from '@/global/components/ui/container'
import { useNftList } from '@/global/api/nft'
import { PROMO_CARDS } from '../constants/promos'
import { CatalogFilters } from '../components/catalog-filters'
import { CatalogFiltersDialog } from '../components/catalog-filters-dialog'
import { CatalogPagination } from '../components/catalog-pagination'
import { CatalogToolbar } from '../components/catalog-toolbar'
import { FeaturedBanner } from '../components/featured-banner'
import { PromoCard } from '../components/promo-card'
import { Hero } from '../components/hero'
import { JournalSection } from '../components/journal-section'
import { MobileHeroBanner } from '../components/mobile-hero-banner'
import { MobileSearchBar } from '../components/mobile-search-bar'
import { NftGrid } from '../components/nft-grid'
import { CatalogError } from '../components/catalog-error'
import { toListQuery } from '../helpers/catalog-search'
import { toSummaryView } from '../helpers/to-summary-view'
import { useCatalogSearch } from '../hooks/use-catalog-search'
import type { NftListResponse } from '@/global/api/contracts/nft'
import type { PriceRange } from '../type'

/** O que a região viva do catálogo diz sobre o estado da consulta. */
function describeResults(
  data: NftListResponse | undefined,
  isPending: boolean,
): string {
  if (isPending) return 'Carregando NFTs…'
  if (!data) return ''
  if (data.total === 0)
    return 'Nenhum NFT encontrado com os filtros selecionados.'

  return data.total === 1
    ? '1 NFT encontrado.'
    : `${data.total} NFTs encontrados.`
}

export function HomeScreen() {
  const catalog = useCatalogSearch()
  const nfts = useNftList(toListQuery(catalog.search))

  const filtersDialogId = useId()
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  /**
   * O intervalo do slider é local enquanto se arrasta e só vira URL ao
   * aplicar: escrever a cada pixel encheria o histórico e dispararia uma
   * consulta por quadro.
   */
  const [draftRange, setDraftRange] = useState<PriceRange>(catalog.priceRange)

  useEffect(() => {
    setDraftRange(catalog.priceRange)
  }, [catalog.priceRange[0], catalog.priceRange[1]])

  /**
   * Trocar de página leva o foco ao título da grade. O link de paginação
   * fica lá embaixo; sem isto, quem usa teclado ou leitor de tela
   * continuava no rodapé da página nova, sem saber que a lista mudou.
   */
  const headingRef = useRef<HTMLHeadingElement>(null)
  const previousPage = useRef(catalog.search.page)

  useEffect(() => {
    if (catalog.search.page === previousPage.current) return

    previousPage.current = catalog.search.page
    headingRef.current?.focus()
  }, [catalog.search.page])

  const items = (nfts.data?.items ?? []).map(toSummaryView)

  const filters = (
    <CatalogFilters
      collections={catalog.search.collection ?? []}
      networks={catalog.search.network ?? []}
      priceRange={draftRange}
      onToggleCollection={catalog.toggleCollection}
      onToggleNetwork={catalog.toggleNetwork}
      onPriceRangeChange={setDraftRange}
      onApplyPriceRange={() => catalog.setPriceRange(draftRange)}
    />
  )

  return (
    <Container
      as="main"
      className="flex flex-col gap-8 pt-4 md:gap-24 md:pt-10"
    >
      <MobileSearchBar
        value={catalog.search.q ?? ''}
        isFiltersOpen={isFiltersOpen}
        filtersDialogId={filtersDialogId}
        onSearch={catalog.setQuery}
        onOpenFilters={() => setIsFiltersOpen(true)}
      />

      <CatalogFiltersDialog
        id={filtersDialogId}
        open={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
      >
        {filters}
      </CatalogFiltersDialog>

      <MobileHeroBanner />
      <Hero />

      {/**
       * `id="catalogo"` é o destino dos CTAs e do "Mercado" da navegação. O
       * heading não aparece — o frame não tem título aqui —, mas sem ele
       * quem navega por títulos não encontrava a grade. Ele também recebe o
       * foco quando a página muda (`tabIndex={-1}`).
       */}
      <section
        id="catalogo"
        aria-labelledby="catalogo-heading"
        className="flex scroll-mt-24 flex-col gap-12 lg:flex-row"
      >
        <h2
          ref={headingRef}
          id="catalogo-heading"
          tabIndex={-1}
          className="sr-only"
        >
          Catálogo de NFTs
        </h2>

        {/**
         * O banner fica na mesma coluna, mas fora da `<aside>` de filtros:
         * dentro dela, uma oferta promocional era anunciada como parte dos
         * filtros.
         */}
        <div className="hidden shrink-0 flex-col gap-6 lg:flex lg:w-77.5">
          <aside aria-label="Filtros do catálogo">{filters}</aside>
          <FeaturedBanner />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-22">
          <div className="flex w-full flex-col gap-8">
            <CatalogToolbar
              activeTab={catalog.search.tab}
              sort={catalog.search.sort}
              onTabChange={catalog.changeTab}
              onSortChange={catalog.changeSort}
            />

            {/**
             * Uma região viva só, sempre montada, para carregamento,
             * contagem e resultado vazio. Montá-la junto com a mensagem faria
             * o leitor de tela perder o primeiro anúncio.
             */}
            <p role="status" className="sr-only">
              {describeResults(nfts.data, nfts.isPending)}
            </p>

            {/**
             * Falha com dados em cache avisa sem apagar a grade — o mesmo
             * critério do carrinho. Sem nada em cache, a mensagem ocupa o
             * lugar da lista.
             */}
            {nfts.isError && !nfts.data ? (
              <CatalogError onRetry={() => void nfts.refetch()} />
            ) : (
              <NftGrid
                items={items}
                isLoading={nfts.isPending}
                isFetching={nfts.isFetching}
              />
            )}
          </div>

          {nfts.data && nfts.data.pageCount > 1 ? (
            <CatalogPagination
              page={nfts.data.page}
              pageCount={nfts.data.pageCount}
            />
          ) : null}
        </div>
      </section>

      <section
        aria-labelledby="destaques-heading"
        className="hidden gap-7 lg:grid lg:grid-cols-2"
      >
        <h2 id="destaques-heading" className="sr-only">
          Destaques
        </h2>
        {PROMO_CARDS.map((promo) => (
          <PromoCard key={promo.id} promo={promo} />
        ))}
      </section>

      <JournalSection />
    </Container>
  )
}
