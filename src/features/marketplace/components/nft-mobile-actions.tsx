import { useRouter } from '@tanstack/react-router'
import { ChevronLeft, Heart } from 'lucide-react'
import { cn } from '@/global/helpers/cn'
import { NFT_DETAIL_COPY } from '../constants/nft-detail-copy'

/** Fundo dos dois botões: medido no frame, entre `surface-card` e `line`. */
const CIRCLE = 'flex size-8.75 items-center justify-center rounded-full'

type NftMobileActionsProps = {
  isFavorite: boolean
  onToggleFavorite: () => void
}

/** Voltar e favoritar, acima da arte, na tela de detalhes do mobile. */
export function NftMobileActions({
  isFavorite,
  onToggleFavorite,
}: NftMobileActionsProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        aria-label={NFT_DETAIL_COPY.backLabel}
        onClick={() => router.history.back()}
        className={cn(CIRCLE, 'bg-[#2f1d15] text-brand')}
      >
        <ChevronLeft className="size-4.5" />
      </button>

      <button
        type="button"
        aria-pressed={isFavorite}
        aria-label={
          isFavorite
            ? NFT_DETAIL_COPY.favoritedLabel
            : NFT_DETAIL_COPY.favoriteLabel
        }
        onClick={onToggleFavorite}
        className={cn(CIRCLE, 'bg-[#2f1d15] text-brand')}
      >
        <Heart className={cn('size-4.5', isFavorite && 'fill-current')} />
      </button>
    </div>
  )
}
