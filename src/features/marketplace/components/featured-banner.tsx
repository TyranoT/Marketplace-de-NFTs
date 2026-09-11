import { useId } from 'react'
import { FEATURED_BANNER } from '../constants/promos'

export function FeaturedBanner() {
  const { eyebrow, title, artwork } = FEATURED_BANNER
  const titleId = useId()

  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col gap-4 bg-surface-card pt-6"
    >
      {/**
       * Maiúsculas pelo CSS: texto inteiro em caixa alta, alguns leitores de
       * tela soletram letra a letra.
       */}
      <div className="flex flex-col gap-4 px-5 text-center uppercase">
        <h2 id={titleId} className="text-24 font-bold text-highlight">
          {eyebrow}
        </h2>
        <p className="text-18 leading-4 font-bold text-foreground">{title}</p>
      </div>

      <img
        src={artwork.src}
        alt={artwork.alt}
        loading="lazy"
        decoding="async"
        className="aspect-310/368 w-full rounded-xl object-cover"
      />
    </section>
  )
}
