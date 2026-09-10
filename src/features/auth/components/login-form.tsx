import { useForm } from 'react-hook-form'
import { Button } from '@/global/components/ui/button'
import { Input } from '@/global/components/ui/input'
import { PasswordInput } from '@/global/components/ui/password-input'
import { useLogin } from '@/global/api/user'
import { cn } from '@/global/helpers/cn'
import { AUTH_COPY } from '../constants/auth-copy'
import { AUTH_FIELD_CLASS, AUTH_SUBMIT_CLASS } from '../constants/auth-fields'
import { LOGIN_DEFAULTS, loginResolver } from '../helpers/auth-schema'
import { toAuthErrorMessage } from '../helpers/to-auth-error-message'
import { AuthNotice } from './auth-notice'
import type { LoginFormValues } from '../helpers/auth-schema'
import type { AuthVariant } from '../constants/auth-fields'
import type { User } from '@/global/api'

type LoginFormProps = {
  variant?: AuthVariant
  onAuthenticated: (user: User) => void
  onUnavailable: (message: string) => void
}

export function LoginForm({
  variant = 'dialog',
  onAuthenticated,
  onUnavailable,
}: LoginFormProps) {
  const login = useLogin()

  const form = useForm<LoginFormValues>({
    resolver: loginResolver,
    defaultValues: LOGIN_DEFAULTS,
    mode: 'onSubmit',
  })

  const { errors } = form.formState

  function handleSubmit(values: LoginFormValues) {
    login.mutate(values, { onSuccess: onAuthenticated })
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <Input
          {...form.register('email')}
          id="login-email"
          type="email"
          autoComplete="email"
          aria-label={AUTH_COPY.loginTab}
          aria-invalid={Boolean(errors.email)}
          placeholder={AUTH_COPY.emailPlaceholder}
          className={AUTH_FIELD_CLASS[variant]}
        />
        <AuthNotice message={errors.email?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <PasswordInput
          {...form.register('password')}
          id="login-password"
          autoComplete="current-password"
          aria-label="Senha"
          aria-invalid={Boolean(errors.password)}
          placeholder={AUTH_COPY.passwordPlaceholder}
          className={cn(AUTH_FIELD_CLASS[variant], 'tracking-widest')}
        />
        <AuthNotice message={errors.password?.message} />
      </div>

      <button
        type="button"
        onClick={() => onUnavailable(AUTH_COPY.forgotPasswordUnavailable)}
        className="self-end text-13 leading-4 text-brand-muted transition-colors hover:text-brand"
      >
        {AUTH_COPY.forgotPassword}
      </button>

      <AuthNotice message={toAuthErrorMessage(login.error)} />

      <Button
        type="submit"
        disabled={login.isPending}
        className={AUTH_SUBMIT_CLASS[variant]}
      >
        {login.isPending ? AUTH_COPY.loginSubmitting : AUTH_COPY.loginSubmit}
      </Button>
    </form>
  )
}
