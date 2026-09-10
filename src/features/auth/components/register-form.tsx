import { useForm } from 'react-hook-form'
import { Button } from '@/global/components/ui/button'
import { Input } from '@/global/components/ui/input'
import { PasswordInput } from '@/global/components/ui/password-input'
import { useRegister } from '@/global/api/user'
import { AUTH_COPY } from '../constants/auth-copy'
import { AUTH_FIELD_CLASS, AUTH_SUBMIT_CLASS } from '../constants/auth-fields'
import { REGISTER_DEFAULTS, registerResolver } from '../helpers/auth-schema'
import { toAuthErrorMessage } from '../helpers/to-auth-error-message'
import { AuthNotice } from './auth-notice'
import type { RegisterFormValues } from '../helpers/auth-schema'
import type { AuthVariant } from '../constants/auth-fields'
import type { User } from '@/global/api'

type RegisterFormProps = {
  variant?: AuthVariant
  onAuthenticated: (user: User) => void
}

/** O cadastro já entra na conta: a senha acabou de ser escolhida. */
export function RegisterForm({
  variant = 'dialog',
  onAuthenticated,
}: RegisterFormProps) {
  const register = useRegister()

  const form = useForm<RegisterFormValues>({
    resolver: registerResolver,
    defaultValues: REGISTER_DEFAULTS,
    mode: 'onSubmit',
  })

  const { errors } = form.formState

  function handleSubmit(values: RegisterFormValues) {
    register.mutate(values, { onSuccess: onAuthenticated })
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <Input
          {...form.register('username')}
          id="register-username"
          autoComplete="username"
          aria-label={AUTH_COPY.usernamePlaceholder}
          aria-invalid={Boolean(errors.username)}
          placeholder={AUTH_COPY.usernamePlaceholder}
          className={AUTH_FIELD_CLASS[variant]}
        />
        <AuthNotice message={errors.username?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Input
          {...form.register('email')}
          id="register-email"
          type="email"
          autoComplete="email"
          aria-label={AUTH_COPY.registerEmailPlaceholder}
          aria-invalid={Boolean(errors.email)}
          placeholder={AUTH_COPY.registerEmailPlaceholder}
          className={AUTH_FIELD_CLASS[variant]}
        />
        <AuthNotice message={errors.email?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <PasswordInput
          {...form.register('password')}
          id="register-password"
          autoComplete="new-password"
          aria-label={AUTH_COPY.newPasswordPlaceholder}
          aria-invalid={Boolean(errors.password)}
          placeholder={AUTH_COPY.newPasswordPlaceholder}
          className={AUTH_FIELD_CLASS[variant]}
        />
        <AuthNotice message={errors.password?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <PasswordInput
          {...form.register('confirmPassword')}
          id="register-confirm-password"
          autoComplete="new-password"
          aria-label={AUTH_COPY.confirmPasswordPlaceholder}
          aria-invalid={Boolean(errors.confirmPassword)}
          placeholder={AUTH_COPY.confirmPasswordPlaceholder}
          className={AUTH_FIELD_CLASS[variant]}
        />
        <AuthNotice message={errors.confirmPassword?.message} />
      </div>

      <AuthNotice message={toAuthErrorMessage(register.error)} />

      <Button
        type="submit"
        disabled={register.isPending}
        className={AUTH_SUBMIT_CLASS[variant]}
      >
        {register.isPending
          ? AUTH_COPY.registerSubmitting
          : AUTH_COPY.registerSubmit}
      </Button>
    </form>
  )
}
