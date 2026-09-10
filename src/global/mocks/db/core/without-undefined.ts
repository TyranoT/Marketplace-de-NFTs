/**
 * Semântica de `PATCH`: campo ausente não apaga o que existe. Passa a limpo
 * um objeto de mudanças descartando o que veio `undefined`, para que o
 * `Object.assign` do modelo não sobrescreva valor bom com vazio.
 */
export function withoutUndefined<TSource extends object>(
  source: TSource,
): Partial<TSource> {
  const entries = Object.entries(source) as Array<
    [keyof TSource, TSource[keyof TSource] | undefined]
  >

  return Object.fromEntries(
    entries.filter(([, value]) => value !== undefined),
  ) as Partial<TSource>
}
