import { useState } from 'react'
import { cn } from 'cn'
import { NFT_DETAIL_COPY } from '../constants/nft-detail-copy'
import { NftDetailFacts } from './nft-detail-facts'
import type { NftDetail } from '@/global/type'

type TabId = 'details' | 'reviews'

type NftDetailTabsProps = {
  nft: NftDetail
}

export function NftDetailTabs({ nft }: NftDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('details')

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: 'details', label: NFT_DETAIL_COPY.detailsTabLabel },
    {
      id: 'reviews',
      label: `${NFT_DETAIL_COPY.reviewsTabLabel} (${nft.rating.count})`,
    },
  ]

  return (
    <section className="flex flex-col gap-5">
      <div role="tablist" className="flex gap-6 border-b border-line">
        {tabs.map(({ id, label }) => {
          const isActive = id === activeTab

          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`nft-tab-${id}`}
              aria-selected={isActive}
              aria-controls={`nft-panel-${id}`}
              onClick={() => setActiveTab(id)}
              className={cn(
                'relative -mb-px pb-2.5 text-15 leading-4 whitespace-nowrap',
                isActive
                  ? 'border-b-2 border-primary font-bold text-highlight'
                  : 'border-b-2 border-transparent text-foreground',
              )}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`nft-panel-${activeTab}`}
        aria-labelledby={`nft-tab-${activeTab}`}
      >
        {activeTab === 'details' ? (
          <NftDetailFacts nft={nft} />
        ) : (
          <p className="text-14 leading-6 text-text-secondary">
            {NFT_DETAIL_COPY.reviewsEmpty}
          </p>
        )}
      </div>
    </section>
  )
}
