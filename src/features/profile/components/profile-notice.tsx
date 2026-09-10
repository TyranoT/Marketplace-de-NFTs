import { cn } from '@/global/helpers/cn'

type ProfileNoticeProps = {
  message?: string
  tone?: 'error' | 'success'
  className?: string
}

/** Um erro interrompe (`alert`); uma confirmação informa (`status`). */
export function ProfileNotice({
  message,
  tone = 'error',
  className,
}: ProfileNoticeProps) {
  if (!message) return null

  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'text-13 leading-4',
        tone === 'error' ? 'text-destructive' : 'text-brand',
        className,
      )}
    >
      {message}
    </p>
  )
}
