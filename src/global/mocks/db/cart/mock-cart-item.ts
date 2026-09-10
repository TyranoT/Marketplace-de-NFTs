import type { CartItemSnapshot } from './cart-snapshot'
import type { NftEditionId } from '../../../type'

/**
 * Linha do carrinho como está guardada: imutável, para que uma mudança de
 * quantidade produza um item novo em vez de alterar o que já foi lido.
 */
export class MockCartItem {
  constructor(
    readonly id: string,
    readonly nftId: string,
    readonly editionId: NftEditionId,
    readonly quantity: number,
  ) {}

  static create(
    nftId: string,
    editionId: NftEditionId,
    quantity: number,
  ): MockCartItem {
    return new MockCartItem(
      `item-${nftId}-${editionId}`,
      nftId,
      editionId,
      quantity,
    )
  }

  static fromSnapshot(snapshot: CartItemSnapshot): MockCartItem {
    return new MockCartItem(
      snapshot.id,
      snapshot.nftId,
      snapshot.editionId,
      snapshot.quantity,
    )
  }

  toSnapshot(): CartItemSnapshot {
    return {
      id: this.id,
      nftId: this.nftId,
      editionId: this.editionId,
      quantity: this.quantity,
    }
  }

  matches(nftId: string, editionId: NftEditionId): boolean {
    return this.nftId === nftId && this.editionId === editionId
  }

  withQuantity(quantity: number): MockCartItem {
    return new MockCartItem(this.id, this.nftId, this.editionId, quantity)
  }
}
