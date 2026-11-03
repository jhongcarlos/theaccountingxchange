import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from './motion/ease.js';

// The three hero image-box items ("Save money", ...). `float`: badges hover around the hero image on
// desktop and stack below it on mobile. `row`: a simple inline row of chips.
const FLOAT_POS = ['md:-left-10 md:top-12', 'md:-right-8 md:top-[44%]', 'md:bottom-10 md:left-6'];

export default function HeroBadges({ badges, variant = 'float', delay = 0.8 }) {
  const reduce = useReducedMotion();
  const floating = variant === 'float';
  return (
    <ul className={floating ? 'mt-6 grid gap-3 sm:grid-cols-3 md:mt-0 md:block' : 'flex flex-wrap gap-3'}>
      {badges.map((badge, i) => (
        <motion.li
          key={badge.title}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: delay + i * 0.12 }}
          className={floating ? `md:absolute ${FLOAT_POS[i]}` : ''}
        >
          <motion.div
            animate={reduce || !floating ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
            className="flex items-center gap-3 rounded-2xl border border-white/15 bg-brand-navy/60 py-2.5 pl-2.5 pr-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-cyan">
              <img src={badge.icon} alt={badge.alt} width="64" height="64" className="h-6 w-6" />
            </span>
            <p className="text-[15px] font-bold leading-tight text-white">{badge.title}</p>
          </motion.div>
        </motion.li>
      ))}
    </ul>
  );
}
