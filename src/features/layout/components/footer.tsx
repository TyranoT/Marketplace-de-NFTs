import { Container } from '@/global/components/ui/container'
import { FOOTER_CONTACT } from '../constants/footer'
import { FooterBrand } from './footer-brand'
import { FooterFeatures } from './footer-features'
import { FooterLinks } from './footer-links'

export function Footer() {
  return (
    <Container as="footer" className="flex flex-col gap-1.5 pb-10">
      <FooterFeatures />
      <FooterBrand />

      <div className="flex flex-col gap-1.5">
        <FooterLinks />
        <p className="text-center text-14 leading-7.5 text-foreground">
          {FOOTER_CONTACT.copyright}
        </p>
      </div>
    </Container>
  )
}
