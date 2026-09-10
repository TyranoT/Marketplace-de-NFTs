import { ModelDelegate } from '../core/model-delegate'
import type { MockDbStore } from '../core/mock-db-store'
import type { IdempotencyRecord } from '../core/snapshot'

export type IdempotencyEntry = IdempotencyRecord & { key: string }

export type IdempotencyWhere = {
  key?: string
}

/**
 * Chaves de idempotência já usadas.
 *
 * Guardar o resumo do conteúdo, e não só o id do pedido, é o que permite
 * distinguir os dois casos que o enunciado separa: a mesma tentativa
 * reenviada (devolve o mesmo pedido) e uma tentativa diferente reusando a
 * chave (conflito).
 */
export class IdempotencyDelegate extends ModelDelegate<
  IdempotencyEntry,
  IdempotencyWhere
> {
  constructor(private readonly store: MockDbStore) {
    super()
  }

  create(args: { data: IdempotencyEntry }): IdempotencyEntry {
    const { key, ...record } = args.data

    this.store.load().idempotency.set(key, record)

    return args.data
  }

  protected list(): Array<IdempotencyEntry> {
    return [...this.store.load().idempotency].map(([key, record]) => ({
      key,
      ...record,
    }))
  }

  protected matches(entry: IdempotencyEntry, where: IdempotencyWhere): boolean {
    return !where.key || entry.key === where.key
  }
}
