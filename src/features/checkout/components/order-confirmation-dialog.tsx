import { X } from 'lucide-react'
import { Button } from '@/global/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/global/components/ui/dialog'
import { ThankYouEnvelopeIcon } from '@/global/components/icons'
import { formatMoney } from '@/global/helpers/eth-amount'
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
          <DialogClose
            aria-label={CHECKOUT_COPY.confirmationClose}
            className="absolute top-5 right-0 text-brand transition-colors hover:text-highlight"
          >
            <X className="size-5" />
          </DialogClose>

          <ThankYouEnvelopeIcon className="mt-4 h-20 self-center text-brand" />

          <DialogTitle className="mt-5 text-center text-16 leading-5 font-bold text-text-secondary">
            {CHECKOUT_COPY.confirmationTitle}
          </DialogTitle>
        </div>

        <dl className="mt-5 grid grid-cols-[1fr_auto_1fr_auto] gap-x-6 gap-y-1 border-y border-primary px-9 py-4.5 text-14 leading-5 md:grid-cols-4 md:divide-x md:divide-line-soft">
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
            <div className="flex items-baseline justify-between gap-4 pl-30">
              <dt className="text-foreground">{CART_COPY.networkFeeLabel}</dt>
              <dd className="text-foreground">
                {formatMoney(order.totals.networkFee, 3)}
              </dd>
            </div>

            <div className="flex items-baseline justify-between gap-4 pl-30 font-bold">
              <dt className="text-text-primary">{CART_COPY.totalLabel}</dt>
              <dd className="text-highlight">
                {formatMoney(order.totals.total, 3)}
              </dd>
            </div>
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
