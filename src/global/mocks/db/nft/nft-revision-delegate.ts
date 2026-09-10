import { NFTS } from '../../../data/nfts'
import { ModelDelegate } from '../core/model-delegate'
import type { MockDbStore } from '../core/mock-db-store'

/** Instante da semente. Fixo, para o banco-semente ser igual a si mesmo. */
const EPOCH = new Date(0).toISOString()

const INITIAL_VERSION = 1

export type NftRevisionRecord = {
  nftId: string
  version: number
  updatedAt: string
}

export type NftRevisionWhere = {
  nftId?: string
}

/**
 * Versão de cada NFT — uma só, cobrindo preço e disponibilidade.
 *
 * O recurso que o evento `nft.updated` anuncia é o NFT, não o preço nem o
 * estoque isoladamente: duas versões separadas obrigariam o cliente a
 * decidir qual delas ordena o evento. Com uma, a regra de descarte é uma
 * comparação só.
 */
export class NftRevisionDelegate extends ModelDelegate<
  NftRevisionRecord,
  NftRevisionWhere
> {
  constructor(private readonly store: MockDbStore) {
    super()
  }

  static seed(): Map<string, NftRevisionRecord> {
    return new Map(
      NFTS.map((nft) => [
        nft.id,
        { nftId: nft.id, version: INITIAL_VERSION, updatedAt: EPOCH },
      ]),
    )
  }

  /** Sobe a versão do NFT. Chamado por toda escrita de preço ou estoque. */
  bump(nftId: string): NftRevisionRecord {
    const { revisions } = this.store.load()
    const current = revisions.get(nftId)

    const next: NftRevisionRecord = {
      nftId,
      version: (current?.version ?? INITIAL_VERSION) + 1,
      updatedAt: new Date().toISOString(),
    }

    revisions.set(nftId, next)

    return next
  }

  versionOf(nftId: string): number {
    return this.store.load().revisions.get(nftId)?.version ?? INITIAL_VERSION
  }

  protected list(): Array<NftRevisionRecord> {
    return [...this.store.load().revisions.values()]
  }

  protected matches(
    record: NftRevisionRecord,
    where: NftRevisionWhere,
  ): boolean {
    return !where.nftId || record.nftId === where.nftId
  }
}
