import { cartHandlers } from './cart'
import { checkoutHandlers } from './checkout'
import { devHandlers } from './dev'
import { nftHandlers } from './nft'
import { orderHandlers } from './order'
import { realtimeHandlers } from './realtime'
import { scenarioHandlers } from './scenario'
import { userHandlers } from './user'

export const handlers = [
  ...nftHandlers,
  ...cartHandlers,
  ...checkoutHandlers,
  ...orderHandlers,
  ...userHandlers,
  ...scenarioHandlers,
  ...devHandlers,
  ...realtimeHandlers,
]
