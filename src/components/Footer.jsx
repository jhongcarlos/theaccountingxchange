import { logo, nav, footer } from '../content/site.js';
import SmartLink from './SmartLink.jsx';
import Icon from './Icon.jsx';
import CTABand from './CTABand.jsx';
import StaggerGroup, { StaggerItem } from './motion/StaggerGroup.jsx';

// Footer typography is Sora, as on the live site.
export default function Footer() {
  return (
    <footer className="border-t-4 border-brand-cyan bg-brand-navy font-sans text-white">
      <div className="container-x pb-16 pt-16 md:pb-20 md:pt-20">
        <CTABand title={footer.heading} button={footer.button} titleClassName="font-sans" />

        <StaggerGroup className="mt-16 grid gap-12 md:grid-cols-[1.4fr_1fr_1.2fr] md:gap-8">
          <StaggerItem>
            <SmartLink href={logo.href} className="inline-block rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cyan">
              <img src={logo.src} srcSet={logo.srcSet} sizes="240px" alt={logo.alt} width={logo.width} height={logo.height} loading="lazy" className="h-auto w-[220px] md:w-[240px]" />
            </SmartLink>
            <ul className="mt-8 flex gap-3">
              {footer.socials.map((s) => (
                <li key={s.label}>
                  <SmartLink
                    href={s.href}
                    target={s.target}
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-cyan hover:bg-brand-cyan hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-cyan"
                  >
                    <Icon name={s.icon} className="h-[18px] w-[18px]" />
                    <span className="sr-only">{s.label}</span>
                  </SmartLink>
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem as="nav">
            <ul className="space-y-3">
              {nav.map((item) => (
                <li key={item.label}>
                  <SmartLink href={item.href} className="group inline-flex items-center gap-2 text-white/75 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none">
                    <span aria-hidden="true" className="h-px w-0 bg-brand-cyan transition-all duration-300 group-hover:w-4" />
                    {item.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem>
            <address className="space-y-2 not-italic leading-relaxed text-white/75">
              {footer.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </address>
          </StaggerItem>
        </StaggerGroup>
      </div>
    </footer>
  );
}
