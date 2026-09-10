import type { LinkProps } from '@tanstack/react-router'

type KnownRoute = NonNullable<LinkProps['to']>

/**
 * Destinos que a autenticação aceita depois de entrar. `redirect` chega pela
 * URL, ou seja, é entrada de fora: sem esta lista, um link montado por
 * terceiros escolheria para onde a pessoa vai ao autenticar.
 */
const ALLOWED: Array<string> = [
  '/',
  '/carrinho',
  '/pagamento',
  '/perfil',
  '/perfil/dados',
  '/perfil/carteiras',
]

export const DEFAULT_AUTH_REDIRECT = '/perfil'

export function toSafeRedirect(value?: string): KnownRoute {
  if (value && ALLOWED.includes(value)) return value as KnownRoute

  return DEFAULT_AUTH_REDIRECT
}
