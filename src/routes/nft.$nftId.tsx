import { createFileRoute } from '@tanstack/react-router'
import { Footer } from '@/features/layout'
import {
  NftDetailScreen,
  NftDetailSkeleton,
  NftNotFound,
  toDetailView,
} from '@/features/marketplace'
import { useNftDetail } from '@/global/api/nft'

export const Route = createFileRoute('/nft/$nftId')({
  /**
   * Client-only pelo mesmo motivo do carrinho: o catálogo passou a vir da
   * rede, e a rede é o Service Worker do MSW — que não existe no servidor.
   */
  ssr: false,
  staticData: {
    header: { active: 'market', divider: true },
    mobileTabBar: false,
  },
  component: NftDetailRoute,
  pendingComponent: NftDetailPending,
})

function NftDetailRoute() {
  const { nftId } = Route.useParams()
  const nft = useNftDetail(nftId)

  /**
   * 404 é resposta, não falha: o `retry` da política já não repete
   * `not_found`, então o NFT inexistente cai aqui de imediato.
   */
  if (nft.error?.kind === 'not_found') {
    return (
      <div className="flex flex-col gap-24">
        <NftNotFound />
        <Footer />
      </div>
    )
  }

  if (!nft.data) return <NftDetailPending />

  return (
    <div className="flex flex-col gap-24">
      <NftDetailScreen
        key={nft.data.id}
        nft={toDetailView(nft.data)}
        categoryId={nft.data.categoryId}
      />

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  )
}

function NftDetailPending() {
  return (
    <div className="flex flex-col gap-24">
      <NftDetailSkeleton />
    </div>
  )
}
