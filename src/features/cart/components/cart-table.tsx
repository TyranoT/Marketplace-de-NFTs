import { CART_COPY } from '../constants/cart-copy'
import { CART_COLUMN_WIDTHS } from '../constants/cart-layout'
import { CartTableRow } from './cart-table-row'
import type { CartItem } from '@/global/api'

type CartTableProps = {
  items: Array<CartItem>
  pendingItemId?: string
  registerRemoveButton: (
    itemId: string,
    element: HTMLButtonElement | null,
  ) => void
  onQuantityChange: (itemId: string, quantity: number) => void
  onRemove: (item: CartItem) => void
}

/**
 * Tabela de verdade, e não uma lista estilizada: o frame tem quatro colunas
 * rotuladas, e sem `<th scope="col">` um leitor de tela anuncia "1.19 ETH"
 * sem dizer que aquilo é o preço.
 *
 * `border-spacing-y-3` produz o intervalo de 12px entre os cards. O `-my-3`
 * que o acompanha é obrigatório: o espaçamento também é aplicado acima da
 * primeira linha e abaixo da última, o que empurraria o cabeçalho e desfaria
 * o alinhamento com o "Resumo da carteira" ao lado.
 *
 * Só a partir de `lg`: as colunas foram medidas para os 782px que a coluna
 * esquerda tem em 1440, e é nessa largura que o grid passa a duas colunas.
 * Espremida em tablet, ela trunca os nomes e quebra o ID em duas linhas —
 * ali a lista empilhada lê melhor.
 */
export function CartTable({
  items,
  pendingItemId,
  registerRemoveButton,
  onQuantityChange,
  onRemove,
}: CartTableProps) {
  return (
    <table className="hidden w-full table-fixed border-separate -my-3 border-spacing-y-3 lg:table">
      <colgroup>
        {/** Índice como chave: as larguras se repetem e a ordem é fixa. */}
        {CART_COLUMN_WIDTHS.map((width, index) => (
          <col key={index} style={{ width }} />
        ))}
      </colgroup>

      <thead>
        <tr className="[&>th]:border-b [&>th]:border-primary/60 [&>th]:pb-2.5 [&>th]:text-left [&>th]:text-17 [&>th]:leading-4 [&>th]:font-normal [&>th]:text-foreground">
          <th scope="col" colSpan={2}>
            {CART_COPY.columnNfts}
          </th>
          <th scope="col">{CART_COPY.columnPrice}</th>
          <th scope="col">{CART_COPY.columnEditions}</th>
          <th scope="col">{CART_COPY.columnTotal}</th>
          <th scope="col">
            <span className="sr-only">{CART_COPY.columnActions}</span>
          </th>
        </tr>
      </thead>

      <tbody>
        {items.map((item) => (
          <CartTableRow
            key={item.id}
            item={item}
            isPending={pendingItemId === item.id}
            registerRemoveButton={registerRemoveButton}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
          />
        ))}
      </tbody>
    </table>
  )
}
