const ETH_FORMATTER = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatEth(value: number) {
  return ETH_FORMATTER.format(value)
}
