import { Button } from '@/global/components/ui/button'
import { FacebookIcon, GoogleIcon } from '@/global/components/icons'
import { AUTH_COPY } from '../constants/auth-copy'

type AuthProvidersProps = {
  onUnavailable: (message: string) => void
}

/**
 * Os dois provedores do frame ficam visíveis, e não escondidos: são parte do
 * desenho. Mas não fingem funcionar — o clique explica que autenticação
 * externa exige um servidor de identidade real, em vez de simular uma sessão
 * que ninguém autorizou.
 */
export function AuthProviders({ onUnavailable }: AuthProvidersProps) {
  function handleClick() {
    onUnavailable(AUTH_COPY.providerUnavailable)
  }

  return (
    <div className="flex flex-col gap-3">
      <Button variant="social" onClick={handleClick}>
        <GoogleIcon />
        {AUTH_COPY.google}
      </Button>

      <Button variant="social" onClick={handleClick}>
        <FacebookIcon />
        {AUTH_COPY.facebook}
      </Button>
    </div>
  )
}
