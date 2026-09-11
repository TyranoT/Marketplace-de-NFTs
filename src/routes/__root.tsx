import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import appCss from '@/styles.css?url'
import { Header, MobileTabBar } from '@/features/layout'
import { SITE, absoluteUrl } from '@/global/config/site'
import { RealtimeProvider } from '@/global/realtime'
import { RouteFocus } from '@/global/components/route-focus'
import { MAIN_CONTENT_ID } from '@/global/components/ui/container'
import { useDeviceTier } from '@/global'
import type { QueryClient } from '@tanstack/react-query'

type RootContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RootContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: SITE.themeColor },
      { title: SITE.title },
      { name: 'description', content: SITE.description },

      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE.name },
      { property: 'og:locale', content: SITE.locale },
      { property: 'og:title', content: SITE.title },
      { property: 'og:description', content: SITE.description },
      {
        property: 'og:url',
        content:
          process.env.NODE_ENV === 'production'
            ? SITE.url
            : 'http://localhost:3000',
      },
      { property: 'og:image', content: absoluteUrl(SITE.ogImage.path) },
      { property: 'og:image:width', content: String(SITE.ogImage.width) },
      { property: 'og:image:height', content: String(SITE.ogImage.height) },
      { property: 'og:image:alt', content: SITE.ogImage.alt },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: SITE.title },
      { name: 'twitter:description', content: SITE.description },
      { name: 'twitter:image', content: absoluteUrl(SITE.ogImage.path) },
      { name: 'twitter:image:alt', content: SITE.ogImage.alt },
      {
        name: 'twitter:url',
        content:
          process.env.NODE_ENV === 'production'
            ? SITE.url
            : 'http://localhost:3000',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        href: '/icon-192.png',
      },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const isMobile = useDeviceTier() === 'mobile'

  return (
    <html lang="pt-BR" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="pb-32 md:pb-0">
        {/**
         * Primeiro elemento do Tab: o cabeçalho é fixo e tem quatro itens e
         * três ações antes do conteúdo, e percorrê-los em toda página é o
         * que o skip link evita.
         */}
        <a
          href={`#${MAIN_CONTENT_ID}`}
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-14 focus:font-bold focus:text-ink"
        >
          Pular para o conteúdo
        </a>

        <RealtimeProvider>
          <RouteFocus />
          <Header />
          {children}
          <MobileTabBar />
        </RealtimeProvider>

        {/** Só em desenvolvimento: no deploy era um botão a mais no Tab. */}
        {!import.meta.env.DEV || isMobile ? null : (
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              {
                name: 'Tanstack Query',
                render: <ReactQueryDevtoolsPanel />,
              },
            ]}
          />
        )}
        <Scripts />
      </body>
    </html>
  )
}
