import { Wallet } from 'lucide-react'
import { Radio } from '@/global/components/ui/radio-group'
import { cn } from '@/global/helpers/cn'
import type { CheckoutProvider } from '../constants/checkout-providers'

type CheckoutProviderCardProps = {
  provider: CheckoutProvider
  isSelected: boolean
}

/**
 * Card de 358×55 do frame: medalhão com a inicial à esquerda, nome e o rádio
 * à direita — a posição do rádio é o que distingue esta lista da de carteiras,
 * onde ele fica à esquerda.
 */
export function CheckoutProviderCard({
  provider,
  isSelected,
}: CheckoutProviderCardProps) {
  return (
    <label
      className={cn(
        'flex h-14 cursor-pointer items-center gap-4 rounded-xl bg-surface-card px-3 transition-colors',
        isSelected ? 'ring-1 ring-primary/40' : 'hover:bg-surface-dark/40',
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-dark text-14 font-bold text-brand">
        {provider.initial ? (
          provider.initial
        ) : (
          <Wallet className="size-4.5" aria-hidden="true" />
        )}
      </span>

      <span className="min-w-0 flex-1 truncate text-16 leading-5 text-foreground">
        {provider.label}
      </span>

      <Radio value={provider.id} className="size-5 shrink-0" />
    </label>
  )
}
