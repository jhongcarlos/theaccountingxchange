import { Link } from 'react-router-dom';
import { ORIGIN } from '../content/site.js';

// Converts absolute same-site URLs from the content files to router paths (same path, same domain).
export function toRoute(href = '') {
  if (href.startsWith(ORIGIN + '/')) return href.slice(ORIGIN.length);
  return href;
}

// Router <Link> for internal paths; plain <a> for hashes, external, mailto/tel and malformed links.
export default function SmartLink({ href, target, children, ...rest }) {
  const to = toRoute(href);
  if (to.startsWith('/') && !target) {
    return (
      <Link to={to} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={to} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} {...rest}>
      {children}
    </a>
  );
}
