import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { MOBILE_SEARCH_PLACEHOLDER } from '../constants/mobile'

/**
 * Espera antes de escrever a busca na URL. Sem isso, cada tecla viraria uma
 * entrada de histórico e uma consulta à rede.
 */
const DEBOUNCE_MS = 300

type MobileSearchBarProps = {
  value: string
  isFiltersOpen: boolean
  filtersDialogId: string
  onSearch: (term: string) => void
  onOpenFilters: () => void
}

export function MobileSearchBar({
  value,
  isFiltersOpen,
  filtersDialogId,
  onSearch,
  onOpenFilters,
}: MobileSearchBarProps) {
  const [draft, setDraft] = useState(value)

  /** A URL manda: voltar pelo histórico precisa reescrever o campo. */
  useEffect(() => {
    setDraft(value)
  }, [value])

  useEffect(() => {
    if (draft === value) return

    const timer = setTimeout(() => onSearch(draft), DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [draft, value, onSearch])

  return (
    <div className="sticky top-4 z-20 flex items-center gap-2 md:hidden">
      {/**
       * O foco é desenhado na cápsula: o input não tem borda própria, e o
       * `outline-none` dele deixava o foco invisível.
       */}
      <div className="flex h-11.25 min-w-0 flex-1 items-center gap-3 rounded-lg bg-surface-card px-3 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring">
        <Search className="size-5 shrink-0 text-text-secondary" />
        <label htmlFor="catalog-search" className="sr-only">
          Buscar NFTs e coleções
        </label>
        <input
          id="catalog-search"
          type="search"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={MOBILE_SEARCH_PLACEHOLDER}
          className="min-w-0 flex-1 bg-transparent text-15 font-bold text-foreground outline-none placeholder:font-bold placeholder:text-text-secondary"
        />
      </div>

      <button
        type="button"
        onClick={onOpenFilters}
        aria-label="Abrir filtros"
        aria-expanded={isFiltersOpen}
        aria-controls={filtersDialogId}
        className="flex size-11.25 shrink-0 items-center justify-center rounded-[9px] bg-primary bg-linear-120 from-line-soft to-brand text-ink"
      >
        <SlidersHorizontal className="size-5.5" />
      </button>
    </div>
  )
}
