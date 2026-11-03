import { useEffect, useRef, useState } from 'react';
import content from '../content/contact.js';
import Seo from '../components/Seo.jsx';
import PageHero from '../components/PageHero.jsx';
import SmartLink from '../components/SmartLink.jsx';
import Icon from '../components/Icon.jsx';
import Reveal from '../components/motion/Reveal.jsx';
import StaggerGroup, { StaggerItem } from '../components/motion/StaggerGroup.jsx';

// Loads the LeadConnector embed script (as the original HTML widget did) and reports when it is ready.
// The booking iframe is mounted only after that: form_embed.js hides each iframe until the widget
// posts a "loaded" message, so the script must be listening before the iframe loads. Auto-height then
// comes from the iframe-resizer the script bundles. If the script fails to load, the iframe is shown
// anyway at a fixed height.
let embedScript;
function useEmbedScript(src) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    embedScript ||= new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.type = 'text/javascript';
      script.onload = script.onerror = resolve;
      document.body.appendChild(script);
    });
    let live = true;
    embedScript.then(() => live && setReady(true));
    return () => {
      live = false;
    };
  }, [src]);
  return ready;
}

export default function ContactUs() {
  const { hero, map, addressLines, links, booking } = content;
  const scriptReady = useEmbedScript(booking.script);
  const bookingFrame = useRef(null);
  useEffect(() => {
    if (scriptReady && bookingFrame.current && window.iFrameResize) window.iFrameResize({ checkOrigin: false }, bookingFrame.current);
  }, [scriptReady]);

  return (
    <>
      <Seo {...content.seo} />
      {/* Contact Us is set in Sora on the live site */}
      <PageHero title={hero.title} intro={hero.intro} titleClassName="font-sans font-extrabold tracking-tight" />

      <section className="bg-surface-page py-20 md:py-28">
        <div className="container-x grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          <div className="min-w-0 space-y-6 font-sans lg:sticky lg:top-28">
            <Reveal className="relative overflow-hidden rounded-[22px] bg-brand-navy p-8 text-white md:p-10">
              <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-cyan/25 blur-3xl" />
              <address className="relative space-y-1 text-lg not-italic leading-relaxed text-white/85">
                {addressLines.map((line) => (
                  <p key={line} className={line === 'Address :' ? 'mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-brand-cyan' : ''}>
                    {line}
                  </p>
                ))}
              </address>
            </Reveal>

            <StaggerGroup as="ul" className="grid gap-3">
              {links.map((link) => (
                <StaggerItem as="li" key={link.href}>
                  <SmartLink
                    href={link.href}
                    className="group flex items-center gap-4 rounded-2xl border border-line/70 bg-white p-4 pr-6 text-lg font-bold text-brand-navy transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-cyan hover:shadow-[0_20px_40px_-24px_rgba(0,33,64,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-cyan md:text-xl"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-cyan text-white transition-transform duration-300 group-hover:scale-110">
                      <Icon name={link.icon} className="h-5 w-5" />
                    </span>
                    <span className="break-all sm:break-normal">{link.label}</span>
                  </SmartLink>
                </StaggerItem>
              ))}
            </StaggerGroup>

            <Reveal className="overflow-hidden rounded-[22px] border border-line/70 bg-white">
              <iframe
                src={map.src}
                title={map.title}
                aria-label={map.title}
                loading="lazy"
                className="block h-[320px] w-full grayscale-[30%]"
              />
            </Reveal>
          </div>

          <Reveal delay={0.1} className="min-w-0 overflow-hidden rounded-[22px] border border-line/70 bg-white p-2 shadow-[0_30px_80px_-40px_rgba(0,33,64,0.35)] md:p-4">
            {scriptReady ? (
              <iframe ref={bookingFrame} src={booking.src} id={booking.id} scrolling="" className="block min-h-[760px] w-full border-0" style={{ width: '100%', border: 'none', overflow: 'hidden' }} />
            ) : (
              <div className="min-h-[760px] animate-pulse rounded-2xl bg-surface-page" />
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
