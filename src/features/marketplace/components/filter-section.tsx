type FilterSectionProps = {
  title: string
  /** Nomeia a seção e o grupo de opções dentro dela. */
  headingId: string
  children: React.ReactNode
}

export function FilterSection({
  title,
  headingId,
  children,
}: FilterSectionProps) {
  return (
    <section aria-labelledby={headingId} className="flex w-full flex-col gap-3">
      <h2
        id={headingId}
        className="text-18 leading-4 font-bold text-foreground"
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
