import { Checkbox } from '@base-ui/react/checkbox'
import { cn } from '@/global/helpers/cn'

type CheckoutToggleProps = {
  id: string
  label: string
  checked: boolean
  className?: string
  onCheckedChange: (checked: boolean) => void
}

/**
 * O frame desenha um círculo, mas a pergunta é de sim ou não: um rádio de
 * opção única nunca desmarca, e deixaria o colecionador preso na escolha. A
 * semântica é de checkbox — só a pintura é redonda.
 */
export function CheckoutToggle({
  id,
  label,
  checked,
  className,
  onCheckedChange,
}: CheckoutToggleProps) {
  return (
    <div className={cn('flex items-center', className)}>
      <label
        htmlFor={id}
        className="flex w-fit cursor-pointer items-center gap-3 text-15 leading-4 text-foreground"
      >
        <Checkbox.Root
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="flex size-4 shrink-0 items-center justify-center rounded-full border border-primary bg-transparent transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Checkbox.Indicator className="size-2 rounded-full bg-primary data-unchecked:hidden" />
        </Checkbox.Root>

        {label}
      </label>
    </div>
  )
}
