export type CheckoutOption = {
  id: string
  label: string
}

/** Redes suportadas pelo mercado simulado. */
export const NETWORKS: Array<CheckoutOption> = [
  { id: 'ethereum', label: 'Ethereum' },
  { id: 'polygon', label: 'Polygon' },
  { id: 'arbitrum', label: 'Arbitrum' },
  { id: 'optimism', label: 'Optimism' },
  { id: 'base', label: 'Base' },
]

export const WALLET_TYPES: Array<CheckoutOption> = [
  { id: 'metamask', label: 'MetaMask' },
  { id: 'walletconnect', label: 'WalletConnect' },
  { id: 'coinbase', label: 'Coinbase Wallet' },
  { id: 'ledger', label: 'Ledger' },
]

export const ENS_SUFFIXES: Array<CheckoutOption> = [
  { id: 'eth', label: '.eth' },
  { id: 'xyz', label: '.xyz' },
]

export const COMPATIBLE_WALLETS = ['METAMASK', 'WALLETCONNECT', 'COINBASE']

export type CheckoutWallet = CheckoutOption & {
  /** Presente na opção que aceita qualquer uma das carteiras compatíveis. */
  badges?: Array<string>
}

/** As três linhas de "Carteira e rede" do frame de pagamento. */
export const CHECKOUT_WALLETS: Array<CheckoutWallet> = [
  {
    id: 'any',
    label: 'Qualquer carteira compatível',
    badges: COMPATIBLE_WALLETS,
  },
  { id: 'metamask', label: 'MetaMask' },
  { id: 'coinbase', label: 'Coinbase Wallet' },
]

export function findCheckoutWallet(walletId: string) {
  return CHECKOUT_WALLETS.find(({ id }) => id === walletId)
}
