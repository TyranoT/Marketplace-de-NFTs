import type { FieldErrors, FieldValues, Resolver } from 'react-hook-form'
import type { ZodType } from 'zod'

/**
 * Resolver de zod escrito à mão. `@hookform/resolvers` declara peer de zod 3
 * por causa de `@typeschema` e conflita com o zod 4 que já está na árvore via
 * `@tanstack/router-generator`. Entre forçar `--legacy-peer-deps` no projeto
 * inteiro e escrever esta função, a função custa menos e não mente sobre a
 * árvore de dependências.
 *
 * Guarda só o primeiro problema de cada campo: é o que o formulário mostra, e
 * empilhar dois avisos no mesmo lugar não ajuda quem está corrigindo.
 */
export function buildZodResolver<TValues extends FieldValues>(
  schema: ZodType<TValues>,
): Resolver<TValues> {
  return (values) => {
    const parsed = schema.safeParse(values)

    if (parsed.success) return { values: parsed.data, errors: {} }

    const errors: Record<string, { type: string; message: string }> = {}

    for (const issue of parsed.error.issues) {
      const field = issue.path.join('.')

      errors[field] ??= { type: issue.code, message: issue.message }
    }

    return { values: {}, errors: errors as FieldErrors<TValues> }
  }
}
