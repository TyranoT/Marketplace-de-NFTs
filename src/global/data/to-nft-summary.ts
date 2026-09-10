import { formatMoney } from '../helpers/eth-amount'
import { ARTWORKS } from './artwork'
import type { Nft, NftSummary } from '../type'

export function toNftSummary(nft: Nft): NftSummary {
  const artwork = ARTWORKS[nft.artworkKey]

  return {
    id: nft.id,
    name: nft.name,
    price: formatMoney(nft.price),
    secondaryPrice: nft.secondaryPrice && formatMoney(nft.secondaryPrice),
    imageUrl: artwork.src,
    imageAlt: artwork.alt,
  }
}
