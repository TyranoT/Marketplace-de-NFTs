import { useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import {
  formatEthAmount,
  formatMoney,
  parseEth,
} from '@/global/helpers/eth-amount'
import { CART_COPY } from '../constants/cart-copy'
import { CartCouponForm } from './cart-coupon-form'
import { CartSummaryRow } from './cart-summary-row'
import type { Cart } from '@/global/api'

type CartMobileSummaryProps = {
  cart: Cart
  isUpdating: boolean
  couponError?: string
  isApplyingCoupon: boolean
  onApplyCoupon: (code: string) => void
  onRemoveCoupon: () => void
}

/**
 * Painel fixo do frame mobile: cupom, totais e a ação de finalizar.
 *
 * Fixo no rodapé, com a lista rolando atrás, para o total e o botão ficarem
 * sempre à vista — é o que o desenho mostra, com o painel encostado na base e
 * arredondado só no topo. A sombra para cima separa as duas superfícies, que
 * têm a mesma cor; o mesmo recurso da barra de compra do detalhe do NFT.
 *
 * A rota declara `mobileTabBar: false`: este painel ocupa o lugar da barra de
 * navegação, e o frame não mostra as duas juntas.
 */
export function CartMobileSummary({
  cart,
  isUpdating,
  couponError,
  isApplyingCoupon,
  onApplyCoupon,
  onRemoveCoupon,
}: CartMobileSummaryProps) {
  const { totals, coupon } = cart
  const panelRef = useRef<HTMLElement>(null)

  /**
   * O painel é fixo e cobre o fim da página. Um item focado por Tab podia
   * ficar atrás dele, invisível. O `scroll-padding` com a altura real do
   * painel faz o navegador rolar o foco para acima dele — medido, porque a
   * altura muda com o erro do cupom e com o zoom de texto.
   */
  useEffect(() => {
    const panel = panelRef.current
    const root = document.documentElement

    if (!panel) return

    const observer = new ResizeObserver(([entry]) => {
      root.style.scrollPaddingBottom = `${entry.contentRect.height + 24}px`
    })

    observer.observe(panel)

    return () => {
      observer.disconnect()
      root.style.scrollPaddingBottom = ''
    }
  }, [])

  return (
    <section
      ref={panelRef}
      aria-labelledby="cart-mobile-summary"
      /**
       * `lg:hidden`, e não `md:hidden`: o resumo da coluna direita só aparece
       * a partir de `lg`. Com `md`, entre 768 e 1023px os dois sumiam e o
       * tablet ficava sem total e sem o botão de finalizar.
       */
      className="fixed inset-x-0 bottom-0 z-40 rounded-t-3xl bg-surface-card px-6 pt-4 pb-6 shadow-[0_-8px_24px_rgba(0,0,0,0.5)] lg:hidden"
    >
      <h2 id="cart-mobile-summary" className="sr-only">
        {CART_COPY.summaryHeading}
      </h2>

      <CartCouponForm
        variant="inline"
        error={couponError}
        isApplying={isApplyingCoupon}
        onApply={onApplyCoupon}
      />

      {/**
       * Uma região viva só, envolvendo cupom, valores e total: anunciar as
       * linhas separadamente faria o leitor de tela ler um subtotal novo ao
       * lado de um total ainda antigo. O cupom aplicado não existia no
       * mobile — não havia como ver qual estava valendo nem como tirá-lo.
       */}
      <div
        aria-live="polite"
        aria-atomic="true"
        aria-busy={isUpdating}
        className="mt-3.5"
      >
        {coupon ? (
          <p className="mb-2 flex items-center justify-between gap-3 text-12 leading-4 text-brand-muted">
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

        <dl className="flex flex-col gap-1.5 text-14 leading-5">
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

        <p className="mt-0.5 text-right text-12 leading-4 text-brand">
          {CART_COPY.networkFeeNote}
        </p>

        <div className="mt-2.5 flex items-baseline justify-between text-16 leading-5 font-bold">
          <span className="text-text-primary">{CART_COPY.totalLabel}</span>
          <span className="text-highlight">{formatMoney(totals.total, 3)}</span>
        </div>
      </div>

      <Link
        to="/pagamento"
        className="mt-4 flex h-14 items-center justify-center rounded-full bg-linear-to-r from-primary to-[#b67842] text-16 font-bold text-background"
      >
        {CART_COPY.checkout}
      </Link>
    </section>
  )
}
