import { motion } from 'framer-motion';
import Button from './Button.jsx';
import HeroBadges from './HeroBadges.jsx';
import HeroBackdrop from './HeroBackdrop.jsx';
import Parallax from './motion/Parallax.jsx';
import WordReveal from './motion/WordReveal.jsx';
import { EASE } from './motion/ease.js';

// Full-height split hero: headline + subtext + CTA, the hero image in a rounded frame with floating badges.
export default function SplitHero({ hero }) {
  return (
    <section className="relative overflow-hidden bg-brand-navy pb-20 pt-36 md:pb-28 md:pt-44">
      <HeroBackdrop />
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
          <HeroBadges badges={hero.badges} />
        </div>
      </div>
    </section>
  );
}
