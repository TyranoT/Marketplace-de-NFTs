import { useId } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/global/components/ui/button'
import { cn } from '@/global/helpers/cn'
import type { PromoCardContent } from '../type'

type PromoCardProps = {
  promo: PromoCardContent
}

export function PromoCard({ promo }: PromoCardProps) {
  const { titleLines, body, cta, artwork } = promo
  const titleId = useId()

  return (
    <article className="relative h-62.5 overflow-hidden rounded-[8px] bg-surface-card">
      <img
        src={artwork.src}
        /** Decorativa: descrevia o macaco, não o que o card oferece. */
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-y-0 left-0 rounded-r-[18px] h-full w-71.75 object-cover"
      />

      <div className="absolute top-9.25 right-7.5 flex w-65.75 flex-col items-end gap-2 text-right">
        <h3
          id={titleId}
          className="text-18 leading-6 font-bold text-foreground"
        >
          {titleLines[0]}
          <br />
          {titleLines[1]}
        </h3>

        <p className="text-14 leading-6 text-text-secondary">{body}</p>

        {/**
         * Os dois cards dizem "Explorar": o título entra na descrição para o
         * leitor de tela distinguir um do outro.
         */}
        <Link
          to="/"
          hash="catalogo"
          aria-describedby={titleId}
          className={cn(buttonVariants(), 'mt-4 w-35 text-background')}
        >
          {cta}
          <ArrowRight />
        </Link>
      </div>
    </article>
  )
}
