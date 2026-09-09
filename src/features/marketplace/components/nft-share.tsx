import { NFT_DETAIL_COPY } from '../constants/nft-detail-copy'
import { NFT_SHARE_TARGETS } from '../constants/nft-share'

export function NftShare() {
  return (
    <div className="flex items-center gap-3">
      <p className="text-15 leading-4 font-bold text-foreground">
        {NFT_DETAIL_COPY.shareLabel}
      </p>

      <ul className="flex items-center gap-2">
        {NFT_SHARE_TARGETS.map(({ label, Icon }) => (
          <li key={label}>
            <button
              type="button"
              aria-label={label}
              className="flex items-center text-foreground"
            >
              <Icon className="size-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
