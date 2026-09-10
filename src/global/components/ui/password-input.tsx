import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from './input'
import { cn } from '@/global/helpers/cn'

type PasswordInputProps = Omit<React.ComponentProps<'input'>, 'type'> & {
  /** Rótulo do botão do olho, que muda com o estado. */
  revealLabel?: string
  hideLabel?: string
}

/**
 * Campo de senha com o olho do frame. O botão é `tabIndex={-1}`: ele não é
 * um passo do preenchimento, e ficar no caminho do Tab entre senha e
 * confirmação atrasaria quem digita sem olhar.
 */
export function PasswordInput({
  className,
  revealLabel = 'Mostrar senha',
  hideLabel = 'Ocultar senha',
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
        tabIndex={-1}
        aria-label={isVisible ? hideLabel : revealLabel}
        aria-pressed={isVisible}
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
