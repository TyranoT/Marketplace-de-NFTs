import { CHECKOUT_WALLETS } from '@/global/data'
import type { CheckoutWallet } from '@/global/data'
import type { CheckoutFormValues } from './checkout-schema'
import type { CheckoutInput, Wallet } from '@/global/api'

/**
 * As carteiras salvas são as do pagamento — é o que o frame de carteiras
 * promete. Sem conta, ou com a conta ainda sem carteira, valem as três opções
 * fixas do frame de pagamento: comprar não pode exigir cadastro.
 */
export function toCheckoutWallets(
  wallets?: Array<Wallet>,
): Array<CheckoutWallet> {
  if (!wallets || wallets.length === 0) return CHECKOUT_WALLETS

  return wallets.map((wallet) => ({ id: wallet.id, label: wallet.nickname }))
}

/** A carteira principal preenche o formulário — ela já tem todos os campos. */
export function toFormValues(
  wallet: Wallet,
  username: string,
): Partial<CheckoutFormValues> {
  return {
    displayName: wallet.displayName,
    username,
    network: wallet.network,
    profileName: wallet.profileName,
    walletAddress: wallet.address,
    secondaryWallet: wallet.secondaryAddress ?? '',
    walletType: wallet.walletType,
    referralCode: wallet.referralCode,
    email: wallet.email,
    ensSuffix: wallet.ensSuffix,
    walletId: wallet.id,
  }
}

export function findPrimary(wallets?: Array<Wallet>): Wallet | undefined {
  return wallets?.find(({ role }) => role === 'primary')
}

/**
 * Compra pela carteira salva, sem formulário: o perfil sai dela, e o provedor
 * escolhido na tela sobrescreve o tipo de carteira — é o que dá efeito real à
 * segunda lista do frame mobile, em vez de deixá-la decorativa.
 */
export function toWalletCheckoutInput(
  wallet: Wallet,
  username: string,
  walletType: string,
  cartVersion: number,
): CheckoutInput {
  return {
    walletId: wallet.id,
    cartVersion,
    profile: {
      displayName: wallet.displayName,
      username,
      network: wallet.network,
      profileName: wallet.profileName,
      walletAddress: wallet.address,
      secondaryWallet: wallet.secondaryAddress,
      walletType,
      referralCode: wallet.referralCode,
      email: wallet.email,
      ensSuffix: wallet.ensSuffix,
    },
  }
}
