import { createCn } from 'cn/config'

/**
 * Nomes do escalonamento `--text-*` declarado em `src/styles.css`.
 *
 * Sem esta lista o motor do `cn` lê `text-15` como cor — o formato é o mesmo
 * de `text-primary` — e descarta o tamanho sempre que uma cor aparece na
 * mesma chamada. Ao incluir um token novo em `styles.css`, inclua aqui.
 */
const FONT_SIZES = [
  '9',
  '10',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '22',
  '24',
  '28',
  '43',
]

/** `cn` do projeto: mesma API do pacote, ciente da escala tipográfica local. */
export const cn = createCn({
  extend: { classGroups: { 'font-size': [{ text: FONT_SIZES }] } },
})
