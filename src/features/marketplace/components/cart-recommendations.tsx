import { useNftList } from '@/global/api/nft'
import { RELATED_LIMIT } from '@/global/data/nft-detail-defaults'
import { toSummaryView } from '../helpers/to-summary-view'
import { NftRelatedSection } from './nft-related-section'

type CartRecommendationsProps = {
  heading: string
  headingId?: string
}

/**
 * A vitrine do carrinho, pela rede.
 *
 * Envolve `NftRelatedSection` em vez de o carrinho consultar direto: a
 * feature de carrinho não deve conhecer as chaves de consulta do catálogo,
 * e a regra "os últimos listados" pertence a quem é dono do catálogo.
 */
export function CartRecommendations({
  heading,
  headingId,
}: CartRecommendationsProps) {
  const nfts = useNftList({ sort: 'recent', page: 1, pageSize: RELATED_LIMIT })

  return (
    <NftRelatedSection
      items={(nfts.data?.items ?? []).map(toSummaryView)}
      heading={heading}
      headingId={headingId}
    />
  )
}
