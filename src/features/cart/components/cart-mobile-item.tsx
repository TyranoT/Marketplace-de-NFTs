import { Trash2 } from 'lucide-react'
import { QuantityStepper } from '@/global/components/ui/quantity-stepper'
import { formatMoney } from '@/global/helpers/eth-amount'
import { cn } from '@/global/helpers/cn'
import {
  CART_COPY,
  buildDecreaseLabel,
  buildIncreaseLabel,
  buildQuantityLabel,
  buildRemoveLabel,
} from '../constants/cart-copy'
import type { CartItem } from '@/global/api'

type CartMobileItemProps = {
  item: CartItem
  isPending: boolean
  registerRemoveButton: (
    itemId: string,
    element: HTMLButtonElement | null,
  ) => void
  onQuantityChange: (itemId: string, quantity: number) => void
  onRemove: (item: CartItem) => void
}

/**
 * Card de 358×112 do frame: a arte encostada na borda esquerda, identidade e
 * preço no meio, controles à direita.
 *
 * O frame desenha a lixeira em uma linha só, no lugar do `+`. Aqui ela é um
 * quarto controle em todas: sem ela não haveria como tirar um item do carrinho
 * no mobile, e o desktop tem a coluna de ações justamente para isso.
 */
export function CartMobileItem({
  item,
  isPending,
  registerRemoveButton,
  onQuantityChange,
  onRemove,
}: CartMobileItemProps) {
  return (
    <article className="relative flex min-w-0 items-stretch gap-3 rounded-xl bg-surface-card pr-2.5">
      <img
        src={item.imageUrl}
        alt={item.imageAlt}
        loading="lazy"
        decoding="async"
        width={101}
        height={101}
        className="size-25.25 shrink-0 self-center rounded-xl object-cover"
      />

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 py-3">
        <p className="truncate text-15 leading-5 font-bold text-text-primary sm:text-16">
          {item.name}
        </p>

        <p className="truncate text-12 leading-4 text-text-secondary sm:text-13">
          {CART_COPY.editionPrefix} {item.editionLabel}
        </p>

        <p
          className={cn(
            'truncate text-16 leading-5 font-bold text-highlight transition-opacity sm:text-17',
            isPending && 'opacity-60',
          )}
        >
          {formatMoney(item.lineTotal)}
        </p>
      </div>

      <div className="flex shrink-0 items-center self-center">
        <QuantityStepper
          tone="outline"
          size="sm"
          value={item.quantity}
          max={item.available}
          disabled={isPending}
          decreaseLabel={buildDecreaseLabel(item.name)}
          increaseLabel={buildIncreaseLabel(item.name)}
          valueLabel={buildQuantityLabel(item.name)}
          className="gap-1.5"
          onIncrease={() => onQuantityChange(item.id, item.quantity + 1)}
          onDecrease={() => onQuantityChange(item.id, item.quantity - 1)}
        />

        {/**
         * Fora do fluxo, no canto do card: somada à linha, a lixeira roubava
         * ~34px de uma largura que o frame reserva para nome e preço, e o
         * botão de aumentar acabava cortado. O card tem 112 de altura e sobra
         * espaço em cima — é de lá que ela sai.
         */}
        <button
          ref={(element) => registerRemoveButton(item.id, element)}
          type="button"
          aria-label={buildRemoveLabel(item.name)}
          disabled={isPending}
          onClick={() => onRemove(item)}
          className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full text-brand-muted transition-colors hover:text-highlight disabled:opacity-50"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </article>
  )
}
