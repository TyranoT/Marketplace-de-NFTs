import { Container } from '@/global/components/ui/container'
import { CATALOG_PAGE_COUNT } from '../constants/catalog'
import { NFT_FIXTURES } from '../constants/nft-fixtures'
import { CatalogFilters } from '../components/catalog-filters'
import { CatalogPagination } from '../components/catalog-pagination'
import { CatalogToolbar } from '../components/catalog-toolbar'
import { Hero } from '../components/hero'
import { NftGrid } from '../components/nft-grid'
import { useCatalogFilters } from '../hooks/use-catalog-filters'
import { useCatalogView } from '../hooks/use-catalog-view'

export function HomeScreen() {
  const view = useCatalogView()
  const filters = useCatalogFilters()

  return (
    <Container as="main" className="flex flex-col gap-16 pt-10">
      <Hero />

      <section className="flex flex-col gap-12 lg:flex-row">
        <aside
          aria-label="Filtros do catálogo"
          className="hidden shrink-0 lg:block lg:w-[310px]"
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
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <CatalogToolbar
            activeTab={view.tab}
            sort={view.sort}
            onTabChange={view.changeTab}
            onSortChange={view.changeSort}
          />

          <NftGrid items={NFT_FIXTURES} />

          <CatalogPagination
            page={view.page}
            pageCount={CATALOG_PAGE_COUNT}
            onPageChange={view.changePage}
          />
        </div>
      </section>
    </Container>
  )
}
