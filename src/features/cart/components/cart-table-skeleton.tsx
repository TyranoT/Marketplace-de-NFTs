import { Skeleton } from '@/global/components/ui/skeleton'
import { CART_COPY } from '../constants/cart-copy'
import {
  CART_COLUMN_WIDTHS,
  CART_SKELETON_ROWS,
} from '../constants/cart-layout'

type CartTableSkeletonProps = {
  rows?: number
}

/**
 * O cabeçalho é texto fixo, então aparece de verdade já no primeiro quadro —
 * só os itens viram placeholders, na altura exata das linhas reais, para o
 * conteúdo não saltar quando os dados chegarem.
 *
 * Duas alturas porque são dois layouts: 70px na tabela de `lg`, e a altura do
 * card empilhado abaixo dela.
 */
export function CartTableSkeleton({
  rows = CART_SKELETON_ROWS,
}: CartTableSkeletonProps) {
  return (
    <div aria-hidden="true" className="flex flex-col">
      <table className="hidden w-full table-fixed lg:table">
        <colgroup>
          {/** Índice como chave: as larguras se repetem e a ordem é fixa. */}
          {CART_COLUMN_WIDTHS.map((width, index) => (
            <col key={index} style={{ width }} />
          ))}
        </colgroup>

        <thead>
          <tr className="[&>th]:border-b [&>th]:border-primary/60 [&>th]:pb-2.5 [&>th]:text-left [&>th]:text-17 [&>th]:leading-4 [&>th]:font-normal [&>th]:text-foreground">
            <th scope="col" colSpan={2}>
              {CART_COPY.columnNfts}
            </th>
            <th scope="col">{CART_COPY.columnPrice}</th>
            <th scope="col">{CART_COPY.columnEditions}</th>
            <th scope="col">{CART_COPY.columnTotal}</th>
            <th scope="col">
              <span className="sr-only">{CART_COPY.columnActions}</span>
            </th>
          </tr>
        </thead>
      </table>

      <div className="mt-3 flex flex-col gap-3">
        {Array.from({ length: rows }, (_, index) => (
          <Skeleton
            key={index}
            className="h-33.5 w-full rounded-md lg:h-17.5"
          />
        ))}
      </div>
    </div>
  )
}
