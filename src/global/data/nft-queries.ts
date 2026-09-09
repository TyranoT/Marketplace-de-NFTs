import { buildNftDetail } from './build-nft-detail'
import { RELATED_LIMIT } from './nft-detail-defaults'
import { NFTS } from './nfts'
import { toNftSummary } from './to-nft-summary'
import type { NftDetail, NftSummary } from '../type'

const NFT_BY_ID = new Map(NFTS.map((nft) => [nft.id, nft]))

export function getNftSummaries(): Array<NftSummary> {
  return NFTS.map(toNftSummary)
}

/** Devolve undefined em vez de lançar: quem decide o 404 é a rota. */
export function getNftById(id: string): NftDetail | undefined {
  const nft = NFT_BY_ID.get(id)

  return nft ? buildNftDetail(nft) : undefined
}

export function getRelatedNfts(
  id: string,
  limit: number = RELATED_LIMIT,
): Array<NftSummary> {
  const current = NFT_BY_ID.get(id)

  if (!current) return []

  /**
   * `slice(-limit)` e não `slice(0, limit)`: em "Mais desta coleção" o Figma
   * mostra os 5 últimos itens da coleção, não os 5 primeiros.
   */
  return NFTS.filter(
    (nft) => nft.id !== id && nft.collection === current.collection,
  )
    .slice(-limit)
    .map(toNftSummary)
}
