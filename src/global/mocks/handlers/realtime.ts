import { realtimeLink, realtimeServer } from '../realtime'

/**
 * Como nos handlers HTTP: nenhuma regra vive aqui. A conexão é registrada
 * no `RealtimeServer`, que é quem sabe emitir e para quem.
 */
export const realtimeHandlers = [
  realtimeLink.addEventListener('connection', (connection) => {
    realtimeServer.accept(connection)
  }),
]
