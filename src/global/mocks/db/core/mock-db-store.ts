import { MockDb } from './mock-db'
import { SEED_VERSION } from './snapshot'
import type { MockDbSnapshot } from './snapshot'

const STORAGE_KEY = 'kurio.mock.db.v1'

/** Cache em memória do banco simulado, persistido entre recargas da página. */
export class MockDbStore {
  private cache: MockDb | undefined

  /** Leitura preguiçosa — o primeiro handler a rodar hidrata o banco. */
  load(): MockDb {
    this.cache ??= this.restore() ?? MockDb.seed()

    return this.cache
  }

  save(db: MockDb): void {
    this.cache = db
    this.write(db.toSnapshot())
  }

  reset(): MockDb {
    const seeded = MockDb.seed()
    this.save(seeded)

    return seeded
  }

  /** Troca o estado em memória sem gravar — é o rollback da transação. */
  replace(db: MockDb): void {
    this.cache = db
  }

  private restore(): MockDb | undefined {
    const snapshot = this.read()

    return snapshot ? MockDb.fromSnapshot(snapshot) : undefined
  }

  private read(): MockDbSnapshot | undefined {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)

      if (!raw) return undefined

      const parsed = JSON.parse(raw) as MockDbSnapshot

      /** Formato antigo é descartado em vez de migrado: é dado de simulação. */
      return parsed.seedVersion === SEED_VERSION ? parsed : undefined
    } catch {
      return undefined
    }
  }

  private write(snapshot: MockDbSnapshot): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
    } catch {
      /** Modo privado ou cota cheia: a sessão segue só em memória. */
    }
  }
}

export const mockDbStore = new MockDbStore()
