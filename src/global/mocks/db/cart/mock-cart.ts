import { MockCartItem } from './mock-cart-item'
import type { CartSnapshot } from './cart-snapshot'
import type { NftEditionId } from '../../../type'

/**
 * Escrituração do carrinho: itens, cupom aplicado e versão. Não conhece
 * preço nem disponibilidade — essas invariantes cruzam agregados e por isso
 * pertencem ao `MockDb`.
 */
export class MockCart {
  constructor(
    readonly id: string,
    private entries: Array<MockCartItem>,
    private appliedCouponCode: string | undefined,
    private currentVersion: number,
    private lastUpdatedAt: string,
  ) {}

  static fromSnapshot(snapshot: CartSnapshot): MockCart {
    return new MockCart(
      snapshot.id,
      snapshot.items.map((item) => MockCartItem.fromSnapshot(item)),
      snapshot.couponCode,
      snapshot.version,
      snapshot.updatedAt,
    )
  }

  static seeded(id: string, items: Array<MockCartItem>): MockCart {
    return new MockCart(id, items, undefined, 1, new Date(0).toISOString())
  }

  toSnapshot(): CartSnapshot {
    return {
      id: this.id,
      items: this.entries.map((item) => item.toSnapshot()),
      couponCode: this.appliedCouponCode,
      version: this.currentVersion,
      updatedAt: this.lastUpdatedAt,
    }
  }

  get items(): ReadonlyArray<MockCartItem> {
    return this.entries
  }

  get couponCode(): string | undefined {
    return this.appliedCouponCode
  }

  get version(): number {
    return this.currentVersion
  }

  get updatedAt(): string {
    return this.lastUpdatedAt
  }

  findById(itemId: string): MockCartItem | undefined {
    return this.entries.find((item) => item.id === itemId)
  }

  findMatching(
    nftId: string,
    editionId: NftEditionId,
  ): MockCartItem | undefined {
    return this.entries.find((item) => item.matches(nftId, editionId))
  }

  add(item: MockCartItem): void {
    this.entries = [...this.entries, item]
  }

  replace(item: MockCartItem): void {
    this.entries = this.entries.map((entry) =>
      entry.id === item.id ? item : entry,
    )
  }

  remove(itemId: string): void {
    this.entries = this.entries.filter((entry) => entry.id !== itemId)
  }

  setCoupon(code: string | undefined): void {
    this.appliedCouponCode = code
  }

  /** Sobe a cada escrita: é o que deixa a interface descartar resposta atrasada. */
  setVersion(version: number): void {
    this.currentVersion = version
  }

  setUpdatedAt(updatedAt: string): void {
    this.lastUpdatedAt = updatedAt
  }
}
