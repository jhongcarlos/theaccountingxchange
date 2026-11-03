// Mirrors theaccountingxchange.com into /reference (wget --mirror --page-requisites equivalent).
// HTML is saved raw (absolute URLs intact) so extract.mjs can map assets back to their origin.
import * as cheerio from 'cheerio';
import fs from 'node:fs/promises';
import path from 'node:path';

const ORIGIN = 'https://theaccountingxchange.com';
const OUT = path.resolve('reference');
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const SKIP = [/\/wp-admin/, /\/wp-json/, /\/feed\/?$/, /\/xmlrpc/, /add-to-cart=/, /\/wp-login/, /\?replytocom=/, /\/comments\//];

const pages = new Map(); // url -> status
const assets = new Map(); // url -> status
const queue = [];

const norm = (u) => {
  const x = new URL(u);
  x.hash = '';
  return x.href;
};
const sameHost = (u) => new URL(u).hostname.replace(/^www\./, '') === 'theaccountingxchange.com';
const isAsset = (u) => /\.(css|js|mjs|png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|eot|mp4|webm|pdf|json)(\?|$)/i.test(new URL(u).pathname);

function localPath(u, isPage) {
  const x = new URL(u);
  let p = decodeURIComponent(x.pathname);
  if (isPage) {
    if (!p.endsWith('/')) p += '/';
    p += 'index.html';
  }
  const host = sameHost(u) ? '' : `_external/${x.hostname}`;
  return path.join(OUT, host, p);
}

async function get(u) {
  const res = await fetch(u, { headers: { 'User-Agent': UA, Accept: '*/*' }, redirect: 'follow' });
  return res;
}

function enqueuePage(u) {
  try {
    const n = norm(u);
    if (!sameHost(n) || isAsset(n) || SKIP.some((r) => r.test(n)) || pages.has(n)) return;
    if (new URL(n).search) return; // query-string variants are not separate pages
    if (new URL(n).username) return; // malformed links like http://info@domain/ (missing mailto:)
    pages.set(n, 'queued');
    queue.push(n);
  } catch {}
}

async function saveAsset(u) {
  const n = norm(u);
  if (assets.has(n)) return;
  assets.set(n, 'pending');
  try {
    const res = await get(n);
    if (!res.ok) return assets.set(n, res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    const file = localPath(n, false);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, buf);
    assets.set(n, 200);
    if (/\.css(\?|$)/i.test(new URL(n).pathname)) {
      const css = buf.toString('utf8');
      for (const m of css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) {
        if (m[1].startsWith('data:')) continue;
        await saveAsset(new URL(m[1], n).href);
      }
      for (const m of css.matchAll(/@import\s+['"]([^'"]+)['"]/g)) await saveAsset(new URL(m[1], n).href);
    }
  } catch (e) {
    assets.set(n, `error: ${e.message}`);
  }
}

async function crawl(u) {
  const res = await get(u);
  const finalUrl = norm(res.url);
  if (!res.ok) return pages.set(u, res.status);
  const html = await res.text();
  if (/cf-browser-verification|challenge-platform|Just a moment\.\.\./i.test(html)) {
    throw new Error(`Block/challenge page returned for ${u}`);
  }
  pages.set(u, finalUrl !== u ? `200 (redirected to ${finalUrl})` : 200);
  const file = localPath(u, true);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html);

  const $ = cheerio.load(html);
  $('a[href]').each((_, el) => enqueuePage(new URL($(el).attr('href'), u).href));

  const reqs = new Set();
  $('link[href]').each((_, el) => {
    const rel = ($(el).attr('rel') || '').toLowerCase();
    if (/stylesheet|icon|preload|apple-touch|manifest/.test(rel)) reqs.add($(el).attr('href'));
  });
  $('script[src], img[src], source[src], video[src], audio[src], iframe[src], embed[src]').each((_, el) => reqs.add($(el).attr('src')));
  $('[srcset]').each((_, el) =>
    $(el).attr('srcset').split(',').forEach((s) => s.trim() && reqs.add(s.trim().split(/\s+/)[0]))
  );
  $('[data-src], [data-lazy-src], [data-bg], [data-background]').each((_, el) =>
    ['data-src', 'data-lazy-src', 'data-bg', 'data-background'].forEach((a) => $(el).attr(a) && reqs.add($(el).attr(a)))
  );
  $('video[poster]').each((_, el) => reqs.add($(el).attr('poster')));
  $('meta[property="og:image"], meta[name="twitter:image"], meta[name="msapplication-TileImage"]').each((_, el) => reqs.add($(el).attr('content')));
  for (const m of html.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) if (!m[1].startsWith('data:')) reqs.add(m[1]);

  for (const r of reqs) {
    if (!r) continue;
    let abs;
    try {
      abs = new URL(r.replace(/&amp;/g, '&'), u).href;
    } catch {
      continue;
    }
    if (!/^https?:/.test(abs)) continue;
    // Only download first-party requisites plus fonts/CSS needed for brand tokens (e.g. Google Fonts).
    const external = !sameHost(abs);
    if (external && !/fonts\.googleapis|fonts\.gstatic|use\.typekit|use\.fontawesome/.test(abs)) continue;
    if (!external && !isAsset(abs) && !/\/wp-content\/|\/wp-includes\//.test(abs)) continue;
    await saveAsset(abs);
  }
}

const seeds = (await fs.readFile(process.argv[2] || 'scripts/seed-urls.txt', 'utf8')).split(/\r?\n/).filter(Boolean);
[ORIGIN + '/', ...seeds].forEach(enqueuePage);
while (queue.length) {
  const u = queue.shift();
  process.stdout.write(`page ${u}\n`);
  try {
    await crawl(u);
  } catch (e) {
    if (/Block\/challenge/.test(e.message)) throw e;
    pages.set(u, `error: ${e.message}`);
  }
}
for (const extra of ['/robots.txt', '/wp-sitemap.xml', '/favicon.ico']) await saveAsset(ORIGIN + extra);

const report = {
  pages: Object.fromEntries(pages),
  assets: Object.fromEntries([...assets].filter(([, s]) => s !== 200)),
  assetCount: [...assets.values()].filter((s) => s === 200).length,
};
await fs.writeFile(path.join(OUT, '_crawl-report.json'), JSON.stringify(report, null, 2));
console.log(`\nPages: ${pages.size}  Assets saved: ${report.assetCount}  Asset failures: ${Object.keys(report.assets).length}`);
