import type { Money } from './api/contracts/money'

export type Artwork = {
  src: string
  alt: string
}

export type ArtworkKey = 'varsity' | 'bucket' | 'headphones' | 'turtleneck'

export type NftEditionId = '1-1' | '1-10' | '1-50' | 'open'

export type NftEdition = {
  id: NftEditionId
  label: string
}

export type NftFact = {
  label: string
  value: string
}

export type NftRating = {
  /** Estrelas acesas de 5. */
  value: number
  /** Nota exibida no selo do mobile, que mostra o número em vez das estrelas. */
  score: number
  count: number
}

/** Registro-semente: fonte única de verdade de cada NFT. */
export type Nft = {
  id: string
  name: string
  /**
   * Valor estruturado, não string de exibição: é daqui que o servidor
   * simulado tira o preço para somar o carrinho com precisão. Quem renderiza
   * recebe `NftSummary.price` / `NftDetail.price`, já formatados.
   */
  price: Money
  secondaryPrice?: Money
  artworkKey: ArtworkKey
  collection: string
  edition: NftEditionId
}

/** Contrato de leitura do card. Derivado de `Nft` por `toNftSummary`. */
export type NftSummary = {
  id: string
  name: string
  price: string
  secondaryPrice?: string
  imageUrl: string
  imageAlt: string
}

/** Contrato de leitura da tela de detalhes. Derivado por `buildNftDetail`. */
export type NftDetail = {
  id: string
  name: string
  price: string
  secondaryPrice?: string
  collection: string
  artwork: Artwork
  gallery: Array<Artwork>
  about: string
  editions: Array<NftEdition>
  selectedEdition: NftEditionId
  metadata: Array<NftFact>
  paragraphs: Array<string>
  /**
   * Guardados com o nome semanticamente correto. O design troca os rótulos
   * de `royalties` e `contract` entre si; a inversão é aplicada na view
   * (`nft-detail-facts.tsx`), por fidelidade ao Figma.
   */
  network: string
  royalties: string
  contract: string
  rating: NftRating
}
