import { Link } from '@tanstack/react-router'
import { Button } from '@/global/components/ui/button'
import {
  formatEthAmount,
  formatMoney,
  parseEth,
} from '@/global/helpers/eth-amount'
import { CART_COPY } from '../constants/cart-copy'
import { CartCouponForm } from './cart-coupon-form'
import { CartSummaryRow } from './cart-summary-row'
import type { Cart } from '@/global/api'

type CartSummaryProps = {
  cart: Cart
  isUpdating: boolean
  couponError?: string
  isApplyingCoupon: boolean
  onApplyCoupon: (code: string) => void
  onRemoveCoupon: () => void
}

export function CartSummary({
  cart,
  isUpdating,
  couponError,
  isApplyingCoupon,
  onApplyCoupon,
  onRemoveCoupon,
}: CartSummaryProps) {
  const { totals, coupon } = cart

  return (
    <section aria-labelledby="cart-summary" className="flex flex-col">
      <h2
        id="cart-summary"
        className="border-b border-primary/60 pb-3 text-17 leading-4 font-bold text-text-primary"
      >
        {CART_COPY.summaryHeading}
      </h2>

      <CartCouponForm
        className="mt-6"
        error={couponError}
        isApplying={isApplyingCoupon}
        onApply={onApplyCoupon}
      />

      {/**
       * Uma única região viva envolvendo os valores e o total: anunciar as
       * linhas separadamente faria o leitor de tela ler um subtotal novo ao
       * lado de um total ainda antigo.
       */}
      <div aria-live="polite" aria-busy={isUpdating}>
        {coupon ? (
          <p className="mt-4 flex items-center justify-between gap-3 text-12 leading-4 text-brand-muted">
            <span>
              {CART_COPY.couponAppliedPrefix} <strong>{coupon.code}</strong>
            </span>

            <button
              type="button"
              onClick={onRemoveCoupon}
              aria-label={`${CART_COPY.couponRemove} cupom ${coupon.code}`}
              className="text-brand underline underline-offset-2 hover:text-highlight"
            >
              {CART_COPY.couponRemove}
            </button>
          </p>
        ) : null}

        <dl className="mt-6.25 flex flex-col gap-4.25 text-15 leading-4">
          <CartSummaryRow
            label={CART_COPY.subtotalLabel}
            value={formatMoney(totals.subtotal)}
          />

          {/**
           * O valor segue o frame: só o sinal e o número, sem a unidade —
           * as linhas vizinhas já a estabelecem, e repeti-la aqui não cabe
           * na coluna de 332 quando o cupom traz o botão de remover.
           */}
          <CartSummaryRow
            label={CART_COPY.discountLabel}
            value={`(-) ${formatEthAmount(parseEth(totals.discount.amount))}`}
          />

          <CartSummaryRow
            label={CART_COPY.networkFeeLabel}
            value={formatMoney(totals.networkFee, 3)}
          />
        </dl>

        <p className="mt-4 text-right text-12 leading-4 text-brand">
          {CART_COPY.networkFeeNote}
        </p>

        <div className="mt-5.5 flex items-center justify-between text-17 leading-4 font-bold">
          <span className="text-text-primary">{CART_COPY.totalLabel}</span>
          <span className="text-highlight">{formatMoney(totals.total, 3)}</span>
        </div>
      </div>

      <Button
        render={<Link to="/pagamento" />}
        className="mt-5.5 w-full text-15 font-bold"
      >
        {CART_COPY.checkout}
      </Button>

      <Link
        to="/"
        className="mt-4 text-center text-15 leading-4 text-brand hover:text-highlight"
      >
        {CART_COPY.continueShopping}
      </Link>
    </section>
  )
}
