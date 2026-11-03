import SmartLink from './SmartLink.jsx';
import Icon from './Icon.jsx';

const VARIANTS = {
  navy: { tone: 'bg-brand-navy text-white hover:shadow-[0_12px_30px_-10px_rgba(0,33,64,0.6)]', arrow: 'bg-white/15' },
  cyan: { tone: 'bg-brand-cyan text-white hover:shadow-[0_12px_30px_-10px_rgba(0,175,239,0.7)]', arrow: 'bg-white/20' },
  light: { tone: 'bg-white text-brand-navy hover:shadow-[0_12px_30px_-10px_rgba(255,255,255,0.45)]', arrow: 'bg-brand-navy/10' },
};

export const buttonBase =
  'group inline-flex items-center gap-3 rounded-button py-2.5 pl-6 pr-2.5 text-[15px] font-semibold tracking-wide transition-[transform,box-shadow] duration-300 hover:scale-[1.02] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cyan disabled:pointer-events-none disabled:opacity-60';

// Label rolls up on hover (an aria-hidden duplicate slides in from below); the arrow nudges right.
export function ButtonInner({ label, variant = 'navy', arrow = true }) {
  const roll = 'block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]';
  return (
    <>
      <span className="relative block overflow-hidden">
        <span className={`${roll} group-hover:-translate-y-full`}>{label}</span>
        <span aria-hidden="true" className={`${roll} absolute inset-0 translate-y-full group-hover:translate-y-0`}>
          {label}
        </span>
      </span>
      {arrow && (
        <span className={`grid h-7 w-7 place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-1 ${VARIANTS[variant].arrow}`}>
          <Icon name="fas-chevron-right" className="h-3 w-3" />
        </span>
      )}
    </>
  );
}

export function buttonClass(variant = 'navy') {
  return `${buttonBase} ${VARIANTS[variant].tone}`;
}

export default function Button({ href, label, variant = 'navy', arrow = true, className = '', ...rest }) {
  return (
    <SmartLink href={href} className={`${buttonClass(variant)} ${className}`} {...rest}>
      <ButtonInner label={label} variant={variant} arrow={arrow} />
    </SmartLink>
  );
}
