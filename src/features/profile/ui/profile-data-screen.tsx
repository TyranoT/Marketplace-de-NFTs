import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/global/components/ui/button'
import {
  FormField,
  errorId,
  fieldProps,
} from '@/global/components/ui/form-field'
import { Input } from '@/global/components/ui/input'
import { OptionSelect } from '@/global/components/ui/option-select'
import { ENS_SUFFIXES } from '@/global/data'
import { useChangePassword, useMe, useUpdateProfile } from '@/global/api/user'
import { PROFILE_COPY } from '../constants/profile-copy'
import {
  EMPTY_PASSWORDS,
  hasPasswordChange,
  profileResolver,
} from '../helpers/profile-schema'
import { toProfileErrorMessage } from '../helpers/to-profile-error-message'
import { AvatarField } from '../components/avatar-field'
import { PasswordSection } from '../components/password-section'
import { ProfileNotice } from '../components/profile-notice'
import type { ProfileFormValues } from '../helpers/profile-schema'
import type { User } from '@/global/api'

const GRID = 'grid gap-x-7 gap-y-5 md:grid-cols-2'

/** O `key` no formulário garante os valores do servidor como ponto de partida. */
/**
 * O retorno de salvar mora aqui, e não no formulário.
 *
 * O formulário é remontado a cada versão do usuário (`key`), para nascer
 * com os valores salvos. Com o estado e as mutations dentro dele, salvar
 * remontava tudo e apagava a própria resposta: "Perfil atualizado." e "A
 * senha atual não confere." sumiam antes de alguém ler. O teste de perfil
 * é que mostrou.
 */
export function ProfileDataScreen() {
  const me = useMe()
  const updateProfile = useUpdateProfile()
  const changePassword = useChangePassword()
  const [status, setStatus] = useState<string>()

  if (!me.data) return null

  return (
    <ProfileDataForm
      key={me.data.updatedAt}
      user={me.data}
      feedback={{ updateProfile, changePassword, status, setStatus }}
    />
  )
}

type ProfileFeedback = {
  updateProfile: ReturnType<typeof useUpdateProfile>
  changePassword: ReturnType<typeof useChangePassword>
  status: string | undefined
  setStatus: (status: string | undefined) => void
}

function ProfileDataForm({
  user,
  feedback,
}: {
  user: User
  feedback: ProfileFeedback
}) {
  const { updateProfile, changePassword, status, setStatus } = feedback

  const form = useForm<ProfileFormValues>({
    resolver: profileResolver,
    mode: 'onSubmit',
    defaultValues: {
      displayName: user.displayName,
      username: user.username,
      email: user.email,
      ensName: user.ensName,
      ensSuffix: user.ensSuffix,
      primaryWalletNickname: user.primaryWalletNickname ?? '',
      ...EMPTY_PASSWORDS,
    },
  })

  const { errors } = form.formState
  const isSaving = updateProfile.isPending || changePassword.isPending

  /**
   * Um botão, dois pedidos: o perfil sempre, a senha só quando o trio veio.
   * A ordem importa — se a senha falhar, o perfil já está salvo, e a mensagem
   * diz isso em vez de deixar a pessoa salvando de novo.
   */
  async function handleSubmit(values: ProfileFormValues) {
    setStatus(undefined)

    await updateProfile.mutateAsync({
      displayName: values.displayName,
      username: values.username,
      email: values.email,
      ensName: values.ensName,
      ensSuffix: values.ensSuffix,
      primaryWalletNickname: values.primaryWalletNickname,
    })

    if (!hasPasswordChange(values)) {
      setStatus(PROFILE_COPY.saved)

      return
    }

    try {
      await changePassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      })

      form.reset({ ...values, ...EMPTY_PASSWORDS })
      setStatus(PROFILE_COPY.savedWithPassword)
    } catch {
      setStatus(PROFILE_COPY.savedButPasswordFailed)
    }
  }

  return (
    <section aria-labelledby="profile-data" className="flex flex-col gap-6">
      <h1
        id="profile-data"
        className="text-17 leading-4 font-bold text-text-primary"
      >
        {PROFILE_COPY.dataHeading}
      </h1>

      <form
        noValidate
        onSubmit={(event) => void form.handleSubmit(handleSubmit)(event)}
        className="flex flex-col gap-6"
      >
        <div className={GRID}>
          <FormField
            id="displayName"
            label={PROFILE_COPY.displayNameLabel}
            required
            error={errors.displayName?.message}
          >
            <Input
              {...form.register('displayName')}
              {...fieldProps('displayName', errors.displayName?.message)}
              autoComplete="name"
            />
          </FormField>

          <FormField
            id="username"
            label={PROFILE_COPY.usernameLabel}
            required
            error={errors.username?.message}
          >
            <Input
              {...form.register('username')}
              {...fieldProps('username', errors.username?.message)}
              autoComplete="username"
            />
          </FormField>

          <FormField
            id="email"
            label={PROFILE_COPY.emailLabel}
            required
            error={errors.email?.message}
          >
            <Input
              {...form.register('email')}
              {...fieldProps('email', errors.email?.message)}
              type="email"
              autoComplete="email"
            />
          </FormField>

          {/** ENS é sufixo e nome lado a lado, como no frame. */}
          <FormField
            id="ensName"
            label={PROFILE_COPY.ensLabel}
            required
            error={errors.ensSuffix?.message ?? errors.ensName?.message}
          >
            <div className="flex gap-3">
              <Controller
                name="ensSuffix"
                control={form.control}
                render={({ field }) => (
                  <OptionSelect
                    id="ensSuffix"
                    ref={field.ref}
                    onBlur={field.onBlur}
                    required
                    ariaLabel="Sufixo ENS"
                    errorMessageId={errorId('ensName')}
                    value={field.value}
                    options={ENS_SUFFIXES}
                    placeholder={ENS_SUFFIXES[0].label}
                    error={errors.ensSuffix?.message}
                    onValueChange={field.onChange}
                    className="w-24 shrink-0"
                  />
                )}
              />

              <Input
                {...form.register('ensName')}
                {...fieldProps('ensName', errors.ensName?.message)}
                placeholder={PROFILE_COPY.ensNamePlaceholder}
                autoComplete="off"
              />
            </div>
          </FormField>

          <FormField
            id="primaryWalletNickname"
            label={PROFILE_COPY.walletNicknameLabel}
            error={errors.primaryWalletNickname?.message}
          >
            <Input
              {...form.register('primaryWalletNickname')}
              {...fieldProps(
                'primaryWalletNickname',
                errors.primaryWalletNickname?.message,
              )}
              autoComplete="off"
            />
          </FormField>

          <AvatarField avatarUrl={user.avatarUrl} />
        </div>

        <PasswordSection form={form} />

        <ProfileNotice message={toProfileErrorMessage(updateProfile.error)} />

        {/**
         * O motivo fica mesmo quando o perfil foi salvo: "a senha não mudou"
         * sem dizer por quê deixa a pessoa tentando no escuro.
         */}
        <ProfileNotice message={toProfileErrorMessage(changePassword.error)} />

        <ProfileNotice
          message={status}
          tone={
            status === PROFILE_COPY.savedButPasswordFailed ? 'error' : 'success'
          }
        />

        <Button
          type="submit"
          disabled={isSaving}
          className="h-11 w-fit px-10 text-15 font-bold"
        >
          {isSaving ? PROFILE_COPY.saving : PROFILE_COPY.save}
        </Button>
      </form>
    </section>
  )
}
