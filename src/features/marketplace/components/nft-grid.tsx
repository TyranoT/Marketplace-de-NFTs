import { CATALOG_PAGE_SIZE } from '../constants/catalog'
import type { NftSummary } from '../type'
import { NftCard, NftCardSkeleton } from './nft-card'

type NftGridProps = {
  items: Array<NftSummary>
  isLoading?: boolean
}

export function NftGrid({ items, isLoading = false }: NftGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 lg:gap-x-8.5">
        {Array.from({ length: CATALOG_PAGE_SIZE }, (_, index) => (
          <NftCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <p className="py-20 text-center text-15 text-text-secondary">
        Nenhum NFT encontrado com os filtros selecionados.
      </p>
    )
  }

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 max-lg:[&>li:nth-child(even)]:mt-8 lg:grid-cols-3 lg:gap-x-8.5">
      {items.map((item) => (
        <li key={item.id}>
          <NftCard
            name={item.name}
            price={item.price}
            secondaryPrice={item.secondaryPrice}
            imageUrl={item.imageUrl}
            imageAlt={item.imageAlt}
          />
        </li>
      ))}
    </ul>
  )
}
