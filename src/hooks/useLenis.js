import { createContext, createElement, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from 'framer-motion';

export const HEADER_OFFSET = 96;

const LenisContext = createContext(null);

export function LenisProvider({ children }) {
  const reduce = useReducedMotion();
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    if (reduce) return undefined;
    const instance = new Lenis({ duration: 1.1, anchors: { offset: -HEADER_OFFSET } });
    let frame;
    const raf = (time) => {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    setLenis(instance);
    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      setLenis(null);
    };
  }, [reduce]);

  return createElement(LenisContext.Provider, { value: lenis }, children);
}

export function useLenis() {
  return useContext(LenisContext);
}

// Scrolls to the top on route change, or to the hash target when the URL has one.
export function useScrollReset(pathname, hash) {
  const lenis = useLenis();
  useEffect(() => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (target) {
      if (lenis) lenis.scrollTo(target, { offset: -HEADER_OFFSET });
      else target.scrollIntoView();
    } else if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, hash, lenis]);
}
