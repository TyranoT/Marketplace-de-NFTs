import { CATALOG_PAGE_SIZE } from '../constants/catalog'
import type { NftSummary } from '@/global/type'
import { NftCardSkeleton } from './nft-card'
import { NftCardLink } from './nft-card-link'

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
    <ul className="grid grid-cols-2 gap-x-8 gap-y-8 max-lg:[&>li:nth-child(even)]:mt-8 lg:grid-cols-3 lg:gap-x-8">
      {items.map((item) => (
        <li key={item.id}>
          <NftCardLink nft={item} />
        </li>
      ))}
    </ul>
  )
}
