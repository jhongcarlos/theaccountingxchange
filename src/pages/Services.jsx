import { motion } from 'framer-motion';
import content from '../content/services.js';
import Seo from '../components/Seo.jsx';
import SplitHero from '../components/SplitHero.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import BentoGrid from '../components/BentoGrid.jsx';
import Eyebrow from '../components/Eyebrow.jsx';
import Icon from '../components/Icon.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import SoftwareSection from '../components/SoftwareSection.jsx';
import ContactSection from '../components/ContactSection.jsx';
import Reveal from '../components/motion/Reveal.jsx';
import WordReveal from '../components/motion/WordReveal.jsx';
import StaggerGroup, { StaggerItem } from '../components/motion/StaggerGroup.jsx';

function WhatWeDo({ section }) {
  return (
    <section className="bg-surface-page py-24 md:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading title={section.title} intro={section.intro} align="left" />
          <Reveal delay={0.2} className="mt-9">
            <Button href={section.button.href} label={section.button.label} />
          </Reveal>
        </div>
        <StaggerGroup as="ul" className="overflow-hidden rounded-[22px] border border-line/70 bg-white">
          {section.items.map((item) => (
            <StaggerItem as="li" key={item.title} className="group border-b border-line/70 last:border-b-0">
              <div className="flex gap-5 p-6 transition-colors duration-300 hover:bg-surface-page md:gap-7 md:p-8">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-cyan/10 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-6 group-hover:scale-110">
                  <img src={item.icon} alt={item.alt} loading="lazy" className="h-9 w-9 object-contain" />
                </span>
                <div>
                  <h3 className="text-xl font-semibold leading-snug text-brand-navy">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink/70">{item.text}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

function Benefits({ section }) {
  return (
    <section className="bg-surface-page py-24 md:py-32">
      <div className="container-x">
        <SectionHeading title={section.title} />
        <BentoGrid cols={3} className="mt-14">
          {section.items.map((item) => (
            <Card key={item.text} icon={item.icon} iconAlt={item.alt}>
              <p className="text-[17px] text-ink/80">{item.text}</p>
            </Card>
          ))}
        </BentoGrid>
        <Reveal className="mt-12 text-center">
          <Button href={section.button.href} label={section.button.label} />
        </Reveal>
      </div>
    </section>
  );
}

function Staffing({ section }) {
  return (
    <section className="bg-surface-gray py-24 md:py-32">
      <div className="container-x grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading eyebrow={section.eyebrow} title={section.title} intro={section.intro} align="left" />
          <Reveal delay={0.2} className="relative mt-10 overflow-hidden rounded-[22px] bg-brand-navy p-8 md:p-10">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-cyan/30 blur-3xl" />
            <span aria-hidden="true" className="relative mb-6 block h-1.5 w-14 rounded-full bg-brand-cyan" />
            <p className="relative text-balance text-3xl font-semibold leading-tight text-white md:text-4xl">{section.highlight}</p>
          </Reveal>
        </div>
        <StaggerGroup className="grid gap-5">
          {section.items.map((item) => (
            <StaggerItem key={item.title}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="group flex items-center gap-6 rounded-[22px] border border-line/70 bg-white p-6 transition-shadow duration-300 hover:shadow-[0_28px_60px_-24px_rgba(0,33,64,0.28)] md:p-7"
              >
                <img
                  src={item.icon}
                  alt={item.alt}
                  loading="lazy"
                  className="h-16 w-16 shrink-0 object-contain transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-6 group-hover:scale-110"
                />
                <div>
                  <h3 className="text-xl font-semibold text-brand-navy">{item.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-ink/70">{item.text}</p>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

function Security({ section }) {
  return (
    <section className="relative overflow-hidden bg-brand-navy py-24 md:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-brand-cyan/15 blur-[120px]" />
      <div className="container-x relative">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} intro={section.intro} dark />
        <StaggerGroup as="ul" className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:[&>li:last-child]:col-start-2">
          {section.features.map((f) => (
            <StaggerItem as="li" key={f} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white/90">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-cyan/15 text-brand-cyan">
                <Icon name="fas-circle" className="h-2.5 w-2.5" />
              </span>
              {f}
            </StaggerItem>
          ))}
        </StaggerGroup>
        <div className="mx-auto mt-16 max-w-5xl rounded-[28px] border border-white/10 bg-white/[0.03] p-8 text-center md:p-12">
          <WordReveal as="h3" text={section.credentialsTitle} className="text-balance text-2xl font-semibold text-white md:text-3xl" />
          <StaggerGroup as="ul" className="mt-8 flex flex-wrap justify-center gap-3">
            {section.credentials.map((c) => (
              <StaggerItem as="li" key={c} y={14}>
                <Eyebrow as="span" dark className="normal-case tracking-normal text-sm">
                  {c}
                </Eyebrow>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}

export default function Services() {
  return (
    <>
      <Seo {...content.seo} />
      <SplitHero hero={content.hero} />
      <WhatWeDo section={content.whatWeDo} />
      <SoftwareSection />
      <Benefits section={content.benefits} />
      <Staffing section={content.staffing} />
      <Security section={content.security} />
      <ContactSection title={content.contact.title} form={content.contact.form} />
    </>
  );
}
