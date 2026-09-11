import { useId } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/global/components/ui/button'
import {
  FormField,
  errorId,
  fieldProps,
} from '@/global/components/ui/form-field'
import { Input } from '@/global/components/ui/input'
import { OptionSelect } from '@/global/components/ui/option-select'
import { ENS_SUFFIXES, NETWORKS, WALLET_TYPES } from '@/global/data'
import { PROFILE_COPY } from '../constants/profile-copy'
import { walletResolver } from '../helpers/wallet-schema'
import { ProfileNotice } from './profile-notice'
import type { WalletFormValues } from '../helpers/wallet-schema'

const GRID = 'grid gap-x-7 gap-y-5 md:grid-cols-2'

type WalletFormProps = {
  defaultValues: WalletFormValues
  isSaving: boolean
  error?: string
  submitLabel?: string
  onSubmit: (values: WalletFormValues) => void
  onCancel?: () => void
}

/**
 * Os dez campos do frame de carteiras — que são os do pagamento mais o
 * apelido. Serve à principal e à secundária: entre elas muda só o papel, que
 * o serviço decide, e não o formulário.
 */
export function WalletForm({
  defaultValues,
  isSaving,
  error,
  submitLabel = PROFILE_COPY.walletSave,
  onSubmit,
  onCancel,
}: WalletFormProps) {
  const form = useForm<WalletFormValues>({
    resolver: walletResolver,
    defaultValues,
    mode: 'onSubmit',
  })

  const { errors } = form.formState

  /**
   * Prefixo único por instância. A tela de carteiras monta dois formulários
   * ao mesmo tempo — o da principal e o rascunho da secundária —, e com ids
   * fixos o rótulo e o erro do segundo apontavam para os campos do primeiro.
   */
  const idPrefix = useId()
  const fid = (name: string) => `${idPrefix}-${name}`

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <div className={GRID}>
        <FormField
          id={fid('displayName')}
          label={PROFILE_COPY.displayNameLabel}
          required
          error={errors.displayName?.message}
        >
          <Input
            {...form.register('displayName')}
            {...fieldProps(fid('displayName'), errors.displayName?.message)}
            autoComplete="name"
          />
        </FormField>

        <FormField
          id={fid('nickname')}
          label={PROFILE_COPY.nicknameLabel}
          required
          error={errors.nickname?.message}
        >
          <Input
            {...form.register('nickname')}
            {...fieldProps(fid('nickname'), errors.nickname?.message)}
            autoComplete="off"
          />
        </FormField>

        <FormField
          id={fid('network')}
          label={PROFILE_COPY.networkLabel}
          required
          error={errors.network?.message}
        >
          <Controller
            name="network"
            control={form.control}
            render={({ field }) => (
              <OptionSelect
                id={fid('network')}
                ref={field.ref}
                onBlur={field.onBlur}
                required
                value={field.value}
                options={NETWORKS}
                placeholder={PROFILE_COPY.networkPlaceholder}
                error={errors.network?.message}
                onValueChange={field.onChange}
              />
            )}
          />
        </FormField>

        <FormField
          id={fid('profileName')}
          label={PROFILE_COPY.profileNameLabel}
          required
          error={errors.profileName?.message}
        >
          <Input
            {...form.register('profileName')}
            {...fieldProps(fid('profileName'), errors.profileName?.message)}
          />
        </FormField>

        <FormField
          id={fid('address')}
          label={PROFILE_COPY.addressLabel}
          required
          error={errors.address?.message}
        >
          <Input
            {...form.register('address')}
            {...fieldProps(fid('address'), errors.address?.message)}
            placeholder={PROFILE_COPY.addressPlaceholder}
            spellCheck={false}
            autoComplete="off"
            className="placeholder:text-brand-muted"
          />
        </FormField>

        {/** No frame este campo não tem rótulo: o placeholder já o descreve. */}
        <div className="flex flex-col justify-end gap-1.5">
          <Input
            {...form.register('secondaryAddress')}
            id={fid('secondaryAddress')}
            aria-label={PROFILE_COPY.secondaryAddressLabel}
            placeholder={PROFILE_COPY.secondaryAddressPlaceholder}
            spellCheck={false}
            autoComplete="off"
            className="placeholder:text-brand-muted"
          />
        </div>

        <FormField
          id={fid('walletType')}
          label={PROFILE_COPY.walletTypeLabel}
          required
          error={errors.walletType?.message}
        >
          <Controller
            name="walletType"
            control={form.control}
            render={({ field }) => (
              <OptionSelect
                id={fid('walletType')}
                ref={field.ref}
                onBlur={field.onBlur}
                required
                value={field.value}
                options={WALLET_TYPES}
                placeholder={PROFILE_COPY.walletTypePlaceholder}
                error={errors.walletType?.message}
                onValueChange={field.onChange}
              />
            )}
          />
        </FormField>

        <FormField
          id={fid('referralCode')}
          label={PROFILE_COPY.referralCodeLabel}
          required
          error={errors.referralCode?.message}
        >
          <Input
            {...form.register('referralCode')}
            {...fieldProps(fid('referralCode'), errors.referralCode?.message)}
            autoComplete="off"
          />
        </FormField>

        <FormField
          id={fid('email')}
          label={PROFILE_COPY.emailLabel}
          required
          error={errors.email?.message}
        >
          <Input
            {...form.register('email')}
            {...fieldProps(fid('email'), errors.email?.message)}
            type="email"
            autoComplete="email"
          />
        </FormField>

        <FormField
          id={fid('ensName')}
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
                  id={fid('ensSuffix')}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  required
                  ariaLabel="Sufixo ENS"
                  errorMessageId={errorId(fid('ensName'))}
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
              {...fieldProps(fid('ensName'), errors.ensName?.message)}
              placeholder={PROFILE_COPY.ensNamePlaceholder}
              autoComplete="off"
            />
          </div>
        </FormField>
      </div>

      <ProfileNotice message={error} />

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={isSaving}
          className="h-11 w-fit px-8 text-15 font-bold"
        >
          {isSaving ? PROFILE_COPY.walletSaving : submitLabel}
        </Button>

        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="text-15 leading-4 text-brand-muted transition-colors hover:text-brand"
          >
            {PROFILE_COPY.cancel}
          </button>
        ) : null}
      </div>
    </form>
  )
}
