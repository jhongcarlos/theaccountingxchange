// Compares the visible text of each rebuilt page against the original page in /reference.
// Usage: node scripts/content-diff.mjs [baseUrl] [route ...]   (default base: http://localhost:4173)
//
// Both pages are split into text segments with the same in-browser function (block elements and <br>
// end a segment; placeholder / aria-label / alt / title / button values count as segments too).
// Segments are compared as sets: the redesign may lay sections out differently (e.g. the footer
// address lines in their own column) and repeat existing text (nav links in the footer), but every
// original segment must appear verbatim and no new segment may appear.
// Excluded from the new page: aria-hidden subtrees (decorative marquee repeats, CountUp digits,
// button roll-up duplicates). The page runs with prefers-reduced-motion so counters show final values.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { builtRoutes } from './lib/routes.mjs';

const base = process.argv[2] || 'http://localhost:4173';
const routes = process.argv.length > 3 ? process.argv.slice(3) : await builtRoutes();

function segmentsIn(selectors) {
  const BLOCK = new Set(
    'a address article aside blockquote body dd details div dl dt fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hr li main nav ol p pre section summary table tbody td tfoot th thead tr ul button label'.split(' ')
  );
  const SKIP = new Set(['script', 'style', 'noscript', 'template', 'svg', 'iframe', 'select']);
  const out = [];
  let buf = '';
  const flush = () => {
    const t = buf.replace(/\s+/g, ' ').trim();
    if (t) out.push(t);
    buf = '';
  };
  const walk = (n) => {
    if (n.nodeType === 3) return void (buf += n.data);
    if (n.nodeType !== 1) return;
    const tag = n.tagName.toLowerCase();
    if (SKIP.has(tag) || n.getAttribute('aria-hidden') === 'true') return;
    if (tag === 'br') return flush();
    const block = BLOCK.has(tag);
    if (block) flush();
    for (const c of n.childNodes) walk(c);
    if (block) flush();
    for (const a of ['placeholder', 'aria-label', 'alt', 'title']) {
      const v = n.getAttribute(a);
      if (v && v.trim()) out.push(`[${a}] ${v.trim().replace(/\s+/g, ' ')}`);
    }
    if (tag === 'input' && ['submit', 'button'].includes(n.type) && n.value) out.push(n.value);
  };
  for (const sel of selectors) document.querySelectorAll(sel).forEach((root) => (walk(root), flush()));
  return [...new Set(out)];
}

const ORIGINAL_ROOTS = [
  'a.skip-link',
  '[data-elementor-type="header"]',
  '[data-elementor-type="wp-page"], [data-elementor-type="wp-post"]',
  '[data-elementor-type="footer"]',
];

const browser = await chromium.launch();
const original = await browser.newContext({ javaScriptEnabled: false });
await original.route('**/*', (r) => r.abort());
const rebuilt = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });

let failures = 0;
const report = [];
for (const route of routes) {
  const file = path.join('reference', route, 'index.html');
  const html = await fs.readFile(file, 'utf8');
  const op = await original.newPage();
  await op.setContent(html, { waitUntil: 'domcontentloaded' });
  const before = await op.evaluate(segmentsIn, ORIGINAL_ROOTS);
  await op.close();

  const np = await rebuilt.newPage();
  await np.goto(base + route, { waitUntil: 'networkidle' });
  await np.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  // expand collapsed content (FAQ accordions) so every answer is compared
  const collapsed = np.locator('button[aria-expanded="false"]:not([aria-controls="mobile-menu"])');
  for (let n = await collapsed.count(); n > 0; n = await collapsed.count()) await collapsed.first().click();
  await np.waitForTimeout(800);
  const after = await np.evaluate(segmentsIn, ['#root']);
  await np.close();

  const missing = before.filter((s) => !after.includes(s));
  const added = after.filter((s) => !before.includes(s));
  const ok = !missing.length && !added.length;
  if (!ok) failures++;
  report.push(`## ${route}: ${ok ? 'PASS' : 'FAIL'} (${before.length} original segments, ${after.length} rebuilt)`);
  missing.forEach((s) => report.push(`  - MISSING: ${s}`));
  added.forEach((s) => report.push(`  + ADDED:   ${s}`));
}
await browser.close();

const text = report.join('\n');
console.log(text);
await fs.mkdir('docs', { recursive: true });
await fs.writeFile('docs/content-diff.txt', `Content diff (${new Date().toISOString()}) against ${base}\n\n${text}\n`);
console.log(failures ? `\n${failures} route(s) with differences` : '\nZero differences.');
process.exit(failures ? 1 : 0);
