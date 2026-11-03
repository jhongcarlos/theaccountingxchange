// Decorative navy hero background: faint grid + cyan glows.
export default function HeroBackdrop() {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid-white opacity-[0.06] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-brand-cyan/25 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 bottom-0 h-[360px] w-[360px] rounded-full bg-brand-cyan/10 blur-[100px]" />
    </>
  );
}
