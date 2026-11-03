import Eyebrow from './Eyebrow.jsx';
import Reveal from './motion/Reveal.jsx';
import WordReveal from './motion/WordReveal.jsx';

export default function SectionHeading({ eyebrow, title, intro, align = 'center', dark = false, as = 'h2', className = '' }) {
  const center = align === 'center';
  return (
    <div className={`${center ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'} ${className}`}>
      {eyebrow && (
        <Reveal className="mb-5">
          <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <WordReveal
        as={as}
        text={title}
        className={`text-balance text-[32px] font-semibold leading-[1.15] tracking-tight md:text-[44px] ${dark ? 'text-white' : 'text-brand-navy'}`}
      />
      {intro && (
        <Reveal delay={0.15} as="p" className={`mt-5 text-pretty text-lg leading-relaxed ${dark ? 'text-white/75' : 'text-ink/70'}`}>
          {intro}
        </Reveal>
      )}
    </div>
  );
}
