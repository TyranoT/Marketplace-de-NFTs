import { FOOTER_CONTACT } from '../constants/footer'

export function FooterBrand() {
  const { email, phone, phoneHref, tagline } = FOOTER_CONTACT

  return (
    <div className="w-full bg-surface-dark p-8">
      <div className="flex w-full flex-col items-center gap-10 text-center text-14 text-foreground lg:h-22 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:text-left">
        <span className="flex-1 font-bold tracking-[1.4px]">KURIO</span>

        <p className="flex-1 leading-5.5">
          {tagline[0]}
          <br />
          {tagline[1]}
        </p>

        <a href={`mailto:${email}`} className="flex-1 leading-5.5">
          {email}
        </a>

        <a href={phoneHref} className="leading-5.5 lg:w-57 lg:shrink-0">
          {phone}
        </a>
      </div>
    </div>
  )
}
