import type { BreadcrumbItem } from '@/global/components/ui/breadcrumb'

export const CART_BREADCRUMB: Array<BreadcrumbItem> = [
  { label: 'Início', to: '/' },
  { label: 'Mercado' },
  { label: 'Carrinho' },
]

export const CART_COPY = {
  columnNfts: 'NFTs',
  columnPrice: 'Preço',
  columnEditions: 'Edições',
  columnTotal: 'Total',
  columnActions: 'Ações',

  tokenIdLabel: 'ID do token:',

  /** Topo da tela no mobile: o frame traz título próprio, sem trilha. */
  mobileTitle: 'Carrinho de NFTs',
  mobileBack: 'Voltar',
  editionPrefix: 'Edição:',

  summaryHeading: 'Resumo da carteira',
  couponLabel: 'Código promocional',
  couponPlaceholder: 'Digite o código promocional...',
  couponApply: 'Aplicar',
  couponRemove: 'Remover',
  couponAppliedPrefix: 'Cupom aplicado:',
  subtotalLabel: 'Subtotal',
  discountLabel: 'Desconto do lançamento',
  networkFeeLabel: 'Taxa de rede',
  networkFeeNote: 'Taxa estimada',
  totalLabel: 'Total',
  checkout: 'Conectar e finalizar',
  continueShopping: 'Continuar explorando',

  recommendationsHeading: 'Colecionadores também viram',

  /**
   * Avisos de tempo real. O resumo já se atualiza sozinho; este texto diz
   * por quê, que é o que o número sozinho não conta.
   */
  priceChanged:
    'O preço de {nft} mudou de {from} para {to}. O resumo foi atualizado.',
  availabilityChanged:
    'A disponibilidade de {nft} mudou: agora restam {units} unidades.',
  dismissChange: 'Dispensar aviso',

  emptyTitle: 'Seu carrinho está vazio',
  emptyBody:
    'Você ainda não adicionou nenhum NFT. Explore o catálogo e escolha as obras que vão para a sua coleção.',
  emptyCta: 'Continuar explorando',

  errorTitle: 'Não foi possível carregar seu carrinho',
  errorBody:
    'A conexão com o mercado falhou. Verifique sua rede e tente novamente.',
  errorCta: 'Tentar novamente',

  loadingLabel: 'Carregando carrinho',
}

export function buildDecreaseLabel(name: string) {
  return `Diminuir quantidade de ${name}`
}

export function buildIncreaseLabel(name: string) {
  return `Aumentar quantidade de ${name}`
}

export function buildQuantityLabel(name: string) {
  return `Quantidade de ${name}`
}

export function buildRemoveLabel(name: string) {
  return `Remover ${name} do carrinho`
}

export function buildRemovedMessage(name: string) {
  return `${name} removido do carrinho.`
}

export function buildMaxQuantityHint(name: string, available: number) {
  return `${name}: restam ${available} unidades disponíveis.`
}
