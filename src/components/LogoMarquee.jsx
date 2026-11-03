import Marquee from './motion/Marquee.jsx';

// Infinite logo strip; pauses on hover. Logos sit on white tiles because several files have white backgrounds.
export default function LogoMarquee({ logos }) {
  return (
    <Marquee duration={35} gap="1.25rem">
      {logos.map((logo) => (
        <div key={logo.src} className="grid h-24 w-48 shrink-0 place-items-center rounded-2xl border border-line/70 bg-white px-6 md:h-28 md:w-56">
          <img src={logo.src} alt={logo.alt} loading="lazy" className="max-h-14 w-auto max-w-full object-contain" />
        </div>
      ))}
    </Marquee>
  );
}
