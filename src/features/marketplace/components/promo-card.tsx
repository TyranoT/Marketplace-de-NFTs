import { ArrowRight } from 'lucide-react'
import { Button } from '@/global/components/ui/button'
import type { PromoCardContent } from '../type'

type PromoCardProps = {
  promo: PromoCardContent
}

export function PromoCard({ promo }: PromoCardProps) {
  const { titleLines, body, cta, artwork } = promo

  return (
    <article className="relative h-[250px] overflow-hidden rounded-lg bg-surface-card">
      <img
        src={artwork.src}
        alt={artwork.alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-y-0 left-0 h-full w-[287px] object-cover"
      />

      <div className="absolute top-[37px] right-[30px] flex w-[263px] flex-col items-end gap-2 text-right">
        <h3 className="text-18 leading-6 font-bold text-foreground">
          {titleLines[0]}
          <br />
          {titleLines[1]}
        </h3>

        <p className="text-14 leading-6 text-text-secondary">{body}</p>

        <Button className="mt-4 w-35">
          {cta}
          <ArrowRight />
        </Button>
      </div>
    </article>
  )
}
