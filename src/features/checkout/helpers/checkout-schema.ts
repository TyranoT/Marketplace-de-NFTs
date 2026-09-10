import { z } from 'zod'
import {
  CHECKOUT_WALLETS,
  ENS_SUFFIXES,
  NETWORKS,
  WALLET_TYPES,
} from '@/global/data'
import type { CheckoutOption } from '@/global/data'
import type { CheckoutInput } from '@/global/api'
import type { FieldErrors, Resolver } from 'react-hook-form'

const WALLET_ADDRESS = /^0x[a-fA-F0-9]{40}$/

function optionId(options: Array<CheckoutOption>, message: string) {
  return z.string().refine((id) => options.some((o) => o.id === id), message)
}

export const checkoutSchema = z.object({
  displayName: z.string().trim().min(1, 'Informe o nome de exibição.'),
  username: z.string().trim().min(1, 'Informe o nome de usuário.'),
  network: optionId(NETWORKS, 'Selecione uma rede.'),
  profileName: z.string().trim().min(1, 'Informe o nome do perfil.'),
  walletAddress: z
    .string()
    .trim()
    .regex(WALLET_ADDRESS, 'Informe um endereço 0x com 40 caracteres.'),
  secondaryWallet: z.string().trim(),
  walletType: optionId(WALLET_TYPES, 'Selecione o tipo de carteira.'),
  referralCode: z.string().trim().min(1, 'Informe o código de indicação.'),
  email: z.email('Informe um e-mail válido.'),
  ensName: optionId(ENS_SUFFIXES, 'Selecione o sufixo ENS.'),
  useAnotherWallet: z.boolean(),
  note: z.string().trim(),
  walletId: optionId(CHECKOUT_WALLETS, 'Escolha uma carteira para pagar.'),
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
  ensName: ENS_SUFFIXES[0].id,
  useAnotherWallet: false,
  note: '',
  walletId: '',
}

/**
 * `@hookform/resolvers` ainda declara peer de zod 3 e conflita com o zod 4 já
 * presente na árvore. O resolver é uma função pura de uma dúzia de linhas —
 * a dependência custaria mais do que escrevê-la.
 */
export const checkoutResolver: Resolver<CheckoutFormValues> = (values) => {
  const parsed = checkoutSchema.safeParse(values)

  if (parsed.success) return { values: parsed.data, errors: {} }

  const errors: Record<string, { type: string; message: string }> = {}

  for (const issue of parsed.error.issues) {
    const field = issue.path.join('.')

    errors[field] ??= { type: issue.code, message: issue.message }
  }

  return { values: {}, errors: errors as FieldErrors<CheckoutFormValues> }
}

/** Do formulário para o corpo da requisição, sem os campos que só existem na tela. */
export function toCheckoutInput(values: CheckoutFormValues): CheckoutInput {
  const { walletId, secondaryWallet, note, ...profile } = values

  return {
    walletId,
    profile: {
      ...profile,
      secondaryWallet: secondaryWallet || undefined,
      note: note || undefined,
    },
  }
}
