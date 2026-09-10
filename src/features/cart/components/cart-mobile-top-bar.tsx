import { useRouter } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { CART_COPY } from '../constants/cart-copy'

/**
 * Topo da tela no mobile: círculo de voltar à esquerda e o título ao lado,
 * como no frame. Só existe abaixo de `md` — acima disso a tela tem o
 * cabeçalho do site e a trilha de navegação, que o frame mobile não mostra.
 *
 * Voltar usa o histórico, e não uma rota fixa: quem chegou do detalhe do NFT
 * volta para ele, e quem chegou do mercado volta para o mercado.
 */
export function CartMobileTopBar() {
  const router = useRouter()

  return (
    <div className="flex items-center gap-4 md:hidden">
      <button
        type="button"
        aria-label={CART_COPY.mobileBack}
        onClick={() => router.history.back()}
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-card text-brand transition-colors hover:text-highlight"
      >
        <ChevronLeft className="size-5" />
      </button>

      <h1 className="flex-1 text-center text-20 leading-6 font-bold text-text-primary">
        {CART_COPY.mobileTitle}
      </h1>

      {/** Espelha a largura do botão para o título ficar centrado no espaço restante. */}
      <span aria-hidden="true" className="size-11 shrink-0" />
    </div>
  )
}
