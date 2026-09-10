import { NFTS } from '../../data/nfts'
import { buildAvailability } from './availability'
import { SEED_VERSION } from './schema'
import type { MockDb } from './schema'

/**
 * Cenário conhecido do carrinho, idêntico ao frame do Figma: três itens com
 * quantidades 2, 6 e 9, cujo subtotal fecha em 26.83 ETH. Manter a paridade
 * com o design é o que permite usar a tela como baseline de regressão visual.
 */
const SEED_ITEMS = [
  { nftId: 'emerald-ape-042', quantity: 2 },
  { nftId: 'violet-nomad-314', quantity: 6 },
  { nftId: 'ivory-baron-088', quantity: 9 },
]

export function buildSeedDb(): MockDb {
  const byId = new Map(NFTS.map((nft) => [nft.id, nft]))

  return {
    seedVersion: SEED_VERSION,
    cart: {
      id: 'cart-guest',
      version: 1,
      updatedAt: new Date(0).toISOString(),
      items: SEED_ITEMS.flatMap(({ nftId, quantity }) => {
        const nft = byId.get(nftId)

        if (!nft) return []

        return [
          { id: `item-${nftId}`, nftId, editionId: nft.edition, quantity },
        ]
      }),
    },
    availability: buildAvailability(),
    prices: Object.fromEntries(NFTS.map((nft) => [nft.id, nft.price.amount])),
  }
}
