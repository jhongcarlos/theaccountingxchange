// Generates host config + SEO files from src/routes.js (runs before every build):
//   vercel.json        301s for legacy WordPress URLs, trailing slashes, SPA fallback
//   public/_redirects  the same rules for Netlify
//   public/sitemap.xml the rebuilt pages, at their original URLs
//   public/robots.txt  allow all + sitemap location
import fs from 'node:fs/promises';
import { builtRoutes, redirectMap } from './lib/routes.mjs';

const ORIGIN = 'https://theaccountingxchange.com';
const routes = await builtRoutes();
const redirects = await redirectMap();
// The old WordPress sitemap URLs point at the new sitemap.
const extra = { '/wp-sitemap.xml': '/sitemap.xml', '/sitemap_index.xml': '/sitemap.xml' };

const vercel = {
  trailingSlash: true,
  redirects: Object.entries({ ...redirects, ...extra }).map(([source, destination]) => ({ source, destination, permanent: true })),
  rewrites: [{ source: '/((?!assets/|.*\\.[a-z0-9]+$).*)', destination: '/index.html' }],
};
await fs.writeFile('vercel.json', JSON.stringify(vercel, null, 2) + '\n');

const netlify = [
  ...Object.entries({ ...redirects, ...extra }).flatMap(([from, to]) => [`${from} ${to} 301!`, `${from.replace(/\/$/, '') || '/'} ${to} 301!`]),
  ...routes.filter((r) => r !== '/').map((r) => `${r.replace(/\/$/, '')} ${r} 301!`),
  '/* /index.html 200',
];
await fs.writeFile('public/_redirects', [...new Set(netlify)].join('\n') + '\n');

const today = new Date().toISOString().slice(0, 10);
await fs.writeFile(
  'public/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map((r) => `  <url><loc>${ORIGIN}${r}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`
);
await fs.writeFile('public/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);

console.log(`deploy files: ${routes.length} pages, ${Object.keys(redirects).length + Object.keys(extra).length} redirects`);
