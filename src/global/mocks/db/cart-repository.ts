import {
  addEth,
  minEth,
  mulEthByQuantity,
  parseEth,
  percentOfEth,
  subEth,
  toMoney,
} from '../../helpers/eth-amount'
import { ARTWORKS } from '../../data/artwork'
import { NFTS } from '../../data/nfts'
import { NFT_EDITIONS } from '../../data/nft-detail-defaults'
import { findCoupon } from './coupons'
import { availabilityKey } from './schema'
import { getDb, saveDb } from './store'
import type { Wei } from '../../helpers/eth-amount'
import type { Cart, CartItem, CartTotals } from '../../api/contracts/cart'
import type { MockCart, MockDb } from './schema'
import type { NftEditionId } from '../../type'

/** Taxa de rede do frame: 0.016 ETH para os três itens do cenário-semente. */
const BASE_NETWORK_FEE = '0.004'
const PER_ITEM_NETWORK_FEE = '0.004'

export class CartRuleError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'CartRuleError'
  }
}

const NFT_BY_ID = new Map(NFTS.map((nft) => [nft.id, nft]))

function editionLabel(editionId: NftEditionId) {
  return NFT_EDITIONS.find(({ id }) => id === editionId)?.label ?? editionId
}

function availableFor(db: MockDb, nftId: string, editionId: NftEditionId) {
  return db.availability[availabilityKey(nftId, editionId)] ?? 0
}

function networkFee(itemCount: number): Wei {
  return addEth(
    parseEth(BASE_NETWORK_FEE),
    mulEthByQuantity(parseEth(PER_ITEM_NETWORK_FEE), itemCount),
  )
}

function discountFor(db: MockDb, subtotal: Wei): Wei {
  const coupon = db.cart.couponCode ? findCoupon(db.cart.couponCode) : undefined

  if (!coupon) return 0n

  if (coupon.percentOff) return percentOfEth(subtotal, coupon.percentOff)

  /** Desconto fixo nunca ultrapassa o subtotal — total negativo não existe. */
  return coupon.amountOff ? minEth(parseEth(coupon.amountOff), subtotal) : 0n
}

function toCartItem(
  db: MockDb,
  item: MockCart['items'][number],
): CartItem | undefined {
  const nft = NFT_BY_ID.get(item.nftId)

  if (!nft) return undefined

  const artwork = ARTWORKS[nft.artworkKey]
  const unitPrice = parseEth(db.prices[item.nftId] ?? nft.price.amount)

  return {
    id: item.id,
    nftId: item.nftId,
    name: nft.name,
    imageUrl: artwork.src,
    imageAlt: artwork.alt,
    editionId: item.editionId,
    editionLabel: editionLabel(item.editionId),
    quantity: item.quantity,
    unitPrice: toMoney(unitPrice),
    lineTotal: toMoney(mulEthByQuantity(unitPrice, item.quantity)),
    available: availableFor(db, item.nftId, item.editionId),
    version: 1,
  }
}

function computeTotals(db: MockDb, items: Array<CartItem>): CartTotals {
  const subtotal = items.reduce<Wei>(
    (total, item) => addEth(total, parseEth(item.lineTotal.amount)),
    0n,
  )

  const discount = discountFor(db, subtotal)
  const fee = items.length === 0 ? 0n : networkFee(items.length)

  return {
    subtotal: toMoney(subtotal),
    discount: toMoney(discount),
    networkFee: toMoney(fee),
    total: toMoney(addEth(subEth(subtotal, discount), fee)),
  }
}

function toCart(db: MockDb): Cart {
  const items = db.cart.items.flatMap((item) => toCartItem(db, item) ?? [])
  const coupon = db.cart.couponCode ? findCoupon(db.cart.couponCode) : undefined

  return {
    id: db.cart.id,
    items,
    coupon:
      coupon && db.cart.couponCode
        ? {
            code: db.cart.couponCode,
            label: coupon.label,
            percentOff: coupon.percentOff,
            amountOff: coupon.amountOff
              ? toMoney(parseEth(coupon.amountOff))
              : undefined,
            expiresAt: coupon.expiresAt,
          }
        : undefined,
    totals: computeTotals(db, items),
    updatedAt: db.cart.updatedAt,
    version: db.cart.version,
  }
}

