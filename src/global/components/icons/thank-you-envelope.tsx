/**
 * Envelope com a etiqueta "THANK YOU" do frame de confirmação. Desenhado em
 * traço, e não exportado como imagem, para acompanhar `currentColor` e ficar
 * nítido em qualquer densidade de tela.
 */
export function ThankYouEnvelopeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 80 84"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="19" y="1" width="42" height="34" rx="4" />
      <text
        x="40"
        y="15"
        textAnchor="middle"
        stroke="none"
        fill="currentColor"
        fontSize="10"
        fontFamily="inherit"
        fontWeight="700"
      >
        THANK
      </text>
      <text
        x="40"
        y="27"
        textAnchor="middle"
        stroke="none"
        fill="currentColor"
        fontSize="10"
        fontFamily="inherit"
        fontWeight="700"
      >
        YOU
      </text>
      <path d="M1 27h78v56H1z" />
      <path d="M1 27l39 30 39-30" />
    </svg>
  )
}
