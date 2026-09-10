import { Button } from '@/global/components/ui/button'
import { CATALOG_ERROR_COPY } from '../constants/catalog'

type CatalogErrorProps = {
  onRetry: () => void
}

/**
 * Falha ao carregar o catálogo, com caminho de volta.
 *
 * `networkMode: 'always'` faz a consulta **errar** em vez de ficar pausada
 * quando não há rede, e é justamente para que exista algo a dizer e algo a
 * tentar — este componente é a outra metade daquela decisão.
 */
export function CatalogError({ onRetry }: CatalogErrorProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-5 py-20 text-center"
    >
      <p className="text-17 font-bold text-foreground">
        {CATALOG_ERROR_COPY.title}
      </p>
      <p className="max-w-125 text-14 leading-6 text-text-secondary">
        {CATALOG_ERROR_COPY.body}
      </p>
      <Button onClick={onRetry} className="w-fit px-8">
        {CATALOG_ERROR_COPY.retry}
      </Button>
    </div>
  )
}
