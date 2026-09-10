import type { Money } from './money'
import type { NftEditionId } from '../../type'
import type { OrderStatus } from './order'

/**
 * Caminho do Socket.IO, e **não** o padrão `/socket.io`.
 *
 * O `WebSocketHandler` do MSW reescreve `^/socket.io/` para `/` antes de
 * casar a rota. Com o padrão, o link teria de ser a raiz — que é exatamente
 * a URL do WebSocket de HMR do Vite (`ws://localhost:3000/`). Interceptá-la
 * derrubaria o recarregamento em desenvolvimento.
 */
export const REALTIME_PATH = '/realtime'

export const REALTIME_EVENTS = {
  nftUpdated: 'nft.updated',
  orderUpdated: 'order.updated',
  /**
   * Só da simulação, não do produto. O reset devolve as versões a 1, e sem
   * este aviso o cliente — que lembra das versões mais altas que já viu —
   * descartaria como antigas todas as mudanças seguintes.
   */
  mockReset: 'mock.reset',
} as const

/**
 * Cabeçalho comum a todo evento: identidade estável, recurso afetado e
 * versão. É o que permite descartar duplicata e evento atrasado sem regredir
 * um estado mais recente.
 */
export type RealtimeEventMeta = {
  /** Identidade do evento. Reentrega do mesmo id é ignorada. */
  id: string
  /** `nft:emerald-ape-042`, `order:KURIO-0001`. */
  resource: string
  /** Versão do recurso **depois** da mudança. */
  version: number
  emittedAt: string
  /**
   * Dono do recurso. `null` é público — o catálogo vale para todos. Um
   * evento com escopo só se aplica a quem está naquela sessão, senão dados
   * de um colecionador apareceriam para outro.
   */
  scope: string | null
}

export type NftEditionAvailability = {
  editionId: NftEditionId
  available: number
}

export type NftUpdatedEvent = RealtimeEventMeta & {
  nftId: string
  price: Money
  editions: Array<NftEditionAvailability>
}

export type OrderUpdatedEvent = RealtimeEventMeta & {
  orderId: string
  status: OrderStatus
  transactionHash?: string
  declineReason?: string
}

export type RealtimeStatus =
  'disabled' | 'connecting' | 'connected' | 'reconnecting' | 'disconnected'
