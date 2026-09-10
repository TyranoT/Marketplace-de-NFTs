import { createFileRoute } from '@tanstack/react-router'
import { ProfileDataScreen } from '@/features/profile'

export const Route = createFileRoute('/perfil/')({
  component: ProfileDataScreen,
})
