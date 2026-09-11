import { cn } from '@/global/helpers/cn'
import { AUTH_COPY } from '../constants/auth-copy'

export type AuthTab = 'login' | 'register'

type AuthTabsProps = {
  active: AuthTab
  onChange: (tab: AuthTab) => void
}

const TABS: Array<{ id: AuthTab; label: string }> = [
  { id: 'login', label: AUTH_COPY.loginTab },
  { id: 'register', label: AUTH_COPY.registerTab },
]

/**
 * As duas abas do frame, separadas pela barra vertical. `role="tablist"` de
 * verdade: as setas do teclado alternam, como se espera de abas.
 */
export function AuthTabs({ active, onChange }: AuthTabsProps) {
  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      onChange(event.key === 'Home' ? 'login' : 'register')

      return
    }

    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return

    event.preventDefault()
    onChange(active === 'login' ? 'register' : 'login')
  }

  return (
    <div
      role="tablist"
      aria-label={`${AUTH_COPY.loginTab} ou ${AUTH_COPY.registerTab}`}
      onKeyDown={handleKeyDown}
      className="flex items-center justify-center divide-x divide-line-soft text-20 leading-6"
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          id={`auth-tab-${tab.id}`}
          aria-selected={active === tab.id}
          /** Só o painel ativo existe no DOM; apontar para o outro era apontar para nada. */
          aria-controls={active === tab.id ? `auth-panel-${tab.id}` : undefined}
          tabIndex={active === tab.id ? 0 : -1}
          onClick={() => onChange(tab.id)}
          className={cn(
            /** O foco era só uma troca de cor — invisível na aba ativa. Agora vale o contorno global. */
            'px-3 transition-colors',
            active === tab.id
              ? 'text-brand'
              : 'text-text-primary hover:text-brand-muted',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
