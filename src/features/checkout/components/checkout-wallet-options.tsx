import { Radio, RadioGroup } from '@/global/components/ui/radio-group'
import { cn } from '@/global/helpers/cn'
import { errorId } from '@/global/components/ui/form-field'
import type { CheckoutWallet } from '@/global/data'

/** Também o alvo do foco quando a carteira é o único erro do envio. */
export const WALLET_OPTIONS_ID = 'walletId'

const FIELD_ID = WALLET_OPTIONS_ID

type CheckoutWalletOptionsProps = {
  wallets: Array<CheckoutWallet>
  value: string
  error?: string
  headingId: string
  onValueChange: (value: string) => void
}

/** Linhas de 405×44,5; a selecionada troca a borda de `--line` por `--brand`. */
export function CheckoutWalletOptions({
  wallets,
  value,
  error,
  headingId,
  onValueChange,
}: CheckoutWalletOptionsProps) {
  return (
    <>
      <RadioGroup
        id={FIELD_ID}
        aria-required="true"
        value={value || null}
        onValueChange={(next) => onValueChange(String(next ?? ''))}
        aria-labelledby={headingId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId(FIELD_ID) : undefined}
        className="gap-4"
      >
        {wallets.map((wallet) => (
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
