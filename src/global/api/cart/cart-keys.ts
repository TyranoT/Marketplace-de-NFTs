import { useCurrentUser } from '../user'

/**
 * Identificador do dono do carrinho. Nasceu com escopo justamente para que
 * autenticação e logout não exigissem reescrever o cache — trocar o escopo
 * isola os dados de cada usuário por construção.
 */
export type CartScope = string

export const GUEST_SCOPE: CartScope = 'guest'

export const cartKeys = {
  all: ['cart'] as const,
  detail: (scope: CartScope) => [...cartKeys.all, scope, 'detail'] as const,
}

export function useCartScope(): CartScope {
  return useCurrentUser()?.id ?? GUEST_SCOPE
}
