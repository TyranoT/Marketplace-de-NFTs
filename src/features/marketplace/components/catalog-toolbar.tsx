import { cn } from 'cn'
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
}

export function CatalogToolbar({
  activeTab,
  sort,
  onTabChange,
  onSortChange,
}: CatalogToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div
        role="group"
        aria-label="Filtrar catálogo"
        className="flex items-start gap-5"
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
                'relative text-15 leading-4 font-medium whitespace-nowrap',
                isActive ? 'text-highlight' : 'text-foreground',
              )}
            >
              {label}
              {isActive ? (
                <span className="absolute top-[23px] right-0 left-0 h-0.5 bg-primary" />
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-1">
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
            className="h-auto border-0 bg-transparent px-0 text-15 text-foreground shadow-none"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATALOG_SORT_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
