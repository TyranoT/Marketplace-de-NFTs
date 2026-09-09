import { ArrowRight } from 'lucide-react'
import { HERO_SLIDE_COUNT } from '../constants/hero'
import { MOBILE_HERO } from '../constants/mobile'

export function MobileHeroBanner() {
  const { eyebrow, titleLines, body, cta, feature, thumbnail } = MOBILE_HERO

  return (
    <section className="relative aspect-366/190 overflow-hidden rounded-[22px] bg-surface-card md:hidden">
      <div
        aria-hidden="true"
        className="absolute -top-[16%] -left-[22%] size-[68%] rounded-full bg-line-soft"
      />
      <div
        aria-hidden="true"
        className="absolute -top-[5%] left-[20%] size-[68%] rounded-full bg-line-soft"
      />

      <div className="relative flex h-full gap-3 px-4 pt-2">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="text-10 leading-4 font-medium tracking-[1px] text-foreground">
            {eyebrow}
          </p>

          <h1 className="text-18 leading-6 font-bold text-foreground">
            {titleLines[0]}
            <br />
            {titleLines[1]}
          </h1>

          <p className="text-10 leading-4 text-text-secondary">{body}</p>

          <button
            type="button"
            className="flex items-center gap-2 text-10 leading-4 font-bold tracking-[1px] text-highlight"
          >
            {cta}
            <ArrowRight className="size-3.5" />
          </button>
        </div>

        <div className="relative w-[104px] shrink-0 self-start pt-1">
          <img
            src={feature.src}
            alt={feature.alt}
            loading="lazy"
            decoding="async"
            className="aspect-square w-full rounded-[10px] object-cover"
          />
          <img
            src={thumbnail.src}
            alt={thumbnail.alt}
            loading="lazy"
            decoding="async"
            className="absolute -bottom-2 -left-6 w-11 rounded-[6px] object-cover"
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-2"
      >
        {Array.from({ length: HERO_SLIDE_COUNT }, (_, index) => (
          <span key={index} className="size-1.5 rounded-full bg-primary" />
        ))}
      </div>
    </section>
  )
}
