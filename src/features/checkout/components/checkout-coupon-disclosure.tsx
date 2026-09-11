import { useId, useState } from 'react'
import { CartCouponForm } from '@/features/cart'
import { CHECKOUT_COPY } from '../constants/checkout-copy'

type CheckoutCouponDisclosureProps = {
  error?: string
  isApplying: boolean
  onApply: (code: string) => void
}

/**
 * No frame o cupom é só um convite em texto. O campo aparece sob demanda:
 * quem chegou ao pagamento em geral já aplicou o desconto no carrinho.
 *
 * O botão fica montado e diz se o campo está aberto (`aria-expanded`). Antes
 * ele era trocado pelo formulário: o foco, que estava nele, caía no
 * `<body>`, e não havia como fechar. Agora o campo recebe o foco ao abrir e
 * o mesmo botão fecha.
 */
export function CheckoutCouponDisclosure({
  error,
  isApplying,
  onApply,
}: CheckoutCouponDisclosureProps) {
  const [isOpen, setIsOpen] = useState(false)
  const regionId = useId()

  return (
    <div className="flex flex-col gap-3">
      <p className="text-center text-14 leading-4 text-foreground">
        {CHECKOUT_COPY.couponPrompt}{' '}
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={regionId}
          onClick={() => setIsOpen((open) => !open)}
          className="text-brand underline underline-offset-2 hover:text-highlight"
        >
          {isOpen ? CHECKOUT_COPY.couponClose : CHECKOUT_COPY.couponAction}
        </button>
      </p>

      <div id={regionId} hidden={!isOpen}>
        {isOpen ? (
          <CartCouponForm
            autoFocus
            error={error}
            isApplying={isApplying}
            onApply={onApply}
          />
        ) : null}
      </div>
    </div>
  )
}
