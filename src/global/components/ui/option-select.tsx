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
  className?: string
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
  className,
  onValueChange,
}: OptionSelectProps) {
  return (
    <Select
      value={value || null}
      onValueChange={(next) => onValueChange(String(next ?? ''))}
    >
      <SelectTrigger
        {...fieldProps(id, error)}
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
