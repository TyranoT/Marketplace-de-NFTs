import { cn } from 'cn'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden rounded-sm bg-surface-card',
        className,
      )}
      {...props}
    >
      <span className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent via-line-soft to-transparent opacity-60" />
    </div>
  )
}

export { Skeleton }
