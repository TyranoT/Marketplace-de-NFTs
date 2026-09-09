import { cn } from 'cn'
import { Skeleton } from './ui/skeleton'

type NftCardProps = {
  name: string
  price: string
  secondaryPrice?: string
  imageUrl: string
  className?: string
}

export function NftCard({
  name,
  price,
  secondaryPrice,
  imageUrl,
  className,
}: NftCardProps) {
  return (
    <article className={cn('flex flex-col gap-3', className)}>
      <div className="relative aspect-258/300 w-full bg-surface-card">
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          decoding="async"
          className="absolute top-[8.33%] right-[1.55%] left-[1.55%] aspect-square rounded-xl object-cover"
        />
      </div>

      <p className="text-16 leading-4 text-foreground">{name}</p>

      <div className="flex items-center gap-3 text-18 leading-4">
        <span className="font-bold text-highlight">{price}</span>
        {secondaryPrice ? (
          <span className="text-brand-muted">{secondaryPrice}</span>
        ) : null}
      </div>
    </article>
  )
}

export function NftCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Skeleton className="aspect-258/300 w-full rounded-none" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[87px]" />
    </div>
  )
}
