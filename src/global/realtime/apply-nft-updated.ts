import { cartKeys } from '../api/cart'
import { nftKeys } from '../api/nft'
import type { QueryClient } from '@tanstack/react-query'
import type { Cart } from '../api/contracts/cart'
import type {
  NftDetailResource,
  NftListItem,
  NftListResponse,
} from '../api/contracts/nft'
import type { NftUpdatedEvent } from '../api/contracts/realtime'
import type { CartScope } from '../api/cart'

/**
 * Muda o que o evento carrega, sem inventar o que ele não carrega.
 */
function patch<TItem extends NftListItem>(
  item: TItem,
  event: NftUpdatedEvent,
): TItem {
  const edition = event.editions.find(
    ({ editionId }) => editionId === item.editionId,
  )

  return {
    ...item,
    price: event.price,
    available: edition?.available ?? item.available,
    version: event.version,
    updatedAt: event.emittedAt,
  }
}

/**
 * Aplica `nft.updated` no cache.
 *
 * Cada alvo tem uma estratégia diferente, e a razão é a mesma em todos: usar
 * o que o evento já traz quando ele basta, e voltar ao servidor quando não.
 */
export function applyNftUpdated(
  queryClient: QueryClient,
  event: NftUpdatedEvent,
  scope: CartScope,
): void {
  /**
   * Detalhe: o evento traz preço, disponibilidade e versão — tudo que muda.
   * Ir à rede seria pedir de volta o que acabou de chegar.
   */
  queryClient.setQueryData<NftDetailResource>(
    nftKeys.detail(event.nftId),
    (current) => (current ? patch(current, event) : current),
  )

  /**
   * Catálogo: remenda **todas** as páginas em cache, inclusive as inativas.
   * Com `keepPreviousData`, voltar para uma página já visitada mostraria o
   * preço antigo se só a ativa fosse corrigida.
   */
  for (const [key, page] of queryClient.getQueriesData<NftListResponse>({
    queryKey: nftKeys.lists(),
  })) {
    if (!page?.items.some(({ id }) => id === event.nftId)) continue

    queryClient.setQueryData<NftListResponse>(key, {
      ...page,
      items: page.items.map((item) =>
        item.id === event.nftId ? patch(item, event) : item,
      ),
    })
  }

  /**
   * Remendar não corrige ordenação nem pertinência ao filtro de preço: um
   * NFT que ficou mais caro pode ter saído da faixa buscada. Marcar como
   * obsoleto sem refazer agora deixa a próxima leitura natural resolver,
   * em vez de reordenar a grade sob o cursor de quem está lendo.
   */
  void queryClient.invalidateQueries({
    queryKey: nftKeys.lists(),
    refetchType: 'none',
  })

  /**
   * Carrinho: aqui não dá para remendar. Mudar o preço de uma linha muda
   * subtotal, desconto (se o cupom for percentual), taxa de rede e total —
   * cálculo que pertence ao servidor, e que este projeto decidiu nunca
   * duplicar na interface. Só vale invalidar se o NFT está no carrinho.
   */
  const cart = queryClient.getQueryData<Cart>(cartKeys.detail(scope))

  if (cart?.items.some(({ nftId }) => nftId === event.nftId)) {
    void queryClient.invalidateQueries({ queryKey: cartKeys.detail(scope) })
  }
}

/** O item do carrinho afetado, para o aviso poder nomeá-lo. */
export function affectedCartItem(
  queryClient: QueryClient,
  event: NftUpdatedEvent,
  scope: CartScope,
) {
  const cart = queryClient.getQueryData<Cart>(cartKeys.detail(scope))

  return cart?.items.find(({ nftId }) => nftId === event.nftId)
}
