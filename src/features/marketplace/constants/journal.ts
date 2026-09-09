import { ARTWORKS } from '@/global/data/artwork'
import type { JournalPost } from '../type'

export const JOURNAL_SECTION = {
  title: 'Diário da Cunhagem',
  subtitle:
    'Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.',
}

export const JOURNAL_POSTS: Array<JournalPost> = [
  {
    id: 'nft-ownership',
    date: '12 de setembro',
    readTime: 'Leitura de 6 min',
    title: 'Como funciona a propriedade de NFTs',
    excerpt: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
    cta: 'Ler mais',
    artwork: ARTWORKS.turtleneck,
  },
  {
    id: 'artists-to-watch',
    date: '13 de setembro',
    readTime: 'Leitura de 2 min',
    title: '10 artistas digitais para acompanhar',
    excerpt: 'Conheça criadores que moldam a cultura digital.',
    cta: 'Ler mais',
    artwork: ARTWORKS.varsity,
  },
  {
    id: 'rarity-and-provenance',
    date: '15 de setembro',
    readTime: 'Leitura de 3 min',
    title: 'Raridade, atributos e procedência',
    excerpt: 'Entenda raridade, procedência, direitos autorais e utilidade.',
    cta: 'Ler mais',
    artwork: ARTWORKS.bucket,
  },
  {
    id: 'wallet-safety',
    date: '15 de setembro',
    readTime: 'Leitura de 2 min',
    title: 'Como proteger sua carteira',
    excerpt: 'Proteja sua carteira, seus ativos e sua identidade.',
    cta: 'Ler mais',
    artwork: ARTWORKS.headphones,
  },
]
