/**
 * Colunas da tabela, medidas no frame Desktop/Carrinho (1440) sobre os 782px
 * da coluna esquerda: miniatura 70 · identidade 241 · preço 136 · edições 138
 * · total 138 · remover 59.
 *
 * Os offsets resultantes — 311, 447 e 585 a partir da borda — são os mesmos
 * dos rótulos do cabeçalho, e é por isso que cabeçalho e linhas compartilham
 * este `colgroup` em vez de cada um declarar as próprias larguras.
 */
export const CART_COLUMN_WIDTHS = [
  '70px',
  'auto',
  '136px',
  '138px',
  '138px',
  '59px',
]

/** Altura do card de item no frame. */
export const CART_ROW_HEIGHT = 'h-17.5'

/** Quantas linhas o esqueleto desenha quando não há contagem em cache. */
export const CART_SKELETON_ROWS = 3
