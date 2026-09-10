import { request } from '../request'
import type {
  AddCartItemInput,
  ApplyCouponInput,
  Cart,
  UpdateCartItemInput,
} from '../contracts/cart'

type Signal = { signal?: AbortSignal }

export function getCart({ signal }: Signal = {}) {
  return request<Cart>({ method: 'GET', url: '/cart', signal })
}

export function addCartItem(data: AddCartItemInput) {
  return request<Cart>({ method: 'POST', url: '/cart/items', data })
}

export function updateCartItem({ itemId, quantity }: UpdateCartItemInput) {
  return request<Cart>({
    method: 'PATCH',
    url: `/cart/items/${itemId}`,
    data: { quantity },
  })
}

export function removeCartItem(itemId: string) {
  return request<Cart>({ method: 'DELETE', url: `/cart/items/${itemId}` })
}

export function applyCartCoupon(data: ApplyCouponInput) {
  return request<Cart>({ method: 'POST', url: '/cart/coupon', data })
}

export function removeCartCoupon() {
  return request<Cart>({ method: 'DELETE', url: '/cart/coupon' })
}
