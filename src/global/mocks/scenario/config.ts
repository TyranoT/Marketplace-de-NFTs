export type MockLatency = 'none' | 'fast' | 'slow' | 'variable'

export type MockScenario = {
  seed: number
  latency: MockLatency
  /** 0..1 — proporção de requisições que falham com 503. */
  failureRate: number
  forceStatus?: number
  /** Alterna a latência por requisição para provocar respostas fora de ordem. */
  outOfOrder: boolean
  offline: boolean
}

const STORAGE_KEY = 'kurio.mock.scenario'

const DEFAULT_SCENARIO: MockScenario = {
  seed: 1,
  latency: 'fast',
  failureRate: 0,
  outOfOrder: false,
  offline: false,
}

const LATENCIES: Array<MockLatency> = ['none', 'fast', 'slow', 'variable']

function fromSearch(search: URLSearchParams): Partial<MockScenario> {
  const partial: Partial<MockScenario> = {}
  const mode = search.get('mock')
  const seed = search.get('mockSeed')
  const failureRate = search.get('mockFail')
  const forceStatus = search.get('mockStatus')

  /**
   * `mock` escolhe **um** modo, e escolhê-lo desliga os outros. Sem isso um
   * `?mock=offline` gravado no armazenamento sobreviveria a um `?mock=fast`
   * seguinte, e a sessão continuaria offline sem nada na URL que explicasse
   * o motivo — foi assim que um cenário antigo passou por falha nova durante
   * o desenvolvimento.
   */
  if (mode) {
    partial.offline = mode === 'offline'
    partial.outOfOrder = mode === 'outOfOrder'

    if (LATENCIES.includes(mode as MockLatency)) {
      partial.latency = mode as MockLatency
    }
  }

  if (seed) partial.seed = Number(seed)
  if (failureRate) partial.failureRate = Number(failureRate)
  if (forceStatus) partial.forceStatus = Number(forceStatus)

  return partial
}

function read(): Partial<MockScenario> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    return raw ? (JSON.parse(raw) as Partial<MockScenario>) : {}
  } catch {
    return {}
  }
}

let cache: MockScenario | undefined

/**
 * Precedência: query string > `localStorage` > padrão. O que vem da URL é
 * persistido, então o cenário sobrevive ao refresh — sem isso não dá para
 * testar "recuperação após recarregar" sob latência ou falha.
 */
export function getScenario(): MockScenario {
  if (cache) return cache

  const stored = read()
  const search =
    typeof window === 'undefined'
      ? new URLSearchParams()
      : new URLSearchParams(window.location.search)

  const fromUrl = fromSearch(search)
  cache = { ...DEFAULT_SCENARIO, ...stored, ...fromUrl }

  if (Object.keys(fromUrl).length > 0) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
    } catch {
      /** Sem persistência o cenário vale só para esta sessão. */
    }
  }

  return cache
}

export function resetScenario() {
  cache = undefined

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /** Nada a limpar. */
  }
}

/**
 * Troca o cenário sem recarregar a página.
 *
 * Necessário para exercitar falha e recuperação numa mesma sessão: carregar
 * a lista com sucesso, derrubar a próxima escrita e ver a interface se
 * recompor. Se o único caminho fosse a query string, o próprio carregamento
 * inicial já falharia e o cenário nunca seria observável.
 */
export function setScenario(partial: Partial<MockScenario>) {
  cache = { ...getScenario(), ...partial }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
  } catch {
    /** Vale só para esta sessão. */
  }

  return cache
}
