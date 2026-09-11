import { useEffect, useRef, useState } from 'react'

type NftPriceAnnouncerProps = {
  price: string
}

/**
 * Anuncia a mudança de preço que chega por tempo real.
 *
 * O preço na tela troca sozinho quando um `nft.updated` chega; para quem
 * enxerga, a mudança é visível, mas o leitor de tela não fala texto que muda
 * fora de uma região viva. Só anuncia **mudanças**: o valor inicial é o que
 * a página já mostra, e repeti-lo ao carregar seria ruído.
 *
 * Fica só no detalhe. Na grade, com vários cards, cada evento viraria um
 * anúncio sobre uma obra que a pessoa talvez nem esteja vendo.
 */
export function NftPriceAnnouncer({ price }: NftPriceAnnouncerProps) {
  const shown = useRef(price)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (price === shown.current) return

    shown.current = price
    setMessage(`Preço atualizado para ${price}.`)
  }, [price])

  return (
    <p role="status" className="sr-only">
      {message}
    </p>
  )
}
