import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search } from 'lucide-react'

/**
 * Busca do cabeçalho.
 *
 * O ícone existia sem ação: um botão "Buscar" que não fazia nada, o que o
 * enunciado proíbe ("ações fora do escopo não devem aparentar sucesso"). E
 * a busca é escopo — só não havia campo no desktop, onde o frame desenha
 * apenas o ícone. Agora o ícone abre um campo, e buscar leva ao catálogo com
 * o termo na URL, o mesmo estado que a busca do mobile escreve.
 */
export function HeaderSearch() {
  const navigate = useNavigate()
  const formId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [term, setTerm] = useState('')

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    void navigate({
      to: '/',
      search: (prev) => ({ ...prev, q: term.trim() || undefined, page: 1 }),
      hash: 'catalogo',
    })

    setIsOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      <form
        id={formId}
        role="search"
        hidden={!isOpen}
        onSubmit={handleSubmit}
        className="flex items-center"
      >
        <label htmlFor={`${formId}-input`} className="sr-only">
          Buscar NFTs e coleções
        </label>
        <input
          ref={inputRef}
          id={`${formId}-input`}
          type="search"
          value={term}
          placeholder="Buscar NFTs..."
          onChange={(event) => setTerm(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setIsOpen(false)
          }}
          className="h-8.75 w-48 rounded-md border border-line bg-surface-card px-3 text-14 text-foreground placeholder:text-text-secondary"
        />
      </form>

      {/**
       * `key` diferentes: sem eles o React reaproveita o mesmo `<button>` e
       * só troca o `type` para `submit` no meio do clique. O navegador, ao
       * terminar o clique, via um botão de envio e enviava o formulário — que
       * fechava a busca na mesma hora. Com o mouse, a busca nunca abria.
       */}
      {isOpen ? (
        <button
          key="submit"
          type="submit"
          form={formId}
          aria-label="Buscar"
          className="text-foreground"
        >
          <Search className="size-6" />
        </button>
      ) : (
        <button
          key="open"
          type="button"
          aria-label="Abrir busca"
          aria-expanded={false}
          aria-controls={formId}
          onClick={() => setIsOpen(true)}
          className="text-foreground"
        >
          <Search className="size-6" />
        </button>
      )}
    </div>
  )
}
