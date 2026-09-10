/**
 * As duas molduras da autenticação. O diálogo do desktop tem campos de 48 e
 * cantos suaves; os frames mobile têm campos de 50 e raio bem maior, com o
 * botão de 60. Só a pintura muda — schema, resolver e mensagens são os mesmos.
 */
export type AuthVariant = 'dialog' | 'screen'

export const AUTH_FIELD_CLASS: Record<AuthVariant, string> = {
  dialog:
    'h-12 rounded-md border-line-soft text-14 placeholder:text-brand-muted',
  screen:
    'h-12.5 rounded-2xl border-line-soft px-5 text-15 placeholder:text-brand-muted',
}

export const AUTH_SUBMIT_CLASS: Record<AuthVariant, string> = {
  dialog: 'h-12 w-full text-16 font-bold',
  screen: 'h-15 w-full rounded-2xl text-16 font-bold',
}
