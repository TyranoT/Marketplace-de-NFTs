import { CATALOG_PAGE_SIZE } from '../constants/catalog'
import type { NftSummary } from '@/global/type'
import { NftCardSkeleton } from './nft-card'
import { NftCardLink } from './nft-card-link'

type NftGridProps = {
  items: Array<NftSummary>
  isLoading?: boolean
  /** Revalidação com a grade anterior ainda na tela (`keepPreviousData`). */
  isFetching?: boolean
}

/**
 * A grade não anuncia nada sozinha: carregamento, contagem e resultado vazio
 * saem de uma região viva única na tela do catálogo. Anunciar daqui também
 * faria o leitor de tela ouvir duas vezes a mesma mudança.
 */
export function NftGrid({
  items,
  isLoading = false,
  isFetching = false,
}: NftGridProps) {
  if (isLoading) {
    return (
      <div
        aria-hidden="true"
        className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 lg:gap-x-8.5"
      >
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
    <ul
      aria-busy={isFetching || undefined}
      className="grid grid-cols-2 gap-x-8 gap-y-8 max-lg:[&>li:nth-child(even)]:mt-8 lg:grid-cols-3 lg:gap-x-8"
    >
      {items.map((item) => (
        <li key={item.id}>
          <NftCardLink nft={item} />
        </li>
      ))}
    </ul>
  )
}
