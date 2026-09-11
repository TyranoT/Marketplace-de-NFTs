import { createFileRoute } from '@tanstack/react-router'
import { ProfileWalletsScreen } from '@/features/profile'

export const Route = createFileRoute('/perfil/carteiras')({
  head: () => ({ meta: [{ title: 'Carteiras · Kurio' }] }),
  component: ProfileWalletsScreen,
})
