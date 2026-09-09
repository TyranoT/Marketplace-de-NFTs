import { Star } from 'lucide-react'
import { cn } from 'cn'
import { formatRatingLabel } from '../helpers/format-rating-label'
import type { NftRating } from '@/global/type'

const MAX_STARS = 5

type NftRatingProps = {
  rating: NftRating
}

export function NftRating({ rating }: NftRatingProps) {
  return (
    <div className="flex items-center gap-2.5">
      <span aria-hidden="true" className="flex items-center gap-1.5">
        {Array.from({ length: MAX_STARS }, (_, index) => (
          <Star
            key={index}
            className={cn(
              'size-3.5',
              index < rating.value
                ? 'fill-brand text-brand'
                : 'fill-brand-muted text-brand-muted',
            )}
          />
        ))}
      </span>

      <span className="text-14 leading-4 text-foreground">
        {formatRatingLabel(rating.count)}
      </span>
    </div>
  )
}
