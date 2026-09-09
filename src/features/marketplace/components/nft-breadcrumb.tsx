import { Link } from '@tanstack/react-router'
import { NFT_DETAIL_COPY } from '../constants/nft-detail-copy'

export function NftBreadcrumb() {
  return (
    <nav aria-label="Trilha de navegação">
      <ol className="flex items-center gap-2 text-14 leading-4 font-bold text-foreground">
        <li>
          <Link to="/">{NFT_DETAIL_COPY.breadcrumbHome}</Link>
        </li>
        <li aria-hidden="true" className="text-text-secondary">
          /
        </li>
        <li aria-current="page">{NFT_DETAIL_COPY.breadcrumbMarket}</li>
      </ol>
    </nav>
  )
}
