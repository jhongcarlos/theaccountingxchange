import software from '../content/software.js';
import SectionHeading from './SectionHeading.jsx';
import LogoMarquee from './LogoMarquee.jsx';
import Reveal from './motion/Reveal.jsx';

export default function SoftwareSection({ dark = false }) {
  return (
    <section className={`overflow-hidden py-24 md:py-32 ${dark ? 'bg-brand-navy' : 'bg-white'}`}>
      <div className="container-x">
        <SectionHeading title={software.title} intro={software.intro} dark={dark} />
      </div>
      <Reveal className="mt-14">
        <LogoMarquee logos={software.logos} />
      </Reveal>
    </section>
  );
}
