import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { nav, headerIcons } from '../content/site.js';
import SmartLink, { toRoute } from './SmartLink.jsx';
import Icon from './Icon.jsx';
import { useLenis } from '../hooks/useLenis.js';
import { EASE } from './motion/ease.js';

// Full-screen menu below lg. Esc closes; page scroll is locked while open; links stagger in.
export default function MobileMenu({ open, onClose }) {
  const lenis = useLenis();
  const firstLink = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    lenis?.stop();
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => firstLink.current?.focus(), 150);
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [open, lenis, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="fixed inset-0 z-40 flex flex-col bg-brand-navy px-6 pb-10 pt-32 lg:hidden"
        >
          <nav>
            <motion.ul initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } }} className="space-y-2">
              {nav.map((item, i) => (
                <motion.li
                  key={item.label}
                  variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
                  className="border-b border-white/10"
                >
                  <NavLink
                    ref={i === 0 ? firstLink : undefined}
                    to={toRoute(item.href)}
                    end
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between py-4 text-4xl font-semibold focus-visible:outline-none focus-visible:text-brand-cyan ${isActive ? 'text-brand-cyan' : 'text-white'}`
                    }
                  >
                    {item.label}
                    <Icon name="fas-chevron-right" className="h-5 w-5 text-white/40" />
                  </NavLink>
                </motion.li>
              ))}
            </motion.ul>
          </nav>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }} className="mt-auto flex gap-3">
            {headerIcons.map((item) => (
              <SmartLink key={item.label} href={item.href} target={item.target} className="grid h-14 w-14 place-items-center rounded-full bg-white text-brand-cyan">
                <Icon name={item.icon} className="h-5 w-5" />
                <span className="sr-only">{item.label}</span>
              </SmartLink>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
