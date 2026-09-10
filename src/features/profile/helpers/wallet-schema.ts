import { z } from 'zod'
import { ENS_SUFFIXES, NETWORKS, WALLET_TYPES } from '@/global/data'
import { isWalletAddress } from '@/global/helpers/wallet-address'
import { buildZodResolver } from '@/global/helpers/zod-resolver'
import type { CheckoutOption } from '@/global/data'
import type { Wallet, WalletInput, WalletRole } from '@/global/api'

function optionId(options: Array<CheckoutOption>, message: string) {
  return z.string().refine((id) => options.some((o) => o.id === id), message)
}

export const walletSchema = z.object({
  nickname: z.string().trim().min(1, 'Dê um apelido a esta carteira.'),
  displayName: z.string().trim().min(1, 'Informe o nome de exibição.'),
  network: optionId(NETWORKS, 'Selecione uma rede.'),
  profileName: z.string().trim().min(1, 'Informe o nome do perfil.'),
  /** Mesma regra do servidor, pela mesma função. */
  address: z
    .string()
    .trim()
    .min(1, 'Informe o endereço da carteira.')
    .refine(
      (value) => value.startsWith('0x'),
      'O endereço começa com 0x — o prefixo vem na frente.',
    )
    .refine(
      (value) => !value.startsWith('0x') || isWalletAddress(value),
      'Depois do 0x vêm 40 caracteres hexadecimais (0-9, a-f).',
    ),
  secondaryAddress: z.string().trim(),
  walletType: optionId(WALLET_TYPES, 'Selecione o tipo de carteira.'),
  referralCode: z.string().trim().min(1, 'Informe o código de indicação.'),
  email: z.email('Informe um e-mail válido.'),
  ensName: z.string().trim().min(1, 'Informe o nome ENS.'),
  ensSuffix: optionId(ENS_SUFFIXES, 'Selecione o sufixo ENS.'),
})

export type WalletFormValues = z.infer<typeof walletSchema>

export const walletResolver = buildZodResolver(walletSchema)

export function toWalletInput(
  values: WalletFormValues,
  role: WalletRole,
): WalletInput {
  return {
    role,
    nickname: values.nickname,
    displayName: values.displayName,
    network: values.network,
    profileName: values.profileName,
    address: values.address,
    secondaryAddress: values.secondaryAddress || undefined,
    walletType: values.walletType,
    referralCode: values.referralCode,
    email: values.email,
    ensName: values.ensName,
    ensSuffix: values.ensSuffix,
  }
}

export function toWalletFormValues(wallet: Wallet): WalletFormValues {
  return {
    nickname: wallet.nickname,
    displayName: wallet.displayName,
    network: wallet.network,
    profileName: wallet.profileName,
    address: wallet.address,
    secondaryAddress: wallet.secondaryAddress ?? '',
    walletType: wallet.walletType,
    referralCode: wallet.referralCode,
    email: wallet.email,
    ensName: wallet.ensName,
    ensSuffix: wallet.ensSuffix,
  }
}

/** Formulário vazio, com o e-mail e o ENS da conta já preenchidos. */
export function emptyWalletValues(
  email: string,
  ensName: string,
  ensSuffix: string,
): WalletFormValues {
  return {
    nickname: '',
    displayName: '',
    network: '',
    profileName: '',
    address: '',
    secondaryAddress: '',
    walletType: '',
    referralCode: '',
    email,
    ensName,
    ensSuffix,
  }
}
