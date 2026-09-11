import { mockDb } from '../core'
import { getScenario } from '../../scenario/config'
import { orderContractMapper } from './order-contract-mapper'
import { OrderRuleError } from './order-rule-error'
import { currentOwnerId } from '../user/session-guard'
import type { MockOrder } from './mock-order'
import type { Order, OrderStatus } from '../../../api/contracts/order'

const DECLINE_REASON =
  'A carteira recusou a transação. Nenhum valor foi debitado.'

/**
 * O ciclo de vida do pedido depois que ele nasce.
 *
 * A liquidação é **preguiçosa**: toda leitura confere se algum pendente já
 * passou da hora e o resolve antes de responder. É isso que faz um F5 no
 * meio da compra recuperar o estado — um `setTimeout` não sobrevive ao
 * recarregar, e depender dele deixaria o pedido preso em `pending` para
 * sempre. O temporizador do `order-settlement` existe só para a transição
 * parecer imediata a quem está com a tela aberta.
 */
export class OrderService {
  readOrder(id: string): Order {
    this.settleDue()

    /**
     * Pedido de outro dono responde 404, e não 403: dizer que ele existe já
     * seria contar a quem não comprou que alguém comprou.
     */
    const order = mockDb.order.findUnique({
      where: { id, ownerId: currentOwnerId() },
    })

    if (!order) throw OrderRuleError.orderNotFound()

    return orderContractMapper.toContract(order)
  }

  listOrders(): Array<Order> {
    this.settleDue()

    return mockDb.order
      .findMany({ where: { ownerId: currentOwnerId() } })
      .map((order) => orderContractMapper.toContract(order))
  }

  /** Todos os pedidos, de todos os donos. Só para o painel de simulação. */
  listAllOrders(): Array<Order> {
    this.settleDue()

    return mockDb.order
      .findMany()
      .map((order) => orderContractMapper.toContract(order))
  }

  /** Dono do pedido, para o evento ir só a ele. */
  ownerOf(id: string): string | undefined {
    return mockDb.order.findUnique({ where: { id } })?.ownerId
  }

  /**
   * Resolve os pendentes vencidos e devolve os que mudaram, para o handler
   * emitir `order.updated` **depois** que a transação fechou.
   */
  settleDue(): Array<Order> {
    const due = mockDb.order.findDue()

    if (due.length === 0) return []

    const outcome = getScenario().orderOutcome

    /** `manual` só liquida pelo painel: o relógio não decide por ele. */
    if (outcome === 'manual') return []

    return mockDb.$transaction(() =>
      due.map((order) => this.transition(order, outcome)),
    )
  }

  /** Transição explícita, usada pelo painel de simulação. */
  settle(id: string, status: OrderStatus, reason?: string): Order {
    return mockDb.$transaction(() => {
      const order = mockDb.order.findUnique({ where: { id } })

      if (!order) throw OrderRuleError.orderNotFound()

      /** Confirmado e recusado são terminais: deles não se sai. */
      if (order.isTerminal)
        throw OrderRuleError.orderAlreadySettled(order.status)

      return this.transition(order, status, reason)
    })
  }

  /**
   * A baixa definitiva. O estoque já foi reservado na criação, então
   * confirmar só limpa o carrinho; recusar devolve as unidades.
   */
  private transition(
    order: MockOrder,
    status: OrderStatus,
    reason?: string,
  ): Order {
    const settled = order.settle(
      status,
      status === 'declined' ? (reason ?? DECLINE_REASON) : undefined,
    )

    mockDb.order.update({ where: { id: order.id }, data: settled })

    if (status === 'declined') this.releaseStock(settled)
    if (status === 'confirmed') this.clearCart(settled)

    return orderContractMapper.toContract(settled)
  }

  /** Recusa devolve o que foi reservado — o NFT volta a estar à venda. */
  private releaseStock(order: MockOrder): void {
    for (const item of order.toSnapshot().items) {
      const current = mockDb.availability.findUnique({
        where: { nftId: item.nftId, editionId: item.editionId },
      })

      mockDb.availability.update({
        where: { nftId: item.nftId, editionId: item.editionId },
        data: { units: (current?.units ?? 0) + item.quantity },
      })

      mockDb.nftRevision.bump(item.nftId)
    }
  }

  /**
   * O carrinho só é esvaziado na confirmação, e não na criação do pedido:
   * uma recusa precisa devolver o colecionador ao carrinho que ele tinha —
   * "preservar os itens em falhas", como diz o enunciado.
   *
   * Remove apenas o que foi comprado; o que entrou no carrinho depois fica.
   */
  private clearCart(order: MockOrder): void {
    const bought = new Set(
      order.toSnapshot().items.map((item) => `${item.nftId}:${item.editionId}`),
    )

    /**
     * O carrinho de **quem comprou**. A liquidação é preguiçosa e pode rodar
     * na leitura de outra conta, logada depois no mesmo navegador — pelo
     * carrinho da sessão, a compra de um esvaziaria o carrinho do outro.
     */
    const cart = mockDb.cart.ownedBy(order.ownerId)

    for (const item of [...cart.items]) {
      if (bought.has(`${item.nftId}:${item.editionId}`)) cart.remove(item.id)
    }

    cart.setCoupon(undefined)
    cart.setVersion(cart.version + 1)
    cart.setUpdatedAt(new Date().toISOString())
  }
}

export const orderService = new OrderService()
