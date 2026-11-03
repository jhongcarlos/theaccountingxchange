import { useEffect, useRef } from 'react';
import { animate, useReducedMotion } from 'framer-motion';
import { useInView } from '../../hooks/useInView.js';

// Counts from 0 to `value` when in view. Screen readers (and the content diff) get the final text
// from the sr-only span; the animated digits are aria-hidden.
export default function CountUp({ value, prefix = '', suffix = '', duration = 1.6, locale = false }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref);
  const fmt = (n) => prefix + (locale ? Math.round(n).toLocaleString('en-US') : Math.round(n)) + suffix;

  useEffect(() => {
    if (!inView || !ref.current) return undefined;
    if (reduce) {
      ref.current.textContent = fmt(value);
      return undefined;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (n) => {
        if (ref.current) ref.current.textContent = fmt(n);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value]);

  return (
    <>
      <span ref={ref} aria-hidden="true" className="tabular-nums">
        {reduce ? fmt(value) : fmt(0)}
      </span>
      <span className="sr-only">{fmt(value)}</span>
    </>
  );
}
