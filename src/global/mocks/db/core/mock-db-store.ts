import { MockDb } from './mock-db'
import { seedFingerprint } from './seed-fingerprint'
import { SEED_VERSION } from './snapshot'
import type { MockDbSnapshot } from './snapshot'

export const MOCK_DB_STORAGE_KEY = 'kurio.mock.db.v1'

const STORAGE_KEY = MOCK_DB_STORAGE_KEY

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

  /**
   * Descarta a cópia em memória; a próxima leitura restaura do
   * `localStorage`.
   *
   * Cada aba roda o seu próprio banco simulado — os handlers do MSW executam
   * na página, não no Service Worker — e todas gravam no mesmo
   * `localStorage`. Sem isto, uma aba continuaria servindo o preço que leu
   * ao abrir, mesmo depois de outra aba o ter mudado.
   */
  invalidate(): void {
    this.cache = undefined
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

      /** Formato ou conteúdo divergente é descartado, não migrado. */
      const isCurrent =
        parsed.seedVersion === SEED_VERSION &&
        parsed.seedFingerprint === seedFingerprint()

      return isCurrent ? parsed : undefined
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
