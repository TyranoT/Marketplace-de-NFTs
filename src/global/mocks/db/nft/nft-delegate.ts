import { NFTS } from '../../../data/nfts'
import { ModelDelegate } from '../core/model-delegate'
import type { Nft } from '../../../type'

export type NftWhere = {
  id?: string
  collection?: string
}

/** Catálogo de obras. Fixture: só leitura. */
export class NftDelegate extends ModelDelegate<Nft, NftWhere> {
  protected list(): Array<Nft> {
    return NFTS
  }

  protected matches(nft: Nft, where: NftWhere): boolean {
    return (
      (!where.id || nft.id === where.id) &&
      (!where.collection || nft.collection === where.collection)
    )
  }
}
