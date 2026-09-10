import { useQuery } from '@tanstack/react-query'
import { cartQueryOptions } from './cart-query-options'
import { useCartScope } from './cart-keys'

/**
 * Soma das unidades no carrinho, ou `undefined` enquanto ela é desconhecida.
 *
 * O `undefined` é intencional: o cabeçalho é renderizado no servidor, onde o
 * carrinho não existe. Devolver um número ali criaria uma árvore diferente da
 * do cliente e quebraria a hidratação. Com as duas primeiras renderizações
 * idênticas, o selo só aparece depois que a consulta resolve.
 */
export function useCartCount(): number | undefined {
  const { data } = useQuery({
    ...cartQueryOptions(useCartScope()),
    select: (cart) =>
      cart.items.reduce((total, item) => total + item.quantity, 0),
  })

  return data
}
