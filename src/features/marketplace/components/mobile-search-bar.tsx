import { Search, SlidersHorizontal } from 'lucide-react'
import { MOBILE_SEARCH_PLACEHOLDER } from '../constants/mobile'

type MobileSearchBarProps = {
  onOpenFilters: () => void
}

export function MobileSearchBar({ onOpenFilters }: MobileSearchBarProps) {
  return (
    <div className="flex items-center gap-2 md:hidden">
      <div className="flex h-11.25 min-w-0 flex-1 items-center gap-3 rounded-lg bg-surface-card px-3">
        <Search className="size-5 shrink-0 text-text-secondary" />
        <label htmlFor="catalog-search" className="sr-only">
          Buscar NFTs e coleções
        </label>
        <input
          id="catalog-search"
          type="search"
          placeholder={MOBILE_SEARCH_PLACEHOLDER}
          className="min-w-0 flex-1 bg-transparent text-15 font-bold text-foreground outline-none placeholder:font-bold placeholder:text-foreground"
        />
      </div>

      <button
        type="button"
        onClick={onOpenFilters}
        aria-label="Abrir filtros"
        className="flex size-11.25 shrink-0 items-center justify-center rounded-[9px] bg-primary text-ink"
      >
        <SlidersHorizontal className="size-5.5" />
      </button>
    </div>
  )
}
