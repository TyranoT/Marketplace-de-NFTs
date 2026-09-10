import { request } from '../request'
import type { CheckoutInput, Order } from '../contracts/order'

export function postCheckout(data: CheckoutInput, idempotencyKey: string) {
  return request<Order>({
    method: 'POST',
    url: '/checkout',
    data,
    /**
     * Vive no header, e não no corpo: é metadado de transporte da tentativa,
     * como o `x-request-id` — só que estável entre retentativas, enquanto
     * aquele muda a cada requisição.
     */
    headers: { 'Idempotency-Key': idempotencyKey },
  })
}
