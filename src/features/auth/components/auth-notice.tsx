type AuthNoticeProps = {
  /** Para o campo apontar para a mensagem com `aria-describedby`. */
  id?: string
  message?: string
  tone?: 'error' | 'info'
}

/**
 * Mensagem única do modal, seja veredito do servidor ou limite declarado da
 * demonstração. `role="status"` para o aviso e `role="alert"` para o erro: um
 * informa, o outro interrompe.
 */
export function AuthNotice({ id, message, tone = 'error' }: AuthNoticeProps) {
  if (!message) return null

  return (
    <p
      id={id}
      role={tone === 'error' ? 'alert' : 'status'}
      className={
        tone === 'error'
          ? 'text-13 leading-4 text-destructive'
          : 'text-13 leading-4 text-brand-muted'
      }
    >
      {message}
    </p>
  )
}
