import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from '@/global/components/icons'
import type { FooterFeature, FooterLinkColumn, SocialLink } from '../type'

export const FOOTER_FEATURES: Array<FooterFeature> = [
  {
    medallion: 'W',
    title: 'Segurança da carteira',
    body: 'Proteja sua carteira e colecione arte digital verificada com confiança.',
  },
  {
    medallion: 'C',
    title: 'Criadores em destaque',
    body: 'Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.',
  },
  {
    medallion: 'D',
    title: 'Alertas de lançamentos',
    body: 'Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.',
  },
]

export const FOOTER_LINK_COLUMNS: Array<FooterLinkColumn> = [
  {
    title: 'Meu perfil',
    items: [
      'Meu perfil',
      'Minha coleção',
      'Atividade',
      'Estúdio do criador',
      'Lista de interesse',
    ],
  },
  {
    title: 'Central de ajuda',
    items: [
      'Central de ajuda',
      'Como comprar NFTs',
      'Carteira e segurança',
      'Política do mercado',
      'Denunciar item',
    ],
  },
  {
    title: 'Coleções',
    items: ['Arte digital', 'Fotografia', 'Música', 'Arte 3D', 'Utilidade'],
  },
]

export const FOOTER_SOCIALS: Array<SocialLink> = [
  { label: 'Facebook', Icon: FacebookIcon },
  { label: 'Instagram', Icon: InstagramIcon },
  { label: 'Twitter', Icon: TwitterIcon },
  { label: 'LinkedIn', Icon: LinkedinIcon },
  { label: 'YouTube', Icon: YoutubeIcon },
]

export const COMPATIBLE_WALLETS = ['METAMASK', 'WALLETCONNECT', 'COINBASE']

export const FOOTER_CONTACT = {
  email: 'contato@email.com',
  phone: '+55 11 4002 8922',
  phoneHref: 'tel:+551140028922',
  tagline: ['Feito para colecionadores,', 'criadores e cultura'],
  copyright: '© 2026 Kurio. Propriedade digital para todos.',
}
