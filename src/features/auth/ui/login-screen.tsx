import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AUTH_COPY } from '../constants/auth-copy'
import { LoginForm } from '../components/login-form'
import { AuthScreen } from './auth-screen'
import type { LinkProps } from '@tanstack/react-router'

type LoginScreenProps = {
  /** Para onde ir depois de entrar. Já validado pela rota. */
  redirectTo: LinkProps['to']
}

export function LoginScreen({ redirectTo }: LoginScreenProps) {
  const navigate = useNavigate()
  const [notice, setNotice] = useState<string>()

  return (
    <AuthScreen
      title={AUTH_COPY.loginTab}
      footerQuestion={AUTH_COPY.newHere}
      footerAction={AUTH_COPY.createAccount}
      footerTo="/criar-conta"
      notice={notice}
      onUnavailable={setNotice}
    >
      <LoginForm
        variant="screen"
        onAuthenticated={() => void navigate({ to: redirectTo })}
        onUnavailable={setNotice}
      />
    </AuthScreen>
  )
}
