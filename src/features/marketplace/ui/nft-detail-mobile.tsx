import { NftEditionPicker } from '../components/nft-edition-picker'
import { NftMetadataList } from '../components/nft-metadata-list'
import { NftMobileActions } from '../components/nft-mobile-actions'
import { NftMobilePurchaseBar } from '../components/nft-mobile-purchase-bar'
import { NftRatingPill } from '../components/nft-rating-pill'
import { useNftPurchase } from '../hooks/use-nft-purchase'
import type { NftDetail } from '@/global/type'

type NftDetailMobileProps = {
  nft: NftDetail
}

/**
 * Tela de detalhes do mobile: arte sobre um fundo próprio e o painel de
 * informações subindo por cima dele, com a barra de compra fixa embaixo.
 *
 * É uma composição separada da versão desktop, não uma reflow dela — no frame
 * a hierarquia muda (a nota vira selo, o breadcrumb dá lugar ao botão voltar,
 * a compra sai do corpo e vira barra fixa). O `-mx-6` desfaz o padding do
 * `Container` para que o fundo e o painel sangrem até as bordas da tela.
 */
export function NftDetailMobile({ nft }: NftDetailMobileProps) {
  const purchase = useNftPurchase(nft.selectedEdition)

  return (
    <section className="-mx-6 flex flex-col min-h-[calc(100vh-120px)] bg-[#271813] md:hidden">
      <div className="px-6 pt-6">
        <NftMobileActions
          isFavorite={purchase.isFavorite}
          onToggleFavorite={purchase.toggleFavorite}
        />

        <img
          src={nft.artwork.src}
          alt={nft.artwork.alt}
          decoding="async"
          className="mt-2 aspect-366/326 w-full rounded-[22px] object-cover"
        />
      </div>

      <div className="flex flex-col rounded-t-[30px] bg-surface-card px-6 pt-8 h-full">
        <div className="flex items-center justify-between gap-4">
          <h1 className="min-w-0 truncate text-20 leading-6.5 font-bold text-foreground">
            {nft.name}
          </h1>

          <NftRatingPill rating={nft.rating} />
        </div>

        <p className="mt-4 text-14 leading-6 text-text-secondary">
          {nft.about}
        </p>

        <div className="mt-2.5">
          <NftEditionPicker
            editions={nft.editions}
            value={purchase.edition}
            onChange={purchase.changeEdition}
          />
        </div>

        <div className="mt-4">
          <NftMetadataList metadata={nft.metadata} />
        </div>
      </div>

      <NftMobilePurchaseBar
        nftId={nft.id}
        editionId={purchase.edition}
        price={nft.price}
        quantity={purchase.quantity}
        onIncrease={purchase.increase}
        onDecrease={purchase.decrease}
      />
    </section>
  )
}
