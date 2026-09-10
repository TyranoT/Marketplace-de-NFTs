import { toSocketIo } from '@mswjs/socket.io-binding'
import { mockDbStore } from '../db/core/mock-db-store'
import { invalidateScenarioCache } from '../scenario/config'
import { RealtimeClient } from './realtime-client'
import { REALTIME_EVENTS } from '../../api/contracts/realtime'
import type { WebSocketHandlerConnection } from 'msw'
import type {
  NftUpdatedEvent,
  OrderUpdatedEvent,
} from '../../api/contracts/realtime'

const GUEST_SCOPE = 'guest'

const CHANNEL_NAME = 'kurio.realtime'

type RelayMessage = {
  name: string
  payload: unknown
  scope: string | null
}

/**
 * O "servidor" de tempo real da simulação.
 *
 * Existe porque o binding não oferece broadcast: o `broadcast()` do
 * `ws.link()` envia bytes crus, sem o enquadramento do Socket.IO, e o
 * `toSocketIo` só existe dentro do ouvinte de `connection`. Manter o
 * registro das conexões vivas é o que permite a um handler HTTP — o painel
 * de simulação — disparar um evento.
 *
 * **Uma instância por aba.** Os handlers do MSW rodam na página, e não no
 * Service Worker, então cada aba tem o seu servidor e só enxerga os próprios
 * sockets. O `BroadcastChannel` é o que faz uma mudança feita no painel de
 * uma aba chegar ao catálogo aberto em outra.
 */
export class RealtimeServer {
  private readonly clients = new Map<string, RealtimeClient>()
  private readonly channel?: BroadcastChannel

  constructor() {
    if (typeof BroadcastChannel === 'undefined') return

    this.channel = new BroadcastChannel(CHANNEL_NAME)

    this.channel.addEventListener(
      'message',
      (event: MessageEvent<RelayMessage>) => {
        /**
         * A outra aba já gravou no `localStorage`, mas esta ainda guarda o
         * banco que leu ao abrir. Descartar a cópia **antes** de entregar é
         * o que garante que o refetch disparado pelo evento leia o dado
         * novo — sem isso, a resposta REST desfaria o que o evento mostrou.
         * O evento `storage` também invalida, mas a ordem entre os dois
         * mecanismos não é garantida.
         */
        mockDbStore.invalidate()
        invalidateScenarioCache()

        const { name, payload, scope } = event.data

        this.deliver(name, payload, scope)
      },
    )
  }

  accept(connection: WebSocketHandlerConnection): RealtimeClient {
    const io = toSocketIo(connection)
    const scope = connection.client.url.searchParams.get('scope') ?? GUEST_SCOPE
    const client = new RealtimeClient(connection.client.id, scope, io)

    this.clients.set(client.id, client)

    connection.client.addEventListener('close', () => {
      client.dispose()
      this.clients.delete(client.id)
    })

    return client
  }

  /** Evento público: catálogo e disponibilidade valem para todo mundo. */
  emitNftUpdated(event: NftUpdatedEvent): void {
    this.emit(REALTIME_EVENTS.nftUpdated, event, null)
  }

  /**
   * Pedido tem dono. Entregar a todos deixaria um colecionador ver a compra
   * de outro — proibição explícita do enunciado.
   */
  emitOrderUpdated(event: OrderUpdatedEvent): void {
    this.emit(REALTIME_EVENTS.orderUpdated, event, event.scope)
  }

  /** O banco voltou à semente; o cliente precisa esquecer as versões. */
  emitReset(): void {
    this.emit(
      REALTIME_EVENTS.mockReset,
      { emittedAt: new Date().toISOString() },
      null,
    )
  }

  /** Derruba todas as conexões, para exercitar reconexão e reconciliação. */
  disconnectAll(): number {
    const total = this.clients.size

    for (const client of this.clients.values()) client.close()

    this.clients.clear()

    return total
  }

  get connectionCount(): number {
    return this.clients.size
  }

  /**
   * Entrega aqui e repassa às outras abas. O `BroadcastChannel` não devolve
   * a mensagem a quem a enviou, então não há eco nem entrega dupla.
   */
  private emit(name: string, payload: unknown, scope: string | null): void {
    this.deliver(name, payload, scope)
    this.channel?.postMessage({ name, payload, scope } satisfies RelayMessage)
  }

  private deliver(name: string, payload: unknown, scope: string | null): void {
    for (const client of this.clients.values()) {
      if (scope != null && client.scope !== scope) continue

      client.emit(name, payload)
    }
  }
}

export const realtimeServer = new RealtimeServer()
