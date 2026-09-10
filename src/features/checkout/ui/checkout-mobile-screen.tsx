import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Container } from '@/global/components/ui/container'
import { MobileTopBar } from '@/global/components/ui/mobile-top-bar'
import { RadioGroup } from '@/global/components/ui/radio-group'
import { formatMoney } from '@/global/helpers/eth-amount'
import { CHECKOUT_COPY } from '../constants/checkout-copy'
import { CHECKOUT_PROVIDERS } from '../constants/checkout-providers'
import { toCheckoutErrorMessage } from '../helpers/to-checkout-error-message'
import { CheckoutError } from '../components/checkout-error'
import { CheckoutProviderCard } from '../components/checkout-provider-card'
import { CheckoutQuoteNotice } from '../components/checkout-quote-notice'
import { CheckoutWalletCard } from '../components/checkout-wallet-card'
import type { ApiError, Cart, Wallet } from '@/global/api'

type CheckoutMobileScreenProps = {
  cart: Cart
  wallets: Array<Wallet>
  isSubmitting: boolean
  isQuoteStale: boolean
  error: ApiError | null
  onConfirm: (input: { walletId: string; walletType: string }) => void
  onReviewQuote: () => void
}

/**
 * Tela do frame mobile: escolher a carteira que paga, o provedor da conexão e
 * confirmar. Não há formulário aqui porque o perfil vem da carteira salva —
 * ela guarda exatamente os campos que a compra pede, o que é o motivo pelo
 * qual o frame de carteiras diz que elas ficam disponíveis no pagamento.
 *
 * Quem não tem carteira salva cai no formulário, na composição de sempre: o
 * servidor exige o perfil de um jeito ou de outro, e comprar não pode passar
 * a exigir cadastro.
 */
export function CheckoutMobileScreen({
  cart,
  wallets,
  isSubmitting,
  isQuoteStale,
  error,
  onConfirm,
  onReviewQuote,
}: CheckoutMobileScreenProps) {
  const primary = wallets.find(({ role }) => role === 'primary')

  const [walletId, setWalletId] = useState(primary?.id ?? wallets[0].id)
  const [providerId, setProviderId] = useState(
    primary?.walletType ?? CHECKOUT_PROVIDERS[0].id,
  )

  return (
    <Container as="main" className="flex flex-col gap-6 pb-40">
      <MobileTopBar
        title={CHECKOUT_COPY.mobileTitle}
        backLabel={CHECKOUT_COPY.mobileBack}
      />

      <CheckoutError message={toCheckoutErrorMessage(error)} />

      {isQuoteStale ? <CheckoutQuoteNotice onReview={onReviewQuote} /> : null}

      <section
        aria-labelledby="checkout-connected"
        className="flex flex-col gap-3"
      >
        <div className="flex items-baseline justify-between gap-4">
          <h2
            id="checkout-connected"
            className="text-17 leading-5 font-bold text-text-primary"
          >
            {CHECKOUT_COPY.connectedHeading}
          </h2>

          <Link
            to="/perfil/carteiras"
            className="text-16 leading-5 font-bold text-brand transition-colors hover:text-highlight"
          >
            {CHECKOUT_COPY.switchWallet}
          </Link>
        </div>

        <RadioGroup
          value={walletId}
          onValueChange={(next) => setWalletId(String(next ?? ''))}
          aria-labelledby="checkout-connected"
          className="gap-4"
        >
          {wallets.map((wallet) => (
            <CheckoutWalletCard
              key={wallet.id}
              wallet={wallet}
              isSelected={walletId === wallet.id}
            />
          ))}
        </RadioGroup>
      </section>

      <section
        aria-labelledby="checkout-provider"
        className="flex flex-col gap-3"
      >
        <h2
          id="checkout-provider"
          className="text-17 leading-5 font-bold text-text-primary"
        >
          {CHECKOUT_COPY.walletsHeading}
        </h2>

        <RadioGroup
          value={providerId}
          onValueChange={(next) => setProviderId(String(next ?? ''))}
          aria-labelledby="checkout-provider"
          className="gap-3.5"
        >
          {CHECKOUT_PROVIDERS.map((provider) => (
            <CheckoutProviderCard
              key={provider.id}
              provider={provider}
              isSelected={providerId === provider.id}
            />
          ))}
        </RadioGroup>
      </section>

      <p className="flex items-baseline justify-end gap-3 text-17 leading-5 font-bold">
        <span className="text-text-primary">{CHECKOUT_COPY.totalPrefix}</span>
        <span className="text-highlight">
          {formatMoney(cart.totals.total, 3)}
        </span>
      </p>

      {/** Fixo no rodapé, como no frame: a ação principal não rola para fora. */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-ink px-6 pb-8">
        <button
          type="button"
          disabled={isSubmitting || isQuoteStale}
          onClick={() => onConfirm({ walletId, walletType: providerId })}
          className="flex h-15 w-full items-center justify-center rounded-full bg-linear-to-r from-primary to-[#b67842] text-16 font-bold text-background disabled:opacity-60"
        >
          {isSubmitting ? CHECKOUT_COPY.submitting : CHECKOUT_COPY.submit}
        </button>
      </div>
    </Container>
  )
}
