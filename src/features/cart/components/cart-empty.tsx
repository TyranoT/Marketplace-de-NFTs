import { Link } from '@tanstack/react-router'
import { Button } from '@/global/components/ui/button'
import { CART_COPY } from '../constants/cart-copy'

export function CartEmpty() {
  return (
    <div className="flex flex-col items-center gap-6 py-32 text-center">
      <h2 className="text-28 leading-9 font-bold text-foreground">
        {CART_COPY.emptyTitle}
      </h2>

      <p className="max-w-150 text-14 leading-6 text-text-secondary">
        {CART_COPY.emptyBody}
      </p>

      <Button render={<Link to="/" />} className="w-fit px-8">
        {CART_COPY.emptyCta}
      </Button>
    </div>
  )
}
