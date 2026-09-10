import { useEffect, useState } from 'react'
import { Container } from '@/global/components/ui/container'
import { useNftList } from '@/global/api/nft'
import { PROMO_CARDS } from '../constants/promos'
import { CatalogFilters } from '../components/catalog-filters'
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
import type { PriceRange } from '../type'

export function HomeScreen() {
  const catalog = useCatalogSearch()
  const nfts = useNftList(toListQuery(catalog.search))

  /**
   * O intervalo do slider é local enquanto se arrasta e só vira URL ao
   * aplicar: escrever a cada pixel encheria o histórico e dispararia uma
   * consulta por quadro.
   */
  const [draftRange, setDraftRange] = useState<PriceRange>(catalog.priceRange)

  useEffect(() => {
    setDraftRange(catalog.priceRange)
  }, [catalog.priceRange[0], catalog.priceRange[1]])

  const items = (nfts.data?.items ?? []).map(toSummaryView)

  return (
    <Container
      as="main"
      className="flex flex-col gap-8 pt-4 md:gap-24 md:pt-10"
    >
      <MobileSearchBar
        value={catalog.search.q ?? ''}
        onSearch={catalog.setQuery}
        /** O painel de filtros do mobile ainda não existe; volta ao início
         *  da listagem, que é o que o botão já fazia antes. */
        onOpenFilters={() => catalog.changePage(1)}
      />
      <MobileHeroBanner />
      <Hero />

      <section className="flex flex-col gap-12 lg:flex-row">
        <aside
          aria-label="Filtros do catálogo"
          className="hidden shrink-0 flex-col gap-6 lg:flex lg:w-77.5"
        >
          <CatalogFilters
            collections={catalog.search.collection ?? []}
            networks={catalog.search.network ?? []}
            priceRange={draftRange}
            onToggleCollection={catalog.toggleCollection}
            onToggleNetwork={catalog.toggleNetwork}
            onPriceRangeChange={setDraftRange}
            onApplyPriceRange={() => catalog.setPriceRange(draftRange)}
          />

          <FeaturedBanner />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-22">
          <div className="flex w-full flex-col gap-8">
            <CatalogToolbar
              activeTab={catalog.search.tab}
              sort={catalog.search.sort}
              onTabChange={catalog.changeTab}
              onSortChange={catalog.changeSort}
            />

            {/**
             * Falha com dados em cache avisa sem apagar a grade — o mesmo
             * critério do carrinho. Sem nada em cache, a mensagem ocupa o
             * lugar da lista.
             */}
            {nfts.isError && !nfts.data ? (
              <CatalogError onRetry={() => void nfts.refetch()} />
            ) : (
              <NftGrid items={items} isLoading={nfts.isPending} />
            )}
          </div>

          {nfts.data && nfts.data.pageCount > 1 ? (
            <CatalogPagination
              page={nfts.data.page}
              pageCount={nfts.data.pageCount}
              onPageChange={catalog.changePage}
            />
          ) : null}
        </div>
      </section>

      <section
        aria-label="Destaques"
        className="hidden gap-7 lg:grid lg:grid-cols-2"
      >
        {PROMO_CARDS.map((promo) => (
          <PromoCard key={promo.id} promo={promo} />
        ))}
      </section>

      <JournalSection />
    </Container>
  )
}
