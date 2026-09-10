import { toTokenId } from '@/global/data/to-token-id'
import { CART_COPY } from '../constants/cart-copy'

type CartItemIdentityProps = {
  name: string
}

/**
 * Nome e identificação do token. O frame do Figma mostra IDs que não batem
 * com o número do próprio NFT (`#0009` para o `#314`); aqui vale `toTokenId`,
 * a mesma fonte usada nos metadados do detalhe.
 */
export function CartItemIdentity({ name }: CartItemIdentityProps) {
  const tokenId = toTokenId(name)

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <p className="truncate text-16 leading-5 font-bold text-text-primary">
        {name}
      </p>

      {tokenId ? (
        <p className="text-13 leading-4 text-text-secondary">
          {CART_COPY.tokenIdLabel} {tokenId}
        </p>
      ) : null}
    </div>
  )
}
