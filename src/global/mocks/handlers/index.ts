import { cartHandlers } from './cart'
import { checkoutHandlers } from './checkout'
import { scenarioHandlers } from './scenario'

export const handlers = [
  ...cartHandlers,
  ...checkoutHandlers,
  ...scenarioHandlers,
]
