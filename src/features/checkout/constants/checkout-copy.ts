import type { BreadcrumbItem } from '@/global/components/ui/breadcrumb'

export const CHECKOUT_BREADCRUMB: Array<BreadcrumbItem> = [
  { label: 'Início', to: '/' },
  { label: 'Mercado' },
  { label: 'Pagamento' },
]

export const CHECKOUT_COPY = {
  profileHeading: 'Perfil do colecionador',

  /** Tela do frame mobile: escolher a carteira que paga e confirmar. */
  mobileTitle: 'Pagamento com carteira',
  mobileBack: 'Voltar',
  connectedHeading: 'Carteira conectada',
  switchWallet: 'Trocar carteira',
  manageWallet: 'Gerenciar carteiras',
  editWallet: 'Editar carteira',
  walletMenuLabel: 'Opções da carteira',
  totalPrefix: 'Total:',
  /** O frame não desenha o caso sem carteira; o formulário cobre esse caminho. */
  noWalletHint: 'Cadastre uma carteira para pagar com um toque.',

  displayNameLabel: 'Nome de exibição',
  usernameLabel: 'Nome de usuário',
  networkLabel: 'Rede',
  networkPlaceholder: 'Selecione uma rede',
  profileNameLabel: 'Nome do perfil',
  walletAddressLabel: 'Endereço da carteira',
  walletAddressPlaceholder: 'Endereço 0x da carteira',
  secondaryWalletLabel: 'Carteira secundária',
  secondaryWalletPlaceholder: 'ENS ou carteira secundária (opcional)',
  walletTypeLabel: 'Tipo de carteira',
  walletTypePlaceholder: 'Selecione uma carteira',
  referralCodeLabel: 'Código de indicação',
  emailLabel: 'E-mail',
  ensNameLabel: 'Nome ENS',
  useAnotherWalletLabel: 'Usar outra carteira?',
  noteLabel: 'Observação do colecionador (opcional)',

  summaryHeading: 'Seus NFTs',
  columnNfts: 'NFTs',
  columnSubtotal: 'Subtotal',
  columnEditions: 'Edições',
  couponPrompt: 'Tem um código promocional?',
  couponAction: 'Aplique aqui',
  couponClose: 'Fechar cupom',
  walletsHeading: 'Carteira e rede',
  submit: 'Confirmar compra',
  submitting: 'Confirmando...',

  confirmationTitle: 'Seus NFTs agora estão na sua carteira',
  confirmationClose: 'Fechar',
  transactionIdLabel: 'ID da transação',
  dateLabel: 'Data',
  totalLabel: 'Total',
  walletLabel: 'Carteira',
  detailsHeading: 'Detalhes da transação',
  confirmationNote:
    'Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na rede.',
  explorerCta: 'Ver no Etherscan',
  /** O hash é simulado: o link mantém o gesto do frame sem prometer o que não há. */
  explorerHint: 'Transação simulada pelo servidor de demonstração.',

  errorTitle: 'Não foi possível concluir a compra',
} as const

/** 'Rede principal Ethereum' na principal e 'Rede Polygon' nas outras. */
export function buildNetworkLabel(network: string, isPrimary: boolean) {
  return isPrimary ? `Rede principal ${network}` : `Rede ${network}`
}

export function buildQuantityLabel(quantity: number) {
  return `(x ${quantity})`
}
