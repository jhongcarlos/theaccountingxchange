import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

// Numbered step cards that pin while scrolling; each next card slides over the previous one,
// which scales down to 0.95. `steps` = [{ number, title, text }].
function StepCard({ step, index, total, progress }) {
  const reduce = useReducedMotion();
  const start = index / total;
  const scale = useTransform(progress, [start, start + 1 / total], [1, index === total - 1 ? 1 : 0.95]);
  return (
    <div className="sticky" style={{ top: `${112 + index * 20}px` }}>
      <motion.article
        style={{ scale: reduce ? 1 : scale }}
        className="origin-top rounded-[28px] border border-white/10 bg-brand-navy p-8 shadow-[0_-12px_40px_-20px_rgba(0,0,0,0.5)] md:flex md:items-start md:gap-12 md:p-12"
      >
        <p className="font-sans text-7xl font-extrabold leading-none text-brand-cyan md:w-32 md:text-8xl">{step.number}</p>
        <div className="mt-6 md:mt-2">
          <h3 className="text-2xl font-semibold text-white md:text-3xl">{step.title}</h3>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/70">{step.text}</p>
        </div>
      </motion.article>
    </div>
  );
}

export default function StickyStepCards({ steps }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  return (
    <div ref={ref} className="relative flex flex-col gap-8 pb-8">
      {steps.map((step, i) => (
        <StepCard key={step.number} step={step} index={i} total={steps.length} progress={scrollYProgress} />
      ))}
    </div>
  );
}
