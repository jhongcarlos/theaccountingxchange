import { motion, useReducedMotion } from 'framer-motion';
import { EASE, VIEWPORT } from './ease.js';

// Parent that reveals its <StaggerItem> children 0.08s apart once in view.
export default function StaggerGroup({ as = 'div', stagger = 0.08, delay = 0, className, children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({ as = 'div', y = 30, className, children, ...rest }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : y },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
