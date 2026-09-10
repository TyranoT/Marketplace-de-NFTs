import { useState } from 'react'
import { Button } from '@/global/components/ui/button'
import { Input } from '@/global/components/ui/input'
import { Label } from '@/global/components/ui/label'
import { cn } from '@/global/helpers/cn'
import { CART_COPY } from '../constants/cart-copy'

const FIELD_ID = 'cart-coupon'
const ERROR_ID = 'cart-coupon-error'

type CartCouponFormProps = {
  error?: string
  isApplying: boolean
  className?: string
  onApply: (code: string) => void
}

/**
 * Campo de cupom do frame: entrada de 230px e botão de 102px somando os 332
 * da coluna, com o arredondamento só nas pontas externas do conjunto.
 */
export function CartCouponForm({
  error,
  isApplying,
  className,
  onApply,
}: CartCouponFormProps) {
  const [code, setCode] = useState('')

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
      <Label
        htmlFor={FIELD_ID}
        className="text-13 leading-4 font-bold text-foreground"
      >
        {CART_COPY.couponLabel}
      </Label>

      <div className="flex">
        <Input
          id={FIELD_ID}
          name="coupon"
          value={code}
          autoComplete="off"
          placeholder={CART_COPY.couponPlaceholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? ERROR_ID : undefined}
          onChange={(event) => setCode(event.target.value)}
          className="rounded-r-none rounded-l-md border-primary border-r-0 text-13 placeholder:text-brand-muted"
        />

        <Button
          type="submit"
          disabled={isApplying}
          className="w-25.5 shrink-0 rounded-l-none rounded-r-md text-15 font-bold"
        >
          {CART_COPY.couponApply}
        </Button>
      </div>

      {error ? (
        <p
          id={ERROR_ID}
          role="alert"
          className="text-12 leading-4 text-destructive"
        >
          {error}
        </p>
      ) : null}
    </form>
  )
}
