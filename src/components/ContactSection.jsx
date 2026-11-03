import ContactForm from './ContactForm.jsx';
import Reveal from './motion/Reveal.jsx';
import WordReveal from './motion/WordReveal.jsx';

// "Ready to Get Started? Contact Our Team Now" + the Elementor form. Carries id="contact" so the
// original "#contact" buttons scroll here.
export default function ContactSection({ title, form }) {
  return (
    <section id="contact" className="scroll-mt-24 bg-surface-gray py-24 md:py-32">
      <div className="container-x grid items-start gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-32">
          <span aria-hidden="true" className="mb-8 block h-1.5 w-16 rounded-full bg-brand-cyan" />
          <WordReveal as="h2" text={title} className="text-balance text-[34px] font-semibold leading-[1.12] tracking-tight text-brand-navy md:text-[52px]" />
        </div>
        <Reveal delay={0.1}>
          <ContactForm {...form} />
        </Reveal>
      </div>
    </section>
  );
}
