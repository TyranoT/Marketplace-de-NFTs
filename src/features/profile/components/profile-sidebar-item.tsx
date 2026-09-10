import { Link } from '@tanstack/react-router'
import { cn } from '@/global/helpers/cn'
import { PROFILE_COPY, buildUnavailableLabel } from '../constants/profile-copy'
import type { ProfileNavItem } from '../constants/profile-nav'

const ROW =
  'flex h-11 items-center gap-3 border-l-2 pl-5 text-15 leading-4 transition-colors'

type ProfileSidebarItemProps = {
  item: ProfileNavItem
}

/**
 * Item ativo ganha a barra à esquerda e o rótulo em `--brand`, como no frame.
 * Sem tela, o item não é link: vira texto desabilitado com o motivo ao lado,
 * anunciado junto pelo `aria-label` para quem usa leitor de tela.
 */
export function ProfileSidebarItem({ item }: ProfileSidebarItemProps) {
  const { Icon, label, to } = item

  if (!to) {
    return (
      <p
        aria-disabled="true"
        aria-label={buildUnavailableLabel(label)}
        className={cn(
          ROW,
          'cursor-not-allowed border-transparent text-brand/45',
        )}
      >
        <Icon className="size-4.5 shrink-0" />
        <span className="truncate">{label}</span>
        <span aria-hidden="true" className="text-10 text-brand-muted/70">
          {PROFILE_COPY.itemUnavailable}
        </span>
      </p>
    )
  }

  return (
    <Link
      to={to}
      activeOptions={{ exact: true }}
      activeProps={{
        'aria-current': 'page',
        className: 'border-primary text-brand',
      }}
      inactiveProps={{ className: 'border-transparent text-brand-muted' }}
      className={cn(ROW, 'hover:text-brand')}
    >
      <Icon className="size-4.5 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  )
}
