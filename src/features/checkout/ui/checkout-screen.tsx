import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { Breadcrumb } from '@/global/components/ui/breadcrumb'
import { Container } from '@/global/components/ui/container'
import { Skeleton } from '@/global/components/ui/skeleton'
import { useApplyCoupon, useCart } from '@/global/api/cart'
import { useCheckout } from '@/global/api/checkout'
import { CartEmpty, toCartErrorMessage } from '@/features/cart'
import { CHECKOUT_BREADCRUMB, CHECKOUT_COPY } from '../constants/checkout-copy'
import {
  CHECKOUT_DEFAULTS,
  checkoutResolver,
  toCheckoutInput,
} from '../helpers/checkout-schema'
import { toCheckoutErrorMessage } from '../helpers/to-checkout-error-message'
import { CheckoutError } from '../components/checkout-error'
import { CheckoutForm } from '../components/checkout-form'
import { CheckoutSummary } from '../components/checkout-summary'
import { OrderConfirmationDialog } from '../components/order-confirmation-dialog'
import type { CheckoutFormValues } from '../helpers/checkout-schema'
import type { Order } from '@/global/api'

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
  const checkout = useCheckout()
  const applyCoupon = useApplyCoupon()
  const navigate = useNavigate()

  const [order, setOrder] = useState<Order>()

  const form = useForm<CheckoutFormValues>({
    resolver: checkoutResolver,
    defaultValues: CHECKOUT_DEFAULTS,
    mode: 'onSubmit',
  })

  const walletId = form.watch('walletId')

  function handleSubmit(values: CheckoutFormValues) {
    checkout.mutate(toCheckoutInput(values), {
      onSuccess: (created) => setOrder(created),
    })
  }

  /** Fechar a confirmação leva ao início: o carrinho comprado não existe mais. */
  function handleCloseConfirmation() {
    setOrder(undefined)
    void navigate({ to: '/' })
  }

  return (
    <Container as="main" className="flex flex-col gap-8 md:pt-8">
      <div className="flex flex-col gap-6">
        <Breadcrumb items={CHECKOUT_BREADCRUMB} />

        {checkout.isError ? (
          <CheckoutError message={toCheckoutErrorMessage(checkout.error)} />
        ) : null}

        {cart.isPending ? <CheckoutSkeleton /> : null}

        {cart.isError && !cart.data ? (
          <CheckoutError message={toCartErrorMessage(cart.error)} />
        ) : null}

        {cart.data && cart.data.items.length === 0 && !order ? (
          <CartEmpty />
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
                onSubmit={form.handleSubmit(handleSubmit)}
              />
            </div>

            <CheckoutSummary
              cart={cart.data}
              formId={FORM_ID}
              walletId={walletId}
              walletError={form.formState.errors.walletId?.message}
              isSubmitting={checkout.isPending}
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

      {order ? (
        <OrderConfirmationDialog
          order={order}
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
