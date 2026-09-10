import type { toSocketIo } from '@mswjs/socket.io-binding'

type SocketIo = ReturnType<typeof toSocketIo>

/**
 * Intervalo do PING enviado à mão.
 *
 * O binding anuncia `pingInterval: 25000` e `pingTimeout: 5000` no handshake,
 * mas **nunca envia o PING**. O `engine.io-client` arma um temporizador de
 * 30s reiniciado a cada pacote recebido; sem tráfego ele derruba a conexão
 * por `ping timeout` e reconecta, em laço, para sempre. 20s deixa margem
 * confortável dentro da janela.
 */
const HEARTBEAT_MS = 20_000

/** Pacote PING do Engine.IO. O cliente responde `'3'` (pong) sozinho. */
const ENGINE_IO_PING = '2'

/**
 * Um colecionador conectado. Guarda o escopo declarado na conexão para que
 * um evento de sessão alheia nunca seja entregue a quem não é seu dono.
 */
export class RealtimeClient {
  private heartbeat: ReturnType<typeof setInterval> | undefined

  constructor(
    readonly id: string,
    readonly scope: string,
    readonly io: SocketIo,
  ) {
    this.heartbeat = setInterval(
      () => this.io.rawClient.send(ENGINE_IO_PING),
      HEARTBEAT_MS,
    )
  }

  emit(name: string, payload: unknown): void {
    this.io.client.emit(name, payload)
  }

  /** Encerra o batimento. Sem isso o intervalo sobrevive à desconexão. */
  dispose(): void {
    clearInterval(this.heartbeat)
    this.heartbeat = undefined
  }

  close(): void {
    this.dispose()
    this.io.rawClient.close()
  }
}