function commit(db: MockDb): Cart {
  const next: MockDb = {
    ...db,
    cart: {
      ...db.cart,
      version: db.cart.version + 1,
      updatedAt: new Date().toISOString(),
    },
  }

  saveDb(next)

  return toCart(next)
}

export function readCart(): Cart {
  return toCart(getDb())
}

export function addItem(
  nftId: string,
  editionId: NftEditionId,
  quantity: number,
): Cart {
  const db = getDb()
  const nft = NFT_BY_ID.get(nftId)

  if (!nft) throw new CartRuleError(404, 'NFT_NOT_FOUND', 'NFT não encontrado.')

  const available = availableFor(db, nftId, editionId)

  if (available === 0) {
    throw new CartRuleError(
      409,
      'EDITION_SOLD_OUT',
      'Esta edição está esgotada.',
    )
  }

  const existing = db.cart.items.find(
    (item) => item.nftId === nftId && item.editionId === editionId,
  )
  const nextQuantity = (existing?.quantity ?? 0) + quantity

  if (nextQuantity > available) {
    throw new CartRuleError(
      409,
      'QUANTITY_EXCEEDS_AVAILABILITY',
      `Restam apenas ${available} unidades desta edição.`,
    )
  }

  const items = existing
    ? db.cart.items.map((item) =>
        item === existing ? { ...item, quantity: nextQuantity } : item,
      )
    : [
        ...db.cart.items,
        { id: `item-${nftId}-${editionId}`, nftId, editionId, quantity },
      ]

  return commit({ ...db, cart: { ...db.cart, items } })
}

export function updateItem(itemId: string, quantity: number): Cart {
  const db = getDb()
  const item = db.cart.items.find((entry) => entry.id === itemId)

  if (!item) {
    throw new CartRuleError(
      404,
      'CART_ITEM_NOT_FOUND',
      'Item não está no carrinho.',
    )
  }

  if (quantity < 1) {
    throw new CartRuleError(422, 'INVALID_QUANTITY', 'A quantidade mínima é 1.')
  }

  const available = availableFor(db, item.nftId, item.editionId)

  if (quantity > available) {
    throw new CartRuleError(
      409,
      'QUANTITY_EXCEEDS_AVAILABILITY',
      `Restam apenas ${available} unidades desta edição.`,
    )
  }

  const items = db.cart.items.map((entry) =>
    entry.id === itemId ? { ...entry, quantity } : entry,
  )

  return commit({ ...db, cart: { ...db.cart, items } })
}

export function removeItem(itemId: string): Cart {
  const db = getDb()

  if (!db.cart.items.some((entry) => entry.id === itemId)) {
    throw new CartRuleError(
      404,
      'CART_ITEM_NOT_FOUND',
      'Item não está no carrinho.',
    )
  }

  const items = db.cart.items.filter((entry) => entry.id !== itemId)

  return commit({ ...db, cart: { ...db.cart, items } })
}

export function applyCoupon(code: string): Cart {
  const db = getDb()
  const normalized = code.trim().toUpperCase()
  const coupon = findCoupon(normalized)

  if (!coupon) {
    throw new CartRuleError(422, 'COUPON_INVALID', 'Cupom inválido.')
  }

  if (Date.parse(coupon.expiresAt) <= Date.now()) {
    throw new CartRuleError(422, 'COUPON_EXPIRED', 'Cupom expirado.')
  }

  if (coupon.minSubtotal) {
    const items = db.cart.items.flatMap((item) => toCartItem(db, item) ?? [])
    const subtotal = items.reduce<Wei>(
      (total, item) => addEth(total, parseEth(item.lineTotal.amount)),
      0n,
    )

    if (subtotal < parseEth(coupon.minSubtotal)) {
      throw new CartRuleError(
        409,
        'COUPON_NOT_APPLICABLE',
        `Este cupom exige subtotal mínimo de ${coupon.minSubtotal} ETH.`,
      )
    }
  }

  return commit({ ...db, cart: { ...db.cart, couponCode: normalized } })
}

export function removeCoupon(): Cart {
  const db = getDb()

  return commit({ ...db, cart: { ...db.cart, couponCode: undefined } })
}
