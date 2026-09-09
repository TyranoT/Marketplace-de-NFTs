import { Mail } from 'lucide-react'
import { LinkedinGlyph, TwitterGlyph } from '@/global/components/icons'
import type { NftShareTarget } from '../type'

export const NFT_SHARE_TARGETS: Array<NftShareTarget> = [
  { label: 'Compartilhar no LinkedIn', Icon: LinkedinGlyph },
  { label: 'Compartilhar por e-mail', Icon: Mail },
  { label: 'Compartilhar no Twitter', Icon: TwitterGlyph },
]
