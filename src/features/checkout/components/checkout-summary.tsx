import { Button } from '@/global/components/ui/button'
import {
  formatEthAmount,
  formatMoney,
  parseEth,
} from '@/global/helpers/eth-amount'
import { CART_COPY, CartSummaryRow } from '@/features/cart'
import { CHECKOUT_COPY } from '../constants/checkout-copy'
import { CheckoutCouponDisclosure } from './checkout-coupon-disclosure'
import { CheckoutSummaryItem } from './checkout-summary-item'
import { CheckoutWalletOptions } from './checkout-wallet-options'
import type { Cart } from '@/global/api'
import type { CheckoutWallet } from '@/global/data'

const HEADING_ID = 'checkout-summary'
const WALLETS_HEADING_ID = 'checkout-wallets'

type CheckoutSummaryProps = {
  cart: Cart
  formId: string
  wallets: Array<CheckoutWallet>
  walletId: string
  walletError?: string
  isSubmitting: boolean
  couponError?: string
  isApplyingCoupon: boolean
  onWalletChange: (walletId: string) => void
  onApplyCoupon: (code: string) => void
}

/**
 * Coluna de 405 do frame. O botão de submit vive aqui, mas pertence ao
 * formulário da coluna esquerda — o atributo `form` é o que permite a um
 * botão fora da árvore do `<form>` submetê-lo.
 */
export function CheckoutSummary({
  cart,
  formId,
  wallets,
  walletId,
  walletError,
  isSubmitting,
  couponError,
  isApplyingCoupon,
  onWalletChange,
  onApplyCoupon,
}: CheckoutSummaryProps) {
  const { totals } = cart

  return (
    <section aria-labelledby={HEADING_ID} className="flex flex-col">
      <h2
        id={HEADING_ID}
        className="text-17 leading-4 font-bold text-text-primary"
      >
        {CHECKOUT_COPY.summaryHeading}
      </h2>

      <div className="mt-6.5 flex items-baseline justify-between border-b border-brand/70 pb-2.5 text-16 leading-4 font-bold text-foreground">
        <span>{CHECKOUT_COPY.columnNfts}</span>
        <span>{CHECKOUT_COPY.columnSubtotal}</span>
      </div>

      <ul className="mt-3 flex flex-col gap-3">
        {cart.items.map((item) => (
          <CheckoutSummaryItem key={item.id} item={item} />
        ))}
      </ul>

      <div className="mt-5.5">
        <CheckoutCouponDisclosure
          error={couponError}
          isApplying={isApplyingCoupon}
          onApply={onApplyCoupon}
        />
      </div>

      <dl className="mt-5 flex flex-col gap-4.5 text-15 leading-4">
        <CartSummaryRow
          label={CART_COPY.subtotalLabel}
          value={formatMoney(totals.subtotal)}
        />

        <CartSummaryRow
          label={CART_COPY.discountLabel}
          value={`(-) ${formatEthAmount(parseEth(totals.discount.amount))}`}
        />

        <CartSummaryRow
          label={CART_COPY.networkFeeLabel}
          value={formatMoney(totals.networkFee, 3)}
        />
      </dl>

      <p className="mt-3.5 text-center text-12 leading-4 text-brand">
        {CART_COPY.networkFeeNote}
      </p>

      <div className="mt-3.5 flex items-center justify-between border-t border-brand/70 pt-4.5 text-17 leading-4 font-bold">
        <span className="pl-6 text-text-primary">{CART_COPY.totalLabel}</span>
        <span className="text-highlight">{formatMoney(totals.total, 3)}</span>
      </div>

      <h3
        id={WALLETS_HEADING_ID}
        className="mt-4 text-center text-17 leading-4 font-bold text-text-primary"
      >
        {CHECKOUT_COPY.walletsHeading}
      </h3>

      <div className="mt-5">
        <CheckoutWalletOptions
          wallets={wallets}
          value={walletId}
          error={walletError}
          headingId={WALLETS_HEADING_ID}
          onValueChange={onWalletChange}
        />
      </div>

      <Button
        type="submit"
        form={formId}
        disabled={isSubmitting}
        className="mt-6 h-11 w-full text-15 font-bold"
      >
        {isSubmitting ? CHECKOUT_COPY.submitting : CHECKOUT_COPY.submit}
      </Button>
    </section>
  )
}
