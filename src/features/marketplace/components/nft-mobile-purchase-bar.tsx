import { ShoppingCart } from 'lucide-react'
import { QuantityStepper } from '@/global/components/ui/quantity-stepper'
import { NFT_DETAIL_COPY } from '../constants/nft-detail-copy'
import { useAddToCart } from '../hooks/use-add-to-cart'
import type { NftEditionId } from '@/global/type'

type NftMobilePurchaseBarProps = {
  nftId: string
  editionId: NftEditionId
  price: string
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
}

/**
 * Barra de compra fixa da tela de detalhes no mobile.
 *
 * Ocupa o lugar da `MobileTabBar`, que a rota de detalhe desliga — o frame não
 * mostra as duas juntas. A sombra para cima é o que separa a barra do painel,
 * já que as duas superfícies têm a mesma cor.
 */
export function NftMobilePurchaseBar({
  nftId,
  editionId,
  price,
  quantity,
  onIncrease,
  onDecrease,
}: NftMobilePurchaseBarProps) {
  const buyNow = useAddToCart({ navigateOnSuccess: true })
  const addToCart = useAddToCart()

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 rounded-t-[40px] bg-surface-card px-6 pt-5.25 pb-8.5 shadow-[0_-8px_24px_rgba(0,0,0,0.5)] md:hidden">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span className="text-14 leading-4 text-text-secondary">
            {NFT_DETAIL_COPY.quantityShortLabel}
          </span>

          <QuantityStepper
            value={quantity}
            decreaseLabel={NFT_DETAIL_COPY.decreaseLabel}
            increaseLabel={NFT_DETAIL_COPY.increaseLabel}
            valueLabel={NFT_DETAIL_COPY.quantityLabel}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
          />
        </div>

        <p className="text-20 leading-4 font-bold text-highlight">{price}</p>
      </div>

      <div className="mt-5.25 flex items-center gap-3">
        <button
          type="button"
          disabled={buyNow.isPending}
          onClick={() => buyNow.add({ nftId, editionId, quantity })}
          className="h-15 flex-1 rounded-full bg-linear-to-r from-primary to-[#b67842] text-16 font-bold text-background disabled:opacity-60"
        >
          {NFT_DETAIL_COPY.mobileBuyLabel}
        </button>

        <button
          type="button"
          aria-label={NFT_DETAIL_COPY.cartLabel}
          disabled={addToCart.isPending}
          onClick={() => addToCart.add({ nftId, editionId, quantity })}
          className="flex size-15 shrink-0 items-center justify-center rounded-full bg-[#2f1d15] text-brand-muted disabled:opacity-60"
        >
          <ShoppingCart className="size-5" />
        </button>
      </div>

      <p role="status" className="sr-only">
        {addToCart.status}
      </p>

      {addToCart.error || buyNow.error ? (
        <p role="alert" className="mt-2 text-13 leading-4 text-destructive">
          {addToCart.error ?? buyNow.error}
        </p>
      ) : null}
    </div>
  )
}
