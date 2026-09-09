import { useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/global/helpers/cn'
import { NFT_DETAIL_COPY } from '../constants/nft-detail-copy'
import type { Artwork } from '@/global/type'

type NftGalleryProps = {
  gallery: Array<Artwork>
  name: string
}

export function NftGallery({ gallery, name }: NftGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const active = gallery[activeIndex] ?? gallery[0]

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row lg:gap-7">
      <ul
        aria-label={`Miniaturas de ${name}`}
        className="flex shrink-0 gap-4 overflow-x-auto lg:flex-col lg:overflow-visible"
      >
        {gallery.map((artwork, index) => (
          <li key={index}>
            <button
              type="button"
              aria-label={`${NFT_DETAIL_COPY.thumbLabel} ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'block size-25 overflow-hidden rounded-lg border bg-surface-card p-1',
                index === activeIndex ? 'border-brand' : 'border-transparent',
              )}
            >
              <img
                src={artwork.src}
                alt=""
                loading="lazy"
                decoding="async"
                className="size-full rounded-md object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="relative h-auto w-full shrink-0 rounded-lg bg-surface-card p-5 lg:h-112 lg:w-111">
        <img
          src={active.src}
          alt={active.alt}
          width={444}
          height={448}
          fetchPriority="high"
          className={cn(
            'size-full rounded-xl object-cover transition-transform duration-200',
            isZoomed && 'scale-125',
          )}
        />

        <button
          type="button"
          aria-label={NFT_DETAIL_COPY.zoomLabel}
          aria-pressed={isZoomed}
          onClick={() => setIsZoomed((current) => !current)}
          className="absolute top-8 right-8 flex size-10 items-center justify-center rounded-full bg-ink/80 text-foreground"
        >
          <Search className="size-5" />
        </button>
      </div>
    </div>
  )
}
