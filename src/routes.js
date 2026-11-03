import { lazy } from 'react';

// Pages being rebuilt (original URL paths, trailing slash included).
export const pages = [
  { path: '/', Component: lazy(() => import('./pages/Home.jsx')) },
  { path: '/services/', Component: lazy(() => import('./pages/Services.jsx')) },
  { path: '/about-us/', Component: lazy(() => import('./pages/AboutUs.jsx')) },
];

// Planned pages not built yet (dev-only placeholder until each lands).
export const pending = ['/contact-us/', '/pricing/'];

// Every other URL in the original sitemap redirects to its closest rebuilt page.
export const redirects = {
  '/about-us-old/': '/about-us/',
  '/home-old/': '/',
  '/services-old/': '/services/',
  '/services-draft/': '/services/',
  '/3-reasons-why/': '/about-us/',
  '/payroll/': '/services/',
  '/tax-preparation/': '/services/',
  '/virtual-assistance/': '/pricing/',
  '/shop/': '/',
  '/cart/': '/',
  '/checkout/': '/',
  '/my-account/': '/',
  '/my-account/lost-password/': '/',
  '/hello-world/': '/',
  '/category/blog/': '/',
  '/author/raj/': '/',
  '/author/theaccountingxchange-com/': '/',
};
