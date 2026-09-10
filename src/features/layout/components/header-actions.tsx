import { Link } from '@tanstack/react-router'
import { LogOut, Search, ShoppingCart } from 'lucide-react'
import { Button } from '@/global/components/ui/button'
import { useCartCount } from '@/global/api/cart'
import { buildCartLabel } from '../helpers/build-cart-label'

type HeaderActionsProps = {
  /** Sobrepõe a contagem real. Usado pela vitrine de componentes. */
  cartCount?: number
}

/** A bolha tem 16px: acima de 9 o número não cabe sem deformar o círculo. */
const MAX_BADGE = 9

export function HeaderActions({ cartCount }: HeaderActionsProps) {
  const resolved = useCartCount()
  const count = cartCount ?? resolved

  return (
    <div className="flex items-center gap-7">
      <button type="button" aria-label="Buscar" className="text-foreground">
        <Search className="size-6" />
      </button>

      <Link
        to="/carrinho"
        aria-label={buildCartLabel(count)}
        className="relative size-6 text-foreground"
      >
        <ShoppingCart className="size-6" />

        {count !== undefined && count > 0 ? (
          <span className="absolute top-0 left-3.75 flex size-4 items-center justify-center rounded-full bg-primary text-10 font-medium text-ink ring-2 ring-ink">
            {count > MAX_BADGE ? `${MAX_BADGE}+` : count}
          </span>
        ) : null}
      </Link>

      <Button className="h-8.75 w-25 gap-1 px-0 text-16 text-background">
        <LogOut className="size-5" />
        Entrar
      </Button>
    </div>
  )
}
