import { useNavigate, useSearch } from '@tanstack/react-router'
import { priceRangeOf } from '../helpers/catalog-search'
import type { CatalogSearch } from '../helpers/catalog-search'
import type { CatalogSortValue, CatalogTabKey, PriceRange } from '../type'

function toggleId(current: Array<string>, id: string): Array<string> {
  return current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id]
}

/** Lista vazia sai da URL: `?collection=` não significa nada. */
function orUndefined(ids: Array<string>): Array<string> | undefined {
  return ids.length > 0 ? ids : undefined
}

/**
 * O estado do catálogo, lido e escrito na URL.
 *
 * Substitui os dois `useState` que existiam antes (`use-catalog-filters` e
 * `use-catalog-view`): eles não sobreviviam a refresh nem ao botão voltar, e
 * também não filtravam nada de fato — o catálogo era uma fixture inteira
 * renderizada de uma vez.
 *
 * **Toda mudança de filtro volta para a página 1.** É regra explícita do
 * enunciado, e sem ela alguém na página 3 aplicaria um filtro com 4
 * resultados e veria uma tela vazia sem entender por quê.
 *
 * `replace: true` para o histórico não encher de um passo por tecla digitada
 * na busca; a navegação entre páginas é que merece entrada própria.
 */
export function useCatalogSearch() {
  const search = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })

  function update(patch: Partial<CatalogSearch>, resetPage = true) {
    void navigate({
      search: (current) => ({
        ...current,
        ...patch,
        ...(resetPage ? { page: 1 } : {}),
      }),
      replace: true,
    })
  }

  return {
    search,
    priceRange: priceRangeOf(search),

    setQuery: (q: string) => update({ q: q.trim() || undefined }),

    toggleCollection: (id: string) =>
      update({
        collection: orUndefined(toggleId(search.collection ?? [], id)),
      }),

    toggleNetwork: (id: string) =>
      update({ network: orUndefined(toggleId(search.network ?? [], id)) }),

    setPriceRange: ([min, max]: PriceRange) =>
      update({ minPrice: min, maxPrice: max }),

    changeTab: (tab: CatalogTabKey) => update({ tab }),
    changeSort: (sort: CatalogSortValue) => update({ sort }),

    /** Paginar não é filtrar: a página escolhida é a que deve valer. */
    changePage: (page: number) =>
      void navigate({
        search: (current) => ({ ...current, page }),
        replace: false,
      }),
  }
}
