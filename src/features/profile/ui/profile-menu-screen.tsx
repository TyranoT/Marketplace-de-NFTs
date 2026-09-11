import { Link } from '@tanstack/react-router'
import { ChevronRight, LogOut } from 'lucide-react'
import { useLogout } from '@/global/api/user'
import { PROFILE_COPY } from '../constants/profile-copy'
import { PROFILE_NAV_ITEMS, toMobileTarget } from '../constants/profile-nav'

const ROW =
  'flex h-14 items-center gap-4 rounded-xl bg-surface-card px-4 text-15 leading-5'

/**
 * Lista de seções que o Tab abre no mobile, no padrão de ajustes do celular:
 * cada item leva à própria tela, que volta pelo topo. A faixa horizontal de
 * sete itens que existia antes vivia cortada e empurrava o conteúdo para
 * baixo — aqui a área inteira cabe numa olhada.
 */
export function ProfileMenuScreen() {
  const logout = useLogout()

  return (
    <div className="flex flex-col gap-3 md:hidden">
      {PROFILE_NAV_ITEMS.map((item) =>
        item.to ? (
          <Link
            key={item.label}
            to={toMobileTarget(item)}
            className={`${ROW} text-foreground`}
          >
            <item.Icon className="size-5 shrink-0 text-brand" />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            <ChevronRight className="size-4 shrink-0 text-brand-muted" />
          </Link>
        ) : (
          <p
            key={item.label}
            className={`${ROW} cursor-not-allowed text-foreground/50`}
          >
            <item.Icon className="size-5 shrink-0 text-brand/45" />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            <span className="text-12 text-brand-muted">
              {PROFILE_COPY.itemUnavailable}
            </span>
          </p>
        ),
      )}

      <button
        type="button"
        disabled={logout.isPending}
        onClick={() => logout.mutate()}
        className={`${ROW} mt-3 font-bold text-brand disabled:opacity-60`}
      >
        <LogOut className="size-5 shrink-0" />
        {logout.isPending ? PROFILE_COPY.logoutPending : PROFILE_COPY.logout}
      </button>
    </div>
  )
}
