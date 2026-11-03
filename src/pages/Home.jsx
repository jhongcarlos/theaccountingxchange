import content from '../content/home.js';
import Seo from '../components/Seo.jsx';
import SplitHero from '../components/SplitHero.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import BentoGrid from '../components/BentoGrid.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import TextMarquee from '../components/TextMarquee.jsx';
import ContactSection from '../components/ContactSection.jsx';
import Reveal from '../components/motion/Reveal.jsx';
import CountUp from '../components/motion/CountUp.jsx';

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
      <SplitHero hero={content.hero} />
      <Workspace workspace={content.workspace} />
      <Why why={content.why} />
      <TextMarquee label={content.hero.button.label} href={content.hero.button.href} />
      <ContactSection title={content.contact.title} form={content.contact.form} />
    </>
  );
}
