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

export type NftSummary = {
  id: string
  name: string
  price: string
  secondaryPrice?: string
  imageUrl: string
  imageAlt: string
}

export type FilterOption = {
  id: string
  label: string
  count: number
}

export type PriceRange = [number, number]

export type Artwork = {
  src: string
  alt: string
}

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
