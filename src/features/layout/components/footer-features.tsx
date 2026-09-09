import { FOOTER_FEATURES } from '../constants/footer'
import { FooterNewsletter } from './footer-newsletter'

export function FooterFeatures() {
  return (
    <div className="bg-surface-card p-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr_1fr_357px] lg:gap-0 lg:[&>*+*]:border-l lg:[&>*+*]:border-primary">
        {FOOTER_FEATURES.map(({ medallion, title, body }) => (
          <div key={title} className="flex flex-col gap-3 lg:px-4">
            <div
              aria-hidden="true"
              className="flex size-18.5 items-center justify-center rounded-full bg-primary text-24 font-bold text-ink"
            >
              {medallion}
            </div>
            <h2 className="text-17 leading-4 font-bold text-foreground">
              {title}
            </h2>
            <p className="text-14 leading-5.5 text-text-secondary lg:max-w-51">
              {body}
            </p>
          </div>
        ))}

        <FooterNewsletter />
      </div>
    </div>
  )
}
