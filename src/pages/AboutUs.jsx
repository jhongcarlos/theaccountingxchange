import { motion } from 'framer-motion';
import content from '../content/about.js';
import Seo from '../components/Seo.jsx';
import PageHero from '../components/PageHero.jsx';
import HeroBadges from '../components/HeroBadges.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import BentoGrid from '../components/BentoGrid.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import SoftwareSection from '../components/SoftwareSection.jsx';
import ContactSection from '../components/ContactSection.jsx';
import Parallax from '../components/motion/Parallax.jsx';
import CountUp from '../components/motion/CountUp.jsx';
import StaggerGroup, { StaggerItem } from '../components/motion/StaggerGroup.jsx';

function HeroMedia({ image }) {
  return (
    <div className="relative mx-auto w-full max-w-[500px]">
      {/* cyan offset block echoes the live site's offset box-shadow on this photo */}
      <div aria-hidden="true" className="absolute -left-3 -top-3 h-full w-full rounded-[32px] bg-brand-cyan md:-left-8 md:-top-8" />
      <div className="group relative aspect-square overflow-hidden rounded-[32px] ring-1 ring-white/15">
        <Parallax distance={24} className="absolute -inset-8">
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes="(min-width: 1024px) 500px, 90vw"
            alt={image.alt}
            width={image.width}
            height={image.height}
            fetchPriority="high"
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          />
        </Parallax>
      </div>
    </div>
  );
}

function Why({ why }) {
  return (
    <section className="bg-surface-page py-24 md:py-32">
      <div className="container-x">
        <SectionHeading title={why.title} intro={why.intro} />
        <BentoGrid cols={3} className="mt-14">
          {why.items.map((item) => (
            <Card
              key={item.title}
              icon={item.icon}
              iconAlt={item.alt}
              title={
                item.count ? (
                  <>
                    <CountUp value={item.count.value} suffix={item.count.suffix} />
                    {item.count.rest}
                  </>
                ) : (
                  item.title
                )
              }
            >
              <p>{item.text}</p>
            </Card>
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}

function Bio({ member }) {
  if (member.name !== 'GAURAV') return <p>{member.bio}</p>;
  // "10,000" counts up; the sentence text is unchanged
  const [before, after] = member.bio.split('10,000');
  return (
    <p>
      {before}
      <CountUp value={10000} locale />
      {after}
    </p>
  );
}

function TeamCard({ member, featured }) {
  return (
    <StaggerItem className={featured ? 'md:col-span-2 lg:col-span-2' : ''}>
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className={`group flex h-full flex-col overflow-hidden rounded-[22px] border border-line/70 bg-white transition-shadow duration-300 hover:shadow-[0_28px_60px_-24px_rgba(0,33,64,0.28)] ${
          featured ? 'md:flex-row' : ''
        }`}
      >
        <div className={`relative shrink-0 overflow-hidden bg-surface-gray ${featured ? 'aspect-square md:aspect-auto md:w-[44%]' : 'aspect-[4/3]'}`}>
          <img
            src={member.photo}
            srcSet={`${member.photo} 600w, ${member.photoFull} 1200w`}
            sizes={featured ? '(min-width: 768px) 360px, 100vw' : '(min-width: 1024px) 400px, 100vw'}
            alt={member.alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-7 md:p-8">
          <h3 className="text-xl font-bold tracking-wide text-brand-navy">{member.name}</h3>
          <p className="mt-1 font-sans text-sm font-semibold uppercase tracking-[0.12em] text-brand-cyan">{member.role}</p>
          <span aria-hidden="true" className="my-5 block h-px w-12 bg-line" />
          <div className="space-y-4 leading-relaxed text-ink/70">
            <Bio member={member} />
            {member.memberships && (
              <p className="rounded-xl bg-surface-page p-4 text-[15px]">
                <b className="font-bold text-brand-navy">{member.memberships.label}</b>
                {member.memberships.text}
              </p>
            )}
          </div>
        </div>
      </motion.article>
    </StaggerItem>
  );
}

function Team({ team }) {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container-x">
        <SectionHeading eyebrow={team.eyebrow} title={team.title} />
        <StaggerGroup className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {team.members.map((member, i) => (
            <TeamCard key={member.name} member={member} featured={i === 0} />
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

export default function AboutUs() {
  const { hero } = content;
  return (
    <>
      <Seo {...content.seo} />
      <PageHero title={hero.title} intro={hero.subtitle} media={<HeroMedia image={hero.image} />}>
        <HeroBadges badges={hero.badges} variant="row" delay={0.7} />
        <div className="mt-10">
          <Button href={hero.button.href} label={hero.button.label} variant="cyan" />
        </div>
      </PageHero>
      <Why why={content.why} />
      <Team team={content.team} />
      <SoftwareSection dark />
      <ContactSection title={content.contact.title} form={content.contact.form} />
    </>
  );
}
