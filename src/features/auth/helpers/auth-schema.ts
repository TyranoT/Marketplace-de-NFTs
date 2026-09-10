import { z } from 'zod'
import { buildZodResolver } from '@/global/helpers/zod-resolver'

const MINIMUM_PASSWORD_LENGTH = 8

export const loginSchema = z.object({
  email: z.email('Informe um e-mail válido.'),
  password: z.string().min(1, 'Informe sua senha.'),
})

export const registerSchema = z
  .object({
    username: z.string().trim().min(1, 'Escolha um nome de usuário.'),
    email: z.email('Informe um e-mail válido.'),
    password: z
      .string()
      .min(
        MINIMUM_PASSWORD_LENGTH,
        `A senha precisa de pelo menos ${MINIMUM_PASSWORD_LENGTH} caracteres.`,
      ),
    confirmPassword: z.string().min(1, 'Repita a senha.'),
  })
  /** O erro cai na confirmação, que é o campo onde a correção acontece. */
  .refine((values) => values.password === values.confirmPassword, {
    message: 'A confirmação não corresponde à senha.',
    path: ['confirmPassword'],
  })

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>

export const LOGIN_DEFAULTS: LoginFormValues = { email: '', password: '' }

export const REGISTER_DEFAULTS: RegisterFormValues = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export const loginResolver = buildZodResolver(loginSchema)
export const registerResolver = buildZodResolver(registerSchema)
