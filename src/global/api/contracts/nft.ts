import type { Money } from './money'
import type {
  Artwork,
  NftCategoryId,
  NftEdition,
  NftEditionId,
  NftFact,
  NftRating,
} from '../../type'

/**
 * O NFT como ele atravessa a rede.
 *
 * O preço é `Money`, e não a string formatada de `NftSummary`: é deste valor
 * que o carrinho e os eventos dependem, e formatar antes da hora perderia a
 * precisão que `eth-amount.ts` existe para garantir. A formatação acontece na
 * borda de apresentação.
 */
export type NftListItem = {
  id: string
  name: string
  collection: string
  /** Categoria do filtro. É por ela que "Mais desta coleção" se monta. */
  categoryId: NftCategoryId
  imageUrl: string
  imageAlt: string
  price: Money
  secondaryPrice?: Money
  editionId: NftEditionId
  /** Unidades restantes na edição corrente. */
  available: number
  /** Versão do recurso. Ordena os eventos `nft.updated`. */
  version: number
  updatedAt: string
}

export type NftDetailResource = NftListItem & {
  gallery: Array<Artwork>
  about: string
  editions: Array<NftEdition>
  metadata: Array<NftFact>
  paragraphs: Array<string>
  network: string
  royalties: string
  contract: string
  rating: NftRating
}

export type NftCatalogTab = 'all' | 'new' | 'trending'
export type NftCatalogSort = 'recent' | 'price-asc' | 'price-desc'

export type NftListQuery = {
  q?: string
  collection?: Array<string>
  network?: Array<string>
  /** Strings decimais, pelo mesmo motivo de `Money`. */
  minPrice?: string
  maxPrice?: string
  tab?: NftCatalogTab
  sort?: NftCatalogSort
  /** Exclui um id do resultado — é como "Mais desta coleção" se monta. */
  exclude?: string
  page: number
  pageSize: number
}

export type NftListResponse = {
  items: Array<NftListItem>
  page: number
  pageSize: number
  total: number
  pageCount: number
}
