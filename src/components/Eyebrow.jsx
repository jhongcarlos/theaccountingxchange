// Small label above a section heading. Only ever given existing site text.
export default function Eyebrow({ children, dark = false, as: Tag = 'p', className = '' }) {
  return (
    <Tag
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] ${
        dark ? 'border-white/15 bg-white/5 text-white/80' : 'border-line bg-white text-brand-navy'
      } ${className}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />
      {children}
    </Tag>
  );
}
