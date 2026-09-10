import { useCallback, useEffect, useRef, useState } from 'react'
import { buildRemovedMessage } from '../constants/cart-copy'
import type { CartItem } from '@/global/api'

/** Alvo do foco depois que a linha some: outro item, ou a própria região. */
type PendingFocus = { kind: 'item'; itemId: string } | { kind: 'region' }

/**
 * Cuida do que acontece ao remover um item: sem isso o botão clicado é
 * desmontado, o foco cai no `<body>` e quem navega por teclado volta ao topo
 * da página a cada remoção.
 *
 * A regra é herdar a posição do item removido — o foco vai para a lixeira de
 * quem assumiu aquele lugar, ou para a região da lista quando era o último.
 *
 * O alvo é aplicado em efeito, e não no retorno da mutation: naquele momento
 * o cache já mudou, mas o React ainda não renderizou a lista nova, e o botão
 * que deve receber o foco pode nem existir no documento.
 */
export function useCartFocus() {
  const buttons = useRef(new Map<string, HTMLButtonElement>())
  const regionRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState('')
  const [pending, setPending] = useState<PendingFocus>()

  const registerRemoveButton = useCallback(
    (itemId: string, element: HTMLButtonElement | null) => {
      if (element) buttons.current.set(itemId, element)
      else buttons.current.delete(itemId)
    },
    [],
  )

  const handleRemoved = useCallback(
    (item: CartItem, remaining: Array<CartItem>) => {
      setStatus(buildRemovedMessage(item.name))
      buttons.current.delete(item.id)

      const next = remaining.at(0)

      setPending(next ? { kind: 'item', itemId: next.id } : { kind: 'region' })
    },
    [],
  )

  useEffect(() => {
    if (!pending) return

    const target =
      pending.kind === 'item'
        ? buttons.current.get(pending.itemId)
        : regionRef.current

    target?.focus()
    setPending(undefined)
  }, [pending])

  return { registerRemoveButton, handleRemoved, regionRef, status }
}
