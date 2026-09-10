import { compareEth, parseEth } from '../../../helpers/eth-amount'
import { mockDb } from '../core'
import { nftContractMapper } from './nft-contract-mapper'
import { NftRuleError } from './nft-rule-error'
import type { Nft } from '../../../type'
import type {
  NftDetailResource,
  NftListItem,
  NftListQuery,
  NftListResponse,
} from '../../../api/contracts/nft'

const DECIMAL = /^\d+(\.\d+)?$/

export type NftChangeInput = {
  price?: string
  editions?: Array<{ editionId: string; units: number }>
}

/**
 * As regras do catálogo, escritas sobre o banco simulado — como o
 * `CartService`. Busca, recorte, ordenação e paginação são decididos aqui e
 * em nenhum outro lugar: o handler só traduz HTTP.
 */
export class NftService {
  list(query: NftListQuery): NftListResponse {
    const filtered = mockDb.nft
      .findMany()
      .filter((nft) => this.matches(nft, query))

    const sorted = this.sort(filtered, query.sort)

    const total = sorted.length
    const pageCount = Math.max(1, Math.ceil(total / query.pageSize))
    /** Página fora do intervalo devolve vazio, e não a última: o cliente
     *  precisa distinguir "acabou" de "esta página não existe". */
    const start = (query.page - 1) * query.pageSize

    return {
      items: sorted
        .slice(start, start + query.pageSize)
        .map((nft) => nftContractMapper.toListItem(nft)),
      page: query.page,
      pageSize: query.pageSize,
      total,
      pageCount,
    }
  }

  detail(id: string): NftDetailResource {
    const nft = mockDb.nft.findUnique({ where: { id } })

    if (!nft) throw NftRuleError.nftNotFound()

    return nftContractMapper.toDetail(nft)
  }

  /**
   * Escrita do painel de simulação: muda preço e disponibilidade e sobe a
   * revisão do NFT.
   *
   * Devolve o item já no formato de contrato para que o handler possa
   * emitir o evento com o mesmo dado que a resposta REST carrega — é o que
   * o §6 exige quando diz que a mudança se reflete nos dois caminhos.
   *
   * **Não abre transação**: quem chama é o ponto de entrada e a controla.
   * Abrir uma aqui, aninhada, persistiria estado parcial no `localStorage`.
   */
  applyChange(id: string, input: NftChangeInput): NftListItem {
    const nft = mockDb.nft.findUnique({ where: { id } })

    if (!nft) throw NftRuleError.nftNotFound()

    if (input.price !== undefined) {
      this.assertPrice(input.price)
      mockDb.price.update({
        where: { nftId: id },
        data: { amount: input.price },
      })
    }

    for (const edition of input.editions ?? []) {
      if (!Number.isInteger(edition.units) || edition.units < 0) {
        throw NftRuleError.invalidUnits()
      }

      mockDb.availability.update({
        where: { nftId: id, editionId: edition.editionId as Nft['edition'] },
        data: { units: edition.units },
      })
    }

    mockDb.nftRevision.bump(id)

    /**
     * O carrinho é cotado a partir do preço corrente, então uma mudança aqui
     * muda o total de lá. Subir a versão do carrinho é o que faz o checkout
     * reconhecer a cotação como desatualizada; sem isso a compra seguiria com
     * um valor que o colecionador nunca viu.
     */
    if (mockDb.cartItem.findFirst({ where: { nftId: id } })) {
      const cart = mockDb.cart.findFirst()

      if (cart) {
        mockDb.cart.update({
          where: { id: cart.id },
          data: {
            version: cart.version + 1,
            updatedAt: new Date().toISOString(),
          },
        })
      }
    }

    return nftContractMapper.toListItem(nft)
  }

  private matches(nft: Nft, query: NftListQuery): boolean {
    if (query.exclude && nft.id === query.exclude) return false

    if (
      query.collection?.length &&
      !query.collection.includes(nft.categoryId)
    ) {
      return false
    }

    if (query.network?.length && !query.network.includes(nft.networkId)) {
      return false
    }

    if (query.tab === 'trending' && !nft.trending) return false

    if (query.q && !this.matchesText(nft, query.q)) return false

    return this.matchesPrice(nft, query)
  }

  /**
   * Busca sem acento e sem caixa: quem digita "musica" espera achar
   * "Música". Cobre nome, coleção e atributos da arte.
   */
  private matchesText(nft: Nft, term: string): boolean {
    const haystack = [
      nft.name,
      nft.collection,
      ...nftContractMapper.attributesOf(nft),
    ]
      .join(' ')
      .toLocaleLowerCase('pt-BR')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')

    const needle = term
      .trim()
      .toLocaleLowerCase('pt-BR')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')

    return haystack.includes(needle)
  }

  /** Compara em wei: `Number` perderia precisão no limite da faixa. */
  private matchesPrice(nft: Nft, query: NftListQuery): boolean {
    const price = parseEth(nftContractMapper.priceOf(nft))

    if (query.minPrice && price < parseEth(query.minPrice)) return false
    if (query.maxPrice && price > parseEth(query.maxPrice)) return false

    return true
  }

  private sort(nfts: Array<Nft>, sort: NftListQuery['sort']): Array<Nft> {
    const ordered = [...nfts]

    if (sort === 'price-asc' || sort === 'price-desc') {
      const direction = sort === 'price-asc' ? 1 : -1

      return ordered.sort(
        (a, b) =>
          direction *
          compareEth(
            parseEth(nftContractMapper.priceOf(a)),
            parseEth(nftContractMapper.priceOf(b)),
          ),
      )
    }

    /** `recent` é o padrão: o mais novo primeiro. */
    return ordered.sort((a, b) => b.listedAt.localeCompare(a.listedAt))
  }

  private assertPrice(amount: string): void {
    if (!DECIMAL.test(amount.trim())) throw NftRuleError.invalidPrice()
    if (parseEth(amount) <= 0n) throw NftRuleError.invalidPrice()
  }
}

export const nftService = new NftService()
