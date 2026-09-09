import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import appCss from '@/styles.css?url'
import { Header } from '@/features/layout'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#140d0a' },
      { title: 'Kurio · Marketplace de NFTs' },
      {
        name: 'description',
        content:
          'Descubra, colecione e negocie NFTs de artistas independentes na Kurio.',
      },
      {
        name: 'og:title',
        content: 'Kurio · Marketplace de NFTs',
      },
      {
        name: 'og:description',
        content:
          'Descubra, colecione e negocie NFTs de artistas independentes na Kurio.',
      },
      {
        name: 'og:url',
        content: process.env.PUBLIC_URL || 'http://localhost:3000',
      },
      {
        name: 'twitter:title',
        content: 'Kurio · Marketplace de NFTs',
      },
      {
        name: 'twitter:description',
        content:
          'Descubra, colecione e negocie NFTs de artistas independentes na Kurio.',
      },
      {
        name: 'twitter:url',
        content: process.env.PUBLIC_URL || 'http://localhost:3000',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <Header />
        {children}
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
