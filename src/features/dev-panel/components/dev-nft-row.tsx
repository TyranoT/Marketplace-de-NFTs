import { useEffect, useState } from 'react'
import { Button } from '@/global/components/ui/button'
import { Input } from '@/global/components/ui/input'
import { DEV_COPY } from '../constants/dev-copy'
import type { NftListItem } from '@/global/api/contracts/nft'

type DevNftRowProps = {
  nft: NftListItem
  isSaving: boolean
  onSave: (input: { price: string; units: number }) => void
}

export function DevNftRow({ nft, isSaving, onSave }: DevNftRowProps) {
  const [price, setPrice] = useState(nft.price.amount)
  const [units, setUnits] = useState(String(nft.available))

  /**
   * Um `nft.updated` de outra origem reescreve os campos — mas só quando o
   * valor do servidor de fato mudou, para não apagar o que está sendo
   * digitado a cada revalidação em segundo plano.
   */
  useEffect(() => {
    setPrice(nft.price.amount)
    setUnits(String(nft.available))
  }, [nft.price.amount, nft.available])

  const priceId = `dev-price-${nft.id}`
  const unitsId = `dev-units-${nft.id}`

  return (
    <tr className="border-b border-line/40">
      <td className="py-3 pr-4">
        <span className="text-14 font-bold text-foreground">{nft.name}</span>
        <span className="block text-12 text-text-secondary">
          {nft.collection} · {nft.editionId}
        </span>
      </td>

      <td className="py-3 pr-4">
        <label htmlFor={priceId} className="sr-only">
          {DEV_COPY.columnPrice} de {nft.name}
        </label>
        <Input
          id={priceId}
          inputMode="decimal"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          className="h-9 w-28"
        />
      </td>

      <td className="py-3 pr-4">
        <label htmlFor={unitsId} className="sr-only">
          {DEV_COPY.columnUnits} de {nft.name}
        </label>
        <Input
          id={unitsId}
          inputMode="numeric"
          value={units}
          onChange={(event) => setUnits(event.target.value)}
          className="h-9 w-20"
        />
      </td>

      <td className="py-3 pr-4 font-mono text-13 text-text-secondary">
        v{nft.version}
      </td>

      <td className="py-3">
        <Button
          type="button"
          disabled={isSaving}
          onClick={() => onSave({ price, units: Number(units) })}
          className="h-9 px-4 text-13"
        >
          {isSaving ? DEV_COPY.saving : DEV_COPY.save}
        </Button>
      </td>
    </tr>
  )
}
