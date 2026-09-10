import { NFTS } from '../../../data/nfts'
import { ModelDelegate } from '../core/model-delegate'
import type { MockDbStore } from '../core/mock-db-store'
import type { NftEditionId } from '../../../type'

const UNITS_BY_EDITION: Record<NftEditionId, number> = {
  '1-1': 1,
  '1-10': 10,
  '1-50': 50,
  open: 999,
}

/**
 * Cenário determinístico de esgotamento: `golden-signal-160` fica com 2
 * unidades para que o conflito de disponibilidade seja reproduzível sem
 * depender de aleatoriedade.
 */
const SCARCE_UNITS: Record<string, number> = {
  'golden-signal-160': 2,
}

export type AvailabilityRecord = {
  nftId: string
  editionId: NftEditionId
  units: number
}

export type AvailabilityWhere = {
  nftId?: string
  editionId?: NftEditionId
}

export type AvailabilityWhereUnique = {
  nftId: string
  editionId: NftEditionId
}

export type AvailabilityUpdateInput = {
  units: number
}

/**
 * Disponibilidade por edição. Vive no servidor simulado, não no fixture do
 * catálogo: é estado que muda com a compra, e não uma característica da obra.
 */
export class AvailabilityDelegate extends ModelDelegate<
  AvailabilityRecord,
  AvailabilityWhere
> {
  constructor(private readonly store: MockDbStore) {
    super()
  }

  static seed(): Map<string, number> {
    return new Map(
      NFTS.map((nft) => [
        availabilityKey(nft.id, nft.edition),
        SCARCE_UNITS[nft.id] ?? UNITS_BY_EDITION[nft.edition],
      ]),
    )
  }

  update(args: {
    where: AvailabilityWhereUnique
    data: AvailabilityUpdateInput
  }): AvailabilityRecord {
    const { nftId, editionId } = args.where

    this.store
      .load()
      .availability.set(availabilityKey(nftId, editionId), args.data.units)

    return { nftId, editionId, units: args.data.units }
  }

  protected list(): Array<AvailabilityRecord> {
    return [...this.store.load().availability].map(([key, units]) => {
      const [nftId, editionId] = key.split(':')

      return { nftId, editionId: editionId as NftEditionId, units }
    })
  }

  protected matches(
    record: AvailabilityRecord,
    where: AvailabilityWhere,
  ): boolean {
    return (
      (!where.nftId || record.nftId === where.nftId) &&
      (!where.editionId || record.editionId === where.editionId)
    )
  }
}

/** Chave `${nftId}:${editionId}`, o formato guardado no snapshot. */
function availabilityKey(nftId: string, editionId: NftEditionId): string {
  return `${nftId}:${editionId}`
}
