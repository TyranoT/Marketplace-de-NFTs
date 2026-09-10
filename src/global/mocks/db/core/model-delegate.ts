/**
 * Vocabulário de leitura comum a todos os modelos, no formato do Prisma
 * Client. A subclasse descreve apenas de onde vêm as linhas e como uma linha
 * casa com o filtro — a busca em si é escrita uma vez só, e todo modelo passa
 * a ser consultado da mesma maneira.
 */
export abstract class ModelDelegate<TRecord, TWhere> {
  protected abstract list(): Array<TRecord>

  protected abstract matches(record: TRecord, where: TWhere): boolean

  findMany(args?: { where?: TWhere }): Array<TRecord> {
    const where = args?.where

    if (!where) return this.list()

    return this.list().filter((record) => this.matches(record, where))
  }

  findFirst(args?: { where?: TWhere }): TRecord | null {
    return this.findMany(args)[0] ?? null
  }

  findUnique(args: { where: TWhere }): TRecord | null {
    return this.findFirst(args)
  }

  count(args?: { where?: TWhere }): number {
    return this.findMany(args).length
  }
}

/** Contrato de escrita, implementado só pelos modelos que aceitam mutação. */
export interface WritableDelegate<
  TRecord,
  TWhereUnique,
  TCreateInput,
  TUpdateInput,
> {
  create: (args: { data: TCreateInput }) => TRecord
  update: (args: { where: TWhereUnique; data: TUpdateInput }) => TRecord
  delete: (args: { where: TWhereUnique }) => TRecord
}
