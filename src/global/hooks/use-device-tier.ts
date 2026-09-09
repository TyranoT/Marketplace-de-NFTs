import { useSyncExternalStore } from 'react'
import {
  DEVICE_MIN_WIDTH,
  DEVICE_TIERS,
  FALLBACK_DEVICE_TIER,
} from '../config/breakpoints'
import type { DeviceTier } from '../config/breakpoints'

const mediaQueries = new Map<DeviceTier, MediaQueryList>()

function getMediaQuery(tier: DeviceTier) {
  const cached = mediaQueries.get(tier)

  if (cached) return cached

  const created = window.matchMedia(`(min-width: ${DEVICE_MIN_WIDTH[tier]}px)`)
  mediaQueries.set(tier, created)

  return created
}

function subscribe(notify: () => void) {
  const watched = DEVICE_TIERS.map(getMediaQuery)
  watched.forEach((query) => query.addEventListener('change', notify))

  return () => {
    watched.forEach((query) => query.removeEventListener('change', notify))
  }
}

function readDeviceTier(): DeviceTier {
  return (
    DEVICE_TIERS.find((tier) => getMediaQuery(tier).matches) ??
    FALLBACK_DEVICE_TIER
  )
}

function readServerDeviceTier(): DeviceTier {
  return FALLBACK_DEVICE_TIER
}

/**
 * Faixa de dispositivo correspondente à largura atual da viewport:
 * `mobile` (< 768px), `tablet` (768–1023px), `notebook` (1024–1439px) ou
 * `desktop` (>= 1440px).
 *
 * Use apenas para decisões que o CSS não expressa — montar ou não um
 * componente, escolher entre drawer e sidebar, ligar um observer. Para
 * simplesmente mostrar ou esconder elementos, prefira as variantes
 * `tablet:`, `notebook:` e `desktop:` do Tailwind: elas já valem na primeira
 * pintura do SSR, enquanto este hook só resolve a faixa real após a
 * hidratação (no servidor ele devolve `desktop`).
 *
 * @returns A faixa ativa, reavaliada a cada mudança de viewport.
 */
export function useDeviceTier(): DeviceTier {
  return useSyncExternalStore(subscribe, readDeviceTier, readServerDeviceTier)
}
