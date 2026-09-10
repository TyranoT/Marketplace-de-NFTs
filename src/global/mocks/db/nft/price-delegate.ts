import { NFTS } from '../../../data/nfts'
import { ModelDelegate } from '../core/model-delegate'
import type { MockDbStore } from '../core/mock-db-store'

export type PriceRecord = {
  nftId: string
  /** String decimal, como no wire. A conversão para wei é de quem consome. */
  amount: string
}

export type PriceWhere = {
  nftId?: string
}

/**
 * Preço corrente de cada NFT. Separado do catálogo porque é o valor que muda
 * com `nft.updated`, enquanto o fixture guarda o preço de lançamento.
 */
export class PriceDelegate extends ModelDelegate<PriceRecord, PriceWhere> {
  constructor(private readonly store: MockDbStore) {
    super()
  }

  static seed(): Map<string, string> {
    return new Map(NFTS.map((nft) => [nft.id, nft.price.amount]))
  }

  protected list(): Array<PriceRecord> {
    return [...this.store.load().prices].map(([nftId, amount]) => ({
      nftId,
      amount,
    }))
  }

  protected matches(record: PriceRecord, where: PriceWhere): boolean {
    return !where.nftId || record.nftId === where.nftId
  }
}
