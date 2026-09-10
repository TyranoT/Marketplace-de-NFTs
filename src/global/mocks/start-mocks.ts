/**
 * Camada de mocks ligada por padrão: um checkout limpo, sem `.env`, precisa
 * rodar — e é o build de demonstração que a avaliação abre. `VITE_ENABLE_MOCKS
 * =false` desliga e libera o caminho para uma API real.
 */
export function isMocksEnabled() {
  return import.meta.env.VITE_ENABLE_MOCKS !== 'false'
}

export async function startMocks() {
  if (!isMocksEnabled() || typeof window === 'undefined') return

  /**
   * Import dinâmico sob a guarda: mantém `msw/browser` e todos os handlers
   * fora do bundle do servidor e em um chunk separado no cliente.
   */
  const { worker, syncMocksAcrossTabs } = await import('./browser')

  await worker.start({
    quiet: true,
    /** HMR, `/_serverFn/` e os assets de `public/` precisam passar direto. */
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: '/mockServiceWorker.js', options: { scope: '/' } },
  })

  syncMocksAcrossTabs()
}
