import Button from './Button.jsx';
import Reveal from './motion/Reveal.jsx';
import WordReveal from './motion/WordReveal.jsx';

// Final call-to-action band. Content always comes from the page or footer content files.
export default function CTABand({ title, text, button, titleClassName = 'font-serif' }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-brand-cyan px-6 py-14 text-center md:px-16 md:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-brand-navy/30 blur-3xl" />
      <div className="relative mx-auto max-w-3xl">
        <WordReveal as="h2" text={title} className={`text-balance text-3xl font-extrabold leading-tight text-white md:text-5xl ${titleClassName}`} />
        {text && (
          <Reveal as="p" delay={0.1} className="mt-5 text-lg text-white/85">
            {text}
          </Reveal>
        )}
        <Reveal delay={0.2} className="mt-9">
          <Button href={button.href} label={button.label} variant="light" />
        </Reveal>
      </div>
    </div>
  );
}
