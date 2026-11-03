import paths from './iconPaths.js';

// Inline version of the site's original Font Awesome SVGs so they take `currentColor`.
export default function Icon({ name, className = 'h-4 w-4' }) {
  const icon = paths[name];
  if (!icon) return null;
  return (
    <svg viewBox={icon.viewBox} className={className} fill="currentColor" aria-hidden="true" focusable="false">
      {icon.d.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
