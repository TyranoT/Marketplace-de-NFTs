import { buildSeedDb } from './seed'
import { SEED_VERSION } from './schema'
import type { MockDb } from './schema'

const STORAGE_KEY = 'kurio.mock.db.v1'

let cache: MockDb | undefined

function read(): MockDb | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) return undefined

    const parsed = JSON.parse(raw) as MockDb

    /** Formato antigo é descartado em vez de migrado: é dado de simulação. */
    return parsed.seedVersion === SEED_VERSION ? parsed : undefined
  } catch {
    return undefined
  }
}

function write(db: MockDb) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch {
    /** Modo privado ou cota cheia: a sessão segue só em memória. */
  }
}

/** Leitura preguiçosa — o primeiro handler a rodar hidrata o banco. */
export function getDb(): MockDb {
  cache ??= read() ?? buildSeedDb()

  return cache
}

export function saveDb(db: MockDb) {
  cache = db
  write(db)
}

export function resetDb(): MockDb {
  const seeded = buildSeedDb()
  saveDb(seeded)

  return seeded
}
