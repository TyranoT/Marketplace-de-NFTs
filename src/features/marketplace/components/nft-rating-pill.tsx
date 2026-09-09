import { Star } from 'lucide-react'
import { formatRatingLabel } from '../helpers/format-rating-label'
import type { NftRating } from '@/global/type'

type NftRatingPillProps = {
  rating: NftRating
}

/**
 * Selo compacto de avaliação do mobile.
 *
 * No desktop o mesmo dado aparece como cinco estrelas mais a contagem escrita
 * (`NftRating`); aqui o frame mostra uma estrela e a nota entre parênteses.
 * O texto visível é curto demais para leitor de tela, então a frase completa
 * vai num rótulo só para leitura assistiva.
 */
export function NftRatingPill({ rating }: NftRatingPillProps) {
  return (
    <p className="flex h-7 shrink-0 items-center gap-1 rounded-full border border-primary/45 px-1.5 text-12 leading-4 text-foreground">
      <Star aria-hidden="true" className="size-3.5 fill-brand text-brand" />
      <span aria-hidden="true" className="flex items-center gap-1">
        {rating.score}
        <span className="text-text-secondary">({rating.count})</span>
      </span>
      <span className="sr-only">
        Nota {rating.score} de 5, {formatRatingLabel(rating.count)}
      </span>
    </p>
  )
}
