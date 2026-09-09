import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
} from '@/global/components/ui/pagination'

type CatalogPaginationProps = {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

export function CatalogPagination({
  page,
  pageCount,
  onPageChange,
}: CatalogPaginationProps) {
  const hasNextPage = page < pageCount

  return (
    <Pagination className="mx-0 w-auto justify-center md:justify-end">
      <PaginationContent>
        {Array.from({ length: pageCount }, (_, index) => index + 1).map(
          (pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href="#"
                isActive={pageNumber === page}
                onClick={(event) => {
                  event.preventDefault()
                  onPageChange(pageNumber)
                }}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={!hasNextPage}
            onClick={(event) => {
              event.preventDefault()
              if (hasNextPage) onPageChange(page + 1)
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
