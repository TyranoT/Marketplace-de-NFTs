import { Mail } from 'lucide-react'
import { LinkedinGlyph, TwitterGlyph } from '@/global/components/icons'
import type { NftShareTarget } from '../type'

export const NFT_SHARE_TARGETS: Array<NftShareTarget> = [
  {
    label: 'Compartilhar no LinkedIn',
    Icon: LinkedinGlyph,
    buildHref: (pageUrl) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
  },
  {
    label: 'Compartilhar por e-mail',
    Icon: Mail,
    buildHref: (pageUrl, nftName) =>
      `mailto:?subject=${encodeURIComponent(nftName)}&body=${encodeURIComponent(pageUrl)}`,
  },
  {
    label: 'Compartilhar no Twitter',
    Icon: TwitterGlyph,
    buildHref: (pageUrl, nftName) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(nftName)}&url=${encodeURIComponent(pageUrl)}`,
  },
]
