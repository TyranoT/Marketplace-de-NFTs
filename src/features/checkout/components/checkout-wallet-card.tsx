import { Link } from '@tanstack/react-router'
import { MoreVertical, PencilLine, Wallet } from 'lucide-react'
import { Radio } from '@/global/components/ui/radio-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/global/components/ui/dropdown-menu'
import { NETWORKS } from '@/global/data'
import { cn } from '@/global/helpers/cn'
import { CHECKOUT_COPY, buildNetworkLabel } from '../constants/checkout-copy'
import type { Wallet as SavedWallet } from '@/global/api'

type CheckoutWalletCardProps = {
  wallet: SavedWallet
  isSelected: boolean
}

/**
 * Card de 358×84 do frame: rádio à esquerda, apelido, identificação e rede,
 * e o menu no canto direito.
 *
 * A identificação é o ENS quando existe e o endereço abreviado quando não —
 * é a leitura dos dois cards do desenho, onde um mostra `nova.kurio.eth` e o
 * outro `0xA91F…E82C`.
 */
export function CheckoutWalletCard({
  wallet,
  isSelected,
}: CheckoutWalletCardProps) {
  const isPrimary = wallet.role === 'primary'

  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-4 rounded-xl bg-surface-card px-4 py-3 transition-colors',
        isSelected ? 'ring-1 ring-primary/40' : 'hover:bg-surface-dark/40',
      )}
    >
      <Radio value={wallet.id} className="size-5" />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-16 leading-5 font-bold text-text-primary">
          {wallet.nickname}
        </p>

        <p className="truncate text-14 leading-5 text-text-secondary">
          {toIdentifier(wallet)}
        </p>

        <p className="truncate text-14 leading-5 text-brand-muted">
          {buildNetworkLabel(toNetworkLabel(wallet.network), isPrimary)}
        </p>
      </div>

      {/**
       * Só caminhos que a API tem: editar e gerenciar levam à tela de
       * carteiras. Remover fica de fora — a principal é recusada pelo
       * servidor, e apagar carteira no meio de uma compra é destrutivo demais.
       */}
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={CHECKOUT_COPY.walletMenuLabel}
          onClick={(event) => event.preventDefault()}
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-brand-muted transition-colors outline-none hover:text-brand focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <MoreVertical className="size-5" />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem render={<Link to="/perfil/carteiras" />}>
            <PencilLine />
            {CHECKOUT_COPY.editWallet}
          </DropdownMenuItem>

          <DropdownMenuItem render={<Link to="/perfil/carteiras" />}>
            <Wallet />
            {CHECKOUT_COPY.manageWallet}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </label>
  )
}

function toIdentifier(wallet: SavedWallet): string {
  if (wallet.ensName) return `${wallet.ensName}.${wallet.ensSuffix}`

  return `${wallet.address.slice(0, 6)}…${wallet.address.slice(-4)}`
}

function toNetworkLabel(network: string): string {
  return NETWORKS.find(({ id }) => id === network)?.label ?? network
}
