import { Skeleton } from '@/global/components/ui/skeleton'
import { CART_COPY } from '../constants/cart-copy'

const ROWS = [
  CART_COPY.subtotalLabel,
  CART_COPY.discountLabel,
  CART_COPY.networkFeeLabel,
]

/** Rótulos e botão são estáticos; apenas os valores esperam a resposta. */
export function CartSummarySkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label={CART_COPY.loadingLabel}
      className="flex flex-col"
    >
      <h2 className="border-b border-primary/60 pb-3 text-17 leading-4 font-bold text-text-primary">
        {CART_COPY.summaryHeading}
      </h2>

      <div className="mt-6 flex flex-col gap-1.5">
        <span className="text-13 leading-4 font-bold text-foreground">
          {CART_COPY.couponLabel}
        </span>
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      <dl className="mt-6.25 flex flex-col gap-4.25 text-15 leading-4">
        {ROWS.map((label) => (
          <div
            key={label}
            className="flex items-baseline justify-between gap-4"
          >
            <dt className="text-foreground">{label}</dt>
            <dd>
              <Skeleton className="h-4 w-24" />
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-right text-12 leading-4 text-brand">
        {CART_COPY.networkFeeNote}
      </p>

      <div className="mt-5.5 flex items-center justify-between gap-4 text-17 leading-4 font-bold">
        <span className="text-text-primary">{CART_COPY.totalLabel}</span>
        <Skeleton className="h-4 w-28" />
      </div>

      <Skeleton className="mt-5.5 h-10 w-full rounded-lg" />
    </section>
  )
}
