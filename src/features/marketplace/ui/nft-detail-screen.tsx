import { Container } from '@/global/components/ui/container'
import { Breadcrumb } from '@/global/components/ui/breadcrumb'
import { NFT_BREADCRUMB, NFT_DETAIL_COPY } from '../constants/nft-detail-copy'
import { NftDetailTabs } from '../components/nft-detail-tabs'
import { NftGallery } from '../components/nft-gallery'
import { NftMetadataList } from '../components/nft-metadata-list'
import { NftPurchasePanel } from '../components/nft-purchase-panel'
import { NftRating } from '../components/nft-rating'
import { NftRelatedSection } from '../components/nft-related-section'
import { NftShare } from '../components/nft-share'
import { NftDetailMobile } from './nft-detail-mobile'
import type { NftDetail, NftSummary } from '@/global/type'

type NftDetailScreenProps = {
  nft: NftDetail
  related: Array<NftSummary>
}

export function NftDetailScreen({ nft, related }: NftDetailScreenProps) {
  return (
    <Container as="main" className="flex flex-col gap-8 md:gap-24 md:pt-8">
      <NftDetailMobile nft={nft} />

      <div className="hidden flex-col gap-3.5 md:flex">
        <Breadcrumb items={NFT_BREADCRUMB} />

        <section className="flex flex-col gap-8 lg:flex-row lg:gap-8.25">
          <NftGallery gallery={nft.gallery} name={nft.name} />

          <div className="flex min-w-0 flex-1 flex-col gap-3.5">
            <h1 className="text-28 leading-9 font-bold text-foreground">
              {nft.name}
            </h1>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-22 leading-4 font-bold text-highlight">
                  {nft.price}
                </p>
                <NftRating rating={nft.rating} />
              </div>
              <div className="h-px bg-line" />
            </div>

            <div className="flex flex-col gap-2.5">
              <h2 className="text-15 leading-4 font-bold text-foreground">
                {NFT_DETAIL_COPY.aboutLabel}
              </h2>
              <p className="text-14 leading-6 text-text-secondary">
                {nft.about}
              </p>
            </div>

            <NftPurchasePanel
              nftId={nft.id}
              editions={nft.editions}
              selectedEdition={nft.selectedEdition}
            />

            <NftMetadataList metadata={nft.metadata} />
            <NftShare />
          </div>
        </section>
      </div>

      <div className="hidden md:block">
        <NftDetailTabs nft={nft} />
      </div>

      <div className="hidden md:block">
        <NftRelatedSection items={related} />
      </div>
    </Container>
  )
}
