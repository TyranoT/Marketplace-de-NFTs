import { useState } from 'react'
import { CartCouponForm } from '@/features/cart'
import { CHECKOUT_COPY } from '../constants/checkout-copy'

type CheckoutCouponDisclosureProps = {
  error?: string
  isApplying: boolean
  onApply: (code: string) => void
}

/**
 * No frame o cupom é só um convite em texto. O campo aparece sob demanda:
 * quem chegou ao pagamento em geral já aplicou o desconto no carrinho.
 */
export function CheckoutCouponDisclosure({
  error,
  isApplying,
  onApply,
}: CheckoutCouponDisclosureProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <p className="text-center text-14 leading-4 text-foreground">
        {CHECKOUT_COPY.couponPrompt}{' '}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-brand underline underline-offset-2 hover:text-highlight"
        >
          {CHECKOUT_COPY.couponAction}
        </button>
      </p>
    )
  }

  return (
    <CartCouponForm error={error} isApplying={isApplying} onApply={onApply} />
  )
}
