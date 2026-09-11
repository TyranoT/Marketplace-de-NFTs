import { useId } from 'react'
import { COLLECTION_FILTERS, NETWORK_FILTERS } from '../constants/filters'
import { FilterOptionList } from './filter-option-list'
import { FilterSection } from './filter-section'
import { PriceRangeFilter } from './price-range-filter'
import type { PriceRange } from '../type'

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
  /** Uma instância por lugar em que os filtros aparecem: lateral e diálogo. */
  const baseId = useId()
  const collectionsId = `${baseId}-collections`
  const priceId = `${baseId}-price`
  const networksId = `${baseId}-networks`

  return (
    <div className="flex w-full flex-col gap-10 bg-surface-card p-5">
      <FilterSection title="Coleções" headingId={collectionsId}>
        <FilterOptionList
          name="collection"
          labelledBy={collectionsId}
          idPrefix={baseId}
          options={COLLECTION_FILTERS}
          selected={collections}
          onToggle={onToggleCollection}
        />
      </FilterSection>

      <FilterSection title="Faixa de preço" headingId={priceId}>
        <PriceRangeFilter
          range={priceRange}
          onRangeChange={onPriceRangeChange}
          onApply={onApplyPriceRange}
        />
      </FilterSection>

      <FilterSection title="Rede" headingId={networksId}>
        <FilterOptionList
          name="network"
          labelledBy={networksId}
          idPrefix={baseId}
          options={NETWORK_FILTERS}
          selected={networks}
          onToggle={onToggleNetwork}
        />
      </FilterSection>
    </div>
  )
}
