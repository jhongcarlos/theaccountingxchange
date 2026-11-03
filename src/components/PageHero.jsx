import { motion } from 'framer-motion';
import Eyebrow from './Eyebrow.jsx';
import HeroBackdrop from './HeroBackdrop.jsx';
import WordReveal from './motion/WordReveal.jsx';
import { EASE } from './motion/ease.js';

// Compact inner-page hero: optional eyebrow, title, intro, extra content (buttons/badges) and an
// optional media block on the right.
export default function PageHero({ eyebrow, title, intro, children, media, titleClassName = 'font-serif' }) {
  const split = Boolean(media);
  return (
    <section className="relative overflow-hidden bg-brand-navy pb-16 pt-36 md:pb-24 md:pt-44">
      <HeroBackdrop />
      <div className={`container-x relative ${split ? 'grid items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20' : 'text-center'}`}>
        <div className={split ? '' : 'mx-auto max-w-3xl'}>
          {eyebrow && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.15 }} className="mb-6">
              <Eyebrow dark>{eyebrow}</Eyebrow>
            </motion.div>
          )}
          <WordReveal
            as="h1"
            onLoad
            delay={0.25}
            text={title}
            className={`text-balance text-[40px] font-semibold leading-[1.08] tracking-tight text-white sm:text-[52px] lg:text-[60px] ${titleClassName}`}
          />
          {intro && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
              className={`mt-6 text-pretty text-lg leading-relaxed text-white/75 md:text-xl ${split ? 'max-w-xl' : 'mx-auto max-w-2xl'}`}
            >
              {intro}
            </motion.p>
          )}
          {children && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.7 }} className="mt-10">
              {children}
            </motion.div>
          )}
        </div>
        {media && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: EASE, delay: 0.3 }}>
            {media}
          </motion.div>
        )}
      </div>
    </section>
  );
}
