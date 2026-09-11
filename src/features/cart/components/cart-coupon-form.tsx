import { useId, useState } from 'react'
import { Button } from '@/global/components/ui/button'
import { Input } from '@/global/components/ui/input'
import { Label } from '@/global/components/ui/label'
import { cn } from '@/global/helpers/cn'
import { CART_COPY } from '../constants/cart-copy'

type CartCouponFormProps = {
  error?: string
  isApplying: boolean
  /**
   * `stacked` é o campo rotulado do frame desktop; `inline` é a cápsula do
   * frame mobile, onde o rótulo daria uma linha que não existe no desenho.
   */
  variant?: 'stacked' | 'inline'
  className?: string
  /** Foca o campo ao aparecer — quando é aberto por um disclosure. */
  autoFocus?: boolean
  onApply: (code: string) => void
}

/**
 * Campo de cupom. No desktop segue o frame: entrada de 230px e botão de 102px
 * somando os 332 da coluna, com o arredondamento só nas pontas externas do
 * conjunto.
 */
export function CartCouponForm({
  error,
  isApplying,
  variant = 'stacked',
  className,
  autoFocus,
  onApply,
}: CartCouponFormProps) {
  const [code, setCode] = useState('')
  const isInline = variant === 'inline'

  /**
   * `useId`, e não ids fixos: o formulário é montado duas vezes — no resumo
   * do desktop e no painel do mobile —, e com `cart-coupon` fixo o rótulo e
   * o erro de um apontavam para o campo do outro.
   */
  const fieldId = useId()
  const errorId = `${fieldId}-error`

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmed = code.trim()

    if (trimmed) onApply(trimmed)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex flex-col gap-1.5', className)}
    >
      {isInline ? null : (
        <Label
          htmlFor={fieldId}
          className="text-13 leading-4 font-bold text-foreground"
        >
          {CART_COPY.couponLabel}
        </Label>
      )}

      <div
        className={cn(
          'flex shadow-xl shadow-black/20',
          isInline &&
            'items-center rounded-full border border-line-soft focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring',
        )}
      >
        <Input
          id={fieldId}
          name="coupon"
          autoFocus={autoFocus}
          value={code}
          autoComplete="off"
          aria-label={isInline ? CART_COPY.couponLabel : undefined}
          placeholder={CART_COPY.couponPlaceholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => setCode(event.target.value)}
          className={cn(
            isInline
              ? 'h-11 border-transparent bg-transparent px-4 text-14 placeholder:text-brand-muted focus-visible:ring-0'
              : 'rounded-r-none rounded-l-md border-r-0 border-primary text-13 placeholder:text-brand-muted',
          )}
        />

        <Button
          type="submit"
          disabled={isApplying}
          className={cn(
            'shrink-0 border-0 bg-linear-120 from-line-soft/50 to-brand text-foreground',
            isInline
              ? 'h-11 rounded-full px-6 text-16'
              : 'w-25.5 rounded-l-none rounded-r-md text-15',
          )}
        >
          {CART_COPY.couponApply}
        </Button>
      </div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-12 leading-4 text-destructive"
        >
          {error}
        </p>
      ) : null}
    </form>
  )
}
