import { useState } from 'react'
import type { NftEditionId } from '@/global/type'

export function useNftPurchase(initialEdition: NftEditionId) {
  const [edition, setEdition] = useState(initialEdition)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  return {
    edition,
    quantity,
    isFavorite,
    changeEdition: setEdition,
    increase: () => setQuantity((current) => current + 1),
    decrease: () => setQuantity((current) => Math.max(1, current - 1)),
    toggleFavorite: () => setIsFavorite((current) => !current),
  }
}
