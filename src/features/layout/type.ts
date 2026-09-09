import type { SVGProps } from 'react'

export type NavKey = 'home' | 'market' | 'creators' | 'learn'

export type NavItem = {
  key: NavKey
  label: string
}

export type HeaderConfig = {
  active?: NavKey
  divider?: boolean
}

export type FooterFeature = {
  medallion: string
  title: string
  body: string
}

export type FooterLinkColumn = {
  title: string
  items: Array<string>
}

export type SocialLink = {
  label: string
  Icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement
}

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    header?: HeaderConfig
  }
}
