import { Checkbox } from '@/global/components/ui/checkbox'
import { useState } from 'react'
import { Skeleton } from '@/global/components/ui/skeleton'
import {
  useCreateWallet,
  useDeleteWallet,
  useMe,
  useUpdateWallet,
  useWallets,
} from '@/global/api/user'
import { PROFILE_COPY } from '../constants/profile-copy'
import {
  emptyWalletValues,
  toWalletFormValues,
  toWalletInput,
} from '../helpers/wallet-schema'
import { toProfileErrorMessage } from '../helpers/to-profile-error-message'
import { ProfileNotice } from '../components/profile-notice'
import { SecondaryWalletCard } from '../components/secondary-wallet-card'
import { WalletForm } from '../components/wallet-form'
import type { WalletFormValues } from '../helpers/wallet-schema'
import type { User, Wallet } from '@/global/api'

/** `undefined` = nenhum formulário de secundária aberto. */
type SecondaryDraft = { walletId?: string; values: WalletFormValues }

export function ProfileWalletsScreen() {
  const me = useMe()
  const wallets = useWallets()

  if (!me.data) return null

  if (wallets.isPending) {
    return (
      <div className="flex flex-col gap-5">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-100 w-full" />
      </div>
    )
  }

  return (
    <WalletsPanels
      user={me.data}
      wallets={wallets.data ?? []}
      error={toProfileErrorMessage(wallets.error)}
    />
  )
}

type WalletsPanelsProps = {
  user: User
  wallets: Array<Wallet>
  error?: string
}

