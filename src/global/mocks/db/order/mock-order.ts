import type { OrderSnapshot } from './order-snapshot'

/**
 * Uma compra concluída. Nasce imutável: nenhum campo tem setter porque nada
 * num pedido confirmado muda depois.
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
}
