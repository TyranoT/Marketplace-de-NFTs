import { NFTS } from '../../data/nfts'
import { availabilityKey } from './schema'
import type { NftEditionId } from '../../type'

/**
 * Disponibilidade por edição. Vive no servidor simulado, não no fixture do
 * catálogo: é estado que muda com a compra, e não uma característica da obra.
 */
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
const SCARCE: Record<string, number> = {
  'golden-signal-160': 2,
}

export function buildAvailability(): Record<string, number> {
  return Object.fromEntries(
    NFTS.map((nft) => [
      availabilityKey(nft.id, nft.edition),
      SCARCE[nft.id] ?? UNITS_BY_EDITION[nft.edition],
    ]),
  )
}
