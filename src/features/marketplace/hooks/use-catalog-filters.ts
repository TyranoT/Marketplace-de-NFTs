import { useState } from 'react'
import { DEFAULT_PRICE_RANGE } from '../constants/filters'
import type { PriceRange } from '../type'

function toggleId(current: Array<string>, id: string) {
  return current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id]
}

export function useCatalogFilters() {
  const [collections, setCollections] = useState<Array<string>>(['digital-art'])
  const [networks, setNetworks] = useState<Array<string>>([])
  const [priceRange, setPriceRange] = useState<PriceRange>(DEFAULT_PRICE_RANGE)

  return {
    collections,
    networks,
    priceRange,
    toggleCollection: (id: string) =>
      setCollections((current) => toggleId(current, id)),
    toggleNetwork: (id: string) =>
      setNetworks((current) => toggleId(current, id)),
    setPriceRange,
  }
}
