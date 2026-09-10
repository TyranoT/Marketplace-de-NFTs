import { ModelDelegate } from '../core/model-delegate'
import type { MockDbStore } from '../core/mock-db-store'
import type { MockUser, UserProfileChanges } from './mock-user'

export type UserWhere = {
  id?: string
  email?: string
  username?: string
}

export type UserWhereUnique = {
  id: string
}

/** O banco simulado tem um colecionador; o delegate não presume que só um. */
export class UserDelegate extends ModelDelegate<MockUser, UserWhere> {
  constructor(private readonly store: MockDbStore) {
    super()
  }

  update(args: {
    where: UserWhereUnique
    data: UserProfileChanges
  }): MockUser | null {
    const user = this.findUnique(args)

    if (!user) return null

    user.applyProfile(args.data)

    return user
  }

  create(args: { data: MockUser }): MockUser {
    this.store.load().users.set(args.data.id, args.data)

    return args.data
  }

  protected list(): Array<MockUser> {
    return [...this.store.load().users.values()]
  }

  /** E-mail e apelido comparam sem caixa: são identidade, não texto livre. */
  protected matches(user: MockUser, where: UserWhere): boolean {
    return (
      (!where.id || user.id === where.id) &&
      (!where.email || equalsIgnoringCase(user.email, where.email)) &&
      (!where.username || equalsIgnoringCase(user.username, where.username))
    )
  }
}

function equalsIgnoringCase(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.trim().toLowerCase()
}
