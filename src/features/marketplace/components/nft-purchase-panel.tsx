import { Heart } from 'lucide-react'
import { cn } from 'cn'
import { Button } from '@/global/components/ui/button'
import { NFT_DETAIL_COPY } from '../constants/nft-detail-copy'
import { useNftPurchase } from '../hooks/use-nft-purchase'
import { NftEditionPicker } from './nft-edition-picker'
import { QuantityStepper } from './quantity-stepper'
import type { NftEditionId } from '@/global/type'

type NftPurchasePanelProps = {
  editions: Array<{ id: NftEditionId; label: string }>
  selectedEdition: NftEditionId
}

export function NftPurchasePanel({
  editions,
  selectedEdition,
}: NftPurchasePanelProps) {
  const purchase = useNftPurchase(selectedEdition)

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
          onIncrease={purchase.increase}
          onDecrease={purchase.decrease}
        />

        <div className="flex items-center gap-2">
          <Button className="w-32.25 text-14 font-bold text-background">
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
            {purchase.isFavorite
              ? NFT_DETAIL_COPY.favoritedLabel
              : NFT_DETAIL_COPY.favoriteLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
