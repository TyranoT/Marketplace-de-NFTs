import { NFT_EDITIONS } from '../../data/nft-detail-defaults'
import { mockDb } from '../db'
import { realtimeServer } from './realtime-server'
import type { NftListItem } from '../../api/contracts/nft'
import type { NftEditionAvailability } from '../../api/contracts/realtime'

/**
 * Monta e emite `nft.updated`.
 *
 * **Só pode ser chamado depois que `$transaction` retornou.** A transação
 * desfaz o que já tinha mudado quando uma regra recusa no meio do caminho;
 * emitir de dentro anunciaria uma mudança que não aconteceu, e o cliente
 * passaria a mostrar um preço que o servidor não tem.
 */
export function emitNftUpdated(item: NftListItem): void {
  realtimeServer.emitNftUpdated({
    id: crypto.randomUUID(),
    resource: `nft:${item.id}`,
    version: item.version,
    emittedAt: new Date().toISOString(),
    /** O catálogo é público: preço e disponibilidade valem para todos. */
    scope: null,
    nftId: item.id,
    price: item.price,
    editions: editionsOf(item.id),
  })
}

function editionsOf(nftId: string): Array<NftEditionAvailability> {
  return NFT_EDITIONS.flatMap(({ id }) => {
    const record = mockDb.availability.findUnique({
      where: { nftId, editionId: id },
    })

    return record ? [{ editionId: id, available: record.units }] : []
  })
}
