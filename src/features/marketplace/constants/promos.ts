import { ARTWORKS } from './artwork'

export const FEATURED_BANNER = {
  eyebrow: 'NFT EM DESTAQUE',
  title: 'OFERTA LIMITADA',
  artwork: ARTWORKS.bucket,
}

export const PROMO_CARDS = [
  {
    id: 'genesis-drops',
    titleLines: ['Lançamentos gênesis', 'de edição limitada'],
    body: 'Colecione edições escassas diretamente dos criadores antes da revelação pública.',
    cta: 'Explorar',
    artwork: ARTWORKS.varsity,
  },
  {
    id: 'curated-art',
    titleLines: ['Arte digital selecionada', 'e muito mais'],
    body: 'Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.',
    cta: 'Explorar',
    artwork: ARTWORKS.turtleneck,
  },
]
