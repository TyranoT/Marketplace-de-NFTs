import { X } from 'lucide-react'
import { Button } from '@/global/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/global/components/ui/dialog'
import { ThankYouEnvelopeIcon } from '@/global/components/icons'
import { cn } from '@/global/helpers/cn'
import {
  formatEthAmount,
  formatMoney,
  parseEth,
} from '@/global/helpers/eth-amount'
import { CART_COPY } from '@/features/cart'
import { CHECKOUT_COPY } from '../constants/checkout-copy'
import {
  buildExplorerUrl,
  formatOrderDate,
  shortenHash,
} from '../helpers/format-order'
import { OrderConfirmationItem } from './order-confirmation-item'
import type { Order } from '@/global/api'

type OrderConfirmationDialogProps = {
  order: Order
  onClose: () => void
}

/**
 * Card de 578×821 do frame, com a faixa de metadados entre dois divisores e
 * a barra da marca no rodapé. Fecha para o carrinho vazio: o pedido já está
 * concluído, e não há a que voltar nesta tela.
 */
export function OrderConfirmationDialog({
  order,
  onClose,
}: OrderConfirmationDialogProps) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-144.5 border-b-10 border-primary">
        <div className="relative flex flex-col px-11 pt-5">
          {/**
           * Medidas do frame: traço de 12px, a 17 da borda direita e 19,5 do
           * topo do card. O ícone do lucide desenha o X em metade da própria
           * caixa, então `size-6` é o que resulta nos 12px de tinta — e o
           * `after` estende a área de clique aos 40px do alvo mínimo sem
           * deslocar o desenho.
           */}
          <DialogClose
            aria-label={CHECKOUT_COPY.confirmationClose}
            className="absolute top-3.5 right-2.75 text-brand transition-colors after:absolute after:-inset-2 hover:text-highlight"
          >
            <X className="size-6" />
          </DialogClose>

          <ThankYouEnvelopeIcon className="mt-4 h-20 self-center text-brand" />

          <DialogTitle className="mt-5 text-center text-16 leading-5 font-bold text-text-secondary">
            {CHECKOUT_COPY.confirmationTitle}
          </DialogTitle>
        </div>

        {/** No card estreito os quatro metadados não caem em uma linha: 2×2. */}
        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-primary px-9 py-4.5 text-14 leading-5 md:grid-cols-4 md:gap-y-1 md:divide-x md:divide-line-soft">
          <ConfirmationMeta
            label={CHECKOUT_COPY.transactionIdLabel}
            value={shortenHash(order.transactionHash)}
            isStrong
          />
          <ConfirmationMeta
            label={CHECKOUT_COPY.dateLabel}
            value={formatOrderDate(order.createdAt)}
          />
          <ConfirmationMeta
            label={CHECKOUT_COPY.totalLabel}
            value={formatMoney(order.totals.total, 3)}
          />
          <ConfirmationMeta
            label={CHECKOUT_COPY.walletLabel}
            value={order.walletLabel}
            isStrong
          />
        </dl>

        <div className="flex flex-col px-11 pb-6">
          <h3 className="mt-4.5 text-16 leading-5 font-bold text-text-primary">
            {CHECKOUT_COPY.detailsHeading}
          </h3>

          <div className="mt-3 flex items-baseline justify-between border-b border-line-soft pb-2 text-16 leading-4 font-bold text-foreground">
            <span>{CHECKOUT_COPY.columnNfts}</span>
            <span className="flex gap-12">
              <span>{CHECKOUT_COPY.columnEditions}</span>
              <span>{CHECKOUT_COPY.columnSubtotal}</span>
            </span>
          </div>

          <ul className="flex flex-col">
            {order.items.map((item) => (
              <OrderConfirmationItem key={item.nftId} item={item} />
            ))}
          </ul>

          <dl className="mt-3 flex flex-col gap-2 border-b border-line-soft pb-3 text-15 leading-4">
            {/**
             * O frame não tem esta linha porque seu cenário não tem cupom.
             * Omiti-la numa compra com desconto mostraria um total menor sem
             * dizer por quê — o recibo tem de fechar a conta que cobrou.
             */}
            {hasDiscount(order) ? (
              <ConfirmationTotalRow
                label={discountLabel(order)}
                value={`(-) ${formatEthAmount(parseEth(order.totals.discount.amount))}`}
              />
            ) : null}

            <ConfirmationTotalRow
              label={CART_COPY.networkFeeLabel}
              value={formatMoney(order.totals.networkFee, 3)}
            />

            <ConfirmationTotalRow
              label={CART_COPY.totalLabel}
              value={formatMoney(order.totals.total, 3)}
              isTotal
            />
          </dl>

          <p className="mt-4 px-4 text-center text-14 leading-6 text-brand-muted">
            {CHECKOUT_COPY.confirmationNote}
          </p>

          <Button
            render={
              <a
                href={buildExplorerUrl(order.transactionHash)}
                target="_blank"
                rel="noreferrer noopener"
                title={CHECKOUT_COPY.explorerHint}
              />
            }
            className="mt-6 h-12 self-center px-8 text-15 font-bold"
          >
            {CHECKOUT_COPY.explorerCta}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function hasDiscount(order: Order): boolean {
  return parseEth(order.totals.discount.amount) > 0n
}

/** Com cupom, o código entra no rótulo: é o que explica o abatimento. */
function discountLabel(order: Order): string {
  return order.couponCode
    ? `${CART_COPY.discountLabel} · ${order.couponCode}`
    : CART_COPY.discountLabel
}

type ConfirmationTotalRowProps = {
  label: string
  value: string
  isTotal?: boolean
}

function ConfirmationTotalRow({
  label,
  value,
  isTotal,
}: ConfirmationTotalRowProps) {
  return (
    <div
      className={cn(
        'flex items-baseline justify-between gap-4 md:pl-30',
        isTotal && 'font-bold',
      )}
    >
      <dt className={isTotal ? 'text-text-primary' : 'text-foreground'}>
        {label}
      </dt>
      <dd className={isTotal ? 'text-highlight' : 'text-foreground'}>
        {value}
      </dd>
    </div>
  )
}

type ConfirmationMetaProps = {
  label: string
  value: string
  isStrong?: boolean
}

function ConfirmationMeta({ label, value, isStrong }: ConfirmationMetaProps) {
  return (
    <div className="flex flex-col gap-1 md:px-4 md:first:pl-0">
      <dt className="text-brand-muted">{label}</dt>
      <dd
        className={
          isStrong ? 'font-bold text-text-primary' : 'text-text-primary'
        }
      >
        {value}
      </dd>
    </div>
  )
}
