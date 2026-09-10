import { Container } from '@/global/components/ui/container'
import { Skeleton } from '@/global/components/ui/skeleton'

/**
 * Esqueleto do detalhe, com as proporções do frame.
 *
 * As dimensões acompanham o conteúdo real para a grade não saltar quando os
 * dados chegam — o enunciado pede skeletons que preservem o layout, e a
 * imagem daqui é o LCP da rota.
 */
export function NftDetailSkeleton() {
  return (
    <Container as="main" className="flex flex-col gap-8 md:gap-24 md:pt-8">
      <div className="flex flex-col gap-3.5">
        <Skeleton className="h-4 w-56" />

        <section className="flex flex-col gap-8 lg:flex-row lg:gap-8.25">
          <div className="flex flex-col gap-4 lg:w-150">
            <Skeleton className="aspect-square w-full rounded-xl" />

            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-3.5">
            <Skeleton className="h-9 w-3/4" />

            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-28" />
            </div>

            <Skeleton className="h-px w-full" />

            <div className="flex flex-col gap-2.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-16 w-full" />
            </div>

            <div className="flex flex-col gap-3.5">
              <Skeleton className="h-10 w-full" />
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>

            <Skeleton className="h-24 w-full" />
          </div>
        </section>
      </div>
    </Container>
  )
}
