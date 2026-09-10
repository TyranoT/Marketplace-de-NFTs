import { useRouter } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/global/helpers/cn'

type MobileTopBarProps = {
  title: string
  backLabel?: string
  className?: string
}

/**
 * Topo das telas de mobile: círculo de voltar à esquerda e o título ao lado,
 * como nos frames de carrinho e pagamento. Só existe abaixo de `md` — acima
 * disso as telas têm o cabeçalho do site e a trilha de navegação, que os
 * frames mobile não mostram.
 *
 * Voltar usa o histórico, e não uma rota fixa: quem chegou do detalhe do NFT
 * volta para ele, e quem chegou do mercado volta para o mercado.
 */
export function MobileTopBar({
  title,
  backLabel = 'Voltar',
  className,
}: MobileTopBarProps) {
  const router = useRouter()

  return (
    <div className={cn('mt-4 flex items-center gap-4 md:hidden', className)}>
      <button
        type="button"
        aria-label={backLabel}
        onClick={() => router.history.back()}
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-card text-brand transition-colors hover:text-highlight"
      >
        <ChevronLeft className="size-5" />
      </button>

      <h1 className="flex-1 text-center text-20 leading-6 font-bold text-text-primary">
        {title}
      </h1>

      {/** Espelha a largura do botão para o título ficar centrado no espaço restante. */}
      <span aria-hidden="true" className="size-11 shrink-0" />
    </div>
  )
}
