import { createFileRoute } from '@tanstack/react-router'
import { ProfileWalletsScreen } from '@/features/profile'

export const Route = createFileRoute('/perfil/carteiras')({
  component: ProfileWalletsScreen,
})
