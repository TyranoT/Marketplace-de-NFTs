export function buildCartLabel(cartCount: number) {
  const noun = cartCount === 1 ? 'item' : 'itens'
  return `Carrinho com ${cartCount} ${noun}`
}
