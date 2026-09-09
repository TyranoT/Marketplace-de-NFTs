import { NFT_FACT_LABELS } from '../constants/nft-detail-copy'
import type { NftDetail } from '@/global/type'

type NftDetailFactsProps = {
  nft: NftDetail
}

export function NftDetailFacts({ nft }: NftDetailFactsProps) {
  /**
   * A ordem dos valores é intencional: o Figma exibe o texto de royalties
   * sob o rótulo "Contrato:" e o endereço do contrato sob "Direitos
   * autorais:". Os rótulos estão trocados no design e a tela mantém a
   * fidelidade — os dados seguem nomeados corretamente em `@/global/type`.
   */
  const facts = [
    { label: NFT_FACT_LABELS.network, value: nft.network },
    { label: NFT_FACT_LABELS.royalties, value: nft.royalties },
    { label: NFT_FACT_LABELS.contract, value: nft.contract },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        {nft.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-14 leading-6 text-text-secondary">
            {paragraph}
          </p>
        ))}
      </div>

      <dl className="flex flex-col gap-4">
        {facts.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1.5">
            <dt className="text-14 leading-4 font-bold text-foreground">
              {label}
            </dt>
            <dd className="text-14 leading-6 text-text-secondary">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
