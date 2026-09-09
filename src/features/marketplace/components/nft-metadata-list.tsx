import type { NftFact } from '@/global/type'

type NftMetadataListProps = {
  metadata: Array<NftFact>
}

export function NftMetadataList({ metadata }: NftMetadataListProps) {
  return (
    <dl className="flex flex-col gap-3.5 text-15 leading-4 text-text-secondary">
      {metadata.map(({ label, value }) => (
        <div key={label} className="flex gap-1.5">
          <dt>{label}:</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  )
}
