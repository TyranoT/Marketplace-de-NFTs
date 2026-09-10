import { cn } from '@/global/helpers/cn'
import {
  NFT_DETAIL_COPY,
  RELATED_ACTIVE_SLIDE,
  RELATED_SLIDE_COUNT,
} from '../constants/nft-detail-copy'
import { NftCardLink } from './nft-card-link'
import type { NftSummary } from '@/global/type'

type NftRelatedSectionProps = {
  items: Array<NftSummary>
  /** O carrinho reusa a mesma vitrine sob outro título. */
  heading?: string
  headingId?: string
}

export function NftRelatedSection({
  items,
  heading = NFT_DETAIL_COPY.relatedHeading,
  headingId = 'nft-related',
}: NftRelatedSectionProps) {
  if (items.length === 0) return null

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 border-b border-line pb-4">
        <h2
          id={headingId}
          className="text-17 leading-4 font-bold text-highlight"
        >
          {heading}
        </h2>
      </div>

      <ul className="grid grid-cols-2 gap-6.5 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <li key={item.id}>
            <NftCardLink nft={item} />
          </li>
        ))}
      </ul>

      <div aria-hidden="true" className="flex justify-center gap-2.5">
        {Array.from({ length: RELATED_SLIDE_COUNT }, (_, index) => (
          <span
            key={index}
            className={cn(
              'size-2.5 rounded-full',
              index === RELATED_ACTIVE_SLIDE
                ? 'bg-primary'
                : 'border border-primary',
            )}
          />
        ))}
      </div>
    </section>
  )
}
