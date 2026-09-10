import { createFileRoute } from '@tanstack/react-router'
import { Footer } from '@/features/layout'
import {
  HomeScreen,
  catalogSearchSchema,
  toListQuery,
} from '@/features/marketplace'
import { nftListQueryOptions } from '@/global/api/nft'

export const Route = createFileRoute('/')({
  /**
   * Busca, filtros, ordenação e paginação compõem a URL — é o que os faz
   * sobreviver a refresh e ao histórico, como o enunciado exige.
   */
  validateSearch: catalogSearchSchema,
  loaderDeps: ({ search }) => ({ search }),

  /**
   * Só o cliente carrega: o MSW vive no Service Worker, e no servidor a
   * consulta ficaria suspensa — o mesmo motivo já registrado no carrinho e
   * no cabeçalho. O `pendingComponent` da grade cobre a espera.
   */
  loader: ({ context, deps }) => {
    if (typeof window === 'undefined') return

    void context.queryClient.prefetchQuery(
      nftListQueryOptions(toListQuery(deps.search)),
    )
  },

  component: HomeRoute,
  staticData: { header: { active: 'home', divider: true } },
})

function HomeRoute() {
  return (
    <div className="flex flex-col gap-24">
      <HomeScreen />
      <Footer />
    </div>
  )
}
