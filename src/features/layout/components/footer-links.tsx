import { Link } from '@tanstack/react-router'
import {
  COMPATIBLE_WALLETS,
  FOOTER_LINK_COLUMNS,
  FOOTER_SOCIALS,
} from '../constants/footer'

/**
 * Coleções do rodapé que existem como filtro do catálogo. É o mesmo id da
 * categoria que o filtro lateral usa, então o link abre a grade já
 * recortada.
 */
const COLLECTION_FILTER: Record<string, string> = {
  'Arte digital': 'digital-art',
  Fotografia: 'photography',
  Música: 'music',
  'Arte 3D': '3d-art',
  Utilidade: 'utility',
}

/**
 * Link só onde há destino. Os 20 `href="#"` de antes pulavam para o topo e
 * pareciam funcionar — o enunciado proíbe que ações fora do escopo
 * aparentem sucesso. O que não tem página vira texto, marcado como
 * indisponível para quem usa leitor de tela.
 */
function FooterItem({ label }: { label: string }) {
  if (label === 'Meu perfil') return <Link to="/perfil">{label}</Link>

  const collection = COLLECTION_FILTER[label]

  if (collection) {
    return (
      <Link
        to="/"
        search={{ collection: [collection], page: 1 }}
        hash="catalogo"
      >
        {label}
      </Link>
    )
  }

  return (
    <span className="text-foreground/60">
      {label}
      <span className="sr-only"> (em breve)</span>
    </span>
  )
}

export function FooterLinks() {
  return (
    <nav aria-label="Rodapé" className="bg-surface-card p-8">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_228px] lg:gap-10 xl:gap-31">
        {FOOTER_LINK_COLUMNS.map(({ title, items }) => (
          <div
            key={title}
            className="flex flex-col items-center gap-2 text-center text-foreground sm:items-start sm:text-left"
          >
            <h2 className="text-18 leading-4 font-bold">{title}</h2>
            <ul className="text-14">
              {items.map((item) => (
                <li key={item} className="leading-7.5">
                  <FooterItem label={item} />
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex flex-col items-center gap-8 sm:items-start">
          <div className="flex flex-col items-center gap-5 sm:items-start">
            <h2 className="text-18 leading-4 font-bold text-foreground">
              Redes sociais
            </h2>
            {/**
             * A Kurio não tem perfis reais. Os ícones ficam, porque são do
             * frame, mas não são links para lugar nenhum.
             */}
            <ul className="flex items-center gap-2.5">
              {FOOTER_SOCIALS.map(({ label, Icon }) => (
                <li key={label}>
                  <span
                    role="img"
                    aria-label={`${label} (em breve)`}
                    className="flex text-primary/70"
                  >
                    <Icon className="size-7.5" />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center gap-3 sm:items-start">
            <h2 className="text-18 leading-4 font-bold text-foreground">
              Carteiras compatíveis
            </h2>
            {/** 12px e com quebra: os 9px sem quebra eram ilegíveis e estouravam. */}
            <p className="flex min-h-6.5 items-center justify-center rounded-lg border border-line-soft bg-surface-dark px-2 py-1 text-12 font-bold tracking-[0.1px] text-highlight">
              {COMPATIBLE_WALLETS.join('  •  ')}
            </p>
          </div>
        </div>
      </div>
    </nav>
  )
}
