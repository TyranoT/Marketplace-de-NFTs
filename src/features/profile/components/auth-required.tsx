import { useState } from 'react'
import { Button } from '@/global/components/ui/button'
import { AuthDialog } from '@/features/auth'
import { PROFILE_COPY } from '../constants/profile-copy'

/**
 * Quem chega deslogado não é redirecionado: entra pelo modal e continua na
 * página que pediu, com o endereço intacto.
 */
export function AuthRequired() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  return (
    <div className="flex flex-col items-start gap-4 border border-line bg-surface-card p-8">
      <h2 className="text-20 leading-6 font-bold text-text-primary">
        {PROFILE_COPY.authRequiredTitle}
      </h2>

      <p className="max-w-140 text-15 leading-6 text-text-secondary">
        {PROFILE_COPY.authRequiredBody}
      </p>

      <Button
        onClick={() => setIsAuthOpen(true)}
        className="h-11 px-8 text-15 font-bold"
      >
        {PROFILE_COPY.authRequiredCta}
      </Button>

      <AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} />
    </div>
  )
}
