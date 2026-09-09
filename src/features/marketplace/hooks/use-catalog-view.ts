import { useState } from 'react'
import { DEFAULT_CATALOG_SORT, DEFAULT_CATALOG_TAB } from '../constants/catalog'
import type { CatalogSortValue, CatalogTabKey } from '../type'

export function useCatalogView() {
  const [tab, setTab] = useState<CatalogTabKey>(DEFAULT_CATALOG_TAB)
  const [sort, setSort] = useState<CatalogSortValue>(DEFAULT_CATALOG_SORT)
  const [page, setPage] = useState(1)

  return {
    tab,
    sort,
    page,
    changeTab: (next: CatalogTabKey) => {
      setTab(next)
      setPage(1)
    },
    changeSort: (next: CatalogSortValue) => {
      setSort(next)
      setPage(1)
    },
    changePage: setPage,
  }
}
