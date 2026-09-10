import { Controller } from 'react-hook-form'
import { Input } from '@/global/components/ui/input'
import { Textarea } from '@/global/components/ui/textarea'
import { ENS_SUFFIXES, NETWORKS, WALLET_TYPES } from '@/global/data'
import { CHECKOUT_COPY } from '../constants/checkout-copy'
import { FormField, fieldProps } from '@/global/components/ui/form-field'
import { OptionSelect } from '@/global/components/ui/option-select'
import { CheckoutToggle } from './checkout-toggle'
import type { UseFormReturn } from 'react-hook-form'
import type { CheckoutFormValues } from '../helpers/checkout-schema'

type CheckoutFormProps = {
  id: string
  form: UseFormReturn<CheckoutFormValues>
  onSubmit: () => void
}

/**
 * Duas sub-colunas de 369 com 24 de gap, medidas no frame de 1440. A ordem
 * dos campos segue o desenho: o par de carteiras ocupa uma linha inteira,
 * porque a secundária não tem rótulo próprio.
 */
export function CheckoutForm({ id, form, onSubmit }: CheckoutFormProps) {
  const { register, control, formState } = form
  const { errors } = formState

  return (
    <form
      id={id}
      noValidate
      onSubmit={onSubmit}
      className="grid gap-x-6 gap-y-5 md:grid-cols-2"
    >
      <FormField
        id="displayName"
        label={CHECKOUT_COPY.displayNameLabel}
        required
        error={errors.displayName?.message}
      >
        <Input
          {...register('displayName')}
          {...fieldProps('displayName', errors.displayName?.message)}
          autoComplete="name"
        />
      </FormField>

      <FormField
        id="username"
        label={CHECKOUT_COPY.usernameLabel}
        required
        error={errors.username?.message}
      >
        <Input
          {...register('username')}
          {...fieldProps('username', errors.username?.message)}
          autoComplete="username"
        />
      </FormField>

      <FormField
        id="network"
        label={CHECKOUT_COPY.networkLabel}
        required
        error={errors.network?.message}
      >
        <Controller
          name="network"
          control={control}
          render={({ field }) => (
            <OptionSelect
              id="network"
              value={field.value}
              options={NETWORKS}
              placeholder={CHECKOUT_COPY.networkPlaceholder}
              error={errors.network?.message}
              onValueChange={field.onChange}
            />
          )}
        />
      </FormField>

      <FormField
        id="profileName"
        label={CHECKOUT_COPY.profileNameLabel}
        required
        error={errors.profileName?.message}
      >
        <Input
          {...register('profileName')}
          {...fieldProps('profileName', errors.profileName?.message)}
        />
      </FormField>

      <FormField
        id="walletAddress"
        label={CHECKOUT_COPY.walletAddressLabel}
        required
        error={errors.walletAddress?.message}
      >
        <Input
          {...register('walletAddress')}
          {...fieldProps('walletAddress', errors.walletAddress?.message)}
          placeholder={CHECKOUT_COPY.walletAddressPlaceholder}
          spellCheck={false}
          autoComplete="off"
          className="placeholder:text-brand-muted"
        />
      </FormField>

      {/** No frame este campo não tem rótulo: o placeholder já o descreve. */}
      <div className="flex flex-col justify-end gap-1.5">
        <Input
          {...register('secondaryWallet')}
          id="secondaryWallet"
          aria-label={CHECKOUT_COPY.secondaryWalletLabel}
          placeholder={CHECKOUT_COPY.secondaryWalletPlaceholder}
          spellCheck={false}
          autoComplete="off"
          className="placeholder:text-brand-muted"
        />
      </div>

      <FormField
        id="walletType"
        label={CHECKOUT_COPY.walletTypeLabel}
        required
        error={errors.walletType?.message}
      >
        <Controller
          name="walletType"
          control={control}
          render={({ field }) => (
            <OptionSelect
              id="walletType"
              value={field.value}
              options={WALLET_TYPES}
              placeholder={CHECKOUT_COPY.walletTypePlaceholder}
              error={errors.walletType?.message}
              onValueChange={field.onChange}
            />
          )}
        />
      </FormField>

      <FormField
        id="referralCode"
        label={CHECKOUT_COPY.referralCodeLabel}
        required
        error={errors.referralCode?.message}
      >
        <Input
          {...register('referralCode')}
          {...fieldProps('referralCode', errors.referralCode?.message)}
          autoComplete="off"
        />
      </FormField>

      <FormField
        id="email"
        label={CHECKOUT_COPY.emailLabel}
        required
        error={errors.email?.message}
      >
        <Input
          {...register('email')}
          {...fieldProps('email', errors.email?.message)}
          type="email"
          autoComplete="email"
        />
      </FormField>

      <FormField
        id="ensSuffix"
        label={CHECKOUT_COPY.ensNameLabel}
        required
        error={errors.ensSuffix?.message}
      >
        <Controller
          name="ensSuffix"
          control={control}
          render={({ field }) => (
            <OptionSelect
              id="ensSuffix"
              value={field.value}
              options={ENS_SUFFIXES}
              placeholder={ENS_SUFFIXES[0].label}
              error={errors.ensSuffix?.message}
              onValueChange={field.onChange}
              className="w-19.5"
            />
          )}
        />
      </FormField>

      <Controller
        name="useAnotherWallet"
        control={control}
        render={({ field }) => (
          <CheckoutToggle
            id="useAnotherWallet"
            label={CHECKOUT_COPY.useAnotherWalletLabel}
            checked={field.value}
            onCheckedChange={field.onChange}
            className="md:col-span-2"
          />
        )}
      />

      <FormField
        id="note"
        label={CHECKOUT_COPY.noteLabel}
        className="md:col-span-2"
      >
        <Textarea
          {...register('note')}
          id="note"
          rows={6}
          className="md:max-w-87.5"
        />
      </FormField>
    </form>
  )
}
