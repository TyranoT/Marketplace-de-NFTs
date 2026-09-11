import type { OrderSnapshot } from './order-snapshot'
import type { OrderStatus } from '../../../api/contracts/order'

/**
 * Uma compra.
 *
 * Deixou de ser imutável quando o pedido passou a nascer `pending`: o
 * desfecho chega depois, por `order.updated`. Só o **status** muda — itens,
 * valores e perfil continuam congelados no instante da compra, porque uma
 * mudança de preço não pode reescrever o que já aconteceu.
 *
 * A transição devolve um objeto novo, como `MockCartItem.withQuantity`, em
 * vez de mutar o que já foi lido.
 */
export class MockOrder {
  constructor(private readonly snapshot: OrderSnapshot) {}

  static fromSnapshot(snapshot: OrderSnapshot): MockOrder {
    return new MockOrder(snapshot)
  }

  toSnapshot(): OrderSnapshot {
    return this.snapshot
  }

  get id(): string {
    return this.snapshot.id
  }

  get createdAt(): string {
    return this.snapshot.createdAt
  }

  get walletId(): string {
    return this.snapshot.walletId
  }

  get ownerId(): string {
    return this.snapshot.ownerId
  }

  get status(): OrderStatus {
    return this.snapshot.status
  }

  get version(): number {
    return this.snapshot.version
  }

  get settleAt(): string | undefined {
    return this.snapshot.settleAt
  }

  /** Confirmado e recusado são terminais: deles não se sai. */
  get isTerminal(): boolean {
    return this.snapshot.status !== 'pending'
  }

  /** Já passou da hora de liquidar? É o que sustenta a recuperação após F5. */
  isDue(now: number = Date.now()): boolean {
    if (this.isTerminal || !this.snapshot.settleAt) return false

    return new Date(this.snapshot.settleAt).getTime() <= now
  }

  settle(status: OrderStatus, declineReason?: string): MockOrder {
    return new MockOrder({
      ...this.snapshot,
      status,
      declineReason,
      version: this.snapshot.version + 1,
      updatedAt: new Date().toISOString(),
      settleAt: undefined,
    })
  }
}
