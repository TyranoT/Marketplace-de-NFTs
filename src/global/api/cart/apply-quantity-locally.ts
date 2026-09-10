import {
  addEth,
  minEth,
  mulEthByQuantity,
  parseEth,
  percentOfEth,
  subEth,
  toMoney,
} from '../../helpers/eth-amount'
import type { Wei } from '../../helpers/eth-amount'
import type { Cart, CartItem } from '../contracts/cart'

/**
 * Recalcula o carrinho inteiro no cliente, com a mesma aritmética que o
 * servidor simulado usa.
 *
 * Existe para a atualização otimista: mudar só a quantidade da linha deixaria
 * o resumo congelado por um instante, mostrando um total que não corresponde
 * a nenhum estado real. Como os dois lados compartilham `eth-amount`, o valor
 * provisório é idêntico ao que a resposta vai confirmar.
 */
function recalculate(cart: Cart, items: Array<CartItem>): Cart {
  const subtotal = items.reduce<Wei>(
    (total, item) => addEth(total, parseEth(item.lineTotal.amount)),
    0n,
  )

  const { coupon } = cart
  let discount: Wei = 0n

  if (coupon?.percentOff) discount = percentOfEth(subtotal, coupon.percentOff)
  else if (coupon?.amountOff)
    discount = minEth(parseEth(coupon.amountOff.amount), subtotal)

  /** A taxa acompanha a quantidade de linhas, não a de unidades. */
  const fee = items.length === 0 ? 0n : parseEth(cart.totals.networkFee.amount)

  return {
    ...cart,
    items,
    totals: {
      subtotal: toMoney(subtotal),
      discount: toMoney(discount),
      networkFee: toMoney(fee),
      total: toMoney(addEth(subEth(subtotal, discount), fee)),
    },
  }
}

export function applyQuantityLocally(
  cart: Cart,
  itemId: string,
  quantity: number,
): Cart {
  return recalculate(
    cart,
    cart.items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            quantity,
            lineTotal: toMoney(
              mulEthByQuantity(parseEth(item.unitPrice.amount), quantity),
            ),
          }
        : item,
    ),
  )
}

export function removeItemLocally(cart: Cart, itemId: string): Cart {
  return recalculate(
    cart,
    cart.items.filter((item) => item.id !== itemId),
  )
}
