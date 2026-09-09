import { Container } from '@/global/components/ui/container'
import { CATALOG_PAGE_COUNT } from '../constants/catalog'
import { NFT_FIXTURES } from '../constants/nft-fixtures'
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
import { MobileTabBar } from '../components/mobile-tab-bar'
import { NftGrid } from '../components/nft-grid'
import { useCatalogFilters } from '../hooks/use-catalog-filters'
import { useCatalogView } from '../hooks/use-catalog-view'

export function HomeScreen() {
  const view = useCatalogView()
  const filters = useCatalogFilters()

  return (
    <Container
      as="main"
      className="flex flex-col gap-8 pt-4 md:gap-24 md:pt-10"
    >
      <MobileSearchBar onOpenFilters={() => view.changePage(1)} />
      <MobileHeroBanner />
      <Hero />

      <section className="flex flex-col gap-12 lg:flex-row">
        <aside
          aria-label="Filtros do catálogo"
          className="hidden shrink-0 flex-col gap-6 lg:flex lg:w-77.5"
        >
          <CatalogFilters
            collections={filters.collections}
            networks={filters.networks}
            priceRange={filters.priceRange}
            onToggleCollection={filters.toggleCollection}
            onToggleNetwork={filters.toggleNetwork}
            onPriceRangeChange={filters.setPriceRange}
            onApplyPriceRange={() => view.changePage(1)}
          />

          <FeaturedBanner />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-22">
          <div className="flex flex-col gap-8 w-full">
            <CatalogToolbar
              activeTab={view.tab}
              sort={view.sort}
              onTabChange={view.changeTab}
              onSortChange={view.changeSort}
            />
            <NftGrid items={NFT_FIXTURES} />
          </div>

          <CatalogPagination
            page={view.page}
            pageCount={CATALOG_PAGE_COUNT}
            onPageChange={view.changePage}
          />
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

      <MobileTabBar />
    </Container>
  )
}
