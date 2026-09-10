import { ModelDelegate } from '../core/model-delegate'
import type { MockDbStore } from '../core/mock-db-store'
import type { SessionSnapshot } from './user-snapshot'

export type SessionWhere = {
  userId?: string
}

/** Linha única: existe uma sessão, ou nenhuma. */
export class SessionDelegate extends ModelDelegate<
  SessionSnapshot,
  SessionWhere
> {
  constructor(private readonly store: MockDbStore) {
    super()
  }

  create(args: { data: { userId: string } }): SessionSnapshot {
    const session: SessionSnapshot = {
      userId: args.data.userId,
      startedAt: new Date().toISOString(),
    }

    this.store.load().setSession(session)

    return session
  }

  deleteMany(): number {
    const existing = this.store.load().session ? 1 : 0

    this.store.load().setSession(undefined)

    return existing
  }

  protected list(): Array<SessionSnapshot> {
    const { session } = this.store.load()

    return session ? [session] : []
  }

  protected matches(session: SessionSnapshot, where: SessionWhere): boolean {
    return !where.userId || session.userId === where.userId
  }
}
