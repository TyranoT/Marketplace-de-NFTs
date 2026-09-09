const TOKEN_NUMBER = /#(\d+)$/

/**
 * 'Emerald Ape #042' -> '#0042'. Devolve undefined quando o nome não segue
 * o padrão, para a linha de metadado ser omitida em vez de exibir ID falso.
 */
export function toTokenId(name: string) {
  const digits = TOKEN_NUMBER.exec(name)?.[1]

  return digits ? `#${digits.padStart(4, '0')}` : undefined
}
