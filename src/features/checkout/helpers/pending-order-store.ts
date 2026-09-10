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
 * O pedido em aberto, fora do React.
 *
 * Vivia em `useState`, e por isso desaparecia ao recarregar — o colecionador
 * ficava sem saber se a compra tinha acontecido, e o único caminho era
 * tentar de novo. É a chave da aplicação, e não do mock: descreve o que
 * *este navegador* estava fazendo, não o estado do servidor simulado.
 */
export function readPendingOrder(): PendingOrder | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    return raw ? (JSON.parse(raw) as PendingOrder) : undefined
  } catch {
    return undefined
  }
}

export function savePendingOrder(pending: PendingOrder): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pending))
  } catch {
    /** Modo privado ou cota cheia: a sessão segue sem recuperação. */
  }
}

/** Só depois que o pedido chegou a um estado terminal e foi visto. */
export function clearPendingOrder(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /** Nada a limpar. */
  }
}
