import { Slider as SliderPrimitive } from '@base-ui/react/slider'
import { cn } from '@/global/helpers/cn'

type SliderProps = SliderPrimitive.Root.Props & {
  /**
   * Nome de cada cursor. Sem isto os dois herdavam o mesmo rótulo do grupo e
   * quem usa leitor de tela não sabia qual era o mínimo e qual o máximo.
   */
  getAriaLabel?: (index: number) => string
  /**
   * Valor falado. Sem isto o Base UI anuncia "0.02 start range", em inglês e
   * sem unidade.
   */
  getAriaValueText?: (
    formattedValue: string,
    value: number,
    index: number,
  ) => string
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  getAriaLabel,
  getAriaValueText,
  ...props
}: SliderProps) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max]

  return (
    <SliderPrimitive.Root
      className={cn('data-horizontal:w-full data-vertical:h-full', className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-primary select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            index={index}
            getAriaLabel={getAriaLabel}
            getAriaValueText={getAriaValueText}
            /**
             * O anel `ring-ink` é a borda escura do desenho, da mesma cor do
             * fundo — servia de foco e por isso o foco era invisível. O foco
             * agora é um contorno da marca, fora da borda.
             */
            className="relative block size-3.75 shrink-0 rounded-full bg-primary ring-3 ring-ink transition-[color,box-shadow] select-none after:absolute after:-inset-2 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
