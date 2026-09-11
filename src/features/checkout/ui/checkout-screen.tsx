import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import type { FieldErrors } from 'react-hook-form'
import { Breadcrumb } from '@/global/components/ui/breadcrumb'
import { Container } from '@/global/components/ui/container'
import { Skeleton } from '@/global/components/ui/skeleton'
import { useApplyCoupon, useCart } from '@/global/api/cart'
import { useCurrentUser, useWallets } from '@/global/api/user'
import { useDeviceTier } from '@/global'
import { CartEmpty, toCartErrorMessage } from '@/features/cart'
import { CHECKOUT_BREADCRUMB, CHECKOUT_COPY } from '../constants/checkout-copy'
import {
  CHECKOUT_DEFAULTS,
  checkoutResolver,
  toCheckoutInput,
} from '../helpers/checkout-schema'
import { toCheckoutErrorMessage } from '../helpers/to-checkout-error-message'
import {
  findPrimary,
  toCheckoutWallets,
  toFormValues,
  toWalletCheckoutInput,
} from '../helpers/to-checkout-wallets'
import { useOrderAttempt } from '../hooks/use-order-attempt'
import { useQuoteGuard } from '../hooks/use-quote-guard'
import { CheckoutError } from '../components/checkout-error'
import { CheckoutForm } from '../components/checkout-form'
import { CheckoutQuoteNotice } from '../components/checkout-quote-notice'
import { CheckoutSummary } from '../components/checkout-summary'
import { OrderConfirmationDialog } from '../components/order-confirmation-dialog'
import { WALLET_OPTIONS_ID } from '../components/checkout-wallet-options'
import { CheckoutMobileScreen } from './checkout-mobile-screen'
import type { CheckoutFormValues } from '../helpers/checkout-schema'

const FORM_ID = 'checkout-form'

/**
 * Duas colunas de 762 e 405 separadas por 33, medidas no frame de 1440. Em
 * `fr` proporcional, como no carrinho: nas larguras do design o resultado é
 * idêntico, e abaixo delas as colunas encolhem juntas.
 */
const CHECKOUT_GRID =
  'grid gap-y-10 lg:grid-cols-[minmax(0,762fr)_minmax(0,405fr)] lg:items-start lg:gap-x-8.25'

