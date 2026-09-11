import { useId } from 'react'
import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'
import { NFT_DETAIL_COPY } from '../constants/nft-detail-copy'
import type { NftEdition, NftEditionId } from '@/global/type'

type NftEditionPickerProps = {
  editions: Array<NftEdition>
  value: NftEditionId
  onChange: (edition: NftEditionId) => void
}

/**
 * Grupo de rádio do Base UI, com a aparência de pílula do frame.
 *
 * Antes eram `<button role="radio">`: o papel prometia o padrão de rádio,
 * mas cada opção era uma parada de Tab e as setas não andavam. O Base UI traz
 * o tabindex móvel e as setas. O `useId` resolve outro problema: o detalhe
 * renderiza este seletor duas vezes (mobile e desktop), e o id fixo de antes
 * ficava duplicado na página.
 */
export function NftEditionPicker({
  editions,
  value,
  onChange,
}: NftEditionPickerProps) {
  const labelId = useId()

  return (
    <div className="flex flex-col gap-1.5 md:gap-2.5">
      <p id={labelId} className="text-15 leading-4 font-bold text-foreground">
        {NFT_DETAIL_COPY.editionLabel}
      </p>

      <RadioGroupPrimitive
        aria-labelledby={labelId}
        value={value}
        onValueChange={onChange}
        className="flex flex-wrap gap-3 md:gap-1.5"
      >
        {editions.map(({ id, label }) => (
          <RadioPrimitive.Root
            key={id}
            value={id}
            className="flex h-7 cursor-pointer items-center rounded-full border border-line-soft px-1.5 text-14 leading-4 text-text-secondary md:h-6.5 data-checked:border-highlight data-checked:text-highlight"
          >
            {label}
          </RadioPrimitive.Root>
        ))}
      </RadioGroupPrimitive>
    </div>
  )
}
