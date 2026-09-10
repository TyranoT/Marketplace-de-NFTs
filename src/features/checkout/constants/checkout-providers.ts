import { WALLET_TYPES } from '@/global/data'

export type CheckoutProvider = {
  id: string
  label: string
  /** Ausente quando o frame usa o glifo de carteira em vez de uma inicial. */
  initial?: string
}

/**
 * Os três provedores do frame mobile, na ordem dele. `WALLET_TYPES` tem um
 * quarto (Ledger), que o desenho não mostra — e é a lista que o servidor
 * valida, então o rótulo sai dela em vez de ser digitado outra vez aqui.
 */
const FRAME_ORDER: Array<{ id: string; initial?: string }> = [
  { id: 'walletconnect', initial: 'W' },
  { id: 'metamask', initial: 'M' },
  { id: 'coinbase' },
]

export const CHECKOUT_PROVIDERS: Array<CheckoutProvider> = FRAME_ORDER.flatMap(
  ({ id, initial }) => {
    const type = WALLET_TYPES.find((option) => option.id === id)

    if (!type) return []

    return [{ id, label: type.label, initial }]
  },
)