export function CheckoutScreen() {
  const cart = useCart()
  const attempt = useOrderAttempt()
  const applyCoupon = useApplyCoupon()
  const navigate = useNavigate()
  const quote = useQuoteGuard(cart.data)

  const order = attempt.order

  /**
   * Fechar o diálogo com a compra pendente só o esconde. Antes descartava a
   * tentativa, e o pedido seguia sendo confirmado sem ninguém para ver o
   * resultado. Ele volta sozinho quando o desfecho chega.
   */
  const [hiddenPendingId, setHiddenPendingId] = useState<string>()
  const isPendingHidden =
    order?.status === 'pending' && hiddenPendingId === order.id
  const visibleOrder = order && !isPendingHidden ? order : undefined

  const form = useForm<CheckoutFormValues>({
    resolver: checkoutResolver,
    defaultValues: CHECKOUT_DEFAULTS,
    mode: 'onSubmit',
  })

  const walletId = form.watch('walletId')

  const user = useCurrentUser()
  const wallets = useWallets()
  const isMobile = useDeviceTier() === 'mobile'
  const hasItems = Boolean(cart.data && cart.data.items.length > 0)
  const primaryWallet = findPrimary(wallets.data)

  /**
   * Com conta, o formulário nasce com a carteira principal — ela guarda
   * exatamente os campos que o pagamento pede. `keepDirtyValues` protege o
   * que o colecionador já digitou antes da lista chegar.
   */
  useEffect(() => {
    if (!primaryWallet || !user) return

    form.reset(
      { ...CHECKOUT_DEFAULTS, ...toFormValues(primaryWallet, user.username) },
      { keepDirtyValues: true },
    )
  }, [form, primaryWallet, user])

  /**
   * A carteira é escolhida por rádio, fora do `register` do react-hook-form,
   * e ele não sabe focá-la. Quando ela é o único erro, o foco não ia a lugar
   * nenhum — então vai para o primeiro rádio do grupo.
   */
  function focusWalletWhenOnlyError(errors: FieldErrors<CheckoutFormValues>) {
    if (Object.keys(errors).length !== 1 || !errors.walletId) return

    document
      .querySelector<HTMLElement>(`#${WALLET_OPTIONS_ID} [role="radio"]`)
      ?.focus()
  }

  function handleSubmit(values: CheckoutFormValues) {
    /** Guarda de corrida: a cotação pode ter vencido entre o clique e aqui. */
    if (quote.isStale) return

    attempt.submit(toCheckoutInput(values, quote.reviewedVersion))
  }

  /**
   * Fechar leva ao início quando a compra foi confirmada — o carrinho
   * comprado não existe mais. Numa recusa fica onde está: os itens foram
   * preservados, e mandar embora quem acabou de falhar tiraria dele o
   * caminho de tentar de novo.
   */
  function handleCloseConfirmation() {
    if (order?.status === 'pending') {
      setHiddenPendingId(order.id)

      return
    }

    const wasConfirmed = order?.status === 'confirmed'

    attempt.dismiss()

    if (wasConfirmed) void navigate({ to: '/' })
  }

  function handleWalletConfirm(chosen: {
    walletId: string
    walletType: string
  }) {
    const wallet = wallets.data?.find(({ id }) => id === chosen.walletId)

    if (!wallet || !user) return

    if (quote.isStale) return

    attempt.submit(
      toWalletCheckoutInput(
        wallet,
        user.username,
        chosen.walletType,
        quote.reviewedVersion,
      ),
    )
  }

  /**
   * O frame mobile não tem formulário: com carteira salva, a compra sai da
   * carteira. Sem conta ou sem carteira, cai na composição de sempre — o
   * servidor exige o perfil de um jeito ou de outro.
   */
  const savedWallets = wallets.data ?? []
  const paysWithWallet =
    isMobile && Boolean(user) && savedWallets.length > 0 && hasItems

  if (paysWithWallet && cart.data) {
    return (
      <>
        <CheckoutMobileScreen
          cart={cart.data}
          wallets={savedWallets}
          isSubmitting={attempt.isSubmitting}
          /** Mesmo bloqueio do desktop: a compra é a mesma. */
          isQuoteStale={quote.isStale}
          error={attempt.error}
          onConfirm={handleWalletConfirm}
          onReviewQuote={quote.acceptCurrent}
        />

        {visibleOrder ? (
          <OrderConfirmationDialog
            order={visibleOrder}
            onClose={handleCloseConfirmation}
          />
        ) : null}
      </>
    )
  }

  return (
    <Container as="main" className="flex flex-col gap-8 md:pt-8">
      <div className="flex flex-col gap-6">
        <Breadcrumb items={CHECKOUT_BREADCRUMB} />

        {attempt.error ? (
          <CheckoutError message={toCheckoutErrorMessage(attempt.error)} />
        ) : null}

        {cart.isPending ? <CheckoutSkeleton /> : null}

        {cart.isError && !cart.data ? (
          <CheckoutError message={toCartErrorMessage(cart.error)} />
        ) : null}

        {cart.data && cart.data.items.length === 0 && !order ? (
          <CartEmpty />
        ) : null}

        {/**
         * Fora da grade e acima dela: o bloqueio vale para as duas colunas,
         * e o botão de enviar vive na direita.
         */}
        {quote.isStale ? (
          <CheckoutQuoteNotice onReview={quote.acceptCurrent} />
        ) : null}

        {isPendingHidden ? (
          <p role="status" className="text-14 leading-5 text-text-secondary">
            {CHECKOUT_COPY.pendingInBackground}
          </p>
        ) : null}

        {cart.data && cart.data.items.length > 0 ? (
          <div className={CHECKOUT_GRID}>
            <div className="flex flex-col gap-6">
              <h1 className="text-17 leading-4 font-bold text-text-primary">
                {CHECKOUT_COPY.profileHeading}
              </h1>

              <CheckoutForm
                id={FORM_ID}
                form={form}
                onSubmit={form.handleSubmit(
                  handleSubmit,
                  focusWalletWhenOnlyError,
                )}
              />
            </div>

            <CheckoutSummary
              cart={cart.data}
              formId={FORM_ID}
              wallets={toCheckoutWallets(wallets.data)}
              walletId={walletId}
              walletError={form.formState.errors.walletId?.message}
              isSubmitting={attempt.isSubmitting}
              isBlocked={quote.isStale}
              couponError={toCartErrorMessage(applyCoupon.error)}
              isApplyingCoupon={applyCoupon.isPending}
              onWalletChange={(next) =>
                form.setValue('walletId', next, { shouldValidate: true })
              }
              onApplyCoupon={(code) => applyCoupon.mutate({ code })}
            />
          </div>
        ) : null}
      </div>

      {visibleOrder ? (
        <OrderConfirmationDialog
          order={visibleOrder}
          onClose={handleCloseConfirmation}
        />
      ) : null}
    </Container>
  )
}

function CheckoutSkeleton() {
  return (
    <div className={CHECKOUT_GRID}>
      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
        {Array.from({ length: 10 }, (_, index) => (
          <Skeleton key={index} className="h-16 w-full" />
        ))}
      </div>

      <Skeleton className="h-150 w-full" />
    </div>
  )
}

/** Renderizada pelo servidor enquanto a rota client-only não hidrata. */
export function CheckoutScreenSkeleton() {
  return (
    <Container as="main" className="flex flex-col gap-8 md:pt-8">
      <div className="flex flex-col gap-6">
        <Breadcrumb items={CHECKOUT_BREADCRUMB} />
        <CheckoutSkeleton />
      </div>
    </Container>
  )
}
