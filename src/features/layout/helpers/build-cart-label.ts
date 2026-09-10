/**
 * `undefined` enquanto a contagem não chegou do servidor — no primeiro quadro
 * do cabeçalho ela é desconhecida, e afirmar "0 itens" seria informação falsa
 * para quem usa leitor de tela.
 */
export function buildCartLabel(cartCount?: number) {
  if (cartCount === undefined) return 'Carrinho'

  const noun = cartCount === 1 ? 'item' : 'itens'

  return `Carrinho com ${cartCount} ${noun}`
}
