import { useRef, useState } from 'react'
import { SmilePlus } from 'lucide-react'
import { Button } from '@/global/components/ui/button'
import { useSetAvatar } from '@/global/api/user'
import { PROFILE_COPY } from '../constants/profile-copy'
import { readImageFile } from '../helpers/read-image-file'
import { toProfileErrorMessage } from '../helpers/to-profile-error-message'
import { ProfileNotice } from './profile-notice'

type AvatarFieldProps = {
  avatarUrl?: string
}

/**
 * "Alterar" abre o seletor de arquivos por um `input` escondido — um `input
 * type="file"` visível não tem como parecer o botão do frame, e estilizá-lo é
 * combate perdido em cada navegador.
 */
export function AvatarField({ avatarUrl }: AvatarFieldProps) {
  const setAvatar = useSetAvatar()
  const fileRef = useRef<HTMLInputElement>(null)
  const [fileError, setFileError] = useState<string>()

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    /** Zera o valor: escolher o mesmo arquivo de novo tem de disparar `change`. */
    event.target.value = ''
    setFileError(undefined)

    if (!file) return

    try {
      setAvatar.mutate(await readImageFile(file))
    } catch (error) {
      setFileError((error as Error).message)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-15 leading-4 text-foreground">
        {PROFILE_COPY.avatarLabel}
      </p>

      <div className="flex items-center gap-4">
        <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-dark text-brand">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={PROFILE_COPY.avatarAlt}
              className="size-full object-cover"
            />
          ) : (
            <SmilePlus className="size-6" />
          )}
        </span>

        <Button
          type="button"
          disabled={setAvatar.isPending}
          onClick={() => fileRef.current?.click()}
          className="h-10 px-6 text-15 font-bold"
        >
          {PROFILE_COPY.avatarChange}
        </Button>

        {avatarUrl ? (
          <button
            type="button"
            disabled={setAvatar.isPending}
            onClick={() => setAvatar.mutate(null)}
            className="text-15 leading-4 text-foreground transition-colors hover:text-brand"
          >
            {PROFILE_COPY.avatarRemove}
          </button>
        ) : null}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          aria-label={PROFILE_COPY.avatarChange}
          onChange={(event) => void handleChange(event)}
          className="hidden"
        />
      </div>

      <ProfileNotice
        message={fileError ?? toProfileErrorMessage(setAvatar.error)}
      />
    </div>
  )
}
