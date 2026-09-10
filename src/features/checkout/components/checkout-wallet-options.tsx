import { Radio, RadioGroup } from '@/global/components/ui/radio-group'
import { cn } from '@/global/helpers/cn'
import { CHECKOUT_WALLETS } from '@/global/data'
import { errorId } from './checkout-field'

const FIELD_ID = 'walletId'

type CheckoutWalletOptionsProps = {
  value: string
  error?: string
  headingId: string
  onValueChange: (value: string) => void
}

/** Linhas de 405×44,5; a selecionada troca a borda de `--line` por `--brand`. */
export function CheckoutWalletOptions({
  value,
  error,
  headingId,
  onValueChange,
}: CheckoutWalletOptionsProps) {
  return (
    <>
      <RadioGroup
        value={value || null}
        onValueChange={(next) => onValueChange(String(next ?? ''))}
        aria-labelledby={headingId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId(FIELD_ID) : undefined}
        className="gap-4"
      >
        {CHECKOUT_WALLETS.map((wallet) => (
          <label
            key={wallet.id}
            className={cn(
              'flex h-11 cursor-pointer items-center gap-4 rounded-sm border px-4 transition-colors',
              value === wallet.id
                ? 'border-primary'
                : 'border-line hover:border-line-soft',
            )}
          >
            <Radio value={wallet.id} />

            {wallet.badges ? (
              <span className="flex items-center gap-2 rounded-sm bg-surface-dark px-2 py-1 text-9 leading-3 tracking-wide text-brand">
                {wallet.badges.join('  •  ')}
                <span className="sr-only">{wallet.label}</span>
              </span>
            ) : (
              <span className="text-15 leading-4 text-foreground">
                {wallet.label}
              </span>
            )}
          </label>
        ))}
      </RadioGroup>

      {error ? (
        <p
          id={errorId(FIELD_ID)}
          role="alert"
          className="text-12 leading-4 text-destructive"
        >
          {error}
        </p>
      ) : null}
    </>
  )
}
