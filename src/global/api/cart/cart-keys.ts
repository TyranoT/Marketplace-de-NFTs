/**
 * Identificador do dono do carrinho. Hoje é sempre o visitante, mas a chave
 * já nasce com o escopo para que autenticação e logout não exijam reescrever
 * o cache — trocar o escopo isola os dados de cada usuário por construção.
 */
export type CartScope = string

export const GUEST_SCOPE: CartScope = 'guest'

export const cartKeys = {
  all: ['cart'] as const,
  detail: (scope: CartScope) => [...cartKeys.all, scope, 'detail'] as const,
}

export function useCartScope(): CartScope {
  return GUEST_SCOPE
}
