import { PROFILE_COPY, buildRemoveWalletLabel } from '../constants/profile-copy'
import type { Wallet } from '@/global/api'

type SecondaryWalletCardProps = {
  wallet: Wallet
  isRemoving: boolean
  onEdit: () => void
  onRemove: () => void
}

/**
 * Carteira secundária já cadastrada. Mostra o apelido e o endereço abreviado
 * — o endereço inteiro não caberia, e o meio dele não identifica nada.
 */
export function SecondaryWalletCard({
  wallet,
  isRemoving,
  onEdit,
  onRemove,
}: SecondaryWalletCardProps) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-4 border border-line bg-surface-card px-5 py-4">
      <div className="flex min-w-0 flex-col gap-1">
        <p className="truncate text-16 leading-5 font-bold text-text-primary">
          {wallet.nickname}
        </p>
        <p className="truncate text-13 leading-4 text-text-secondary">
          {shortenAddress(wallet.address)} · {wallet.network}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onEdit}
          className="text-14 leading-4 text-brand transition-colors hover:text-highlight"
        >
          {PROFILE_COPY.secondaryEdit}
        </button>

        <button
          type="button"
          disabled={isRemoving}
          aria-label={buildRemoveWalletLabel(wallet.nickname)}
          onClick={onRemove}
          className="text-14 leading-4 text-foreground transition-colors hover:text-destructive disabled:opacity-60"
        >
          {PROFILE_COPY.secondaryRemove}
        </button>
      </div>
    </li>
  )
}

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}
