import { useInView as useFramerInView } from 'framer-motion';

// Site-wide defaults: trigger once, when 20% of the element is visible.
export function useInView(ref, options = {}) {
  return useFramerInView(ref, { once: true, amount: 0.2, ...options });
}
