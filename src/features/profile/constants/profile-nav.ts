import {
  CircleAlert,
  Download,
  Heart,
  MapPin,
  ShoppingBag,
  TrendingUp,
  UserRound,
} from 'lucide-react'
import type { LinkProps } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

export type ProfileNavItem = {
  label: string
  Icon: LucideIcon
  /** Ausente enquanto a tela do destino não existir. */
  to?: LinkProps['to']
}

/**
 * Os sete itens do frame. Os cinco sem `to` não têm tela desenhada: aparecem
 * porque são o mapa do que a área de perfil vai ter, e ficam inertes porque um
 * item que navega para o nada promete tela que não há.
 */
export const PROFILE_NAV_ITEMS: Array<ProfileNavItem> = [
  { label: 'Dados do perfil', Icon: UserRound, to: '/perfil' },
  { label: 'Carteiras', Icon: MapPin, to: '/perfil/carteiras' },
  { label: 'Atividade', Icon: ShoppingBag },
  { label: 'Lista de interesse', Icon: Heart },
  { label: 'Ofertas', Icon: TrendingUp },
  { label: 'Arquivos baixados', Icon: Download },
  { label: 'Suporte', Icon: CircleAlert },
]
