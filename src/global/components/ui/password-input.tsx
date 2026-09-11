import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from './input'
import { cn } from '@/global/helpers/cn'

type PasswordInputProps = Omit<React.ComponentProps<'input'>, 'type'> & {
  revealLabel?: string
}

/**
 * Campo de senha com o olho do frame.
 *
 * O botão fica **no caminho do Tab**. Antes era `tabIndex={-1}`, com a ideia
 * de não atrasar quem digita sem olhar — mas isso deixava a função
 * inalcançável para quem só usa teclado, que é justamente quem mais precisa
 * conferir o que digitou.
 *
 * O rótulo é fixo e o estado vai em `aria-pressed`. Trocar o rótulo junto
 * com o estado fazia o leitor anunciar "Ocultar senha, pressionado": dois
 * sinais para a mesma coisa, que se contradizem.
 */
export function PasswordInput({
  className,
  revealLabel = 'Mostrar senha',
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        {...props}
        type={isVisible ? 'text' : 'password'}
        className={cn('pr-11', className)}
      />

      <button
        type="button"
        aria-label={revealLabel}
        aria-pressed={isVisible}
        aria-controls={props.id}
        onClick={() => setIsVisible((visible) => !visible)}
        className="absolute inset-y-0 right-3 flex items-center text-brand-muted transition-colors hover:text-brand"
      >
        {isVisible ? (
          <Eye className="size-4.5" />
        ) : (
          <EyeOff className="size-4.5" />
        )}
      </button>
    </div>
  )
}
