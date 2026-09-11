import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select'
import { fieldProps } from './form-field'
import { cn } from '@/global/helpers/cn'
import type { CheckoutOption } from '@/global/data'

type OptionSelectProps = {
  id: string
  value: string
  options: Array<CheckoutOption>
  placeholder: string
  error?: string
  required?: boolean
  /**
   * Id da mensagem de erro, quando ela é de outro campo. No ENS o erro
   * aparece sob o grupo "sufixo + nome", com o id do nome — e o
   * `aria-describedby` do sufixo apontava para um id que não existia.
   */
  errorMessageId?: string
  /** Para quando não há `<label>` visível — o sufixo ENS ao lado do nome. */
  ariaLabel?: string
  className?: string
  /**
   * Repassados do `Controller` do react-hook-form. Sem o `ref` o foco no
   * primeiro campo inválido pula este select; sem o `onBlur` o campo nunca
   * é marcado como tocado.
   */
  ref?: React.Ref<HTMLButtonElement>
  onBlur?: () => void
  onValueChange: (value: string) => void
}

/**
 * O `Select` do projeto nasceu com a altura de 32 do shadcn; nos frames de
 * formulário os controles têm 40, como os inputs ao lado.
 */
export function OptionSelect({
  id,
  value,
  options,
  placeholder,
  error,
  required,
  errorMessageId,
  ariaLabel,
  className,
  ref,
  onBlur,
  onValueChange,
}: OptionSelectProps) {
  return (
    <Select
      value={value || null}
      required={required}
      onValueChange={(next) => onValueChange(String(next ?? ''))}
    >
      <SelectTrigger
        ref={ref}
        onBlur={onBlur}
        aria-label={ariaLabel}
        {...fieldProps(id, error, { required })}
        {...(error && errorMessageId
          ? { 'aria-describedby': errorMessageId }
          : {})}
        className={cn(
          'h-10 w-full rounded-sm border-input px-4 text-14 leading-4 text-text-primary data-placeholder:text-text-secondary',
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
