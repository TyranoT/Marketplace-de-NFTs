import { formatMoney } from '@/global/helpers/eth-amount'
import type { NftDetailResource } from '@/global/api/contracts/nft'
import type { NftDetail } from '@/global/type'

/**
 * Do contrato de rede para o modelo de exibição do detalhe.
 *
 * Mesma razão de `to-summary-view`: `Money` é o que precisa somar com
 * precisão, e formatar é papel da borda. `artwork` e `selectedEdition` são
 * os dois campos que a view nomeia de outro jeito — a imagem principal é a
 * mesma do card, e a edição escolhida nasce sendo a do catálogo.
 */
export function toDetailView(resource: NftDetailResource): NftDetail {
  return {
    id: resource.id,
    name: resource.name,
    price: formatMoney(resource.price),
    secondaryPrice:
      resource.secondaryPrice && formatMoney(resource.secondaryPrice),
    collection: resource.collection,
    artwork: { src: resource.imageUrl, alt: resource.imageAlt },
    gallery: resource.gallery,
    about: resource.about,
    editions: resource.editions,
    selectedEdition: resource.editionId,
    metadata: resource.metadata,
    paragraphs: resource.paragraphs,
    network: resource.network,
    royalties: resource.royalties,
    contract: resource.contract,
    rating: resource.rating,
  }
}
