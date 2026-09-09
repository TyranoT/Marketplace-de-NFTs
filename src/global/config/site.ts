const baseUrl = import.meta.env.VITE_SITE_URL ?? ''

export const SITE = {
  name: 'Kurio',
  title: 'Kurio · Marketplace de NFTs',
  description:
    'Descubra, colecione e negocie NFTs de artistas independentes na Kurio.',
  locale: 'pt_BR',
  url: baseUrl,
  themeColor: '#140d0a',
  ogImage: {
    path: '/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Kurio — Marketplace de NFTs',
  },
}

/**
 * Crawlers de Open Graph exigem URL absoluta. Em produção defina
 * VITE_SITE_URL; sem ela o caminho relativo mantém o preview local
 * funcionando.
 */
export function absoluteUrl(path: string) {
  return baseUrl ? new URL(path, baseUrl).toString() : path
}
