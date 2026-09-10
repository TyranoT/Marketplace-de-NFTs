const DATE_FORMAT = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

/** '29 Jul, 2026', como no frame — e não o '29 de jul. de 2026' do padrão. */
export function formatOrderDate(iso: string): string {
  const parts = DATE_FORMAT.formatToParts(new Date(iso))
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''

  const month = value('month').replace('.', '')

  return `${value('day')} ${month.charAt(0).toUpperCase()}${month.slice(1)}, ${value('year')}`
}

/** '0xA91F…E82C': o hash inteiro não cabe, e o meio não identifica nada. */
export function shortenHash(hash: string): string {
  return `${hash.slice(0, 6)}…${hash.slice(-4)}`
}

export function buildExplorerUrl(hash: string): string {
  return `https://etherscan.io/tx/${hash.toLowerCase()}`
}
