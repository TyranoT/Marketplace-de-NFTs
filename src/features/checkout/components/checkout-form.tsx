import { Controller } from 'react-hook-form'
import { Input } from '@/global/components/ui/input'
import { Radio, RadioGroup } from '@/global/components/ui/radio-group'
import { Textarea } from '@/global/components/ui/textarea'
import { ENS_SUFFIXES, NETWORKS, WALLET_TYPES } from '@/global/data'
import { CHECKOUT_COPY } from '../constants/checkout-copy'
import { CheckoutField, fieldProps } from './checkout-field'
import { CheckoutSelect } from './checkout-select'
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
      <CheckoutField
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
      </CheckoutField>

      <CheckoutField
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
      </CheckoutField>

      <CheckoutField
        id="network"
        label={CHECKOUT_COPY.networkLabel}
        required
        error={errors.network?.message}
      >
        <Controller
          name="network"
          control={control}
          render={({ field }) => (
            <CheckoutSelect
              id="network"
              value={field.value}
              options={NETWORKS}
              placeholder={CHECKOUT_COPY.networkPlaceholder}
              error={errors.network?.message}
              onValueChange={field.onChange}
            />
          )}
        />
      </CheckoutField>

      <CheckoutField
        id="profileName"
        label={CHECKOUT_COPY.profileNameLabel}
        required
        error={errors.profileName?.message}
      >
        <Input
          {...register('profileName')}
          {...fieldProps('profileName', errors.profileName?.message)}
        />
      </CheckoutField>

      <CheckoutField
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
      </CheckoutField>

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

      <CheckoutField
        id="walletType"
        label={CHECKOUT_COPY.walletTypeLabel}
        required
        error={errors.walletType?.message}
      >
        <Controller
          name="walletType"
          control={control}
          render={({ field }) => (
            <CheckoutSelect
              id="walletType"
              value={field.value}
              options={WALLET_TYPES}
              placeholder={CHECKOUT_COPY.walletTypePlaceholder}
              error={errors.walletType?.message}
              onValueChange={field.onChange}
            />
          )}
        />
      </CheckoutField>

      <CheckoutField
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
      </CheckoutField>

      <CheckoutField
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
      </CheckoutField>

      <CheckoutField
        id="ensName"
        label={CHECKOUT_COPY.ensNameLabel}
        required
        error={errors.ensName?.message}
      >
        <Controller
          name="ensName"
          control={control}
          render={({ field }) => (
            <CheckoutSelect
              id="ensName"
              value={field.value}
              options={ENS_SUFFIXES}
              placeholder={ENS_SUFFIXES[0].label}
              error={errors.ensName?.message}
              onValueChange={field.onChange}
              className="w-19.5"
            />
          )}
        />
      </CheckoutField>

      <Controller
        name="useAnotherWallet"
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value ? 'yes' : 'no'}
            onValueChange={(next) => field.onChange(next === 'yes')}
            aria-label={CHECKOUT_COPY.useAnotherWalletLabel}
            className="md:col-span-2"
          >
            <label className="flex w-fit cursor-pointer items-center gap-3 text-15 leading-4 text-foreground">
              <Radio value="yes" />
              {CHECKOUT_COPY.useAnotherWalletLabel}
            </label>
          </RadioGroup>
        )}
      />

      <CheckoutField
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
      </CheckoutField>
    </form>
  )
}
