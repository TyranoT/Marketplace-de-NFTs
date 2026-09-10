import { getCart } from './cart-api'
import { cartKeys } from './cart-keys'
import type { CartScope } from './cart-keys'

/**
 * Opções compartilhadas por quem lê o carrinho.
 *
 * `enabled` desliga a consulta no servidor. Não é otimização: o cabeçalho é
 * renderizado no SSR e chama esta consulta, e uma consulta iniciada ali fica
 * suspensa — sem rede, o servidor não tem como buscar nada. Esse estado
 * suspenso viajava na desidratação e o cliente hidratava já travado, sem
 * nunca disparar a busca. Mantendo-a desligada no servidor, ela nasce no
 * cliente, onde o carrinho de fato existe.
 */
export function cartQueryOptions(scope: CartScope) {
  return {
    queryKey: cartKeys.detail(scope),
    queryFn: ({ signal }: { signal: AbortSignal }) => getCart({ signal }),
    enabled: typeof window !== 'undefined',
  }
}
