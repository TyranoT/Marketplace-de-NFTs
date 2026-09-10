import axios from 'axios'
import { toApiError } from './api-error'

/**
 * Cliente HTTP único do projeto.
 *
 * `baseURL` relativo de propósito: funciona em dev, no preview e na Vercel
 * sem variável de ambiente, e é o mesmo caminho que o Service Worker do MSW
 * intercepta.
 */
export const http = axios.create({
  baseURL: '/api',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

/**
 * Correlaciona a requisição com o log do servidor simulado — é o que torna um
 * cenário de falha rastreável quando o mesmo endpoint é chamado várias vezes.
 */
http.interceptors.request.use((config) => {
  config.headers.set('x-request-id', crypto.randomUUID())

  return config
})

/**
 * O interceptor apenas normaliza o erro de transporte. Ele nunca substitui
 * payload, devolve fallback nem decide o que a interface faz — o código de
 * negócio chega intacto ao hook que o consome.
 */
http.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error)),
)
