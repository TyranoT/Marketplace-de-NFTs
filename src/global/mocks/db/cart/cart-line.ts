import { addEth, mulEthByQuantity } from '../../../helpers/eth-amount'
import type { Wei } from '../../../helpers/eth-amount'
import type { MockCartItem } from './mock-cart-item'
import type { Nft } from '../../../type'

/**
 * Item do carrinho já resolvido contra catálogo, preço e disponibilidade.
 * É a forma que o cálculo de totais e o mapeamento para o contrato consomem,
 * o que evita os dois refazerem a mesma junção.
 */
export class CartLine {
  constructor(
    readonly item: MockCartItem,
    readonly nft: Nft,
    readonly unitPrice: Wei,
    readonly available: number,
    /** Versão do NFT no catálogo, para o cliente ordenar os eventos. */
    readonly version: number,
  ) {}

  get lineTotal(): Wei {
    return mulEthByQuantity(this.unitPrice, this.item.quantity)
  }

  static sum(lines: ReadonlyArray<CartLine>): Wei {
    return lines.reduce<Wei>((total, line) => addEth(total, line.lineTotal), 0n)
  }
}
