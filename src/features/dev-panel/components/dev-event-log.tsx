import { cn } from '@/global/helpers/cn'
import { DEV_COPY, REALTIME_STATUS_LABEL } from '../constants/dev-copy'
import type { RealtimeLogEntry } from '@/global/realtime'
import type { RealtimeStatus } from '@/global/api/contracts/realtime'

type DevEventLogProps = {
  status: RealtimeStatus
  log: Array<RealtimeLogEntry>
}

const DOT_BY_STATUS: Record<RealtimeStatus, string> = {
  connected: 'bg-brand',
  connecting: 'bg-highlight',
  reconnecting: 'bg-highlight',
  disconnected: 'bg-destructive',
  disabled: 'bg-line',
}

/**
 * A prova de que o transporte é real.
 *
 * A coluna do catálogo escreve por REST; esta lista mostra o que o
 * `socket.io-client` recebeu. Se o socket for substituído por uma chamada
 * direta ao cache — o que o enunciado trata como eliminatório —, esta lista
 * fica muda enquanto o resto continua funcionando.
 */
export function DevEventLog({ status, log }: DevEventLogProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="flex items-center gap-2 text-14 text-foreground">
        <span
          aria-hidden="true"
          className={cn('size-2.5 rounded-full', DOT_BY_STATUS[status])}
        />
        {REALTIME_STATUS_LABEL[status]}
      </p>

      <h3 className="text-13 font-bold tracking-wide text-text-secondary uppercase">
        {DEV_COPY.eventsHeading}
      </h3>

      {/**
       * Região viva: o painel é feito para ser observado enquanto outra
       * coisa acontece, então a chegada de um evento precisa ser anunciada
       * a quem não está olhando para a lista.
       */}
      <ul aria-live="polite" className="flex flex-col gap-2">
        {log.length === 0 ? (
          <li className="text-13 text-text-secondary">
            {DEV_COPY.eventsEmpty}
          </li>
        ) : (
          log.map((entry) => (
            <li
              key={entry.id}
              className="flex flex-wrap items-baseline gap-x-2 font-mono text-12"
            >
              <span className="text-text-secondary">
                {new Date(entry.receivedAt).toLocaleTimeString('pt-BR')}
              </span>
              <span className="text-foreground">{entry.name}</span>
              <span className="text-text-secondary">{entry.resource}</span>
              <span className="text-text-secondary">v{entry.version}</span>
              <span
                className={cn(
                  'rounded-sm px-1.5 py-0.5 text-11',
                  entry.applied
                    ? 'bg-brand/20 text-brand'
                    : 'bg-line-soft/40 text-text-secondary',
                )}
              >
                {entry.applied
                  ? DEV_COPY.eventApplied
                  : DEV_COPY.eventDiscarded}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
