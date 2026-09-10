import type { OrderStatus } from '@/global/api'

export const DEV_COPY = {
  title: 'Painel de simulação',
  intro:
    'Altera os dados simulados e dispara os eventos de tempo real. Não faz parte do produto: existe para tornar demonstrável o cenário em que um preço muda enquanto alguém navega.',

  catalogHeading: 'Catálogo',
  catalogHint:
    'Salvar grava no banco simulado, sobe a versão do NFT e emite nft.updated pelo Socket.IO.',
  columnNft: 'NFT',
  columnPrice: 'Preço (ETH)',
  columnUnits: 'Unidades',
  columnVersion: 'Versão',
  columnAction: 'Ação',
  save: 'Salvar',
  saving: 'Salvando...',

  connectionHeading: 'Conexão',
  eventsHeading: 'Eventos recebidos',
  eventsEmpty:
    'Nenhum evento ainda. Salve uma alteração no catálogo para ver o cliente Socket.IO receber.',
  eventApplied: 'aplicado',
  eventDiscarded: 'descartado',
  disconnect: 'Derrubar conexão',

  ordersHeading: 'Pedidos',
  ordersEmpty: 'Nenhum pedido ainda. Finalize uma compra em /pagamento.',
  confirmOrder: 'Confirmar',
  declineOrder: 'Recusar',

  scenarioHeading: 'Cenário de rede',
  reset: 'Restaurar cenário-semente',
  resetting: 'Restaurando...',

  mocksOffTitle: 'Mocks desligados',
  mocksOffBody:
    'Esta tela controla a camada de simulação. Com VITE_ENABLE_MOCKS=false não há o que controlar.',
} as const

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  declined: 'Recusado',
}

export const REALTIME_STATUS_LABEL: Record<string, string> = {
  disabled: 'Desligado',
  connecting: 'Conectando',
  connected: 'Conectado',
  reconnecting: 'Reconectando',
  disconnected: 'Desconectado',
}
