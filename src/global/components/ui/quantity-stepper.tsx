import { useId } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { cn } from '@/global/helpers/cn'
import type { VariantProps } from 'class-variance-authority'

const stepperButton = cva(
  /**
   * `aria-disabled`, e não `disabled`: um botão `disabled` que está com o
   * foco joga o foco no `<body>`, e quem usa teclado perdia a posição a cada
   * clique — o botão trava durante a mutation e de novo ao chegar no limite.
   * O `after` amplia a área de toque além do desenho de 18px da cápsula.
   */
  'relative flex shrink-0 items-center justify-center transition-opacity after:absolute after:-inset-1.5 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
  {
    variants: {
      tone: {
        /** Padrão do projeto: círculo da marca com o glifo escuro. */
        solid: 'bg-primary text-ink',
        /**
         * Carrinho no mobile: círculo escuro com o glifo claro, como o frame.
         * O botão travado apaga pelo `aria-disabled:opacity-50` da base, que é
         * o que produz o tom apagado do desenho sobre este fundo.
         */
        outline: 'bg-[#2f1d15] text-foreground',
      },
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
    defaultVariants: { shape: 'circle', size: 'md', tone: 'solid' },
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
  /**
   * Por que o "+" travou no limite. Sem isto o botão apagava sem explicação
   * — a pessoa via o limite, mas não o motivo.
   */
  limitHint?: string
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
  tone,
  decreaseLabel,
  increaseLabel,
  valueLabel,
  limitHint,
  className,
  onIncrease,
  onDecrease,
}: QuantityStepperProps) {
  const buttonClass = stepperButton({ shape, size, tone })
  const iconClass = shape === 'pill' ? 'size-3' : 'size-3.5 md:size-4'
  const hintId = useId()

  const isAtLimit = max !== undefined && value >= max
  const cannotDecrease = disabled || value <= min
  const cannotIncrease = disabled || isAtLimit

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <button
        type="button"
        aria-label={decreaseLabel}
        aria-disabled={cannotDecrease || undefined}
        onClick={() => {
          if (!cannotDecrease) onDecrease()
        }}
        className={buttonClass}
      >
        <Minus className={iconClass} />
      </button>

      {/** O rótulo inclui o valor: `aria-label` substitui o conteúdo. */}
      <output
        aria-label={`${valueLabel}: ${value}`}
        className="min-w-4 text-center text-16 leading-4 text-foreground"
      >
        {value}
      </output>

      <button
        type="button"
        aria-label={increaseLabel}
        aria-disabled={cannotIncrease || undefined}
        aria-describedby={isAtLimit && limitHint ? hintId : undefined}
        onClick={() => {
          if (!cannotIncrease) onIncrease()
        }}
        className={buttonClass}
      >
        <Plus className={iconClass} />
      </button>

      {limitHint ? (
        <span id={hintId} className="sr-only">
          {limitHint}
        </span>
      ) : null}
    </div>
  )
}
