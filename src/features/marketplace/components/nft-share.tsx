import { useId } from 'react'
import { NFT_DETAIL_COPY } from '../constants/nft-detail-copy'
import { NFT_SHARE_TARGETS } from '../constants/nft-share'

type NftShareProps = {
  nftName: string
}

/**
 * Compartilhar de verdade. Eram botões sem ação — parecia funcionar e não
 * fazia nada. Os destinos são as URLs públicas de cada rede, que não exigem
 * integração: só a URL da página e o nome da obra.
 */
export function NftShare({ nftName }: NftShareProps) {
  const labelId = useId()
  const pageUrl = typeof window === 'undefined' ? '' : window.location.href

  return (
    <div className="flex items-center gap-3">
      <p id={labelId} className="text-15 leading-4 font-bold text-foreground">
        {NFT_DETAIL_COPY.shareLabel}
      </p>

      <ul aria-labelledby={labelId} className="flex items-center gap-2">
        {NFT_SHARE_TARGETS.map(({ label, Icon, buildHref }) => (
          <li key={label}>
            <a
              href={buildHref(pageUrl, nftName)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label} (abre em nova aba)`}
              className="flex items-center text-foreground"
            >
              <Icon className="size-5" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
