import { Minus, Plus } from 'lucide-react'
import { NFT_DETAIL_COPY } from '../constants/nft-detail-copy'

type QuantityStepperProps = {
  value: number
  onIncrease: () => void
  onDecrease: () => void
}

const BUTTON_CLASS =
  'flex h-7 w-7 items-center justify-center rounded-full bg-primary text-ink disabled:opacity-50 md:size-8'

export function QuantityStepper({
  value,
  onIncrease,
  onDecrease,
}: QuantityStepperProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label={NFT_DETAIL_COPY.decreaseLabel}
        onClick={onDecrease}
        disabled={value <= 1}
        className={BUTTON_CLASS}
      >
        <Minus className="size-3.5 md:size-4" />
      </button>

      <output
        aria-label={NFT_DETAIL_COPY.quantityLabel}
        className="min-w-4 text-center text-16 leading-4 text-foreground"
      >
        {value}
      </output>

      <button
        type="button"
        aria-label={NFT_DETAIL_COPY.increaseLabel}
        onClick={onIncrease}
        className={BUTTON_CLASS}
      >
        <Plus className="size-3.5 md:size-4" />
      </button>
    </div>
  )
}
