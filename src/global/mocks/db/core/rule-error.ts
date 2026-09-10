/**
 * Veredito de regra do servidor simulado: status HTTP, código de negócio e
 * mensagem nascem juntos. Os handlers capturam este tipo, e cada domínio o
 * estende com as suas fábricas em vez de inventar o próprio formato de erro.
 */
export class RuleError extends Error {
  protected constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'RuleError'
  }
}
