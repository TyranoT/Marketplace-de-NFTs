type CartSummaryRowProps = {
  label: string
  value: string
}

export function CartSummaryRow({ label, value }: CartSummaryRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-foreground">{label}</dt>
      <dd className="whitespace-nowrap text-foreground">{value}</dd>
    </div>
  )
}
