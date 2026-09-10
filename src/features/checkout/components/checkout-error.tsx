import { CHECKOUT_COPY } from '../constants/checkout-copy'

type CheckoutErrorProps = {
  message?: string
}

/**
 * Mensagem acima do formulário, e não em lugar dele: uma compra recusada não
 * pode apagar os dados que o colecionador acabou de digitar.
 */
export function CheckoutError({ message }: CheckoutErrorProps) {
  if (!message) return null

  return (
    <div
      role="alert"
      className="flex flex-col gap-1 rounded-sm border border-destructive/60 bg-destructive/10 px-4 py-3"
    >
      <p className="text-15 leading-4 font-bold text-text-primary">
        {CHECKOUT_COPY.errorTitle}
      </p>
      <p className="text-14 leading-5 text-text-secondary">{message}</p>
    </div>
  )
}
