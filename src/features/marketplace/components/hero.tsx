import { Button } from '@/global/components/ui/button'
import { HERO_ARTWORK, HERO_CONTENT, HERO_SLIDE_COUNT } from '../constants/hero'

export function Hero() {
  const { eyebrow, titleLines, body, cta } = HERO_CONTENT

  return (
    <section className="relative hidden h-112.5 items-center pl-10 md:flex">
      <div className="flex w-full items-center justify-between gap-10">
        <div className="flex flex-col items-end gap-11 lg:w-150">
          <div className="flex w-full flex-col items-start gap-8">
            <div className="flex w-full flex-col gap-1">
              <div className="flex w-full flex-col gap-2 text-foreground">
                <p className="text-14 leading-4 font-medium tracking-[1.4px]">
                  {eyebrow}
                </p>
                <h1 className="text-43 leading-17.5 font-bold">
                  {titleLines[0]}
                  <br />
                  {titleLines[1]}
                </h1>
              </div>
              <p className="text-14 leading-6 text-text-secondary lg:max-w-139.25">
                {body}
              </p>
            </div>

            <Button className="w-35 text-16 font-bold text-background">
              {cta}
            </Button>
          </div>

          <div aria-hidden="true" className="flex gap-2">
            {Array.from({ length: HERO_SLIDE_COUNT }, (_, index) => (
              <span key={index} className="size-2 rounded-full bg-primary" />
            ))}
          </div>
        </div>

        <div className="relative hidden size-112.5 shrink-0 lg:block">
          <img
            src={HERO_ARTWORK.feature}
            alt={HERO_ARTWORK.featureAlt}
            width={450}
            height={450}
            fetchPriority="high"
            className="size-full rounded-3xl object-cover"
          />
          <img
            src={HERO_ARTWORK.thumbnail}
            alt={HERO_ARTWORK.thumbnailAlt}
            width={120}
            height={120}
            loading="lazy"
            className="absolute top-70 left-10 size-30 rounded-[8px] object-cover"
          />
        </div>
      </div>
    </section>
  )
}
