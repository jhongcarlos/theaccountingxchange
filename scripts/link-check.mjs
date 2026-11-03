// Verifies that every link, asset, embed and form from docs/inventory.json is present and working
// in the build. Usage: node scripts/link-check.mjs [baseUrl] [route ...]  (default: http://localhost:4173)
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import { builtRoutes, redirectMap } from './lib/routes.mjs';

const ORIGIN = 'https://theaccountingxchange.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const base = process.argv[2] || 'http://localhost:4173';
const routes = process.argv.length > 3 ? process.argv.slice(3) : await builtRoutes();
const inventory = JSON.parse(await fs.readFile('docs/inventory.json', 'utf8'));

const toLocal = (href) => (href.startsWith(ORIGIN + '/') ? href.slice(ORIGIN.length) : href);
// "/wp-content/uploads/2026/01/x-1024x1024.png" -> "2026/01/x.png" (size variants are the same asset)
const uploadKey = (u) => {
  const m = decodeURIComponent(u).match(/\/(?:wp-content|assets)\/uploads\/(.+?)(?:-\d+x\d+)?(\.[a-z0-9]+)$/i);
  return m ? m[1] + m[2] : null;
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ reducedMotion: 'reduce' });
const lines = [];
let failures = 0;
const fail = (msg) => (failures++, lines.push(`  ✗ ${msg}`));
const pass = (msg) => lines.push(`  ✓ ${msg}`);
const externals = new Map();

for (const route of routes) {
  const inv = inventory.pages.find((p) => p.route === route);
  lines.push(`\n## ${route}`);
  const page = await ctx.newPage();
  const responses = [];
  page.on('response', (r) => responses.push({ url: r.url(), status: r.status() }));
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await page.waitForTimeout(1000);

  const dom = await page.evaluate(() => ({
    links: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
    images: [...document.querySelectorAll('img')].flatMap((i) => [i.getAttribute('src'), ...(i.getAttribute('srcset') || '').split(',').map((s) => s.trim().split(/\s+/)[0])]).filter(Boolean),
    iframes: [...document.querySelectorAll('iframe')].map((f) => f.getAttribute('src')),
    forms: [...document.querySelectorAll('form')].map((f) => ({
      name: f.getAttribute('name'),
      fields: [...f.querySelectorAll('input, textarea, select')].map((e) => ({ name: e.getAttribute('name'), value: e.type === 'hidden' ? e.value : undefined, required: e.required, placeholder: e.getAttribute('placeholder') })),
    })),
  }));

  // links
  const want = [...new Map(inv.links.map((l) => [l.href, l])).values()];
  for (const l of want) {
    const local = toLocal(l.href);
    if (dom.links.includes(local) || dom.links.includes(l.href)) pass(`link ${l.where}: "${l.text}" → ${l.href}`);
    else fail(`link missing (${l.where}): "${l.text}" → ${l.href}`);
    if (l.kind === 'external') externals.set(l.href, null);
  }

  // images
  const have = new Set(dom.images.map(uploadKey).filter(Boolean));
  for (const img of inv.images) {
    const key = uploadKey(img.full || img.src);
    if (have.has(key)) pass(`image ${key} (alt="${img.alt ?? ''}")`);
    else fail(`image missing: ${key}`);
  }
  for (const bg of inv.backgrounds) {
    const key = uploadKey(bg);
    if (have.has(key)) pass(`background image ${key}`);
    else fail(`background image missing: ${key}`);
  }

  // videos + embeds
  for (const v of inv.videos) {
    const id = (v.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/) || [])[1];
    if (id ? dom.iframes.some((s) => s && s.includes(id)) : dom.iframes.includes(v)) pass(`video ${v}`);
    else fail(`video missing: ${v}`);
  }
  for (const e of inv.embeds) {
    if (dom.iframes.includes(e.src)) pass(`embed ${e.src}`);
    else fail(`embed missing: ${e.src}`);
  }

  // forms: same field names, hidden values and required flags
  for (const f of inv.forms) {
    const mine = dom.forms.find((x) => x.name === f.name);
    if (!mine) {
      fail(`form missing: ${f.kind} "${f.name}"`);
      continue;
    }
    const problems = f.fields
      .filter((x) => x.name)
      .filter((x) => {
        const m = mine.fields.find((y) => y.name === x.name);
        return !m || (x.type === 'hidden' && (m.value ?? '') !== (x.value ?? '')) || m.required !== x.required || (x.placeholder && m.placeholder !== x.placeholder);
      })
      .map((x) => x.name);
    if (problems.length) fail(`form "${f.name}" field mismatch: ${problems.join(', ')}`);
    else pass(`form "${f.name}": ${f.fields.filter((x) => x.name).length} fields match (endpoint: ${ORIGIN}/wp-admin/admin-ajax.php)`);
  }

  // every same-origin request the page made (scripts, CSS, images, fonts) must succeed
  const bad = responses.filter((r) => r.url.startsWith(base) && r.status >= 400);
  if (bad.length) bad.forEach((r) => fail(`asset ${r.status}: ${r.url}`));
  else pass(`all ${responses.filter((r) => r.url.startsWith(base)).length} local requests returned < 400`);
  await page.close();
}

// redirects (only to pages that are already rebuilt)
const built = new Set(routes);
lines.push('\n## Redirects');
for (const [from, to] of Object.entries(await redirectMap())) {
  if (!built.has(to)) {
    lines.push(`  · ${from} → ${to} (target not rebuilt yet; skipped)`);
    continue;
  }
  const page = await ctx.newPage();
  await page.goto(base + from, { waitUntil: 'networkidle' });
  const landed = new URL(page.url()).pathname;
  landed === to ? pass(`${from} → ${to}`) : fail(`${from} landed on ${landed}, expected ${to}`);
  await page.close();
}
await browser.close();

// external links: reported, not failed (social sites often reject automated requests)
lines.push('\n## External links (live status, informational)');
lines.push(`  · ${ORIGIN}/wp-admin/admin-ajax.php — form endpoint`);
for (const href of [...externals.keys(), `${ORIGIN}/wp-admin/admin-ajax.php`]) {
  try {
    const res = await fetch(href, { headers: { 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(15000) });
    lines.push(`  · ${res.status} ${href}${href.endsWith('admin-ajax.php') && res.status === 400 ? ' (400 without an action = WordPress handler is up)' : ''}`);
  } catch (e) {
    lines.push(`  · ERROR ${href} (${e.cause?.code || e.message})`);
  }
}

const text = lines.join('\n');
console.log(text);
await fs.writeFile('docs/link-check.txt', `Link check (${new Date().toISOString()}) against ${base}\n${text}\n`);
console.log(failures ? `\n${failures} failure(s)` : '\nAll links, assets, embeds and forms present.');
process.exit(failures ? 1 : 0);
