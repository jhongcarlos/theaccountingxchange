import { motion, useReducedMotion } from 'framer-motion';
import content from '../content/home.js';
import Seo from '../components/Seo.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import BentoGrid from '../components/BentoGrid.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import TextMarquee from '../components/TextMarquee.jsx';
import ContactSection from '../components/ContactSection.jsx';
import Reveal from '../components/motion/Reveal.jsx';
import WordReveal from '../components/motion/WordReveal.jsx';
import Parallax from '../components/motion/Parallax.jsx';
import CountUp from '../components/motion/CountUp.jsx';
import { EASE } from '../components/motion/ease.js';

// Floating badge positions around the hero image (desktop); they stack below the image on mobile.
const BADGE_POS = ['md:-left-10 md:top-12', 'md:-right-8 md:top-[44%]', 'md:bottom-10 md:left-6'];

function Hero({ hero }) {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-brand-navy pb-20 pt-36 md:pb-28 md:pt-44">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid-white opacity-[0.06] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-brand-cyan/25 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 bottom-0 h-[360px] w-[360px] rounded-full bg-brand-cyan/10 blur-[100px]" />

      <div className="container-x relative grid items-center gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <WordReveal
            as="h1"
            onLoad
            delay={0.25}
            text={hero.title}
            className="text-balance text-[42px] font-semibold leading-[1.08] tracking-tight text-white sm:text-[56px] lg:text-[68px]"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.6 }}
            className="mt-7 max-w-xl text-xl leading-relaxed text-white/75"
          >
            {hero.subtitle}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.75 }} className="mt-10">
            <Button href={hero.button.href} label={hero.button.label} variant="cyan" />
          </motion.div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.3 }}
            className="group relative aspect-square overflow-hidden rounded-[32px] ring-1 ring-white/15"
          >
            <Parallax distance={24} className="absolute -inset-8">
              <img
                src={hero.image.src}
                srcSet={hero.image.srcSet}
                sizes="(min-width: 1024px) 520px, 90vw"
                alt={hero.image.alt}
                width={hero.image.width}
                height={hero.image.height}
                fetchPriority="high"
                className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
            </Parallax>
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-navy/50 via-transparent to-transparent" />
          </motion.div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-3 md:mt-0 md:block">
            {hero.badges.map((badge, i) => (
              <motion.li
                key={badge.title}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.8 + i * 0.12 }}
                className={`md:absolute ${BADGE_POS[i]}`}
              >
                <motion.div
                  animate={reduce ? undefined : { y: [0, -8, 0] }}
                  transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
                  className="flex items-center gap-3 rounded-2xl border border-white/15 bg-brand-navy/60 py-3 pl-3 pr-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-cyan">
                    <img src={badge.icon} alt={badge.alt} width="64" height="64" className="h-7 w-7" />
                  </span>
                  <p className="text-[15px] font-bold leading-tight text-white">{badge.title}</p>
                </motion.div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Workspace({ workspace }) {
  const { before, count, after } = workspace.intro;
  return (
    <section className="bg-surface-page py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          title={workspace.title}
          intro={
            <>
              {before}
              <CountUp value={count} />
              {after}
            </>
          }
        />
        <Reveal y={40} className="relative mx-auto mt-14 max-w-5xl">
          <div aria-hidden="true" className="absolute -bottom-4 -left-4 h-full w-full rounded-[28px] bg-brand-cyan md:-bottom-5 md:-left-5" />
          <div className="relative aspect-video overflow-hidden rounded-[28px] bg-brand-navy shadow-[0_40px_100px_-40px_rgba(0,33,64,0.5)]">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${workspace.video.id}?rel=0`}
              title="YouTube video player"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Why({ why }) {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container-x">
        <SectionHeading title={why.title} />
        <BentoGrid cols={3} className="mt-14">
          {why.items.map((item) => (
            <Card key={item.title} icon={item.icon} iconAlt={item.alt} title={item.title}>
              <p>{item.description}</p>
            </Card>
          ))}
        </BentoGrid>
        <Reveal className="mt-12 text-center">
          <Button href={why.button.href} label={why.button.label} />
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Seo {...content.seo} />
      <Hero hero={content.hero} />
      <Workspace workspace={content.workspace} />
      <Why why={content.why} />
      <TextMarquee label={content.hero.button.label} href={content.hero.button.href} />
      <ContactSection title={content.contact.title} form={content.contact.form} />
    </>
  );
}
