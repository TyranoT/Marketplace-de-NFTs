import {
  COMPATIBLE_WALLETS,
  FOOTER_LINK_COLUMNS,
  FOOTER_SOCIALS,
} from '../constants/footer'

export function FooterLinks() {
  return (
    <div className="bg-surface-card p-8">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_228px] lg:gap-31">
        {FOOTER_LINK_COLUMNS.map(({ title, items }) => (
          <div key={title} className="flex flex-col gap-2 text-foreground">
            <h2 className="text-18 leading-4 font-bold">{title}</h2>
            <ul className="text-14">
              {items.map((item) => (
                <li key={item} className="leading-7.5">
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <h2 className="text-18 leading-4 font-bold text-foreground">
              Redes sociais
            </h2>
            <ul className="flex items-center gap-2.5">
              {FOOTER_SOCIALS.map(({ label, Icon }) => (
                <li key={label}>
                  <a href="#" aria-label={label} className="text-primary">
                    <Icon className="size-7.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-18 leading-4 font-bold text-foreground">
              Carteiras compatíveis
            </h2>
            <p className="flex h-6.5 items-center justify-center rounded-lg border border-line-soft bg-surface-dark text-9 font-bold tracking-[0.1px] whitespace-nowrap text-highlight">
              {COMPATIBLE_WALLETS.join('  •  ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
