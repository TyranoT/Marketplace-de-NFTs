import { LogOut } from 'lucide-react'
import { useLogout } from '@/global/api/user'
import { PROFILE_COPY } from '../constants/profile-copy'
import { PROFILE_NAV_ITEMS } from '../constants/profile-nav'
import { ProfileSidebarItem } from './profile-sidebar-item'

/**
 * Card de 310 do frame. Abaixo de `lg` vira uma faixa acima do conteúdo, com
 * os itens rolando na horizontal — não há frame mobile destas telas, então é
 * adaptação declarada, não desenho seguido.
 */
export function ProfileSidebar() {
  const logout = useLogout()

  return (
    <nav
      aria-label={PROFILE_COPY.sidebarHeading}
      className="flex flex-col gap-4 bg-surface-card py-6 lg:h-101.75"
    >
      <h2 className="px-5 text-20 leading-6 font-bold text-text-primary">
        {PROFILE_COPY.sidebarHeading}
      </h2>

      <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-0 lg:overflow-visible">
        {PROFILE_NAV_ITEMS.map((item) => (
          <li key={item.label} className="shrink-0 lg:shrink">
            <ProfileSidebarItem item={item} />
          </li>
        ))}
      </ul>

      <div className="mt-auto border-t border-line-soft pt-4">
        <button
          type="button"
          disabled={logout.isPending}
          onClick={() => logout.mutate()}
          className="flex h-11 w-full items-center gap-3 pl-5 text-15 leading-4 font-bold text-brand transition-colors hover:text-highlight disabled:opacity-60"
        >
          <LogOut className="size-4.5 shrink-0" />
          {logout.isPending ? PROFILE_COPY.logoutPending : PROFILE_COPY.logout}
        </button>
      </div>
    </nav>
  )
}
