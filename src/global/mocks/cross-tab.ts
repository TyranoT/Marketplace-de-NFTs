import { MOCK_DB_STORAGE_KEY, mockDbStore } from './db/core/mock-db-store'
import {
  SCENARIO_STORAGE_KEY,
  invalidateScenarioCache,
} from './scenario/config'

/**
 * Mantém o banco simulado desta aba em dia com as outras.
 *
 * Cada aba roda o seu próprio banco em memória e todas gravam no mesmo
 * `localStorage`. O evento `storage` só dispara nas **outras** abas, que é
 * exatamente quem precisa descartar a cópia antiga. Cobre o que não passa
 * por tempo real — mexer no carrinho, entrar, sair —; os eventos do
 * catálogo e dos pedidos são repassados pelo `RealtimeServer`.
 *
 * `key === null` é o `localStorage.clear()`: tudo pode ter mudado.
 */
export function syncMocksAcrossTabs(): void {
  window.addEventListener('storage', (event) => {
    if (event.key === null || event.key === MOCK_DB_STORAGE_KEY) {
      mockDbStore.invalidate()
    }

    if (event.key === null || event.key === SCENARIO_STORAGE_KEY) {
      invalidateScenarioCache()
    }
  })
}
