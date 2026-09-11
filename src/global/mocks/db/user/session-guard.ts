import { mockDb } from '../core'
import { GUEST_OWNER } from '../core/guest-owner'
import { UserRuleError } from './user-rule-error'
import type { MockUser } from './mock-user'

/**
 * Porta única da autenticação. Perfil e carteiras passam por aqui antes de
 * qualquer validação de campo: responder "e-mail inválido" a quem nem está
 * logado é contar o que não deveria.
 */
export function requireUser(): MockUser {
  const session = mockDb.session.findFirst()

  if (!session) throw UserRuleError.notAuthenticated()

  const user = mockDb.user.findUnique({ where: { id: session.userId } })

  if (!user) throw UserRuleError.notAuthenticated()

  return user
}

/**
 * De quem são os dados que esta requisição pode ver: o usuário da sessão, ou
 * o visitante. Carrinho e pedidos são filtrados por aqui — antes havia um
 * carrinho só, e quem entrasse numa conta via o carrinho de quem tinha
 * entrado antes.
 */
export function currentOwnerId(): string {
  return mockDb.session.findFirst()?.userId ?? GUEST_OWNER
}
