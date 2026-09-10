import { mockDb } from '../core'
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
