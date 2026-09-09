import { FEATURED_BANNER } from '../constants/promos'

export function FeaturedBanner() {
  const { eyebrow, title, artwork } = FEATURED_BANNER

  return (
    <section
      aria-label={eyebrow}
      className="flex flex-col gap-4 bg-surface-card pt-6"
    >
      <div className="flex flex-col gap-4 px-5 text-center">
        <h2 className="text-24 font-bold text-highlight">{eyebrow}</h2>
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
