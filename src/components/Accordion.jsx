import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon.jsx';
import { EASE } from './motion/ease.js';

// FAQ accordion: buttons with aria-expanded/controls, animated height, plus icon rotates 45deg.
export default function Accordion({ items, defaultOpen = 0 }) {
  const [open, setOpen] = useState(defaultOpen);
  const baseId = useId();

  return (
    <div className="divide-y divide-line/70 overflow-hidden rounded-[22px] border border-line/70 bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        return (
          <div key={item.q}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left text-lg font-semibold text-brand-navy transition-colors hover:bg-surface-page focus-visible:bg-surface-page focus-visible:outline-none md:px-8"
              >
                {item.q}
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors ${isOpen ? 'bg-brand-cyan text-white' : 'bg-surface-gray text-brand-navy'}`}
                >
                  <Icon name="fas-plus" className="h-3.5 w-3.5" />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-7 leading-relaxed text-ink/70 md:px-8">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
