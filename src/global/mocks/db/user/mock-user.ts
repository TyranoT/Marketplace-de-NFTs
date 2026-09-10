import { withoutUndefined } from '../core/without-undefined'
import { buildSalt, digestPassword } from './password-digest'
import type { UserSnapshot } from './user-snapshot'

export type UserProfileChanges = {
  displayName?: string
  username?: string
  email?: string
  ensName?: string
  ensSuffix?: string
  /** `null` remove o avatar; ausente deixa como está, como no Prisma. */
  avatarUrl?: string | null
}

/**
 * O colecionador. A senha entra e sai só por `matchesPassword` e
 * `replacePassword`: o digesto nunca é lido de fora da classe, o que torna
 * impossível um mapper ou um handler deixá-lo escapar por descuido.
 */
export class MockUser {
  private constructor(private readonly snapshot: UserSnapshot) {}

  /**
   * `salt` explícito existe para a semente: um sal sorteado a cada carga
   * tornaria o banco-semente diferente de si mesmo, e a impressão digital que
   * detecta mudança de semente nunca fecharia.
   */
  static create(
    data: Omit<UserSnapshot, 'passwordDigest' | 'passwordSalt'>,
    password: string,
    salt?: string,
  ): MockUser {
    const passwordSalt = salt ?? buildSalt()

    return new MockUser({
      ...data,
      passwordSalt,
      passwordDigest: digestPassword(password, passwordSalt),
    })
  }

  static fromSnapshot(snapshot: UserSnapshot): MockUser {
    return new MockUser({ ...snapshot })
  }

  toSnapshot(): UserSnapshot {
    return { ...this.snapshot }
  }

  get id(): string {
    return this.snapshot.id
  }

  get displayName(): string {
    return this.snapshot.displayName
  }

  get username(): string {
    return this.snapshot.username
  }

  get email(): string {
    return this.snapshot.email
  }

  get ensName(): string {
    return this.snapshot.ensName
  }

  get ensSuffix(): string {
    return this.snapshot.ensSuffix
  }

  get avatarUrl(): string | undefined {
    return this.snapshot.avatarUrl
  }

  get createdAt(): string {
    return this.snapshot.createdAt
  }

  get updatedAt(): string {
    return this.snapshot.updatedAt
  }

  matchesPassword(password: string): boolean {
    return (
      digestPassword(password, this.snapshot.passwordSalt) ===
      this.snapshot.passwordDigest
    )
  }

  replacePassword(password: string): void {
    this.snapshot.passwordSalt = buildSalt()
    this.snapshot.passwordDigest = digestPassword(
      password,
      this.snapshot.passwordSalt,
    )
    this.touch()
  }

  applyProfile(changes: UserProfileChanges): void {
    const { avatarUrl, ...fields } = changes

    Object.assign(this.snapshot, withoutUndefined(fields))

    if (avatarUrl !== undefined) {
      this.snapshot.avatarUrl = avatarUrl ?? undefined
    }

    this.touch()
  }

  private touch(): void {
    this.snapshot.updatedAt = new Date().toISOString()
  }
}
