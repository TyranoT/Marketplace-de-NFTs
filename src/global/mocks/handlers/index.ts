import { cartHandlers } from './cart'
import { checkoutHandlers } from './checkout'
import { scenarioHandlers } from './scenario'
import { userHandlers } from './user'

export const handlers = [
  ...cartHandlers,
  ...checkoutHandlers,
  ...userHandlers,
  ...scenarioHandlers,
]
