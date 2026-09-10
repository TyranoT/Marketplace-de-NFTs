import { z } from 'zod'
import { ENS_SUFFIXES, NETWORKS, WALLET_TYPES } from '@/global/data'
import { isWalletAddress } from '@/global/helpers/wallet-address'
import { buildZodResolver } from '@/global/helpers/zod-resolver'
import type { CheckoutOption } from '@/global/data'
import type { CheckoutInput } from '@/global/api'

function optionId(options: Array<CheckoutOption>, message: string) {
  return z.string().refine((id) => options.some((o) => o.id === id), message)
}

export const checkoutSchema = z.object({
  displayName: z.string().trim().min(1, 'Informe o nome de exibição.'),
  username: z.string().trim().min(1, 'Informe o nome de usuário.'),
  network: optionId(NETWORKS, 'Selecione uma rede.'),
  profileName: z.string().trim().min(1, 'Informe o nome do perfil.'),
  /**
   * Três vereditos em vez de um: dizer só "endereço inválido" obriga o
   * colecionador a adivinhar se errou o prefixo, o tamanho ou um caractere.
   * O prefixo é checado antes do corpo, senão quem escreve `0x` no fim recebe
   * uma reclamação sobre tamanho e não sobre posição.
   */
  walletAddress: z
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
  secondaryWallet: z.string().trim(),
  walletType: optionId(WALLET_TYPES, 'Selecione o tipo de carteira.'),
  referralCode: z.string().trim().min(1, 'Informe o código de indicação.'),
  email: z.email('Informe um e-mail válido.'),
  ensSuffix: optionId(ENS_SUFFIXES, 'Selecione o sufixo ENS.'),
  useAnotherWallet: z.boolean(),
  note: z.string().trim(),
  /** A lista vem da API quando há conta, então quem julga o id é o servidor. */
  walletId: z.string().min(1, 'Escolha uma carteira para pagar.'),
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>

export const CHECKOUT_DEFAULTS: CheckoutFormValues = {
  displayName: '',
  username: '',
  network: '',
  profileName: '',
  walletAddress: '',
  secondaryWallet: '',
  walletType: '',
  referralCode: '',
  email: '',
  ensSuffix: ENS_SUFFIXES[0].id,
  useAnotherWallet: false,
  note: '',
  walletId: '',
}

export const checkoutResolver = buildZodResolver(checkoutSchema)

/** Do formulário para o corpo da requisição, sem os campos que só existem na tela. */
export function toCheckoutInput(
  values: CheckoutFormValues,
  cartVersion: number,
): CheckoutInput {
  const { walletId, secondaryWallet, note, ...profile } = values

  return {
    walletId,
    cartVersion,
    profile: {
      ...profile,
      secondaryWallet: secondaryWallet || undefined,
      note: note || undefined,
    },
  }
}
