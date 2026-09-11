import { useId, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import type { JournalPost } from '../type'

type JournalCardProps = {
  post: JournalPost
}

const NOT_IN_DEMO = 'O conteúdo editorial não faz parte desta demonstração.'

/**
 * Card do journal.
 *
 * "Ler mais" era um `href="#"` — quatro links idênticos que não levavam a
 * lugar nenhum. Páginas editoriais estão fora do escopo do desafio, e ações
 * fora do escopo não podem aparentar sucesso; então o controle é um botão
 * que diz isso em texto, como os botões sociais do login.
 */
export function JournalCard({ post }: JournalCardProps) {
  const { date, readTime, title, excerpt, cta } = post
  const titleId = useId()
  const [status, setStatus] = useState('')

  return (
    <article
      aria-labelledby={titleId}
      className="flex flex-col overflow-hidden rounded-[8px] bg-surface-card"
    >
      {/** Decorativa: a arte é do catálogo, não ilustra o texto do post. */}
      <img
        src={post.artwork.src}
        alt=""
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

        <h3
          id={titleId}
          className="text-16 leading-5.5 font-bold text-foreground"
        >
          {title}
        </h3>

        <p className="text-12 leading-4 text-text-secondary">{excerpt}</p>

        <button
          type="button"
          aria-describedby={titleId}
          onClick={() => setStatus(NOT_IN_DEMO)}
          className="mt-auto flex w-fit items-center gap-1.5 text-12 leading-4 text-highlight"
        >
          {cta}
          <ArrowRight aria-hidden="true" className="size-3" />
        </button>

        <p
          role="status"
          className="text-12 leading-4 text-text-secondary empty:hidden"
        >
          {status}
        </p>
      </div>
    </article>
  )
}
