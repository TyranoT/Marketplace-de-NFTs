import { ws } from 'msw'
import { REALTIME_PATH } from '../../api/contracts/realtime'

/**
 * O link do Socket.IO.
 *
 * O caminho é `/realtime`, e não o padrão `/socket.io`, de propósito: o
 * `WebSocketHandler` do MSW reescreve `^/socket.io/` para `/` antes de casar
 * a rota, o que obrigaria a interceptar a raiz — exatamente a URL do
 * WebSocket de HMR do Vite. O recarregamento em desenvolvimento pararia de
 * funcionar, e o motivo seria difícil de encontrar.
 */
export const realtimeLink = ws.link(REALTIME_PATH)
