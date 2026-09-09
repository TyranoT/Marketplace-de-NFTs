import { Link } from '@tanstack/react-router'
import { NftCard } from './nft-card'
import type { NftSummary } from '@/global/type'

type NftCardLinkProps = {
  nft: NftSummary
}

export function NftCardLink({ nft }: NftCardLinkProps) {
  return (
    <Link
      to="/nft/$nftId"
      params={{ nftId: nft.id }}
      className="block rounded-lg outline-offset-4"
    >
      <NftCard
        name={nft.name}
        price={nft.price}
        secondaryPrice={nft.secondaryPrice}
        imageUrl={nft.imageUrl}
        imageAlt={nft.imageAlt}
      />
    </Link>
  )
}
