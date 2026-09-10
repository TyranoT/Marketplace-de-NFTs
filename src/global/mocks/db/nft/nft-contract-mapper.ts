import { ARTWORKS, ARTWORK_ATTRIBUTES } from '../../../data/artwork'
import { buildNftDetail } from '../../../data/build-nft-detail'
import { mockDb } from '../core'
import type { Nft } from '../../../type'
import type { NftDetailResource, NftListItem } from '../../../api/contracts/nft'

/**
 * Única classe que conhece o formato de wire do NFT.
 *
 * Junta três fontes que vivem separadas de propósito: o fixture (a obra, que
 * não muda), o preço corrente e a disponibilidade (estado de servidor), e a
 * revisão (que ordena os eventos).
 */
export class NftContractMapper {
  toListItem(nft: Nft): NftListItem {
    const artwork = ARTWORKS[nft.artworkKey]
    const revision = mockDb.nftRevision.findUnique({ where: { nftId: nft.id } })

    return {
      id: nft.id,
      name: nft.name,
      collection: nft.collection,
      categoryId: nft.categoryId,
      imageUrl: artwork.src,
      imageAlt: artwork.alt,
      price: { amount: this.priceOf(nft), currency: 'ETH' },
      secondaryPrice: nft.secondaryPrice,
      editionId: nft.edition,
      available: this.availableOf(nft),
      version: revision?.version ?? 1,
      updatedAt: revision?.updatedAt ?? new Date(0).toISOString(),
    }
  }

  toDetail(nft: Nft): NftDetailResource {
    /**
     * O texto autoral do detalhe continua vindo de `buildNftDetail`: é cópia
     * do Figma, não estado de servidor. Daqui saem só os campos que mudam.
     */
    const detail = buildNftDetail(nft)

    return {
      ...this.toListItem(nft),
      gallery: detail.gallery,
      about: detail.about,
      editions: detail.editions,
      metadata: detail.metadata,
      paragraphs: detail.paragraphs,
      network: detail.network,
      royalties: detail.royalties,
      contract: detail.contract,
      rating: detail.rating,
    }
  }

  /** Atributos da arte, usados pela busca por texto. */
  attributesOf(nft: Nft): Array<string> {
    return ARTWORK_ATTRIBUTES[nft.artworkKey]
  }

  /** O preço corrente vence o de lançamento — é ele que `nft.updated` muda. */
  priceOf(nft: Nft): string {
    return (
      mockDb.price.findUnique({ where: { nftId: nft.id } })?.amount ??
      nft.price.amount
    )
  }

  private availableOf(nft: Nft): number {
    return (
      mockDb.availability.findUnique({
        where: { nftId: nft.id, editionId: nft.edition },
      })?.units ?? 0
    )
  }
}

export const nftContractMapper = new NftContractMapper()
