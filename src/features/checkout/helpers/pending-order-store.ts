const STORAGE_KEY = 'kurio.checkout.pending.v1'

export type PendingOrder = {
  orderId: string
  /**
   * A chave usada na tentativa. Guardada junto porque uma retentativa
   * precisa reusá-la: chave nova criaria uma segunda compra.
   */
  idempotencyKey: string
}

/**
 * O pedido em aberto, fora do React, **por conta**.
 *
 * Vivia em `useState`, e por isso desaparecia ao recarregar. Guardado no
 * `localStorage`, precisa de dono: sem o escopo na chave, quem entrasse
 * depois no mesmo navegador tentaria recuperar a compra de outra pessoa.
 * É a chave da aplicação, e não do mock: descreve o que este navegador
 * estava fazendo, não o estado do servidor simulado.
 */
function keyOf(scope: string): string {
  return `${STORAGE_KEY}:${scope}`
}

export function readPendingOrder(scope: string): PendingOrder | undefined {
  try {
    const raw = localStorage.getItem(keyOf(scope))

    return raw ? (JSON.parse(raw) as PendingOrder) : undefined
  } catch {
    return undefined
  }
}

export function savePendingOrder(scope: string, pending: PendingOrder): void {
  try {
    localStorage.setItem(keyOf(scope), JSON.stringify(pending))
  } catch {
    /** Modo privado ou cota cheia: a sessão segue sem recuperação. */
  }
}

/** Só depois que o pedido chegou a um estado terminal e foi visto. */
export function clearPendingOrder(scope: string): void {
  try {
    localStorage.removeItem(keyOf(scope))
  } catch {
    /** Nada a limpar. */
  }
}
