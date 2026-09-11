import type { BreadcrumbItem } from '@/global/components/ui/breadcrumb'

export const NFT_DETAIL_COPY = {
  breadcrumbHome: 'Início',
  breadcrumbMarket: 'Mercado',
  aboutLabel: 'Sobre este NFT:',
  editionLabel: 'Edição:',
  zoomLabel: 'Ampliar imagem',
  thumbLabel: 'Ver imagem',
  decreaseLabel: 'Diminuir quantidade',
  increaseLabel: 'Aumentar quantidade',
  quantityLabel: 'Quantidade',
  buyLabel: 'Comprar',
  backLabel: 'Voltar',
  mobileBuyLabel: 'Comprar NFT',
  cartLabel: 'Adicionar ao carrinho',
  quantityShortLabel: 'Qtd.',
  favoriteLabel: 'Favoritar',
  favoritedLabel: 'Favoritado',
  shareLabel: 'Compartilhar este NFT:',
  detailsTabLabel: 'Detalhes do NFT',
  reviewsTabLabel: 'Avaliações de colecionadores',
  reviewsEmpty:
    'As avaliações deste NFT ainda não estão disponíveis nesta versão.',
  relatedHeading: 'Mais desta coleção',
  notFoundTitle: 'NFT não encontrado',
  notFoundBody:
    'Este NFT não existe ou saiu do catálogo. Explore os itens disponíveis na página inicial.',
  notFoundCta: 'Voltar para o início',
}

/**
 * Rótulos dos três fatos da aba de detalhes.
 *
 * O Figma troca "Contrato" e "Direitos autorais" entre si. A tela seguia o
 * design, mas isso punha o texto de royalties sob "Contrato" — informação
 * errada para qualquer pessoa, não só para quem usa leitor de tela. Desvio
 * consciente, registrado no ARCHITECTURE.md.
 */
export const NFT_FACT_LABELS = {
  network: 'Rede:',
  royalties: 'Direitos autorais:',
  contract: 'Contrato:',
}

/** Trilha do detalhe. `Mercado` ainda não tem rota, então fica sem `to`. */
export const NFT_BREADCRUMB: Array<BreadcrumbItem> = [
  { label: 'Início', to: '/' },
  { label: 'Mercado' },
]

/** 3 indicadores no carrossel de relacionados, o 2º ativo. Medido no Figma. */
export const RELATED_SLIDE_COUNT = 3
export const RELATED_ACTIVE_SLIDE = 1
