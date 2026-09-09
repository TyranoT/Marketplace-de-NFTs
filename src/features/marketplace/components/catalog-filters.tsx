import { COLLECTION_FILTERS, NETWORK_FILTERS } from '../constants/filters'
import type { PriceRange } from '../type'
import { FilterOptionList } from './filter-option-list'
import { FilterSection } from './filter-section'
import { PriceRangeFilter } from './price-range-filter'

type CatalogFiltersProps = {
  collections: Array<string>
  networks: Array<string>
  priceRange: PriceRange
  onToggleCollection: (id: string) => void
  onToggleNetwork: (id: string) => void
  onPriceRangeChange: (range: PriceRange) => void
  onApplyPriceRange: () => void
}

export function CatalogFilters({
  collections,
  networks,
  priceRange,
  onToggleCollection,
  onToggleNetwork,
  onPriceRangeChange,
  onApplyPriceRange,
}: CatalogFiltersProps) {
  return (
    <div className="flex w-full flex-col gap-10 bg-surface-card p-5">
      <FilterSection title="Coleções">
        <FilterOptionList
          name="collection"
          options={COLLECTION_FILTERS}
          selected={collections}
          onToggle={onToggleCollection}
        />
      </FilterSection>

      <FilterSection title="Faixa de preço">
        <PriceRangeFilter
          range={priceRange}
          onRangeChange={onPriceRangeChange}
          onApply={onApplyPriceRange}
        />
      </FilterSection>

      <FilterSection title="Rede">
        <FilterOptionList
          name="network"
          options={NETWORK_FILTERS}
          selected={networks}
          onToggle={onToggleNetwork}
        />
      </FilterSection>
    </div>
  )
}
