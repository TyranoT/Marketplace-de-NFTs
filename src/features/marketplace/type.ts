import type { Artwork } from '@/global/type'

export type CatalogTabKey = 'all' | 'new' | 'trending'

export type CatalogTab = {
  key: CatalogTabKey
  label: string
}

export type CatalogSortValue = 'recent' | 'price-asc' | 'price-desc'

export type CatalogSortOption = {
  value: CatalogSortValue
  label: string
}

export type FilterOption = {
  id: string
  label: string
  count: number
}

export type PriceRange = [number, number]

export type PromoCardContent = {
  id: string
  titleLines: Array<string>
  body: string
  cta: string
  artwork: Artwork
}

export type JournalPost = {
  id: string
  date: string
  readTime: string
  title: string
  excerpt: string
  cta: string
  artwork: Artwork
}

export type NftShareTarget = {
  label: string
  /**
   * `ComponentType` em vez do tipo de função usado em `SocialLink`: os ícones
   * do lucide são forwardRef e não são atribuíveis àquela assinatura.
   */
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  /** URL pública de compartilhamento da rede, sem integração. */
  buildHref: (pageUrl: string, nftName: string) => string
}
