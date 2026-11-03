import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { logo, nav, headerIcons, menuToggleLabel } from '../content/site.js';
import SmartLink, { toRoute } from './SmartLink.jsx';
import Icon from './Icon.jsx';
import MobileMenu from './MobileMenu.jsx';
import { EASE } from './motion/ease.js';

// Sticky header: transparent over the navy hero, blurred translucent navy + shadow once scrolled.
// The logo only exists in a light variant, so the header is always on navy.
export default function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          scrolled || menuOpen ? 'bg-brand-navy/80 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.45)] backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className={`container-x flex items-center justify-between gap-6 transition-[height] duration-500 ${scrolled ? 'h-[72px]' : 'h-[88px]'}`}>
          <SmartLink href={logo.href} className="shrink-0 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cyan">
            <img src={logo.src} srcSet={logo.srcSet} sizes="200px" alt={logo.alt} width={logo.width} height={logo.height} className="h-auto w-[180px] md:w-[200px]" />
          </SmartLink>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1.5">
              {nav.map((item) => (
                <li key={item.label}>
                  <NavLink
                    to={toRoute(item.href)}
                    end
                    className={({ isActive }) =>
                      `block rounded-full px-5 py-2 text-[15px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-cyan ${
                        isActive ? 'bg-white text-brand-navy' : 'text-white/85 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {headerIcons.map((item) => (
              <SmartLink
                key={item.label}
                href={item.href}
                target={item.target}
                className="hidden h-11 w-11 place-items-center rounded-full bg-white text-brand-cyan transition-transform duration-300 hover:-translate-y-0.5 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan sm:grid"
              >
                <Icon name={item.icon} className="h-4 w-4" />
                <span className="sr-only">{item.label}</span>
              </SmartLink>
            ))}
            <button
              type="button"
              aria-label={menuToggleLabel}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
              className="relative ml-1 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-cyan lg:hidden"
            >
              <span className="sr-only">Menu</span>
              <span className={`absolute h-0.5 w-5 rounded bg-current transition-transform duration-300 ${menuOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
              <span className={`absolute h-0.5 w-5 rounded bg-current transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`absolute h-0.5 w-5 rounded bg-current transition-transform duration-300 ${menuOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
            </button>
          </div>
        </div>
      </motion.header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
