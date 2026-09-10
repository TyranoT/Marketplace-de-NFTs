import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useCartScope } from '../api/cart'
import { isMocksEnabled } from '../mocks/start-mocks'
import { REALTIME_EVENTS } from '../api/contracts/realtime'
import { affectedCartItem, applyNftUpdated } from './apply-nft-updated'
import { applyOrderUpdated } from './apply-order-updated'
import { EventLedger } from './event-ledger'
import { RealtimeProviderContext } from './realtime-context'
import type { Socket } from 'socket.io-client'
import type {
  NftUpdatedEvent,
  OrderUpdatedEvent,
  RealtimeStatus,
} from '../api/contracts/realtime'
import type { CartChangeAlert, RealtimeLogEntry } from './realtime-context'

type RealtimeProviderProps = {
  children: React.ReactNode
}

/** Últimos eventos guardados para o painel de simulação. */
const MAX_LOG = 20

/**
 * Ciclo de vida da conexão de tempo real.
 *
 * Fica dentro do `QueryClientProvider` que a integração do router injeta,
 * porque todo evento termina em escrita no cache.
 *
 * O escopo entra nas dependências do efeito de propósito: entrar, sair ou
 * trocar de conta refaz a conexão e zera o histórico. Sem isso, eventos de
 * uma sessão anterior atualizariam dados de outro colecionador.
 */
export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const queryClient = useQueryClient()
  const scope = useCartScope()

  const [status, setStatus] = useState<RealtimeStatus>('disabled')
  const [log, setLog] = useState<Array<RealtimeLogEntry>>([])
  const [alerts, setAlerts] = useState<Array<CartChangeAlert>>([])

  const ledgerRef = useRef(new EventLedger())

  const dismissAlert = useCallback((id: string) => {
    setAlerts((current) => current.filter((alert) => alert.id !== id))
  }, [])

  useEffect(() => {
    /**
     * Guarda de compilação, não de execução: o efeito já não roda no
     * servidor. O Vite substitui `import.meta.env.SSR` por uma constante em
     * cada build, e no do servidor tudo abaixo daqui vira código morto —
     * é o que mantém `socket.io-client` e `engine.io-client` fora de
     * `.output/server`. Só o import dinâmico não bastava: o módulo continua
     * alcançável a partir do `__root.tsx`, e o chunk era emitido dos dois
     * lados.
     */
    if (import.meta.env.SSR) return

    if (!isMocksEnabled()) {
      setStatus('disabled')

      return
    }

    /**
     * O efeito é assíncrono e o StrictMode o monta duas vezes. Sem esta
     * bandeira, a conexão criada pela montagem descartada sobreviveria à
     * limpeza e todo evento chegaria em dobro.
     */
    let disposed = false
    let socket: Socket | undefined

    const ledger = ledgerRef.current
    ledger.reset()

    setStatus('connecting')
    setLog([])
    setAlerts([])

    const append = (entry: RealtimeLogEntry) =>
      setLog((current) => [entry, ...current].slice(0, MAX_LOG))

    /**
     * O módulo inteiro entra por import dinâmico, e não só o
     * `socket.io-client` dentro dele: este provider é alcançável a partir
     * do `__root.tsx`, que renderiza no servidor, e um import estático
     * arrastaria `socket.io-client` e `engine.io-client` para o bundle do
     * servidor — 227kB que ele nunca executa. É a mesma técnica de
     * `start-mocks.ts`, e vale conferir no `.output/server` ao mudar isto.
     */
    void import('./create-socket')
      .then(({ createSocket }) => createSocket({ scope }))
      .then((created) => {
        if (disposed) {
          created.disconnect()

          return
        }

        socket = created

        created.on('connect', () => setStatus('connected'))
        created.io.on('reconnect_attempt', () => setStatus('reconnecting'))
        created.on('disconnect', () => setStatus('disconnected'))

        /**
         * Reconexão reconcilia com o REST: enquanto esteve fora, eventos se
         * perderam, e só o servidor sabe o estado atual.
         */
        created.io.on('reconnect', () => {
          ledger.reset()
          void queryClient.refetchQueries({ type: 'active' })
        })

        /**
         * O cenário voltou à semente e as versões voltaram a 1. Sem esquecer
         * as que já viu, este cliente descartaria como antigas todas as
         * mudanças seguintes — foi assim que um preço alterado depois de um
         * reset deixou de aparecer.
         */
        created.on(REALTIME_EVENTS.mockReset, () => {
          ledger.reset()
          setAlerts([])
          void queryClient.invalidateQueries()
        })

        created.on(REALTIME_EVENTS.nftUpdated, (event: NftUpdatedEvent) => {
          const applied = ledger.shouldApply(event, scope)

          append({
            id: event.id,
            name: REALTIME_EVENTS.nftUpdated,
            resource: event.resource,
            version: event.version,
            receivedAt: new Date().toISOString(),
            applied,
          })

          if (!applied) return

          /** Lido antes de aplicar: depois, o valor anterior já se perdeu. */
          const item = affectedCartItem(queryClient, event, scope)

          applyNftUpdated(queryClient, event, scope)

          if (!item) return

          const nextAvailable =
            event.editions.find(({ editionId }) => editionId === item.editionId)
              ?.available ?? item.available

          /** Só avisa o que de fato mudou para quem tem o item no carrinho. */
          if (
            item.unitPrice.amount === event.price.amount &&
            item.available === nextAvailable
          ) {
            return
          }

          setAlerts((current) => [
            ...current.filter((alert) => alert.nftId !== event.nftId),
            {
              id: event.id,
              nftId: event.nftId,
              name: item.name,
              previousPrice: item.unitPrice,
              nextPrice: event.price,
              previousAvailable: item.available,
              nextAvailable,
            },
          ])
        })

        created.on(REALTIME_EVENTS.orderUpdated, (event: OrderUpdatedEvent) => {
          const applied = ledger.shouldApply(event, scope)

          append({
            id: event.id,
            name: REALTIME_EVENTS.orderUpdated,
            resource: event.resource,
            version: event.version,
            receivedAt: new Date().toISOString(),
            applied,
          })

          if (applied) applyOrderUpdated(queryClient, event, scope)
        })

        created.connect()
      })

    return () => {
      disposed = true
      socket?.removeAllListeners()
      socket?.disconnect()
      setStatus('disabled')
    }
  }, [queryClient, scope])

  const value = useMemo(
    () => ({ status, log, alerts, dismissAlert }),
    [status, log, alerts, dismissAlert],
  )

  return (
    <RealtimeProviderContext value={value}>{children}</RealtimeProviderContext>
  )
}
