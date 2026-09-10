import { Label } from '@/global/components/ui/label'
import { cn } from '@/global/helpers/cn'

type CheckoutFieldProps = {
  id: string
  label: string
  required?: boolean
  error?: string
  className?: string
  children: React.ReactNode
}

/**
 * Rótulo, controle e mensagem de erro amarrados por `aria-describedby`. Sem
 * este componente a mesma ligação se repetiria em doze campos, e é exatamente
 * o tipo de amarração que se esquece num deles.
 */
export function CheckoutField({
  id,
  label,
  required,
  error,
  className,
  children,
}: CheckoutFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={id} className="gap-0 text-15 leading-4 text-foreground">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-destructive">
            *
          </span>
        ) : null}
      </Label>

      {children}

      {error ? (
        <p
          id={errorId(id)}
          role="alert"
          className="text-12 leading-4 text-destructive"
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function errorId(fieldId: string) {
  return `${fieldId}-error`
}

/** Props que todo controle do formulário repete para se ligar ao rótulo. */
export function fieldProps(id: string, error?: string) {
  return {
    id,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? errorId(id) : undefined,
  }
}
