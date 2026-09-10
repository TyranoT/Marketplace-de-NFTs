import { useQuery } from '@tanstack/react-query'
import { getMe } from './user-api'
import { userKeys } from './user-keys'
import type { ApiError } from '../api-error'
import type { User } from '../contracts/user'

/**
 * 401 é resposta, não falha: a política de `query-client.ts` já não repete
 * `unauthorized`, então o visitante anônimo termina em erro imediato em vez
 * de ficar tentando entrar numa conta que não existe.
 *
 * `enabled` desliga a consulta no servidor pela mesma razão do carrinho: o
 * cabeçalho é renderizado no SSR, e uma consulta iniciada ali fica suspensa —
 * sem rede, o servidor não tem como buscar nada — e o cliente hidrata já
 * travado, sem nunca disparar a busca.
 */
export function useMe() {
  return useQuery<User, ApiError>({
    queryKey: userKeys.me(),
    queryFn: ({ signal }) => getMe({ signal }),
    enabled: typeof window !== 'undefined',
  })
}

/** `undefined` enquanto carrega, e também quando ninguém está autenticado. */
export function useCurrentUser(): User | undefined {
  return useMe().data
}
