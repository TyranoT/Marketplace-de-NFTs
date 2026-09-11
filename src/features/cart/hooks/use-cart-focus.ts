import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { buildRemovedMessage } from '../constants/cart-copy'
import type { CartItem } from '@/global/api'

/** Alvo do foco depois que a linha some: outro item, ou a própria região. */
type PendingFocus = { kind: 'item'; itemId: string } | { kind: 'region' }

type Layout = 'table' | 'list'

const LAYOUTS: Array<Layout> = ['table', 'list']

type Registrar = (itemId: string, element: HTMLButtonElement | null) => void

/**
 * Cuida do que acontece ao remover um item: sem isso o botão clicado é
 * desmontado, o foco cai no `<body>` e quem navega por teclado volta ao topo
 * da página a cada remoção.
 *
 * A regra é herdar a posição do item removido — o foco vai para a lixeira de
 * quem ocupou aquele lugar, ou para a região da lista quando era o último.
 *
 * **Os botões são registrados por layout.** A tabela do desktop e a lista do
 * mobile ficam montadas ao mesmo tempo, uma delas com `display: none`. Com a
 * chave só pelo id do item, a lista (que vem depois no DOM) sobrescrevia o
 * botão da tabela, e no desktop o foco ia para um botão invisível — `focus()`
 * falhava em silêncio e o foco caía no `<body>`.
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

  const registrars = useMemo(() => {
    const make =
      (layout: Layout): Registrar =>
      (itemId, element) => {
        const key = `${layout}:${itemId}`

        if (element) buttons.current.set(key, element)
        else buttons.current.delete(key)
      }

    return { table: make('table'), list: make('list') }
  }, [])

  /** `removedIndex` é a posição do item antes de sair da lista. */
  const handleRemoved = useCallback(
    (item: CartItem, remaining: Array<CartItem>, removedIndex: number) => {
      setStatus(buildRemovedMessage(item.name))

      const next = remaining.at(Math.min(removedIndex, remaining.length - 1))

      setPending(next ? { kind: 'item', itemId: next.id } : { kind: 'region' })
    },
    [],
  )

  useEffect(() => {
    if (!pending) return

    const target =
      pending.kind === 'item'
        ? visibleButton(pending.itemId)
        : regionRef.current

    target?.focus()
    setPending(undefined)
  }, [pending])

  /** O botão do layout que está na tela — o outro tem `display: none`. */
  function visibleButton(itemId: string) {
    for (const layout of LAYOUTS) {
      const element = buttons.current.get(`${layout}:${itemId}`)

      if (element && element.offsetParent !== null) return element
    }

    return regionRef.current
  }

  return {
    registerTableButton: registrars.table,
    registerListButton: registrars.list,
    handleRemoved,
    regionRef,
    status,
  }
}
