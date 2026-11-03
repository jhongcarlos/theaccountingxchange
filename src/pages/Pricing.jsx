import { motion } from 'framer-motion';
import content from '../content/pricing.js';
import Seo from '../components/Seo.jsx';
import PageHero from '../components/PageHero.jsx';
import Button from '../components/Button.jsx';
import Icon from '../components/Icon.jsx';
import Accordion from '../components/Accordion.jsx';
import CTABand from '../components/CTABand.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import StickyStepCards from '../components/StickyStepCards.jsx';
import Parallax from '../components/motion/Parallax.jsx';
import Reveal from '../components/motion/Reveal.jsx';
import WordReveal from '../components/motion/WordReveal.jsx';
import StaggerGroup, { StaggerItem } from '../components/motion/StaggerGroup.jsx';

function FeatureList({ items, dark }) {
  return (
    <ul className="space-y-3">
      {items.map((f) => (
        <li key={f} className={`flex items-center gap-3 ${dark ? 'text-white/85' : 'text-ink/80'}`}>
          <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${dark ? 'bg-brand-cyan text-white' : 'bg-brand-cyan/10 text-brand-cyan'}`}>
            <Icon name="fas-chevron-right" className="h-2.5 w-2.5" />
          </span>
          {f}
        </li>
      ))}
    </ul>
  );
}

// The middle package is visually emphasised (navy card); no label or copy is added.
function PackageCard({ pkg, featured }) {
  return (
    <StaggerItem className="h-full">
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className={`group flex h-full flex-col rounded-[28px] border p-8 transition-shadow duration-300 md:p-9 ${
          featured
            ? 'border-brand-navy bg-brand-navy shadow-[0_40px_80px_-30px_rgba(0,33,64,0.6)] lg:-my-4 lg:py-12'
            : 'border-line/70 bg-white hover:shadow-[0_28px_60px_-24px_rgba(0,33,64,0.28)]'
        }`}
      >
        <span
          className={`grid h-14 w-14 place-items-center rounded-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-6 group-hover:scale-110 ${
            featured ? 'bg-brand-cyan text-white' : 'bg-brand-navy text-white'
          }`}
        >
          <Icon name={pkg.icon} className="h-6 w-6" />
        </span>
        <h3 className={`mt-7 font-sans text-sm font-bold tracking-[0.14em] ${featured ? 'text-brand-cyan' : 'text-brand-navy'}`}>{pkg.title}</h3>
        <p className={`mt-3 text-lg leading-snug ${featured ? 'text-white' : 'text-ink'}`}>{pkg.tagline}</p>
        <div className={`my-7 h-px ${featured ? 'bg-white/15' : 'bg-line/70'}`} />
        <FeatureList items={pkg.features} dark={featured} />
        <p className={`mt-auto pt-8 text-2xl font-bold ${featured ? 'text-white' : 'text-brand-navy'}`}>{pkg.fee}</p>
        <div className="mt-6">
          <Button href={pkg.button.href} label={pkg.button.label} variant={featured ? 'cyan' : 'navy'} className="w-full justify-between" />
        </div>
      </motion.article>
    </StaggerItem>
  );
}

function Packages({ packages }) {
  return (
    <section className="bg-surface-page pb-24 pt-16 md:pb-32 md:pt-24">
      <StaggerGroup className="container-x grid items-stretch gap-6 lg:grid-cols-3">
        {packages.map((pkg, i) => (
          <PackageCard key={pkg.title} pkg={pkg} featured={i === 1} />
        ))}
      </StaggerGroup>
    </section>
  );
}

function Assistant({ section }) {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading eyebrow={section.eyebrow} title={section.title} intro={section.intro} align="left" />
          <Reveal delay={0.15} className="mt-10 rounded-[22px] border border-line/70 bg-surface-page p-7 md:p-8">
            <h3 className="text-xl font-bold text-brand-navy">{section.cardTitle}</h3>
            <div className="mt-5">
              <FeatureList items={section.features} />
            </div>
            <div className="mt-8">
              <Button href={section.button.href} label={section.button.label} />
            </div>
          </Reveal>
        </div>
        <Reveal y={40} className="relative">
          <div aria-hidden="true" className="absolute -bottom-4 -right-4 h-full w-full rounded-[32px] bg-brand-cyan md:-bottom-6 md:-right-6" />
          <div className="group relative aspect-square overflow-hidden rounded-[32px]">
            <Parallax className="absolute -inset-10">
              <img
                src={section.image.src}
                srcSet={section.image.srcSet}
                sizes="(min-width: 1024px) 600px, 100vw"
                alt={section.image.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
            </Parallax>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Why({ why }) {
  return (
    <section className="bg-surface-gray py-24 md:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <span aria-hidden="true" className="mb-8 block h-1.5 w-16 rounded-full bg-brand-cyan" />
          <WordReveal as="h2" text={why.title} className="text-balance text-[34px] font-semibold leading-[1.12] tracking-tight text-brand-navy md:text-[48px]" />
        </div>
        <StickyStepCards steps={why.steps} />
      </div>
    </section>
  );
}

function Faq({ faq }) {
  return (
    <section className="bg-surface-page py-24 md:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <span aria-hidden="true" className="mb-8 block h-1.5 w-16 rounded-full bg-brand-cyan" />
          <WordReveal as="h2" text={faq.title} className="text-balance text-[34px] font-semibold leading-[1.12] tracking-tight text-brand-navy md:text-[48px]" />
        </div>
        <Reveal delay={0.1}>
          <Accordion items={faq.items} ariaLabel={faq.ariaLabel} />
        </Reveal>
      </div>
    </section>
  );
}

export default function Pricing() {
  return (
    <>
      <Seo {...content.seo} />
      <PageHero title={content.hero.title} intro={content.hero.intro} />
      <Packages packages={content.packages} />
      <Assistant section={content.assistant} />
      <Why why={content.why} />
      <Faq faq={content.faq} />
      <section className="bg-surface-page pb-24 md:pb-32">
        <div className="container-x">
          <CTABand title={content.cta.title} text={content.cta.text} button={content.cta.button} variant="navy" />
        </div>
      </section>
    </>
  );
}
