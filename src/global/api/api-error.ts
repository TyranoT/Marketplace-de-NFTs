import { AxiosError } from 'axios'

/**
 * Classificação de **transporte**, não de negócio. Diz o que aconteceu com a
 * requisição; o que a interface faz a respeito é decisão de quem consome.
 */
export type ApiErrorKind =
  | 'network'
  | 'timeout'
  | 'canceled'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'validation'
  | 'server'
  | 'unknown'

/** Formato de erro devolvido pela API simulada. */
export type ApiErrorPayload = {
  error: {
    code: string
    message: string
    details?: Record<string, string>
  }
}

type ApiErrorInit = {
  kind: ApiErrorKind
  message: string
  status?: number
  code?: string
  details?: Record<string, string>
  requestId?: string
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status?: number
  /**
   * Código de negócio da API (`COUPON_EXPIRED`, `EDITION_SOLD_OUT`…),
   * repassado sem interpretação. Traduzir para texto é papel da feature.
   */
  readonly code?: string
  readonly details?: Record<string, string>
  readonly requestId?: string

  constructor({
    kind,
    message,
    status,
    code,
    details,
    requestId,
  }: ApiErrorInit) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
    this.code = code
    this.details = details
    this.requestId = requestId
  }
}

const KIND_BY_STATUS: Record<number, ApiErrorKind> = {
  401: 'unauthorized',
  403: 'forbidden',
  404: 'not_found',
  409: 'conflict',
  422: 'validation',
}

function kindFromStatus(status: number): ApiErrorKind {
  return KIND_BY_STATUS[status] ?? (status >= 500 ? 'server' : 'unknown')
}

function isPayload(data: unknown): data is ApiErrorPayload {
  if (typeof data !== 'object' || data === null || !('error' in data))
    return false

  const { error } = data

  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  )
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) return error

  if (!(error instanceof AxiosError)) {
    return new ApiError({
      kind: 'unknown',
      message: error instanceof Error ? error.message : 'Falha inesperada.',
    })
  }

  const requestId = error.config?.headers['x-request-id'] as string | undefined

  if (error.code === AxiosError.ERR_CANCELED) {
    return new ApiError({
      kind: 'canceled',
      message: 'Requisição cancelada.',
      requestId,
    })
  }

  if (
    error.code === AxiosError.ECONNABORTED ||
    error.code === AxiosError.ETIMEDOUT
  ) {
    return new ApiError({
      kind: 'timeout',
      message: 'A requisição excedeu o tempo limite.',
      requestId,
    })
  }

  if (!error.response) {
    return new ApiError({
      kind: 'network',
      message: 'Não foi possível conectar ao servidor.',
      requestId,
    })
  }

  const { status, data } = error.response
  const payload = isPayload(data) ? data.error : undefined

  return new ApiError({
    kind: kindFromStatus(status),
    message: payload?.message ?? error.message,
    status,
    code: payload?.code,
    details: payload?.details,
    requestId,
  })
}