function WalletsPanels({ user, wallets, error }: WalletsPanelsProps) {
  const createWallet = useCreateWallet()
  const updateWallet = useUpdateWallet()
  const deleteWallet = useDeleteWallet()

  const [draft, setDraft] = useState<SecondaryDraft>()
  const [sameAsPrimary, setSameAsPrimary] = useState(false)
  const [status, setStatus] = useState<string>()

  const primary = wallets.find(({ role }) => role === 'primary')
  const secondaries = wallets.filter(({ role }) => role === 'secondary')
  const isSaving = createWallet.isPending || updateWallet.isPending

  const blank = emptyWalletValues(user.email, user.ensName, user.ensSuffix)

  function handlePrimarySubmit(values: WalletFormValues) {
    setStatus(undefined)

    const onSuccess = () => setStatus(PROFILE_COPY.walletSaved)

    if (primary) {
      updateWallet.mutate(
        { walletId: primary.id, data: toWalletInput(values, 'primary') },
        { onSuccess },
      )

      return
    }

    createWallet.mutate(toWalletInput(values, 'primary'), { onSuccess })
  }

  function handleSecondarySubmit(values: WalletFormValues) {
    setStatus(undefined)

    const onSuccess = () => {
      setStatus(PROFILE_COPY.walletSaved)
      setDraft(undefined)
      setSameAsPrimary(false)
    }

    if (draft?.walletId) {
      updateWallet.mutate(
        { walletId: draft.walletId, data: toWalletInput(values, 'secondary') },
        { onSuccess },
      )

      return
    }

    createWallet.mutate(toWalletInput(values, 'secondary'), { onSuccess })
  }

  /**
   * "Igual à carteira principal" copia os campos da principal para a nova, com
   * o apelido em branco: duas carteiras com o mesmo apelido seriam
   * indistinguíveis na hora de pagar.
   */
  function openSecondaryDraft(copyPrimary: boolean) {
    setStatus(undefined)
    setSameAsPrimary(copyPrimary)
    setDraft({
      values:
        copyPrimary && primary
          ? { ...toWalletFormValues(primary), nickname: '' }
          : blank,
    })
  }

  return (
    <div className="flex flex-col gap-10">
      <section
        aria-labelledby="wallets-primary"
        className="flex flex-col gap-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1
              id="wallets-primary"
              className="text-17 leading-4 font-bold text-text-primary"
            >
              {PROFILE_COPY.walletsHeading}
            </h1>
            <p className="text-15 leading-5 text-text-secondary">
              {PROFILE_COPY.walletsSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => openSecondaryDraft(false)}
            className="text-15 leading-4 text-brand transition-colors hover:text-highlight"
          >
            {PROFILE_COPY.walletsAdd}
          </button>
        </div>

        <ProfileNotice message={error} />

        {!primary ? (
          <ProfileNotice message={PROFILE_COPY.primaryMissing} tone="success" />
        ) : null}

        <WalletForm
          key={primary?.updatedAt ?? 'nova-principal'}
          defaultValues={primary ? toWalletFormValues(primary) : blank}
          isSaving={isSaving}
          error={toProfileErrorMessage(
            updateWallet.error ?? createWallet.error,
          )}
          onSubmit={handlePrimarySubmit}
        />
      </section>

      <section
        aria-labelledby="wallets-secondary"
        className="flex flex-col gap-4 border-t border-line pt-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h2
            id="wallets-secondary"
            className="text-17 leading-4 font-bold text-text-primary"
          >
            {PROFILE_COPY.secondaryHeading}
          </h2>

          <div className="flex items-center gap-3">
            {/**
             * Checkbox, e não um rádio sozinho num grupo: é um liga/desliga, e
             * um rádio marcado não se desmarca. Sem principal ele não tem de
             * onde copiar, e o motivo fica no próprio rótulo.
             */}
            <label className="flex cursor-pointer items-center gap-3 text-15 leading-4 text-foreground">
              <Checkbox
                checked={sameAsPrimary}
                disabled={!primary}
                onCheckedChange={(checked) => {
                  if (checked) openSecondaryDraft(true)
                  else setSameAsPrimary(false)
                }}
              />
              {PROFILE_COPY.sameAsPrimary}
              {primary ? null : (
                <span className="text-12 text-brand-muted">
                  (cadastre a principal primeiro)
                </span>
              )}
            </label>

            <button
              type="button"
              onClick={() => openSecondaryDraft(sameAsPrimary)}
              className="text-15 leading-4 font-bold text-brand transition-colors hover:text-highlight"
            >
              {PROFILE_COPY.walletsAdd}
            </button>
          </div>
        </div>

        {secondaries.length === 0 && !draft ? (
          <p className="text-15 leading-5 text-text-secondary">
            {PROFILE_COPY.secondaryEmpty}
          </p>
        ) : null}

        {secondaries.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {secondaries.map((wallet) => (
              <SecondaryWalletCard
                key={wallet.id}
                wallet={wallet}
                isRemoving={deleteWallet.isPending}
                onEdit={() =>
                  setDraft({
                    walletId: wallet.id,
                    values: toWalletFormValues(wallet),
                  })
                }
                onRemove={() =>
                  deleteWallet.mutate(
                    { walletId: wallet.id },
                    {
                      onSuccess: () => {
                        setStatus(PROFILE_COPY.walletRemoved)
                        setDraft(undefined)
                      },
                    },
                  )
                }
              />
            ))}
          </ul>
        ) : null}

        <ProfileNotice message={toProfileErrorMessage(deleteWallet.error)} />

        {draft ? (
          <div className="flex flex-col gap-5 border border-line bg-surface-card p-6">
            <h3 className="text-16 leading-4 font-bold text-text-primary">
              {draft.walletId
                ? PROFILE_COPY.secondaryEdit
                : PROFILE_COPY.newSecondaryHeading}
            </h3>

            <WalletForm
              key={draft.walletId ?? 'nova-secundaria'}
              defaultValues={draft.values}
              isSaving={isSaving}
              onSubmit={handleSecondarySubmit}
              onCancel={() => {
                setDraft(undefined)
                setSameAsPrimary(false)
              }}
            />
          </div>
        ) : null}

        <ProfileNotice message={status} tone="success" />
      </section>
    </div>
  )
}
