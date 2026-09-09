import { LogOut, Search, ShoppingCart } from 'lucide-react'
import { Button } from '@/global/components/ui/button'
import { buildCartLabel } from '../helpers/build-cart-label'

type HeaderActionsProps = {
  cartCount: number
}

export function HeaderActions({ cartCount }: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-7">
      <button type="button" aria-label="Buscar" className="text-foreground">
        <Search className="size-6" />
      </button>

      <button
        type="button"
        aria-label={buildCartLabel(cartCount)}
        className="relative size-6 text-foreground"
      >
        <ShoppingCart className="size-6" />
        <span className="absolute top-0 left-3.75 flex size-4 items-center justify-center rounded-full bg-primary text-10 font-medium text-ink ring-2 ring-ink">
          {cartCount}
        </span>
      </button>

      <Button className="h-8.75 w-25 gap-1 px-0 text-16">
        <LogOut className="size-5" />
        Entrar
      </Button>
    </div>
  )
}
