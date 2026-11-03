import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from './motion/ease.js';

export default function PageTransition({ children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 12 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } }}
      exit={{ opacity: 0, y: reduce ? 0 : -8, transition: { duration: 0.25, ease: EASE } }}
    >
      {children}
    </motion.div>
  );
}
