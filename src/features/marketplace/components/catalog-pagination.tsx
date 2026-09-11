import { Link } from '@tanstack/react-router'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/global/components/ui/pagination'

type CatalogPaginationProps = {
  page: number
  pageCount: number
}

/**
 * Cada página é um link para a própria URL, com o resto da busca mantido.
 * Abrir em outra aba, copiar o endereço e o botão voltar funcionam porque a
 * página já é estado da URL — o `href="#"` de antes descartava tudo isso.
 *
 * `resetScroll={false}`: sem ele o router rolaria até o topo da home, e
 * quem trocou de página no fim da grade voltaria ao hero. O foco vai para o
 * título da grade, e isso é feito pela tela, que é quem conhece o título.
 */
export function CatalogPagination({ page, pageCount }: CatalogPaginationProps) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  function linkTo(target: number) {
    return (
      <Link
        to="/"
        search={(prev) => ({ ...prev, page: target })}
        resetScroll={false}
      />
    )
  }

  return (
    <Pagination className="mx-0 w-auto justify-center md:justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious render={linkTo(page - 1)} disabled={page <= 1} />
        </PaginationItem>

        {pages.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              render={linkTo(pageNumber)}
              isActive={pageNumber === page}
              aria-label={`Página ${pageNumber}`}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            render={linkTo(page + 1)}
            disabled={page >= pageCount}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
