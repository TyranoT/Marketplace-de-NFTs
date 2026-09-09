import { ARTWORKS } from './artwork'

export const NFT_DETAIL = {
  breadcrumb: ['Início', 'Mercado'],
  name: 'Emerald Ape #042',
  price: '1.19 ETH',
  ratingCount: 19,
  ratingLabel: '19 avaliações de colecionadores',
  aboutLabel: 'Sobre este NFT:',
  about:
    'Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.',
  editionLabel: 'Edição:',
  editions: [
    { id: '1-1', label: '1/1' },
    { id: '1-10', label: '1/10' },
    { id: '1-50', label: '1/50' },
    { id: 'open', label: 'ABERTA' },
  ],
  selectedEdition: '1-50',
  buyLabel: 'COMPRAR',
  favoriteLabel: 'Favoritar',
  metadata: [
    { label: 'ID do token', value: '#0042' },
    { label: 'Coleção', value: 'Kurio Apes' },
    { label: 'Atributos', value: 'Óculos, Esmeralda, Raro' },
  ],
  shareLabel: 'Compartilhar este NFT:',
  gallery: [
    ARTWORKS.varsity,
    ARTWORKS.headphones,
    ARTWORKS.bucket,
    ARTWORKS.turtleneck,
  ],
}

export const NFT_DETAIL_TABS = [
  { id: 'details', label: 'Detalhes do NFT' },
  { id: 'reviews', label: 'Avaliações de colecionadores (19)' },
]

export const NFT_DESCRIPTION = {
  paragraphs: [
    'Emerald Ape #042 é uma obra digital 1/50 finalizada à mão da coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na Ethereum. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.',
    'A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede. Nova Sato recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.',
  ],
  facts: [
    {
      label: 'Rede:',
      value:
        'Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS.',
    },
    {
      label: 'Contrato:',
      value:
        'Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.',
    },
    {
      label: 'Direitos autorais:',
      value: '0x7A42...19E8 • Contrato inteligente ERC-721 verificado.',
    },
  ],
}

export const RELATED_HEADING = 'Mais desta coleção'
export const RELATED_SLIDE_COUNT = 3
