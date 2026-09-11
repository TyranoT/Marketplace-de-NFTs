import { X } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/global/components/ui/dialog'
import { buttonVariants } from '@/global/components/ui/button'
import { cn } from '@/global/helpers/cn'

type CatalogFiltersDialogProps = {
  id: string
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

/**
 * Os filtros no mobile.
 *
 * O botão "Abrir filtros" existia sem abrir nada, e abaixo de `lg` não havia
 * como filtrar: a lateral é `hidden lg:flex`. O conteúdo é o mesmo
 * `CatalogFilters` da lateral — muda só o recipiente. O Dialog do Base UI
 * prende o foco, fecha com Esc e devolve o foco ao botão que o abriu.
 *
 * Os filtros aplicam na hora, como na lateral; "Ver resultados" só fecha, e
 * a grade atrás já está atualizada.
 */
export function CatalogFiltersDialog({
  id,
  open,
  onOpenChange,
  children,
}: CatalogFiltersDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent id={id} className="max-w-md rounded-lg">
        <div className="flex items-center justify-between px-5 pt-5">
          <DialogTitle className="text-18 leading-5 text-foreground">
            Filtros
          </DialogTitle>

          <DialogClose
            aria-label="Fechar filtros"
            className="relative text-brand after:absolute after:-inset-2 hover:text-highlight"
          >
            <X className="size-5" />
          </DialogClose>
        </div>

        {children}

        <div className="px-5 pb-5">
          <DialogClose className={cn(buttonVariants(), 'w-full text-ink')}>
            Ver resultados
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
