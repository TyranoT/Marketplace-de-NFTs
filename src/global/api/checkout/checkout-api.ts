import { request } from '../request'
import type { CheckoutInput, Order } from '../contracts/order'

export function postCheckout(data: CheckoutInput) {
  return request<Order>({ method: 'POST', url: '/checkout', data })
}
