import { Fragment } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE, VIEWPORT } from './ease.js';

// Reveals a string word by word (blur 8px -> 0, y 20 -> 0, opacity 0 -> 1, 0.05s stagger).
// Words are inline-block spans separated by real spaces, so the text content is unchanged.
export default function WordReveal({ text, as = 'h2', onLoad = false, delay = 0, className }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const words = text.split(' ');
  const trigger = onLoad ? { animate: 'show' } : { whileInView: 'show', viewport: VIEWPORT };

  return (
    <Tag
      className={className}
      initial="hidden"
      {...trigger}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          <motion.span
            className="inline-block"
            variants={{
              hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 20, filter: 'blur(8px)' },
              show: reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE } },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </Tag>
  );
}
