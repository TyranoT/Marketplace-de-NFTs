export function FooterNewsletter() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <div className="flex flex-col gap-3 lg:px-4">
      <h2 className="text-18 leading-4 font-bold text-foreground">
        Antecipe-se ao próximo lançamento
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex h-10 items-center justify-between rounded-lg bg-surface-dark pl-3 shadow-[0px_0px_10px_rgba(10,6,4,0.45)]"
      >
        <label htmlFor="newsletter" className="sr-only">
          Seu e-mail
        </label>
        <input
          id="newsletter"
          type="email"
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

      <p className="text-13 leading-5.5 text-text-secondary">
        Receba lançamentos selecionados, histórias de criadores e novidades do
        mercado.
      </p>
    </div>
  )
}
