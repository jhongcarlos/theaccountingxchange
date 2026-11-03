import { useReducedMotion } from 'framer-motion';

// Seamless infinite horizontal loop. The track holds `copies` identical groups; only the first is
// exposed to assistive tech. Pauses on hover; static (no loop) under prefers-reduced-motion.
export default function Marquee({ children, duration = 40, reverse = false, copies = 2, gap = '3rem', className = '' }) {
  const reduce = useReducedMotion();
  const group = (i) => (
    <div key={i} aria-hidden={i > 0 ? 'true' : undefined} className="flex shrink-0 items-center" style={{ gap, paddingRight: gap }}>
      {children}
    </div>
  );

  if (reduce) return <div className={`flex flex-wrap items-center justify-center ${className}`} style={{ gap }}>{children}</div>;

  return (
    <div className={`group/marquee flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] ${className}`}>
      <div
        className="flex w-max animate-marquee group-hover/marquee:[animation-play-state:paused]"
        style={{ animationDuration: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal', '--marquee-shift': `-${100 / copies}%` }}
      >
        {Array.from({ length: copies }, (_, i) => group(i))}
      </div>
    </div>
  );
}
