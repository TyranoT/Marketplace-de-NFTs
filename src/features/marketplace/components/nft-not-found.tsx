import { Link } from '@tanstack/react-router'
import { Container } from '@/global/components/ui/container'
import { Button } from '@/global/components/ui/button'
import { NFT_DETAIL_COPY } from '../constants/nft-detail-copy'

export function NftNotFound() {
  return (
    <Container
      as="main"
      className="flex flex-col items-center gap-6 py-32 text-center"
    >
      <h1 className="text-28 leading-9 font-bold text-foreground">
        {NFT_DETAIL_COPY.notFoundTitle}
      </h1>
      <p className="max-w-150 text-14 leading-6 text-text-secondary">
        {NFT_DETAIL_COPY.notFoundBody}
      </p>
      <Button render={<Link to="/" />} className="w-fit px-8">
        {NFT_DETAIL_COPY.notFoundCta}
      </Button>
    </Container>
  )
}
