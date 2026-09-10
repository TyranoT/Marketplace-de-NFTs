import { createFileRoute } from '@tanstack/react-router'
import { DevPanelScreen } from '@/features/dev-panel'

/**
 * Painel de simulação.
 *
 * Não tem link no cabeçalho, no rodapé nem na barra de navegação, e não
 * entra na lista de destinos de autenticação: existe só pela URL. Também
 * não é indexável.
 *
 * **Funciona no build de demonstração de propósito.** Os mocks ficam
 * ligados lá, e é lá que o cenário de tempo real do enunciado precisa ser
 * demonstrável; guardá-la por `import.meta.env.DEV` a tornaria inútil
 * exatamente onde ela serve. Com `VITE_ENABLE_MOCKS=false` a tela avisa que
 * não há simulação a controlar.
 *
 * `ssr: false` pelo motivo já conhecido do carrinho: o que ela mostra vive
 * no `localStorage` e é servido pelo Service Worker.
 */
export const Route = createFileRoute('/dev')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'Painel de simulação · Kurio' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  staticData: {
    header: { active: 'home', divider: true },
    mobileTabBar: false,
  },
  component: DevPanelScreen,
})
