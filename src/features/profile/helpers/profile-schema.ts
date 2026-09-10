import { z } from 'zod'
import { ENS_SUFFIXES } from '@/global/data'
import { buildZodResolver } from '@/global/helpers/zod-resolver'

const MINIMUM_PASSWORD_LENGTH = 8

/**
 * Os três campos de senha são opcionais porque salvar o perfil sem trocar a
 * senha é o caso normal. Mas eles andam juntos: preencher um exige os três,
 * senão o botão único do frame mandaria metade de uma troca de senha.
 */
export const profileSchema = z
  .object({
    displayName: z.string().trim().min(1, 'Informe o nome de exibição.'),
    username: z.string().trim().min(1, 'Informe o nome de usuário.'),
    email: z.email('Informe um e-mail válido.'),
    ensName: z.string().trim().min(1, 'Informe o nome ENS.'),
    ensSuffix: z
      .string()
      .refine(
        (id) => ENS_SUFFIXES.some((suffix) => suffix.id === id),
        'Selecione o sufixo ENS.',
      ),
    primaryWalletNickname: z.string().trim(),
    currentPassword: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((values, ctx) => {
    const filled = [
      values.currentPassword,
      values.newPassword,
      values.confirmPassword,
    ].filter((value) => value.length > 0)

    if (filled.length === 0) return

    if (!values.currentPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['currentPassword'],
        message: 'Informe a senha atual para trocá-la.',
      })
    }

    if (values.newPassword.length < MINIMUM_PASSWORD_LENGTH) {
      ctx.addIssue({
        code: 'custom',
        path: ['newPassword'],
        message: `A senha precisa de pelo menos ${MINIMUM_PASSWORD_LENGTH} caracteres.`,
      })
    }

    if (values.newPassword !== values.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'A confirmação não corresponde à nova senha.',
      })
    }
  })

export type ProfileFormValues = z.infer<typeof profileSchema>

export const profileResolver = buildZodResolver(profileSchema)

export const EMPTY_PASSWORDS = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

/** Verdadeiro quando o trio de senha veio preenchido e válido. */
export function hasPasswordChange(values: ProfileFormValues): boolean {
  return values.currentPassword.length > 0
}
