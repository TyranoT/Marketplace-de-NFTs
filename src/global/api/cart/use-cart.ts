import { useQuery } from '@tanstack/react-query'
import { cartQueryOptions } from './cart-query-options'
import { useCartScope } from './cart-keys'

export function useCart() {
  return useQuery(cartQueryOptions(useCartScope()))
}
