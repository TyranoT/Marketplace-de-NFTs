import { useState } from 'react'
import { Breadcrumb } from '@/global/components/ui/breadcrumb'
import { Container } from '@/global/components/ui/container'
import {
  useApplyCoupon,
  useCart,
  useRemoveCartItem,
  useRemoveCoupon,
  useUpdateCartItem,
} from '@/global/api/cart'
import { getCartRecommendations } from '@/global/data'
import { NftRelatedSection } from '@/features/marketplace'
import { CART_BREADCRUMB, CART_COPY } from '../constants/cart-copy'
import { toCartErrorMessage } from '../helpers/to-cart-error-message'
import { useCartFocus } from '../hooks/use-cart-focus'
import { CartEmpty } from '../components/cart-empty'
import { CartError } from '../components/cart-error'
import { CartMobileList } from '../components/cart-mobile-list'
import { CartSummary } from '../components/cart-summary'
import { CartSummarySkeleton } from '../components/cart-summary-skeleton'
import { CartTable } from '../components/cart-table'
import { CartTableSkeleton } from '../components/cart-table-skeleton'
import type { CartItem } from '@/global/api'

/**
 * Duas colunas de 782 e 332 separadas por 86, medidas no frame de 1440.
 * Em `fr` proporcional em vez de pixels fixos: nas larguras exatas do design
 * o resultado é idêntico, e abaixo delas as colunas encolhem juntas em vez
 * de estourar o container.
 */
const CART_GRID =
  'grid gap-y-10 lg:grid-cols-[minmax(0,782fr)_minmax(0,332fr)] lg:items-start lg:gap-x-21.5'

export function CartScreen() {
  const cart = useCart()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()
  const applyCoupon = useApplyCoupon()
  const removeCoupon = useRemoveCoupon()
  const focus = useCartFocus()

  const [actionError, setActionError] = useState<string>()

  /** Falha de revalidação com dados em cache: avisa sem apagar a lista. */
  const backgroundError =
    cart.isError && cart.data ? toCartErrorMessage(cart.error) : undefined

  const pendingItemId =
    updateItem.isPending || removeItem.isPending
      ? (updateItem.variables?.itemId ?? removeItem.variables?.itemId)
      : undefined

  function handleQuantityChange(itemId: string, quantity: number) {
    setActionError(undefined)
    updateItem.mutate(
      { itemId, quantity },
      { onError: (error) => setActionError(toCartErrorMessage(error)) },
    )
  }

  function handleRemove(item: CartItem) {
    setActionError(undefined)
    removeItem.mutate(
      { itemId: item.id },
      {
        onSuccess: (next) => focus.handleRemoved(item, next.items),
        onError: (error) => setActionError(toCartErrorMessage(error)),
      },
    )
  }

  return (
    <Container as="main" className="flex flex-col gap-8 md:gap-24 md:pt-8">
      {/**
       * `tabIndex={-1}` aqui, e não no bloco da tabela: quando o último item
       * sai, a tabela é desmontada junto com ele, e o foco cairia no `body`.
       * Este wrapper sobrevive à troca para o estado vazio.
       */}
      <div
        ref={focus.regionRef}
        tabIndex={-1}
        className="flex flex-col gap-3 outline-none"
      >
        <Breadcrumb items={CART_BREADCRUMB} />

        {/** Mensagens de mutation ficam acima da lista, onde a ação começou. */}
        {(actionError ?? backgroundError) ? (
          <p role="alert" className="text-14 leading-5 text-destructive">
            {actionError ?? backgroundError}
          </p>
        ) : null}

        <p role="status" className="sr-only">
          {focus.status}
        </p>

        {cart.isPending ? (
          <div className={CART_GRID}>
            <CartTableSkeleton />
            <CartSummarySkeleton />
          </div>
        ) : null}

        {/**
         * A tela de erro só substitui o conteúdo quando não há carrinho
         * algum para mostrar. Uma revalidação que falha em segundo plano
         * mantém a lista no lugar — apagá-la faria o colecionador perder de
         * vista o que já tinha, por causa de uma falha que não o afeta.
         */}
        {cart.isError && !cart.data ? (
          <CartError
            message={toCartErrorMessage(cart.error)}
            onRetry={() => void cart.refetch()}
          />
        ) : null}

        {cart.data && cart.data.items.length === 0 ? <CartEmpty /> : null}

        {cart.data && cart.data.items.length > 0 ? (
          <div className={CART_GRID}>
            <div>
              <CartTable
                items={cart.data.items}
                pendingItemId={pendingItemId}
                registerRemoveButton={focus.registerRemoveButton}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />

              <CartMobileList
                items={cart.data.items}
                pendingItemId={pendingItemId}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            </div>

            <CartSummary
              cart={cart.data}
              isUpdating={
                updateItem.isPending || removeItem.isPending || cart.isFetching
              }
              couponError={toCartErrorMessage(applyCoupon.error)}
              isApplyingCoupon={applyCoupon.isPending}
              onApplyCoupon={(code) => applyCoupon.mutate({ code })}
              onRemoveCoupon={() => removeCoupon.mutate()}
            />
          </div>
        ) : null}
      </div>

      <NftRelatedSection
        items={getCartRecommendations()}
        heading={CART_COPY.recommendationsHeading}
        headingId="cart-recommendations"
      />
    </Container>
  )
}

/** Renderizada pelo servidor enquanto a rota client-only não hidrata. */
export function CartScreenSkeleton() {
  return (
    <Container as="main" className="flex flex-col gap-8 md:gap-24 md:pt-8">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={CART_BREADCRUMB} />

        <div className={CART_GRID}>
          <CartTableSkeleton />
          <CartSummarySkeleton />
        </div>
      </div>
    </Container>
  )
}
