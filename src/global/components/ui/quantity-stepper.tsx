import { Minus, Plus } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { cn } from '@/global/helpers/cn'
import type { VariantProps } from 'class-variance-authority'

const stepperButton = cva(
  'flex shrink-0 items-center justify-center bg-primary text-ink transition-opacity disabled:opacity-50',
  {
    variants: {
      shape: {
        /** Detalhe do NFT: botão redondo. */
        circle: 'rounded-full',
        /** Carrinho: cápsula vertical de 18x28, medida no frame do Figma. */
        pill: 'rounded-full',
      },
      size: {
        sm: 'size-6 md:size-7',
        md: 'size-7 md:size-8',
      },
    },
    compoundVariants: [
      { shape: 'circle', size: 'sm', class: 'size-7' },
      { shape: 'circle', size: 'md', class: 'size-7 md:size-8' },
      { shape: 'pill', size: 'sm', class: 'h-7 w-4.5' },
      { shape: 'pill', size: 'md', class: 'h-7 w-4.5' },
    ],
    defaultVariants: { shape: 'circle', size: 'md' },
  },
)

type QuantityStepperProps = VariantProps<typeof stepperButton> & {
  value: number
  min?: number
  /** Disponibilidade da edição. Trava o botão de aumentar no limite. */
  max?: number
  disabled?: boolean
  /**
   * Rótulos obrigatórios: a mesma tela pode ter vários steppers, e três
   * botões anunciados como "Aumentar quantidade" deixam quem usa leitor de
   * tela sem saber qual item está alterando.
   */
  decreaseLabel: string
  increaseLabel: string
  valueLabel: string
  className?: string
  onIncrease: () => void
  onDecrease: () => void
}

export function QuantityStepper({
  value,
  min = 1,
  max,
  disabled = false,
  shape,
  size,
  decreaseLabel,
  increaseLabel,
  valueLabel,
  className,
  onIncrease,
  onDecrease,
}: QuantityStepperProps) {
  const buttonClass = stepperButton({ shape, size })
  const iconClass = shape === 'pill' ? 'size-3' : 'size-3.5 md:size-4'

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <button
        type="button"
        aria-label={decreaseLabel}
        onClick={onDecrease}
        disabled={disabled || value <= min}
        className={buttonClass}
      >
        <Minus className={iconClass} />
      </button>

      <output
        aria-label={valueLabel}
        className="min-w-4 text-center text-16 leading-4 text-foreground"
      >
        {value}
      </output>

      <button
        type="button"
        aria-label={increaseLabel}
        onClick={onIncrease}
        disabled={disabled || (max !== undefined && value >= max)}
        className={buttonClass}
      >
        <Plus className={iconClass} />
      </button>
    </div>
  )
}
