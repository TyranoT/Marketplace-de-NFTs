import { Button } from '@/global/components/ui/button'
import { Slider } from '@/global/components/ui/slider'
import { PRICE_BOUNDS, PRICE_STEP } from '../constants/filters'
import { formatEth } from '../helpers/format-eth'
import type { PriceRange } from '../type'

type PriceRangeFilterProps = {
  range: PriceRange
  onRangeChange: (range: PriceRange) => void
  onApply: () => void
}

export function PriceRangeFilter({
  range,
  onRangeChange,
  onApply,
}: PriceRangeFilterProps) {
  const [minPrice, maxPrice] = range

  return (
    <div className="flex w-full flex-col gap-3 pl-3">
      <Slider
        aria-labelledby="price-range-value"
        min={PRICE_BOUNDS[0]}
        max={PRICE_BOUNDS[1]}
        step={PRICE_STEP}
        value={range}
        onValueChange={(value) => onRangeChange(value as PriceRange)}
      />

      <p id="price-range-value" className="text-15 text-foreground">
        Preço: {formatEth(minPrice)} - {formatEth(maxPrice)} ETH
      </p>

      <Button
        type="button"
        onClick={onApply}
        className="h-9 w-fit px-3 text-16 font-bold"
      >
        Aplicar
      </Button>
    </div>
  )
}
