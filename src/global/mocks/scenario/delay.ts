import { delay } from 'msw'
import { getScenario } from './config'
import { mulberry32 } from './random'

const RANGES = {
  none: [0, 0],
  fast: [80, 160],
  slow: [900, 1600],
  variable: [100, 1400],
} as const

/** Alterna 800ms / 120ms por requisição — a segunda sempre chega antes. */
const OUT_OF_ORDER = [800, 120]

let requestIndex = 0
let random: (() => number) | undefined

export function nextRequestIndex() {
  requestIndex += 1

  return requestIndex
}

export async function applyLatency(index: number) {
  const scenario = getScenario()

  if (scenario.outOfOrder) {
    await delay(OUT_OF_ORDER[index % OUT_OF_ORDER.length])

    return
  }

  random ??= mulberry32(scenario.seed)
  const [min, max] = RANGES[scenario.latency]

  await delay(min === max ? min : Math.round(min + random() * (max - min)))
}
