import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AUTH_COPY } from '../constants/auth-copy'
import { RegisterForm } from '../components/register-form'
import { AuthScreen } from './auth-screen'
import type { LinkProps } from '@tanstack/react-router'

type RegisterScreenProps = {
  redirectTo: LinkProps['to']
}

/** Criar conta já inicia a sessão: a tela seguinte é o destino, não o login. */
export function RegisterScreen({ redirectTo }: RegisterScreenProps) {
  const navigate = useNavigate()
  const [notice, setNotice] = useState<string>()

  return (
    <AuthScreen
      title={AUTH_COPY.registerTitle}
      footerQuestion={AUTH_COPY.alreadyHaveAccount}
      footerAction={AUTH_COPY.loginTab}
      footerTo="/entrar"
      notice={notice}
      onUnavailable={setNotice}
    >
      <RegisterForm
        variant="screen"
        onAuthenticated={() => void navigate({ to: redirectTo })}
      />
    </AuthScreen>
  )
}
