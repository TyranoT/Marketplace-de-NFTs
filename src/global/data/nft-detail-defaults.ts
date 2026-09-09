import type { NftEdition, NftEditionId } from '../type'

export const NFT_EDITIONS: Array<NftEdition> = [
  { id: '1-1', label: '1/1' },
  { id: '1-10', label: '1/10' },
  { id: '1-50', label: '1/50' },
  { id: 'open', label: 'ABERTA' },
]

export const DEFAULT_EDITION: NftEditionId = '1-50'

/**
 * Premissas válidas para o catálogo inteiro, extraídas da cópia do Figma.
 * São afirmações sobre a coleção — mesma rede, mesmo contrato, mesma regra
 * de royalties — e não sobre um NFT específico, por isso valem para todos.
 */
export const CATALOG_NETWORK =
  'Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS.'
export const CATALOG_ROYALTIES =
  'Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.'
export const CATALOG_CONTRACT =
  '0x7A42...19E8 • Contrato inteligente ERC-721 verificado.'

/** O design repete a mesma arte nas 4 miniaturas; mantido fiel de propósito. */
export const GALLERY_SIZE = 4

/** 5 cards em "Mais desta coleção", medido no Figma. */
export const RELATED_LIMIT = 5

/** Avaliação do único NFT redigido no Figma, reaproveitada como fixture. */
export const DEFAULT_RATING = { value: 4, count: 19 }
