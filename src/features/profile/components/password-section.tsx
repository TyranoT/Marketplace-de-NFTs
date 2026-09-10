import { PasswordInput } from '@/global/components/ui/password-input'
import { FormField, fieldProps } from '@/global/components/ui/form-field'
import { PROFILE_COPY } from '../constants/profile-copy'
import type { UseFormReturn } from 'react-hook-form'
import type { ProfileFormValues } from '../helpers/profile-schema'

type PasswordSectionProps = {
  form: UseFormReturn<ProfileFormValues>
}

const FIELDS = [
  {
    name: 'currentPassword',
    label: PROFILE_COPY.currentPasswordLabel,
    autoComplete: 'current-password',
  },
  {
    name: 'newPassword',
    label: PROFILE_COPY.newPasswordLabel,
    autoComplete: 'new-password',
  },
  {
    name: 'confirmPassword',
    label: PROFILE_COPY.confirmPasswordLabel,
    autoComplete: 'new-password',
  },
] as const

/** Vazio é o caso normal: só é enviado quando os três campos vêm juntos. */
export function PasswordSection({ form }: PasswordSectionProps) {
  const { errors } = form.formState

  return (
    <section aria-labelledby="profile-password" className="flex flex-col gap-5">
      <h3
        id="profile-password"
        className="text-17 leading-4 font-bold text-text-primary"
      >
        {PROFILE_COPY.passwordHeading}
      </h3>

      {FIELDS.map((field) => (
        <FormField
          key={field.name}
          id={field.name}
          label={field.label}
          error={errors[field.name]?.message}
          className="md:max-w-104"
        >
          <PasswordInput
            {...form.register(field.name)}
            {...fieldProps(field.name, errors[field.name]?.message)}
            autoComplete={field.autoComplete}
          />
        </FormField>
      ))}
    </section>
  )
}
