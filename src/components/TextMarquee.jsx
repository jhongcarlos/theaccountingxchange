import SmartLink from './SmartLink.jsx';
import Marquee from './motion/Marquee.jsx';

// Large looping strip of an existing CTA phrase, linking to the contact page.
// Only the first phrase is a focusable link; the repeats are decorative (aria-hidden via Marquee).
export default function TextMarquee({ label, href, dark = true }) {
  const phrase = (key, first) => (
    <span key={key} className="flex items-center gap-10">
      <span className={`font-serif text-5xl font-semibold tracking-tight md:text-7xl ${dark ? 'text-white' : 'text-brand-navy'}`}>
        {first ? label : <span aria-hidden="true">{label}</span>}
      </span>
      <span aria-hidden="true" className="h-4 w-4 rounded-full bg-brand-cyan md:h-5 md:w-5" />
    </span>
  );

  return (
    <section className={`${dark ? 'bg-brand-navy' : 'bg-surface-gray'} py-10 md:py-14`}>
      <SmartLink
        href={href}
        className="block transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand-cyan"
      >
        <Marquee duration={28} gap="2.5rem">
          {phrase(0, true)}
          {phrase(1)}
          {phrase(2)}
        </Marquee>
      </SmartLink>
    </section>
  );
}
