import { useState } from 'react'

const NOT_IN_DEMO =
  'A newsletter não faz parte desta demonstração — nenhum e-mail foi cadastrado.'

export function FooterNewsletter() {
  const [status, setStatus] = useState('')

  /**
   * "Enviar" não fazia nada e não dizia nada. Agora diz, em texto, que o
   * cadastro não existe aqui — o mesmo padrão dos botões Google e Facebook
   * do login, em vez de fingir sucesso.
   */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus(NOT_IN_DEMO)
  }

  return (
    <div className="flex flex-col items-center gap-3 text-center lg:items-start lg:px-4 lg:text-left">
      <h2 className="text-18 leading-4 font-bold text-foreground">
        Antecipe-se ao próximo lançamento
      </h2>

      {/**
       * O foco é desenhado na cápsula: o input não tem borda própria, e o
       * `outline-none` dele deixava o foco invisível.
       */}
      <form
        onSubmit={handleSubmit}
        className="flex h-10 w-full items-center justify-between rounded-lg bg-surface-dark pl-3 shadow-[0px_0px_10px_rgba(10,6,4,0.45)] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring"
      >
        <label htmlFor="newsletter" className="sr-only">
          Seu e-mail
        </label>
        <input
          id="newsletter"
          type="email"
          autoComplete="email"
          required
          placeholder="digite seu e-mail..."
          className="h-full min-w-0 flex-1 bg-transparent text-14 leading-4 text-text-primary outline-none placeholder:text-brand-muted"
        />
        <button
          type="submit"
          className="h-10 w-21.25 shrink-0 rounded-r-lg bg-primary text-18 leading-4 font-bold text-ink"
        >
          Enviar
        </button>
      </form>

      <p
        role="status"
        className="text-13 leading-5 text-highlight empty:hidden"
      >
        {status}
      </p>

      <p className="text-13 leading-5.5 text-text-secondary">
        Receba lançamentos selecionados, histórias de criadores e novidades do
        mercado.
      </p>
    </div>
  )
}
