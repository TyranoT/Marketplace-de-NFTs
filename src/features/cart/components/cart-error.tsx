import { Button } from '@/global/components/ui/button'
import { CART_COPY } from '../constants/cart-copy'

type CartErrorProps = {
  message?: string
  onRetry: () => void
}

export function CartError({ message, onRetry }: CartErrorProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-6 py-32 text-center"
    >
      <h2 className="text-28 leading-9 font-bold text-foreground">
        {CART_COPY.errorTitle}
      </h2>

      <p className="max-w-150 text-14 leading-6 text-text-secondary">
        {message ?? CART_COPY.errorBody}
      </p>

      <Button onClick={onRetry} className="w-fit px-8">
        {CART_COPY.errorCta}
      </Button>
    </div>
  )
}
