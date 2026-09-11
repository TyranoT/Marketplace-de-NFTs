import { Tabs } from '@base-ui/react/tabs'
import { NFT_DETAIL_COPY } from '../constants/nft-detail-copy'
import { NftDetailFacts } from './nft-detail-facts'
import type { NftDetail } from '@/global/type'

type NftDetailTabsProps = {
  nft: NftDetail
}

const TAB_CLASS =
  'relative -mb-px border-b-2 border-transparent pb-2.5 text-15 leading-4 whitespace-nowrap text-foreground aria-selected:border-primary aria-selected:font-bold aria-selected:text-highlight'

/**
 * Abas do Base UI, com a aparência do frame.
 *
 * As de antes tinham os papéis ARIA certos mas nenhum teclado: as setas não
 * andavam entre as abas, cada uma era uma parada de Tab, e o `aria-controls`
 * da aba inativa apontava para um painel que não existia. O Base UI traz o
 * tabindex móvel, as setas, Home/End e as ligações aba–painel.
 */
export function NftDetailTabs({ nft }: NftDetailTabsProps) {
  return (
    <Tabs.Root defaultValue="details" className="flex flex-col gap-5">
      <Tabs.List
        aria-label="Informações do NFT"
        className="flex gap-6 border-b border-line"
      >
        <Tabs.Tab value="details" className={TAB_CLASS}>
          {NFT_DETAIL_COPY.detailsTabLabel}
        </Tabs.Tab>
        <Tabs.Tab value="reviews" className={TAB_CLASS}>
          {`${NFT_DETAIL_COPY.reviewsTabLabel} (${nft.rating.count})`}
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="details">
        <NftDetailFacts nft={nft} />
      </Tabs.Panel>

      <Tabs.Panel value="reviews">
        <p className="text-14 leading-6 text-text-secondary">
          {NFT_DETAIL_COPY.reviewsEmpty}
        </p>
      </Tabs.Panel>
    </Tabs.Root>
  )
}
