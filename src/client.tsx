import { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/react-start/client'
import { startMocks } from '@/global/mocks/start-mocks'

/**
 * Override do entry padrão do Start, idêntico a ele exceto por aguardar o
 * Service Worker do MSW.
 *
 * O `await` não é opcional: `worker.start()` só resolve quando o worker está
 * de fato *controlando* a página. Hidratar antes disso deixaria a primeira
 * consulta — a contagem do carrinho no cabeçalho — escapar da interceptação e
 * bater em 404 real.
 */
async function bootstrap() {
  await startMocks()

  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <StartClient />
      </StrictMode>,
    )
  })
}

void bootstrap()
