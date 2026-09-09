import { createFileRoute, notFound } from '@tanstack/react-router'
import { Footer } from '@/features/layout'
import { NftDetailScreen, NftNotFound } from '@/features/marketplace'
import { getNftById, getRelatedNfts } from '@/global/data'

export const Route = createFileRoute('/nft/$nftId')({
  staticData: { header: { active: 'market', divider: true } },
  loader: ({ params }) => {
    const nft = getNftById(params.nftId)

    if (!nft) throw notFound()

    return { nft, related: getRelatedNfts(params.nftId) }
  },
  component: NftDetailRoute,
  notFoundComponent: NftNotFoundRoute,
})

function NftDetailRoute() {
  const { nft, related } = Route.useLoaderData()

  return (
    <div className="flex flex-col gap-24">
      <NftDetailScreen key={nft.id} nft={nft} related={related} />
      <Footer />
    </div>
  )
}

function NftNotFoundRoute() {
  return (
    <div className="flex flex-col gap-24">
      <NftNotFound />
      <Footer />
    </div>
  )
}
