import { cartHandlers } from './cart'
import { scenarioHandlers } from './scenario'

export const handlers = [...cartHandlers, ...scenarioHandlers]
