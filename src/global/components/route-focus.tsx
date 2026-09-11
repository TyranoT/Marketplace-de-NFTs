import { useEffect, useRef } from 'react'
import { useRouter } from '@tanstack/react-router'
import { MAIN_CONTENT_ID } from './ui/container'

/**
 * Leva o foco ao conteúdo quando a página muda.
 *
 * Numa navegação client-side o documento não recarrega: sem isto, o foco
 * ficava no link clicado — muitas vezes no rodapé ou no cabeçalho — e o
 * leitor de tela não anunciava que havia uma página nova.
 *
 * Só quando o **caminho** muda. Filtros e paginação do catálogo também são
 * navegações (vivem na URL), e roubar o foco do checkbox recém-marcado
 * seria pior do que não fazer nada.
 */
export function RouteFocus() {
  const router = useRouter()
  const previous = useRef(router.state.location.pathname)

  useEffect(
    () =>
      router.subscribe('onResolved', ({ toLocation }) => {
        if (toLocation.pathname === previous.current) return

        previous.current = toLocation.pathname

        /** `preventScroll`: a rolagem é do router — topo ou âncora. */
        document.getElementById(MAIN_CONTENT_ID)?.focus({ preventScroll: true })
      }),
    [router],
  )

  return null
}
