import { Trash2 } from 'lucide-react'
import { buildRemoveLabel } from '../constants/cart-copy'

type CartRemoveButtonProps = {
  name: string
  disabled?: boolean
  buttonRef?: (element: HTMLButtonElement | null) => void
  onRemove: () => void
}

export function CartRemoveButton({
  name,
  disabled = false,
  buttonRef,
  onRemove,
}: CartRemoveButtonProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={buildRemoveLabel(name)}
      disabled={disabled}
      onClick={onRemove}
      className="inline-flex size-10 items-center justify-center rounded-md text-brand-muted transition-colors hover:text-highlight disabled:opacity-50"
    >
      <Trash2 className="size-5" />
    </button>
  )
}
