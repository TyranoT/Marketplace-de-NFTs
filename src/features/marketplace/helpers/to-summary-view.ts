import { formatMoney } from '@/global/helpers/eth-amount'
import type { NftListItem } from '@/global/api/contracts/nft'
import type { NftSummary } from '@/global/type'

/**
 * Do contrato de rede para o modelo de exibição do card.
 *
 * A conversão acontece aqui, na borda da apresentação, e não no servidor
 * simulado: `Money` é o que o carrinho e os eventos precisam somar com
 * precisão, e uma string já formatada não voltaria a ser número sem perda.
 * Nenhum componente de card mudou por causa disso.
 */
export function toSummaryView(item: NftListItem): NftSummary {
  return {
    id: item.id,
    name: item.name,
    price: formatMoney(item.price),
    secondaryPrice: item.secondaryPrice && formatMoney(item.secondaryPrice),
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt,
  }
}
