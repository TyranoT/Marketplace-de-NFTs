import { QueryClient } from '@tanstack/react-query'
import { isApiError } from './api-error'

const MAX_RETRIES = 2

/**
 * Um `QueryClient` por chamada de `getRouter()` — ou seja, um por request no
 * servidor. Um singleton em escopo de módulo vazaria cache de um visitante
 * para o próximo na mesma instância do Nitro.
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        /**
         * `always` em vez do padrão `online`: com `online`, uma falha de rede
         * deixa a consulta *pausada* — sem erro, sem dado e sem fim — e a
         * interface fica presa no esqueleto, sem nada a dizer nem a tentar.
         * Aqui a falha vira erro de verdade, com mensagem e nova tentativa.
         *
         * Também é o modo coerente com o backend simulado, que vive num
         * Service Worker local: "o navegador está offline" não descreve a
         * indisponibilidade que se quer representar.
         */
        networkMode: 'always',
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        /**
         * Nunca repetir 4xx: cupom inválido, edição esgotada e conflito de
         * disponibilidade são vereditos do servidor, não falhas transitórias.
         * Repetir só atrasaria o retorno ao usuário.
         */
        retry: (failureCount, error) => {
          if (!isApiError(error)) return false
          if (error.kind !== 'network' && error.kind !== 'server') return false

          return failureCount < MAX_RETRIES
        },
        retryDelay: (attempt) => Math.min(1_000 * 2 ** attempt, 8_000),
      },
      mutations: { networkMode: 'always', retry: false },
    },
  })
}
