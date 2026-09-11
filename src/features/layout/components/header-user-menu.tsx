import { Link } from '@tanstack/react-router'
import { ChevronDown, LogOut, UserRound } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/global/components/ui/dropdown-menu'
import { useLogout } from '@/global/api/user'
import { AUTH_COPY } from '@/features/auth'
import type { User } from '@/global/api'

type HeaderUserMenuProps = {
  user: User
}

/**
 * Nenhum frame desenhou o cabeçalho de quem entrou. O cartão segue a
 * linguagem do resto: fundo de card, borda `--line` e o nome sobre o e-mail —
 * o e-mail é o que distingue duas contas com o mesmo nome de exibição.
 */
export function HeaderUserMenu({ user }: HeaderUserMenuProps) {
  const logout = useLogout()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`${AUTH_COPY.accountMenuLabel} de ${user.displayName}`}
        className="flex max-w-56 items-center gap-3 rounded-md border border-line bg-card px-3 py-1.5 text-left transition-colors outline-none hover:border-line-soft focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:border-primary"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-brand">
          <UserRound className="size-4" />
        </span>

        <span className="flex min-w-0 flex-col">
          <span className="truncate text-14 leading-4 font-bold text-text-primary">
            {user.displayName}
          </span>
          <span className="truncate text-12 leading-4 text-text-secondary">
            {user.email}
          </span>
        </span>

        <ChevronDown className="size-4 shrink-0 text-brand transition-transform in-data-popup-open:rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem render={<Link to="/perfil" />}>
          <UserRound />
          {AUTH_COPY.profile}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={logout.isPending}
          onClick={() => logout.mutate()}
          className="text-brand data-highlighted:text-highlight"
        >
          <LogOut />
          {logout.isPending ? AUTH_COPY.logoutPending : AUTH_COPY.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
