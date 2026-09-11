import { useCallback, useEffect, useRef, useState } from 'react'
import { useCartScope } from '@/global/api/cart'
import { useCheckout } from '@/global/api/checkout'
import { useOrder } from '@/global/api/order'
import {
  clearPendingOrder,
  readPendingOrder,
  savePendingOrder,
} from '../helpers/pending-order-store'
import type { CheckoutInput, Order } from '@/global/api'

/**
 * Uma tentativa de compra, do envio ao desfecho.
 *
 * Reúne três coisas que precisam andar juntas e antes viviam soltas: a
 * chave de idempotência (estável dentro de uma tentativa), o id do pedido
 * pendente (que sobrevive ao refresh) e a consulta que traz o estado atual.
 *
 * A chave é gerada **uma vez por tentativa**, não por requisição. É o que
 * faz o cenário do enunciado funcionar: se a resposta se perder num timeout
 * e o colecionador tentar de novo, o servidor devolve o mesmo pedido em vez
 * de cobrar duas vezes.
 *
 * Tudo é **por conta**: trocar de usuário troca o pedido que se acompanha.
 */
export function useOrderAttempt() {
  const checkout = useCheckout()
  const scope = useCartScope()

  const [pendingId, setPendingId] = useState<string | undefined>(undefined)
  const keyRef = useRef<string | undefined>(undefined)

  /** Retoma o que ficou em aberto — e esquece o da conta anterior. */
  useEffect(() => {
    const stored = readPendingOrder(scope)

    keyRef.current = stored?.idempotencyKey
    setPendingId(stored?.orderId)
  }, [scope])

  const order = useOrder(pendingId)

  /**
   * O pedido guardado não existe mais para esta conta — o cenário foi
   * restaurado. Manter a entrada deixaria a tela de pagamento tentando
   * recuperar, a cada visita, uma compra que ninguém mais conhece.
   */
  useEffect(() => {
    if (order.error?.kind !== 'not_found') return

    clearPendingOrder(scope)
    keyRef.current = undefined
    setPendingId(undefined)
  }, [order.error, scope])

  const submit = useCallback(
    (input: CheckoutInput, onSettled?: (order: Order) => void) => {
      /** Reusa a chave se já houve tentativa: retentar não é comprar de novo. */
      keyRef.current ??= crypto.randomUUID()

      const idempotencyKey = keyRef.current

      checkout.mutate(
        { ...input, idempotencyKey },
        {
          onSuccess: (created) => {
            savePendingOrder(scope, { orderId: created.id, idempotencyKey })
            setPendingId(created.id)
            onSettled?.(created)
          },
        },
      )
    },
    [checkout, scope],
  )

  /**
   * Fechar só é permitido num estado terminal — e é aí que a tentativa
   * termina de verdade: a chave é descartada, e uma compra seguinte nasce
   * como tentativa nova.
   */
  const dismiss = useCallback(() => {
    clearPendingOrder(scope)
    keyRef.current = undefined
    setPendingId(undefined)
    checkout.reset()
  }, [checkout, scope])

  return {
    submit,
    dismiss,
    order: order.data,
    isSubmitting: checkout.isPending,
    error: checkout.error,
  }
}
