import { motion } from 'framer-motion';
import { StaggerItem } from './motion/StaggerGroup.jsx';

// Hover: lifts 6px, shadow deepens, icon tilts/scales. Use inside a <StaggerGroup>.
export default function Card({ icon, iconAlt = '', title, titleAs: Title = 'h3', children, className = '', dark = false }) {
  return (
    <StaggerItem className={`h-full ${className}`}>
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className={`group flex h-full flex-col rounded-[22px] border p-7 transition-shadow duration-300 md:p-8 ${
          dark
            ? 'border-white/10 bg-white/[0.04] hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]'
            : 'border-line/70 bg-white shadow-[0_1px_2px_rgba(0,33,64,0.04)] hover:shadow-[0_28px_60px_-24px_rgba(0,33,64,0.28)]'
        }`}
      >
        {icon && (
          <div className={`mb-6 grid h-16 w-16 place-items-center rounded-2xl ${dark ? 'bg-white/10' : 'bg-surface-page ring-1 ring-line/60'}`}>
            <img
              src={icon}
              alt={iconAlt}
              loading="lazy"
              className="h-10 w-10 object-contain transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-6 group-hover:scale-110"
            />
          </div>
        )}
        {title && <Title className={`text-xl font-bold leading-snug ${dark ? 'text-white' : 'text-brand-navy'}`}>{title}</Title>}
        {children && <div className={`mt-3 leading-relaxed ${dark ? 'text-white/70' : 'text-ink/70'}`}>{children}</div>}
      </motion.article>
    </StaggerItem>
  );
}
