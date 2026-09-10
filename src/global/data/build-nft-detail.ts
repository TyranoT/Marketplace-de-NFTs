import { formatMoney } from '../helpers/eth-amount'
import { ARTWORKS, ARTWORK_ATTRIBUTES } from './artwork'
import {
  CATALOG_CONTRACT,
  CATALOG_NETWORK,
  CATALOG_ROYALTIES,
  DEFAULT_RATING,
  GALLERY_SIZE,
  NFT_EDITIONS,
} from './nft-detail-defaults'
import { NFT_DETAIL_OVERRIDES } from './nft-detail-overrides'
import { toTokenId } from './to-token-id'
import type { Nft, NftDetail, NftFact } from '../type'

function buildMetadata(nft: Nft): Array<NftFact> {
  const tokenId = toTokenId(nft.name)

  return [
    ...(tokenId ? [{ label: 'ID do token', value: tokenId }] : []),
    { label: 'Coleção', value: nft.collection },
    {
      label: 'Atributos',
      value: ARTWORK_ATTRIBUTES[nft.artworkKey].join(', '),
    },
  ]
}

function editionLabel(nft: Nft) {
  return NFT_EDITIONS.find(({ id }) => id === nft.edition)?.label ?? ''
}

function buildParagraphs(nft: Nft): Array<string> {
  return [
    `${nft.name} é uma obra digital ${editionLabel(nft)} finalizada à mão da coleção ${nft.collection}. Cada atributo fica armazenado nos metadados do token e verificado na Ethereum.`,
    'A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede.',
  ]
}

export function buildNftDetail(nft: Nft): NftDetail {
  const artwork = ARTWORKS[nft.artworkKey]

  const derived: NftDetail = {
    id: nft.id,
    name: nft.name,
    price: formatMoney(nft.price),
    secondaryPrice: nft.secondaryPrice && formatMoney(nft.secondaryPrice),
    collection: nft.collection,
    artwork,
    gallery: Array.from({ length: GALLERY_SIZE }, () => artwork),
    about: `Um colecionável digital da coleção ${nft.collection}, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.`,
    editions: NFT_EDITIONS,
    selectedEdition: nft.edition,
    metadata: buildMetadata(nft),
    paragraphs: buildParagraphs(nft),
    network: CATALOG_NETWORK,
    royalties: CATALOG_ROYALTIES,
    contract: CATALOG_CONTRACT,
    rating: DEFAULT_RATING,
  }

  return { ...derived, ...NFT_DETAIL_OVERRIDES[nft.id] }
}
