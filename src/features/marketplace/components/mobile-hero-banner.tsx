import { useId } from 'react'
import { ArrowRight } from 'lucide-react'
import { HERO_SLIDE_COUNT } from '../constants/hero'
import { MOBILE_HERO, MOBILE_HERO_ORBS } from '../constants/mobile'

/**
 * Banner do hero mobile, em proporção fixa 366x190 como no Figma.
 *
 * A altura vem do `aspect-ratio`, então nenhuma medida interna pode ser fixa:
 * num card mais estreito que os 366px do frame, o texto ganharia uma linha e
 * estouraria a altura travada. Todo tamanho aqui é múltiplo de `--u`, o pixel
 * de design — `100cqw / 366`, ou seja 1px quando o card mede 366 e menos que
 * isso proporcionalmente. Assim a coluna de texto guarda sempre as mesmas
 * ~26 letras por linha e a composição só muda de escala, nunca de arranjo.
 *
 * `--u` mora no filho, não na `<section>`: um container não consulta a si
 * mesmo, e é a `<section>` que declara `@container`.
 */
export function MobileHeroBanner() {
  const { eyebrow, titleLines, body, cta, feature, thumbnail } = MOBILE_HERO
  const orbFillId = useId()

  return (
    <section className="@container relative aspect-366/190 md:hidden">
      <div className="absolute inset-0 overflow-hidden rounded-[calc(var(--u)*28)] bg-linear-to-r from-[#3c2818] to-[#291b11] [--u:calc(100cqw/366)]">
        <svg
          aria-hidden="true"
          viewBox="0 0 366 190"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
        >
          <defs>
            <linearGradient
              id={orbFillId}
              x1="0"
              y1="0"
              x2="0"
              y2="190"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="var(--brand)" stopOpacity="0.45" />
              <stop offset="1" stopColor="var(--brand)" stopOpacity="0.11" />
            </linearGradient>
          </defs>

          {MOBILE_HERO_ORBS.map(({ cx, cy, rx, ry }) => (
            <ellipse
              key={cx}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill={`url(#${orbFillId})`}
            />
          ))}
        </svg>

        <div className="relative flex h-full gap-[calc(var(--u)*8)] px-[calc(var(--u)*16)] pt-[calc(var(--u)*6)]">
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="text-[calc(var(--u)*12)] leading-[calc(var(--u)*16)] font-medium text-foreground">
              {eyebrow}
            </p>

            <h1 className="mt-[calc(var(--u)*4.5)] text-[calc(var(--u)*18)] leading-[calc(var(--u)*29)] font-bold text-foreground">
              {titleLines[0]}
              <br />
              {titleLines[1]}
            </h1>

            <p className="mt-[calc(var(--u)*7)] text-[calc(var(--u)*12)] leading-[calc(var(--u)*18)] text-text-secondary">
              {body}
            </p>

            <button
              type="button"
              className="flex items-center gap-[calc(var(--u)*10)] text-[calc(var(--u)*12)] leading-[calc(var(--u)*16)] font-bold text-highlight"
            >
              {cta}
              <ArrowRight className="size-[calc(var(--u)*16)]" />
            </button>
          </div>

          <div className="relative w-[calc(var(--u)*138)] shrink-0 self-start pt-[calc(var(--u)*4)]">
            <img
              src={feature.src}
              alt={feature.alt}
              loading="lazy"
              decoding="async"
              className="aspect-square w-full rounded-[calc(var(--u)*15)] object-cover"
            />
            <img
              src={thumbnail.src}
              alt={thumbnail.alt}
              loading="lazy"
              decoding="async"
              className="absolute bottom-[calc(-8*var(--u))] left-[calc(var(--u)*14)] size-[calc(var(--u)*57)] rounded-[calc(var(--u)*15)] object-cover"
            />
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute bottom-[calc(var(--u)*6)] left-1/2 flex -translate-x-1/2 gap-[calc(var(--u)*6)]"
        >
          {Array.from({ length: HERO_SLIDE_COUNT }, (_, index) => (
            <span
              key={index}
              className="size-[calc(var(--u)*7)] rounded-full bg-primary"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
