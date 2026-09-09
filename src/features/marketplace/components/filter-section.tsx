type FilterSectionProps = {
  title: string
  children: React.ReactNode
}

export function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <section className="flex w-full flex-col gap-3">
      <h2 className="text-18 leading-4 font-bold text-foreground">{title}</h2>
      {children}
    </section>
  )
}
