import { SlidersHorizontal } from 'lucide-react'
import { cn } from '@/global/helpers/cn'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/global/components/ui/select'
import { CATALOG_SORT_OPTIONS, CATALOG_TABS } from '../constants/catalog'
import type { CatalogSortValue, CatalogTabKey } from '../type'

type CatalogToolbarProps = {
  activeTab: CatalogTabKey
  sort: CatalogSortValue
  onTabChange: (tab: CatalogTabKey) => void
  onSortChange: (sort: CatalogSortValue) => void
  filtersDialogId?: string
  isFiltersOpen?: boolean
  onOpenFilters?: () => void
}

export function CatalogToolbar({
  activeTab,
  sort,
  onTabChange,
  onSortChange,
  filtersDialogId,
  isFiltersOpen = false,
  onOpenFilters,
}: CatalogToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
      <div
        role="group"
        aria-label="Filtrar catálogo"
        className="flex items-start gap-2.5 md:gap-5"
      >
        {CATALOG_TABS.map(({ key, label }) => {
          const isActive = key === activeTab

          return (
            <button
              key={key}
              type="button"
              aria-pressed={isActive}
              onClick={() => onTabChange(key)}
              className={cn(
                'relative text-14 leading-4 font-medium whitespace-nowrap md:text-15',
                isActive ? 'text-highlight' : 'text-foreground',
              )}
            >
              {label}
              {isActive ? (
                <span className="absolute top-4.25 right-0 left-0 h-0.5 bg-primary md:top-5.75" />
              ) : null}
            </button>
          )
        })}
      </div>

      {onOpenFilters ? (
        /**
         * Entre o mobile e o desktop não havia como filtrar: a busca do
         * mobile, que abre o diálogo, some a partir do `md`, e a lateral só
         * aparece no `lg`. Este botão cobre o intervalo — o teste do
         * catálogo no tablet é que mostrou.
         */
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isFiltersOpen}
          aria-controls={filtersDialogId}
          onClick={onOpenFilters}
          className="hidden items-center gap-2 rounded-md border border-line px-3 py-1.5 text-15 text-foreground md:inline-flex lg:hidden"
        >
          <SlidersHorizontal aria-hidden="true" className="size-4" />
          Abrir filtros
        </button>
      ) : null}

      <div className="ml-auto hidden shrink-0 items-center gap-1 md:flex">
        <label
          htmlFor="catalog-sort"
          className="text-15 text-foreground whitespace-nowrap"
        >
          Ordenar por:
        </label>
        <Select
          value={sort}
          onValueChange={(value) => onSortChange(value as CatalogSortValue)}
        >
          <SelectTrigger
            id="catalog-sort"
            className="h-auto min-w-30 shrink-0 border-0 bg-transparent pl-2 pr-0 text-15 text-foreground shadow-none"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {CATALOG_SORT_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value} className="text-15">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
