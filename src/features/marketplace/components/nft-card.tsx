import { cn } from '@/global/helpers/cn'
import { Skeleton } from '@/global/components/ui/skeleton'

type NftCardProps = {
  name: string
  price: string
  secondaryPrice?: string
  imageUrl: string
  /** Mantido na assinatura: a vitrine de componentes ainda passa. */
  imageAlt?: string
  className?: string
}

/**
 * O nome é um `<h3>`, sob o título da seção — quem navega por títulos chega
 * a cada obra. A imagem é decorativa (`alt=""`): o card inteiro é um link, e
 * com o alt descritivo o nome do link virava "macaco de jaqueta verde...
 * Emerald Ape #042 1.19 ETH", com a descrição da arte na frente do nome.
 */
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
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute top-[8.33%] right-[1.55%] left-[1.55%] aspect-square rounded-xl object-cover"
        />
      </div>

      <h3 className="text-16 leading-4 font-normal text-foreground">{name}</h3>

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
      <Skeleton className="h-4 w-21.75" />
    </div>
  )
}
