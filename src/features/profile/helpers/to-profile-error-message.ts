import { isApiError } from '@/global/api'

const MESSAGE_BY_CODE: Record<string, string> = {
  EMAIL_TAKEN: 'Este e-mail já tem uma conta.',
  USERNAME_TAKEN: 'Este nome de usuário já está em uso.',
  PASSWORD_INCORRECT: 'A senha atual não confere.',
  PASSWORD_MISMATCH: 'A confirmação não corresponde à nova senha.',
  PASSWORD_TOO_SHORT: 'A senha precisa de pelo menos 8 caracteres.',
  AVATAR_INVALID: 'Envie uma imagem para o avatar.',
  AVATAR_TOO_LARGE: 'A imagem do avatar é grande demais.',
  WALLET_ADDRESS_TAKEN: 'Este endereço já está em outra carteira sua.',
  WALLET_NOT_FOUND: 'Esta carteira não existe mais.',
  PRIMARY_WALLET_EXISTS: 'Você já tem uma carteira principal.',
  PRIMARY_WALLET_REQUIRED: 'A carteira principal não pode ser removida.',
  NOT_AUTHENTICATED: 'Sua sessão expirou. Entre novamente.',
}

const MESSAGE_BY_KIND: Record<string, string> = {
  network: 'Sem conexão com o mercado. Verifique sua rede e tente novamente.',
  timeout: 'O mercado demorou a responder. Tente novamente.',
  server: 'O mercado está instável. Tente novamente em instantes.',
}

export function toProfileErrorMessage(error: unknown): string | undefined {
  if (!isApiError(error)) return undefined

  if (error.code && MESSAGE_BY_CODE[error.code])
    return MESSAGE_BY_CODE[error.code]

  /** `PROFILE_INVALID` e `WALLET_INVALID` trazem o campo recusado no texto. */
  if (error.code === 'PROFILE_INVALID' || error.code === 'WALLET_INVALID') {
    return error.message
  }

  return MESSAGE_BY_KIND[error.kind] ?? 'Não foi possível concluir a ação.'
}
