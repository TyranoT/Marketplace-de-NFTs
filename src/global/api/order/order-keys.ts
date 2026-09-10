export const orderKeys = {
  all: ['order'] as const,
  detail: (orderId: string) => [...orderKeys.all, orderId] as const,
}

/** Identidade do recurso nos eventos. Precisa casar com a do servidor. */
export function orderResourceId(orderId: string): string {
  return `order:${orderId}`
}
