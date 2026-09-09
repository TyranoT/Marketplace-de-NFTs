import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & {
  /** Moldura arredondada do rodapé. O compartilhar da tela de NFT usa o glifo puro. */
  framed?: boolean
}

export function LinkedinIcon({ framed = true, ...props }: IconProps) {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      {...props}
    >
      <g>
        {framed ? (
          <rect
            x="1.5625%"
            y="1.5625%"
            width="96.875%"
            height="96.875%"
            rx="4.5"
            stroke="#D28A4C"
          />
        ) : null}
        <path
          transform="translate(16 16) scale(1.25) translate(-16 -16)"
          d="M12.3333 10.6667C12.3333 11.6 11.6 12.3333 10.6667 12.3333C9.73333 12.3333 9 11.6 9 10.6667C9 9.73333 9.73333 9 10.6667 9C11.6 9 12.3333 9.73333 12.3333 10.6667ZM12.3333 13.6667H9V24.3333H12.3333V13.6667ZM17.6667 13.6667H14.3333V24.3333H17.6667V18.7333C17.6667 15.6 21.6667 15.3333 21.6667 18.7333V24.3333H25V17.6C25 12.3333 19.0667 12.5333 17.6667 15.1333V13.6667Z"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}

/** Glifo sem a moldura, para uso inline (ex.: compartilhar na tela de NFT). */
export function LinkedinGlyph(props: SVGProps<SVGSVGElement>) {
  return <LinkedinIcon {...props} framed={false} />
}
