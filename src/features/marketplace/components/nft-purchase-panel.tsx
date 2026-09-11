import { Heart } from 'lucide-react'
import { cn } from '@/global/helpers/cn'
import { Button } from '@/global/components/ui/button'
import { QuantityStepper } from '@/global/components/ui/quantity-stepper'
import { NFT_DETAIL_COPY } from '../constants/nft-detail-copy'
import { useAddToCart } from '../hooks/use-add-to-cart'
import { useNftPurchase } from '../hooks/use-nft-purchase'
import { NftEditionPicker } from './nft-edition-picker'
import type { NftEditionId } from '@/global/type'

type NftPurchasePanelProps = {
  nftId: string
  editions: Array<{ id: NftEditionId; label: string }>
  selectedEdition: NftEditionId
}

export function NftPurchasePanel({
  nftId,
  editions,
  selectedEdition,
}: NftPurchasePanelProps) {
  const purchase = useNftPurchase(selectedEdition)
  const cart = useAddToCart({ navigateOnSuccess: true })

  return (
    <div className="flex flex-col gap-3.5">
      <NftEditionPicker
        editions={editions}
        value={purchase.edition}
        onChange={purchase.changeEdition}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <QuantityStepper
          value={purchase.quantity}
          decreaseLabel={NFT_DETAIL_COPY.decreaseLabel}
          increaseLabel={NFT_DETAIL_COPY.increaseLabel}
          valueLabel={NFT_DETAIL_COPY.quantityLabel}
          onIncrease={purchase.increase}
          onDecrease={purchase.decrease}
        />

        <div className="flex items-center gap-2">
          {/** `disabled` durante a requisição impede que dois cliques
           * seguidos criem duas linhas do mesmo NFT no carrinho. */}
          <Button
            disabled={cart.isPending}
            onClick={() =>
              cart.add({
                nftId,
                editionId: purchase.edition,
                quantity: purchase.quantity,
              })
            }
            className="w-32.25 text-14 font-bold text-background uppercase"
          >
            {NFT_DETAIL_COPY.buyLabel}
          </Button>

          <Button
            variant="outline"
            aria-pressed={purchase.isFavorite}
            onClick={purchase.toggleFavorite}
            className="w-32.5 border-highlight! bg-transparent text-14 text-highlight"
          >
            <Heart
              className={cn('size-5', purchase.isFavorite && 'fill-current')}
            />
            {/**
             * Rótulo fixo: o estado está no `aria-pressed`, e trocar o texto
             * junto fazia o leitor anunciar "Favoritado, pressionado".
             */}
            {NFT_DETAIL_COPY.favoriteLabel}
          </Button>
        </div>
      </div>

      {cart.error ? (
        <p role="alert" className="text-13 leading-4 text-destructive">
          {cart.error}
        </p>
      ) : null}
    </div>
  )
}
