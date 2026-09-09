import { ArrowRight } from 'lucide-react'
import type { JournalPost } from '../type'

type JournalCardProps = {
  post: JournalPost
}

export function JournalCard({ post }: JournalCardProps) {
  const { date, readTime, title, excerpt, cta, artwork } = post

  return (
    <article className="flex flex-col overflow-hidden rounded-[8px] bg-surface-card">
      <img
        src={artwork.src}
        alt={artwork.alt}
        loading="lazy"
        decoding="async"
        className="aspect-268/195 h-48.75 w-full object-cover"
      />

      <div className="flex flex-1 flex-col gap-2 px-4 pt-3 pb-4">
        <p className="text-12 leading-4 text-text-secondary">
          {date}
          <span aria-hidden="true">{'  |  '}</span>
          {readTime}
        </p>

        <h3 className="text-16 leading-5.5 font-bold text-foreground">
          {title}
        </h3>

        <p className="text-12 leading-4 text-text-secondary">{excerpt}</p>

        <a
          href="#"
          className="mt-auto flex items-center gap-1.5 text-12 leading-4 text-highlight"
        >
          {cta}
          <ArrowRight aria-hidden="true" className="size-3" />
        </a>
      </div>
    </article>
  )
}
