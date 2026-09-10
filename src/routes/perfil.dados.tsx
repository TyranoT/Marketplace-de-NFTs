import { createFileRoute } from '@tanstack/react-router'
import { ProfileDataScreen } from '@/features/profile'

/**
 * Caminho próprio dos dados do perfil. Existe para que `/perfil` possa ser a
 * lista de seções no mobile; no desktop renderiza a mesma tela que o índice.
 */
export const Route = createFileRoute('/perfil/dados')({
  component: ProfileDataScreen,
})
