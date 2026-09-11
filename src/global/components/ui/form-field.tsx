import { Label } from './label'
import { cn } from '@/global/helpers/cn'

type FormFieldProps = {
  id: string
  label: string
  required?: boolean
  /** Dica permanente, como formato esperado. Não some ao digitar, como o placeholder. */
  hint?: string
  error?: string
  className?: string
  children: React.ReactNode
}

/**
 * Rótulo, controle, dica e mensagem de erro amarrados por `aria-describedby`.
 * Sem este componente a mesma ligação se repetiria em cada campo de cada
 * formulário, e é exatamente o tipo de amarração que se esquece num deles.
 */
export function FormField({
  id,
  label,
  required,
  hint,
  error,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={id} className="gap-0 text-15 leading-4 text-foreground">
        {label}
        {/**
         * O asterisco é só visual: o obrigatório chega ao leitor de tela pelo
         * `aria-required` que `fieldProps` coloca no controle.
         */}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-destructive">
            *
          </span>
        ) : null}
      </Label>

      {children}

      {hint ? (
        <p id={hintId(id)} className="text-12 leading-4 text-text-secondary">
          {hint}
        </p>
      ) : null}

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

export function hintId(fieldId: string) {
  return `${fieldId}-hint`
}

type FieldOptions = {
  required?: boolean
  /** Precisa casar com o `hint` passado ao `FormField`. */
  hasHint?: boolean
}

/** Props que todo controle repete para se ligar ao rótulo, à dica e ao erro. */
export function fieldProps(
  id: string,
  error?: string,
  { required, hasHint }: FieldOptions = {},
) {
  const describedBy = [hasHint ? hintId(id) : null, error ? errorId(id) : null]
    .filter(Boolean)
    .join(' ')

  return {
    id,
    'aria-invalid': Boolean(error),
    'aria-describedby': describedBy || undefined,
    'aria-required': required || undefined,
  }
}
