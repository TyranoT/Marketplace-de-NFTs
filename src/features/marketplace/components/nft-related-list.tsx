import { useNftList } from '@/global/api/nft'
import { RELATED_LIMIT } from '@/global/data/nft-detail-defaults'
import { toSummaryView } from '../helpers/to-summary-view'
import { NftRelatedSection } from './nft-related-section'
import type { NftCategoryId } from '@/global/type'

type NftRelatedListProps = {
  categoryId: NftCategoryId
  /** O próprio NFT não aparece entre os "mais desta coleção". */
  excludeId: string
}

export function NftRelatedList({ categoryId, excludeId }: NftRelatedListProps) {
  const nfts = useNftList({
    collection: [categoryId],
    exclude: excludeId,
    page: 1,
    pageSize: RELATED_LIMIT,
  })

  return (
    <NftRelatedSection items={(nfts.data?.items ?? []).map(toSummaryView)} />
  )
}
