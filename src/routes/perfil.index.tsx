import { createFileRoute } from '@tanstack/react-router'
import { useDeviceTier } from '@/global'
import { ProfileDataScreen, ProfileMenuScreen } from '@/features/profile'

/**
 * No mobile o índice é a lista de seções, que é o que o Tab abre. No desktop a
 * sidebar já faz esse papel, então o índice mostra os dados do perfil — e é
 * por isso que o item "Dados do perfil" da sidebar aponta para `/perfil`.
 */
export const Route = createFileRoute('/perfil/')({
  component: ProfileIndexRoute,
})

function ProfileIndexRoute() {
  const isMobile = useDeviceTier() === 'mobile'

  return isMobile ? <ProfileMenuScreen /> : <ProfileDataScreen />
}
