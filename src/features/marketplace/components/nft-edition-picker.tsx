import { cn } from 'cn'
import { NFT_DETAIL_COPY } from '../constants/nft-detail-copy'
import type { NftEdition, NftEditionId } from '@/global/type'

type NftEditionPickerProps = {
  editions: Array<NftEdition>
  value: NftEditionId
  onChange: (edition: NftEditionId) => void
}

export function NftEditionPicker({
  editions,
  value,
  onChange,
}: NftEditionPickerProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <p
        id="nft-edition-label"
        className="text-15 leading-4 font-bold text-foreground"
      >
        {NFT_DETAIL_COPY.editionLabel}
      </p>

      <div
        role="radiogroup"
        aria-labelledby="nft-edition-label"
        className="flex flex-wrap gap-1.5"
      >
        {editions.map(({ id, label }) => {
          const isSelected = id === value

          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(id)}
              className={cn(
                'h-6.5 rounded-full border px-1.5 text-14 leading-4',
                isSelected
                  ? 'border-highlight text-highlight'
                  : 'border-line-soft text-text-secondary',
              )}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
