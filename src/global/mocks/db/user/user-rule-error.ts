import { RuleError } from '../core/rule-error'

/** Regras de conta, sessão e carteiras. */
export class UserRuleError extends RuleError {
  private constructor(status: number, code: string, message: string) {
    super(status, code, message)
    this.name = 'UserRuleError'
  }

  static notAuthenticated(): UserRuleError {
    return new UserRuleError(
      401,
      'NOT_AUTHENTICATED',
      'Entre na sua conta para continuar.',
    )
  }

  /**
   * Um veredito só para e-mail inexistente e senha errada: dizer qual dos
   * dois falhou entrega ao curioso a lista de quem tem conta aqui.
   */
  static invalidCredentials(): UserRuleError {
    return new UserRuleError(
      401,
      'INVALID_CREDENTIALS',
      'E-mail ou senha incorretos.',
    )
  }

  static invalidProfile(field: string, message: string): UserRuleError {
    return new UserRuleError(422, 'PROFILE_INVALID', `${field}: ${message}`)
  }

  static emailTaken(): UserRuleError {
    return new UserRuleError(
      409,
      'EMAIL_TAKEN',
      'Este e-mail já tem uma conta.',
    )
  }

  static usernameTaken(): UserRuleError {
    return new UserRuleError(
      409,
      'USERNAME_TAKEN',
      'Este nome de usuário já está em uso.',
    )
  }

  static passwordIncorrect(): UserRuleError {
    return new UserRuleError(
      422,
      'PASSWORD_INCORRECT',
      'A senha atual não confere.',
    )
  }

  static passwordMismatch(): UserRuleError {
    return new UserRuleError(
      422,
      'PASSWORD_MISMATCH',
      'A confirmação não corresponde à senha.',
    )
  }

  static passwordTooShort(minimum: number): UserRuleError {
    return new UserRuleError(
      422,
      'PASSWORD_TOO_SHORT',
      `A senha precisa de pelo menos ${minimum} caracteres.`,
    )
  }

  static avatarInvalid(): UserRuleError {
    return new UserRuleError(
      422,
      'AVATAR_INVALID',
      'Envie uma imagem para o avatar.',
    )
  }

  static avatarTooLarge(maximumKb: number): UserRuleError {
    return new UserRuleError(
      422,
      'AVATAR_TOO_LARGE',
      `O avatar precisa ter menos de ${maximumKb} KB.`,
    )
  }

  static walletInvalid(field: string, message: string): UserRuleError {
    return new UserRuleError(422, 'WALLET_INVALID', `${field}: ${message}`)
  }

  static walletNotFound(): UserRuleError {
    return new UserRuleError(
      404,
      'WALLET_NOT_FOUND',
      'Carteira não encontrada.',
    )
  }

  static walletAddressTaken(): UserRuleError {
    return new UserRuleError(
      409,
      'WALLET_ADDRESS_TAKEN',
      'Este endereço já está em outra carteira sua.',
    )
  }

  static primaryWalletExists(): UserRuleError {
    return new UserRuleError(
      409,
      'PRIMARY_WALLET_EXISTS',
      'Você já tem uma carteira principal.',
    )
  }

  static primaryWalletRequired(): UserRuleError {
    return new UserRuleError(
      409,
      'PRIMARY_WALLET_REQUIRED',
      'A carteira principal não pode ser removida.',
    )
  }
}
