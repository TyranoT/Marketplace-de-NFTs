import type { Nft } from '../type'

/**
 * Fixtures do catálogo. `artworkKey` aponta para a arte em `artwork.ts`, de
 * onde `toNftSummary` resolve `imageUrl` e `imageAlt` — evita repetir src e
 * alt em cada registro e mantém os dois sempre em sincronia.
 */
export const NFTS: Array<Nft> = [
  {
    id: 'emerald-ape-042',
    name: 'Emerald Ape #042',
    price: '1.19 ETH',
    artworkKey: 'varsity',
    collection: 'Kurio Apes',
    edition: '1-50',
  },
  {
    id: 'sage-nomad-009',
    name: 'Sage Nomad #009',
    price: '1.69 ETH',
    artworkKey: 'headphones',
    collection: 'Kurio Apes',
    edition: '1-50',
  },
  {
    id: 'neon-vessel-552',
    name: 'Neon Vessel #552',
    price: '1.99 ETH',
    secondaryPrice: '2.29 ETH',
    artworkKey: 'turtleneck',
    collection: 'Kurio Apes',
    edition: '1-50',
  },
  {
    id: 'cosmic-bloom-118',
    name: 'Cosmic Bloom #118',
    price: '1.29 ETH',
    artworkKey: 'bucket',
    collection: 'Kurio Apes',
    edition: '1-50',
  },
  {
    id: 'violet-nomad-314',
    name: 'Violet Nomad #314',
    price: '1.39 ETH',
    artworkKey: 'varsity',
    collection: 'Kurio Apes',
    edition: '1-50',
  },
  {
    id: 'ivory-baron-088',
    name: 'Ivory Baron #088',
    price: '1.79 ETH',
    artworkKey: 'turtleneck',
    collection: 'Kurio Apes',
    edition: '1-50',
  },
  {
    id: 'golden-beat-207',
    name: 'Golden Beat #207',
    price: '0.99 ETH',
    artworkKey: 'headphones',
    collection: 'Kurio Apes',
    edition: '1-50',
  },
  {
    id: 'golden-signal-160',
    name: 'Golden Signal #160',
    price: '0.39 ETH',
    artworkKey: 'bucket',
    collection: 'Kurio Apes',
    edition: '1-50',
  },
]
