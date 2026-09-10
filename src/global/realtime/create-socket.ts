import { REALTIME_PATH } from '../api/contracts/realtime'
import type { Socket } from 'socket.io-client'

type CreateSocketInput = {
  scope: string
}

/**
 * Abre a conexão do Socket.IO.
 *
 * O `import` é dinâmico pela mesma razão de `start-mocks.ts`: mantém
 * `socket.io-client` e `engine.io-client` fora do bundle do servidor e fora
 * do carregamento inicial do cliente, onde só pesariam na auditoria.
 */
export async function createSocket({
  scope,
}: CreateSocketInput): Promise<Socket> {
  const { io } = await import('socket.io-client')

  return io(window.location.origin, {
    path: REALTIME_PATH,

    /**
     * Sem isto nada funciona. O cliente tentaria primeiro
     * `GET /socket.io/?EIO=4&transport=polling`, que é HTTP: o `ws` do MSW
     * intercepta a classe `WebSocket`, não esse GET, então ele escaparia
     * pelo `onUnhandledRequest: 'bypass'`, bateria em 404 real e entraria
     * em `xhr poll error` reencaminhado para sempre.
     */
    transports: ['websocket'],

    /** Conectar é decisão do provider, depois que os mocks já subiram. */
    autoConnect: false,

    /** O servidor simulado lê o escopo daqui para não vazar dados de sessão. */
    query: { scope },
  })
}
