import type { SVGProps } from 'react'

/**
 * Casa preenchida com a porta vazada, como no frame mobile do Figma.
 *
 * A variante `House` do lucide é apenas contornada: preenchê-la fecharia a
 * porta. Aqui as duas silhuetas vivem no mesmo path com `evenodd`, o que
 * mantém a porta transparente sobre qualquer fundo.
 */
export function HouseSolidIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8Z"
      />
    </svg>
  )
}
