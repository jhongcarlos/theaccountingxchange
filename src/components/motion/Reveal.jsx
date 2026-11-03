import { motion, useReducedMotion } from 'framer-motion';
import { EASE, VIEWPORT } from './ease.js';

// Fades + slides a block up 30px when 20% of it is in view. Runs once.
export default function Reveal({ as = 'div', delay = 0, y = 30, className, children, ...rest }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
