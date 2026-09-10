import type { RealtimeEventMeta } from '../api/contracts/realtime'

/** Teto do histórico de ids. Sem limite, uma sessão longa cresceria sem fim. */
const MAX_SEEN = 500

/**
 * Guarda que decide se um evento deve ser aplicado.
 *
 * O enunciado exige tolerar duplicatas e eventos antigos sem regredir um
 * estado mais recente nem reaplicar efeitos. São duas perguntas diferentes:
 * "já vi este evento?" (id) e "este evento é mais novo que o que tenho?"
 * (versão por recurso). Uma só não basta — um evento inédito pode chegar
 * atrasado, e um evento repetido pode trazer a versão corrente.
 *
 * `record` também é alimentado pelas respostas REST: sem isso, um evento em
 * voo poderia sobrescrever um dado que a rede já trouxe mais novo.
 */
export class EventLedger {
  private readonly seen = new Set<string>()
  private readonly versions = new Map<string, number>()

  shouldApply(meta: RealtimeEventMeta, currentScope: string): boolean {
    if (meta.scope != null && meta.scope !== currentScope) return false
    if (this.seen.has(meta.id)) return false

    const known = this.versions.get(meta.resource)

    if (known !== undefined && meta.version <= known) return false

    this.remember(meta.id)
    this.versions.set(meta.resource, meta.version)

    return true
  }

  /** Chamado também com o que veio do REST, que é a fonte de verdade. */
  record(resource: string, version: number): void {
    const known = this.versions.get(resource)

    if (known === undefined || version > known) {
      this.versions.set(resource, version)
    }
  }

  versionOf(resource: string): number | undefined {
    return this.versions.get(resource)
  }

  /** Trocar de usuário zera tudo: o que foi visto pertencia a outra sessão. */
  reset(): void {
    this.seen.clear()
    this.versions.clear()
  }

  private remember(id: string): void {
    if (this.seen.size >= MAX_SEEN) {
      const oldest = this.seen.values().next().value

      if (oldest !== undefined) this.seen.delete(oldest)
    }

    this.seen.add(id)
  }
}
