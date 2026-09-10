import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/global/components/ui/select'
import { cn } from '@/global/helpers/cn'
import { fieldProps } from './checkout-field'
import type { CheckoutOption } from '@/global/data'

type CheckoutSelectProps = {
  id: string
  value: string
  options: Array<CheckoutOption>
  placeholder: string
  error?: string
  className?: string
  onValueChange: (value: string) => void
}

/**
 * O `Select` do projeto nasceu com a altura de 32 do shadcn; no frame de
 * pagamento os controles têm 40, como os inputs ao lado.
 */
export function CheckoutSelect({
  id,
  value,
  options,
  placeholder,
  error,
  className,
  onValueChange,
}: CheckoutSelectProps) {
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
