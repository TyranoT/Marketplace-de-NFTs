import { Button } from '@/global/components/ui/button'
import { CHECKOUT_COPY } from '../constants/checkout-copy'

type CheckoutQuoteNoticeProps = {
  onReview: () => void
}

/**
 * A cotação mudou enquanto o formulário estava aberto.
 *
 * `role="alert"` aqui, diferente do aviso do carrinho: ali era informação,
 * aqui a ação que a pessoa ia tomar foi bloqueada — precisa interromper a
 * leitura, não esperar a próxima pausa.
 */
export function CheckoutQuoteNotice({ onReview }: CheckoutQuoteNoticeProps) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-md border border-highlight/40 bg-highlight/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-14 leading-5 text-text-primary">
        {CHECKOUT_COPY.quoteStale}
      </p>

      <Button
        type="button"
        onClick={onReview}
        className="h-9 shrink-0 px-4 text-13"
      >
        {CHECKOUT_COPY.quoteReview}
      </Button>
    </div>
  )
}
