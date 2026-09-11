import { cn } from '@/global/helpers/cn'

/** Destino do "Pular para o conteúdo" e do foco ao trocar de página. */
export const MAIN_CONTENT_ID = 'conteudo'

type ContainerProps = React.ComponentProps<'div'> & {
  as?: 'div' | 'header' | 'footer' | 'main' | 'section' | 'nav'
}

/**
 * Como `main`, vira o alvo do skip link: `id` conhecido e `tabIndex={-1}`,
 * para receber foco por programa sem entrar na ordem do Tab. O contorno de
 * foco some só aqui — é o landmark inteiro, não um controle, e um anel em
 * volta da página toda seria ruído.
 */
export function Container({
  as: Tag = 'div',
  className,
  ...props
}: ContainerProps) {
  const isMain = Tag === 'main'

  return (
    <Tag
      id={isMain ? MAIN_CONTENT_ID : undefined}
      tabIndex={isMain ? -1 : undefined}
      className={cn(
        'mx-auto w-full max-w-312 px-6',
        isMain && 'outline-none',
        className,
      )}
      {...props}
    />
  )
}
