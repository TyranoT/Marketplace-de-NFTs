import type { NftDetail } from '../type'

type NftDetailOverride = Partial<
  Pick<
    NftDetail,
    | 'about'
    | 'paragraphs'
    | 'metadata'
    | 'network'
    | 'royalties'
    | 'contract'
    | 'rating'
  >
>

/**
 * Texto autoral transcrito do Figma. Só existe para os NFTs efetivamente
 * redigidos no design; os demais recebem a versão derivada por template em
 * `build-nft-detail.ts`.
 *
 * O `Pick` é restritivo de propósito: um override não pode alterar `id`,
 * `price`, `artwork` nem `gallery` — isso deixaria o detalhe divergindo do
 * card da home sem ninguém perceber.
 */
export const NFT_DETAIL_OVERRIDES: Record<string, NftDetailOverride> = {
  'emerald-ape-042': {
    about:
      'Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.',
    paragraphs: [
      'Emerald Ape #042 é uma obra digital 1/50 finalizada à mão da coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na Ethereum. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.',
      'A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede. Nova Sato recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.',
    ],
    metadata: [
      { label: 'ID do token', value: '#0042' },
      { label: 'Coleção', value: 'Kurio Apes' },
      { label: 'Atributos', value: 'Óculos, Esmeralda, Raro' },
    ],
  },
}
