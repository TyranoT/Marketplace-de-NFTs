/**
 * Larguras mínimas, em pixels, de cada faixa de dispositivo.
 *
 * Espelham os tokens `--breakpoint-tablet`, `--breakpoint-notebook` e
 * `--breakpoint-desktop` declarados em `src/styles.css`. Alterar um dos lados
 * exige alterar o outro para que CSS e JavaScript concordem sobre a faixa ativa.
 */
export const DEVICE_MIN_WIDTH = {
  mobile: 0,
  tablet: 768,
  notebook: 1024,
  desktop: 1440,
} as const

export type DeviceTier = keyof typeof DEVICE_MIN_WIDTH

/**
 * Faixas da mais larga para a mais estreita. A primeira cujo `min-width`
 * corresponde à viewport é a faixa ativa.
 */
export const DEVICE_TIERS = [
  'desktop',
  'notebook',
  'tablet',
  'mobile',
] as const satisfies ReadonlyArray<DeviceTier>

export const FALLBACK_DEVICE_TIER: DeviceTier = 'desktop'
