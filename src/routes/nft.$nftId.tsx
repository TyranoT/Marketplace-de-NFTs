import { createFileRoute } from '@tanstack/react-router'
import { Footer } from '@/features/layout'
import {
  NftDetailScreen,
  NftDetailSkeleton,
  NftNotFound,
  toDetailView,
} from '@/features/marketplace'
import { nftDetailQueryOptions, useNftDetail } from '@/global/api/nft'

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
  /**
   * O loader existe para o `<title>` saber o nome do NFT. Ele aquece o
   * mesmo cache que a tela lê, então não há segunda requisição. Falha vira
   * `null` em vez de erro: quem decide o que mostrar — 404, erro de rede —
   * é o componente, que já trata os dois.
   */
  loader: ({ context, params }) =>
    context.queryClient
      .ensureQueryData(nftDetailQueryOptions(params.nftId))
      .then((nft) => ({ name: nft.name }))
      .catch(() => ({ name: null })),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.name ? `${loaderData.name} · Kurio` : 'NFT · Kurio',
      },
    ],
  }),
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
