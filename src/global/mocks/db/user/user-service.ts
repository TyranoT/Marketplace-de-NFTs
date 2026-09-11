import { ENS_SUFFIXES } from '../../../data'
import { cartService } from '../cart/cart-service'
import { mockDb } from '../core'
import { MockUser } from './mock-user'
import { requireUser } from './session-guard'
import { userContractMapper } from './user-contract-mapper'
import { UserRuleError } from './user-rule-error'
import type {
  ChangePasswordInput,
  RegisterInput,
  UpdateProfileInput,
  User,
} from '../../../api/contracts/user'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const MINIMUM_PASSWORD_LENGTH = 8
const MAXIMUM_AVATAR_KB = 512
const AVATAR_PREFIX = 'data:image/'
const DEFAULT_ENS_SUFFIX = 'eth'

/** Sessão, perfil, senha e avatar do colecionador. */
export class UserService {
  login(email: string, password: string): User {
    return mockDb.$transaction(() => {
      const user = mockDb.user.findUnique({ where: { email } })

      if (!user || !user.matchesPassword(password)) {
        throw UserRuleError.invalidCredentials()
      }

      mockDb.session.create({ data: { userId: user.id } })
      cartService.adoptGuestCart()

      return this.toContract(user)
    })
  }

  /**
   * Cadastro: cria a conta e já inicia a sessão. Quem acabou de escolher uma
   * senha não precisa digitá-la de novo na tela seguinte.
   *
   * A conta nasce sem carteira — o pagamento cai nas opções fixas do frame
   * até o colecionador cadastrar a dele.
   */
  register(input: RegisterInput): User {
    return mockDb.$transaction(() => {
      this.assertNewAccount(input)

      const now = new Date().toISOString()
      const username = input.username.trim()

      const created = mockDb.user.create({
        data: MockUser.create(
          {
            id: buildUserId(mockDb.user.count()),
            displayName: username,
            username,
            email: input.email.trim(),
            ensName: username,
            ensSuffix: DEFAULT_ENS_SUFFIX,
            createdAt: now,
            updatedAt: now,
          },
          input.password,
        ),
      })

      mockDb.session.create({ data: { userId: created.id } })
      cartService.adoptGuestCart()

      return this.toContract(created)
    })
  }

  logout(): void {
    mockDb.$transaction(() => mockDb.session.deleteMany())
  }

  me(): User {
    return this.toContract(requireUser())
  }

  updateProfile(input: UpdateProfileInput): User {
    return mockDb.$transaction(() => {
      const user = requireUser()

      this.assertProfile(input)
      this.assertIdentityIsFree(input.email, input.username, user.id)

      mockDb.user.update({
        where: { id: user.id },
        data: {
          displayName: input.displayName,
          username: input.username,
          email: input.email,
          ensName: input.ensName,
          ensSuffix: input.ensSuffix,
        },
      })

      /**
       * "Apelido da carteira" no frame de perfil é o apelido da carteira
       * principal, e não um segundo campo de mesmo nome no usuário: guardar o
       * mesmo conceito em dois lugares é como eles divergem.
       */
      if (input.primaryWalletNickname !== undefined) {
        const primary = this.primaryWalletOf(user)

        if (primary) {
          mockDb.wallet.update({
            where: { id: primary.id },
            data: { nickname: input.primaryWalletNickname.trim() },
          })
        }
      }

      return this.toContract(user)
    })
  }

  changePassword(input: ChangePasswordInput): User {
    return mockDb.$transaction(() => {
      const user = requireUser()

      if (!user.matchesPassword(input.currentPassword)) {
        throw UserRuleError.passwordIncorrect()
      }

      if (input.newPassword !== input.confirmPassword) {
        throw UserRuleError.passwordMismatch()
      }

      if (input.newPassword.length < MINIMUM_PASSWORD_LENGTH) {
        throw UserRuleError.passwordTooShort(MINIMUM_PASSWORD_LENGTH)
      }

      user.replacePassword(input.newPassword)

      return this.toContract(user)
    })
  }

  /** `null` remove o avatar, como o "Remover" ao lado do "Alterar" do frame. */
  setAvatar(avatarUrl: string | null): User {
    return mockDb.$transaction(() => {
      const user = requireUser()

      if (avatarUrl !== null) this.assertAvatar(avatarUrl)

      mockDb.user.update({ where: { id: user.id }, data: { avatarUrl } })

      return this.toContract(user)
    })
  }

  private assertNewAccount(input: RegisterInput): void {
    if (!input.username.trim()) {
      throw UserRuleError.invalidProfile('Nome de usuário', 'campo obrigatório')
    }

    if (!EMAIL.test(input.email)) {
      throw UserRuleError.invalidProfile('E-mail', 'endereço inválido')
    }

    if (input.password !== input.confirmPassword) {
      throw UserRuleError.passwordMismatch()
    }

    if (input.password.length < MINIMUM_PASSWORD_LENGTH) {
      throw UserRuleError.passwordTooShort(MINIMUM_PASSWORD_LENGTH)
    }

    this.assertIdentityIsFree(input.email, input.username)
  }

  /** E-mail e apelido identificam a conta: dois donos quebrariam o login. */
  private assertIdentityIsFree(
    email?: string,
    username?: string,
    ignoringUserId?: string,
  ): void {
    if (email !== undefined) {
      const owner = mockDb.user.findFirst({ where: { email } })

      if (owner && owner.id !== ignoringUserId) throw UserRuleError.emailTaken()
    }

    if (username !== undefined) {
      const owner = mockDb.user.findFirst({ where: { username } })

      if (owner && owner.id !== ignoringUserId) {
        throw UserRuleError.usernameTaken()
      }
    }
  }

  private assertProfile(input: UpdateProfileInput): void {
    const required = [
      ['Nome de exibição', input.displayName],
      ['Nome de usuário', input.username],
      ['Nome ENS', input.ensName],
    ] as const

    for (const [label, value] of required) {
      if (value !== undefined && !value.trim()) {
        throw UserRuleError.invalidProfile(label, 'campo obrigatório')
      }
    }

    if (input.email !== undefined && !EMAIL.test(input.email)) {
      throw UserRuleError.invalidProfile('E-mail', 'endereço inválido')
    }

    if (
      input.ensSuffix !== undefined &&
      !ENS_SUFFIXES.some(({ id }) => id === input.ensSuffix)
    ) {
      throw UserRuleError.invalidProfile('Nome ENS', 'sufixo inválido')
    }
  }

  private assertAvatar(avatarUrl: string): void {
    if (!avatarUrl.startsWith(AVATAR_PREFIX)) {
      throw UserRuleError.avatarInvalid()
    }

    if (avatarUrl.length > MAXIMUM_AVATAR_KB * 1024) {
      throw UserRuleError.avatarTooLarge(MAXIMUM_AVATAR_KB)
    }
  }

  private primaryWalletOf(user: MockUser) {
    return mockDb.wallet.findFirst({
      where: { userId: user.id, role: 'primary' },
    })
  }

  private toContract(user: MockUser): User {
    return userContractMapper.toContract(
      user,
      this.primaryWalletOf(user) ?? undefined,
    )
  }
}

/** Sequencial mais um sufixo do relógio: legível e sem colisão na sessão. */
function buildUserId(existingCount: number): string {
  return `user-${existingCount + 1}-${Date.now().toString(36)}`
}

export const userService = new UserService()
