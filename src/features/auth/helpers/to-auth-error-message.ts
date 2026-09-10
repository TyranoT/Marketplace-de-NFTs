import { isApiError } from '@/global/api'

const MESSAGE_BY_CODE: Record<string, string> = {
  INVALID_CREDENTIALS: 'E-mail ou senha incorretos.',
  EMAIL_TAKEN: 'Este e-mail já tem uma conta. Tente entrar.',
  USERNAME_TAKEN: 'Este nome de usuário já está em uso.',
  PASSWORD_MISMATCH: 'A confirmação não corresponde à senha.',
  PASSWORD_TOO_SHORT: 'A senha precisa de pelo menos 8 caracteres.',
}

const MESSAGE_BY_KIND: Record<string, string> = {
  network: 'Sem conexão com o mercado. Verifique sua rede e tente novamente.',
  timeout: 'O mercado demorou a responder. Tente novamente.',
  server: 'O mercado está instável. Tente novamente em instantes.',
}

export function toAuthErrorMessage(error: unknown): string | undefined {
  if (!isApiError(error)) return undefined

  if (error.code && MESSAGE_BY_CODE[error.code])
    return MESSAGE_BY_CODE[error.code]

  /** `PROFILE_INVALID` chega com o campo recusado no texto, vindo do servidor. */
  if (error.code === 'PROFILE_INVALID') return error.message

  return MESSAGE_BY_KIND[error.kind] ?? 'Não foi possível concluir a ação.'
}
