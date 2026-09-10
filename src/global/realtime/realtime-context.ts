import { createContext, useContext } from 'react'
import type { Money } from '../api/contracts/money'
import type { RealtimeStatus } from '../api/contracts/realtime'

/**
 * Um evento como ele chegou. `applied: false` é o registro de um descarte —
 * duplicata, versão antiga ou escopo alheio —, e é justamente o que torna a
 * regra de ordenação observável em vez de invisível.
 */
export type RealtimeLogEntry = {
  id: string
  name: string
  resource: string
  version: number
  receivedAt: string
  applied: boolean
}

/**
 * Uma mudança que atingiu algo que o colecionador tem no carrinho. O total
 * se atualiza sozinho; isto existe para dizer **por quê**.
 */
export type CartChangeAlert = {
  id: string
  nftId: string
  name: string
  previousPrice: Money
  nextPrice: Money
  previousAvailable: number
  nextAvailable: number
}

export type RealtimeContextValue = {
  status: RealtimeStatus
  log: Array<RealtimeLogEntry>
  alerts: Array<CartChangeAlert>
  dismissAlert: (id: string) => void
}

const RealtimeContext = createContext<RealtimeContextValue>({
  status: 'disabled',
  log: [],
  alerts: [],
  dismissAlert: () => undefined,
})

export const RealtimeProviderContext = RealtimeContext

export function useRealtime(): RealtimeContextValue {
  return useContext(RealtimeContext)
}
