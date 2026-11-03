// Parses the /reference mirror and produces:
//   docs/inventory.md + docs/inventory.json  (pages, meta, verbatim content, assets, links, forms)
//   docs/brand-tokens.md + docs/brand-tokens.json  (colors, fonts, logos measured from the live CSS)
//   public/assets/**  (every media file from wp-content/uploads, original filenames and paths kept)
//   docs/asset-map.json  (original URL -> /assets path, with every alt text seen)
import * as cheerio from 'cheerio';
import fs from 'node:fs/promises';
import fss from 'node:fs';
import path from 'node:path';

const ORIGIN = 'https://theaccountingxchange.com';
const REF = path.resolve('reference');
const DOCS = path.resolve('docs');
const PUB_ASSETS = path.resolve('public/assets');
const MEDIA_RE = /\.(png|jpe?g|gif|webp|avif|svg|ico|mp4|webm|mov|pdf)$/i;

const crawl = JSON.parse(await fs.readFile(path.join(REF, '_crawl-report.json'), 'utf8'));
const clean = (s) => (s || '').replace(/[\t\r\n ]+/g, ' ').trim();
const toAssetPath = (u) => {
  try {
    const x = new URL(u, ORIGIN);
    if (x.hostname.replace(/^www\./, '') !== 'theaccountingxchange.com') return null;
    const m = decodeURIComponent(x.pathname).match(/^\/wp-content\/uploads\/(.+)$/);
    return m ? `/assets/uploads/${m[1]}` : null;
  } catch {
    return null;
  }
};

// ---------- 1. pages ----------
const pageFiles = [];
(function walk(dir) {
  for (const e of fss.readdirSync(dir, { withFileTypes: true })) {
    if (['_external', 'wp-content', 'wp-includes'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') pageFiles.push(p);
  }
})(REF);

const routeOf = (file) => '/' + path.relative(REF, path.dirname(file)).split(path.sep).filter(Boolean).map((s) => s + '/').join('');

// ---------- CSS helpers ----------
function cssRules(css) {
  // Flattens CSS (incl. @media blocks) into [{media, selector, decls}]
  const out = [];
  let media = '';
  let depth = 0;
  let buf = '';
  for (const ch of css.replace(/\/\*[\s\S]*?\*\//g, '')) {
    if (ch === '{') {
      const head = buf.trim();
      if (head.startsWith('@media') || head.startsWith('@supports')) {
        media = head;
        depth = 1;
        buf = '';
      } else {
        out.push({ media, selector: head, decls: '' });
        buf = '';
        out[out.length - 1].open = true;
      }
    } else if (ch === '}') {
      const last = out[out.length - 1];
      if (last && last.open) {
        last.decls = buf.trim();
        delete last.open;
      } else if (depth) {
        media = '';
        depth = 0;
      }
      buf = '';
    } else buf += ch;
  }
  return out.filter((r) => r.decls !== undefined && !r.open);
}
const readCss = (id) => {
  const f = path.join(REF, 'wp-content/uploads/elementor/css', `post-${id}.css`);
  return fss.existsSync(f) ? fss.readFileSync(f, 'utf8') : '';
};

// background images per Elementor element id, from a post CSS file
function backgroundsFrom(css) {
  const map = {};
  for (const r of cssRules(css)) {
    const bg = r.decls.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
    if (!bg) continue;
    for (const m of r.selector.matchAll(/elementor-element-([0-9a-f]{6,8})/g)) {
      (map[m[1]] ||= new Set()).add(bg[1] + (r.media ? ` (${r.media})` : ''));
    }
  }
  return map;
}

// ---------- content extraction ----------
function inlineText($, el) {
  // Verbatim text, keeping **bold**, _italic_ and [links](href) as markdown markers
  let s = '';
  $(el)
    .contents()
    .each((_, n) => {
      if (n.type === 'text') s += n.data;
      else if (n.type === 'tag') {
        const t = n.tagName;
        if (t === 'br') s += '  \n';
        else if (t === 'strong' || t === 'b') {
          const x = inlineText($, n);
          s += x.trim() ? `**${x}**` : x;
        } else if (t === 'em' || t === 'i') {
          const x = inlineText($, n);
          s += x.trim() ? `_${x}_` : x;
        } else if (t === 'a') s += `[${inlineText($, n)}](${$(n).attr('href') || ''})`;
        else if (['script', 'style', 'svg'].includes(t)) {
        } else s += inlineText($, n);
      }
    });
  return s.replace(/[ \t\r\n]+/g, (m) => (m.includes('  \n') ? m : ' '));
}

function blockText($, el, lines, indent = '') {
  $(el)
    .children()
    .each((_, c) => {
      const t = c.tagName;
      if (/^h[1-6]$/.test(t)) lines.push(`${indent}<${t}> ${clean(inlineText($, c))}`);
      else if (t === 'ul' || t === 'ol')
        $(c)
          .children('li')
          .each((i, li) => {
            const nested = $(li).children('ul,ol');
            const own = $(li).clone();
            own.children('ul,ol').remove();
            lines.push(`${indent}${t === 'ol' ? `${i + 1}.` : '-'} ${clean(inlineText($, own))}`);
            nested.each((_, n) => blockText($, $('<div>').append($(n).clone()), lines, indent + '  '));
          });
      else if (t === 'p' || t === 'blockquote' || t === 'figcaption' || t === 'span') {
        const x = clean(inlineText($, c));
        if (x) lines.push(`${indent}${t === 'blockquote' ? '> ' : ''}${x}`);
      } else if (t === 'table') {
        $(c)
          .find('tr')
          .each((_, tr) => lines.push(`${indent}| ${$(tr).children().map((_, td) => clean($(td).text())).get().join(' | ')} |`));
      } else if (t === 'img') lines.push(`${indent}[image] ${imgDesc($, c)}`);
      else if (t === 'div' || t === 'section' || t === 'article' || t === 'figure') {
        if ($(c).children().length) blockText($, c, lines, indent);
        else if (clean($(c).text())) lines.push(indent + clean(inlineText($, c)));
      } else if (clean($(c).text())) lines.push(indent + clean(inlineText($, c)));
    });
  // bare text nodes directly in the container
  $(el)
    .contents()
    .filter((_, n) => n.type === 'text' && clean(n.data))
    .each((_, n) => lines.push(indent + clean(n.data)));
}

function imgDesc($, img) {
  const src = $(img).attr('data-src') || $(img).attr('src') || '';
  const full = fullSizeOf($(img));
  return `src=\`${src}\`${full && full !== src ? ` full=\`${full}\`` : ''} alt="${$(img).attr('alt') ?? '(no alt attribute)'}"`;
}
function fullSizeOf($img) {
  // largest srcset candidate = original upload
  const ss = $img.attr('srcset');
  if (!ss) return $img.attr('src');
  return ss
    .split(',')
    .map((s) => s.trim().split(/\s+/))
    .sort((a, b) => parseInt(b[1]) - parseInt(a[1]))[0][0];
}

const visibility = (cls) => {
  const h = (cls.match(/elementor-hidden-(desktop|tablet|mobile|widescreen|laptop|mobile_extra|tablet_extra)/g) || []).map((x) => x.replace('elementor-hidden-', ''));
  return h.length ? ` _(hidden on: ${h.join(', ')})_` : '';
};

function widget($, w, ctx) {
  const type = ($(w).attr('data-widget_type') || '').replace(/\.default$/, '');
  const vis = visibility($(w).attr('class') || '');
  const L = [];
  const $w = $(w);
  const cont = $w.children('.elementor-widget-container').length ? $w.children('.elementor-widget-container') : $w;
  // Elementor inlines Font Awesome icons as <svg class="e-font-icon-svg e-fas-NAME">; keep them as asset files
  cont.find('svg.e-font-icon-svg').each((_, s) => {
    const name = ($(s).attr('class').match(/e-(fa[srb]?-[a-z0-9-]+)/) || [])[1];
    if (name) icons.set(name, $.html(s));
  });
  switch (type) {
    case 'heading': {
      const h = cont.find('.elementor-heading-title').first();
      const tag = h.prop('tagName')?.toLowerCase() || 'h?';
      const a = h.find('a').attr('href') || h.closest('a').attr('href');
      L.push(`**Heading <${tag}>:** ${clean(inlineText($, h))}${a ? ` → \`${a}\`` : ''}`);
      break;
    }
    case 'text-editor': {
      const lines = [];
      blockText($, cont, lines);
      L.push('**Text:**', ...lines.map((l) => (l.startsWith('-') || /^\d+\./.test(l) || l.startsWith('  ') ? l : `> ${l}`)));
      break;
    }
    case 'image': {
      cont.find('img').each((_, i) => L.push(`**Image:** ${imgDesc($, i)}${cont.find('a').attr('href') ? ` link=\`${cont.find('a').attr('href')}\`` : ''}`));
      const cap = clean(cont.find('figcaption').text());
      if (cap) L.push(`  caption: ${cap}`);
      ctx.images.push(...cont.find('img').toArray());
      break;
    }
    case 'image-box':
    case 'icon-box': {
      const img = cont.find('img').first();
      const title = cont.find('.elementor-image-box-title, .elementor-icon-box-title').first();
      const desc = cont.find('.elementor-image-box-description, .elementor-icon-box-description').first();
      const icon = cont.find('.elementor-icon i, .elementor-icon svg').first();
      const a = cont.find('a').attr('href');
      L.push(`**${type === 'image-box' ? 'Image box' : 'Icon box'}:**`);
      if (img.length) L.push(`  - image: ${imgDesc($, img)}`), ctx.images.push(img[0]);
      if (icon.length) L.push(`  - icon: \`${icon.attr('class') || icon.attr('class') || 'svg'}\``);
      if (title.length) L.push(`  - title <${title.prop('tagName').toLowerCase()}>: ${clean(inlineText($, title))}`);
      if (desc.length) L.push(`  - description: ${clean(inlineText($, desc))}`);
      if (a) L.push(`  - link: \`${a}\``);
      break;
    }
    case 'button': {
      const a = cont.find('a, button').first();
      L.push(`**Button:** "${clean(cont.find('.elementor-button-text').text() || a.text())}" → \`${a.attr('href') || '(no href)'}\`${a.attr('target') ? ` target=${a.attr('target')}` : ''}`);
      break;
    }
    case 'icon-list': {
      L.push('**Icon list:**');
      cont.find('.elementor-icon-list-item').each((_, li) => {
        const a = $(li).find('a').attr('href');
        const ic = $(li).find('.elementor-icon-list-icon i, .elementor-icon-list-icon svg').attr('class');
        L.push(`  - ${clean($(li).find('.elementor-icon-list-text').text())}${a ? ` → \`${a}\`` : ''}${ic ? ` (icon: ${ic})` : ''}`);
      });
      break;
    }
    case 'social-icons': {
      L.push('**Social icons:**');
      cont.find('a').each((_, a) => L.push(`  - ${clean($(a).find('.elementor-screen-only').text()) || $(a).attr('class')} → \`${$(a).attr('href')}\``));
      break;
    }
    case 'nav-menu': {
      L.push('**Navigation menu:**');
      const nav = cont.find('nav.elementor-nav-menu--main').first().length ? cont.find('nav.elementor-nav-menu--main').first() : cont.find('nav').first();
      (function menu(ul, ind) {
        $(ul)
          .children('li')
          .each((_, li) => {
            const a = $(li).children('a').first();
            L.push(`${ind}- ${clean(a.text())} → \`${a.attr('href')}\``);
            $(li).children('ul').each((_, sub) => menu(sub, ind + '  '));
          });
      })(nav.children('ul').first(), '  ');
      break;
    }
    case 'video': {
      const s = JSON.parse($w.attr('data-settings') || '{}');
      const v = cont.find('video');
      L.push(
        `**Video:** ${s.youtube_url || s.vimeo_url || s.dailymotion_url || v.attr('src') || s.hosted_url?.url || JSON.stringify(s)}${s.video_type ? ` (type: ${s.video_type})` : ''}${s.autoplay ? ' autoplay' : ''}${s.mute ? ' muted' : ''}${s.loop ? ' loop' : ''}${s.controls === '' ? ' no-controls' : ''}`
      );
      if (s.image_overlay?.url) L.push(`  - overlay image: \`${s.image_overlay.url}\``);
      if (v.attr('poster')) L.push(`  - poster: \`${v.attr('poster')}\``);
      ctx.videos.push(s.hosted_url?.url || v.attr('src') || s.youtube_url || s.vimeo_url);
      break;
    }
    case 'form': {
      const f = cont.find('form').first();
      ctx.forms.push(formInfo($, f, 'Elementor Pro form'));
      L.push(`**Form:** see Forms → \`${f.attr('name') || f.find('[name=form_id]').val()}\``);
      break;
    }
    case 'counter': {
      L.push(
        `**Counter:** ${clean(cont.find('.elementor-counter-number-prefix').text())}${cont.find('.elementor-counter-number').attr('data-to-value')}${clean(cont.find('.elementor-counter-number-suffix').text())} - ${clean(cont.find('.elementor-counter-title').text())}`
      );
      break;
    }
    case 'testimonial':
    case 'testimonial-carousel':
    case 'reviews': {
      L.push(`**${type}:**`);
      const items = cont.find('.swiper-slide, .elementor-testimonial-wrapper').not('.swiper-slide-duplicate');
      items.each((_, it) => {
        L.push(`  - quote: ${clean(inlineText($, $(it).find('.elementor-testimonial__text, .elementor-testimonial-content').first()))}`);
        L.push(`    name: ${clean($(it).find('.elementor-testimonial__name, .elementor-testimonial-name').first().text())}`);
        const t = clean($(it).find('.elementor-testimonial__title, .elementor-testimonial-job').first().text());
        if (t) L.push(`    title: ${t}`);
        const img = $(it).find('img').first();
        if (img.length) L.push(`    image: ${imgDesc($, img)}`), ctx.images.push(img[0]);
      });
      break;
    }
    case 'accordion':
    case 'toggle':
    case 'nested-accordion': {
      L.push(`**${type} (FAQ):**`);
      cont.find('.elementor-accordion-item, .elementor-toggle-item, details').each((_, it) => {
        const q = clean($(it).find('.elementor-tab-title, summary').first().text());
        const lines = [];
        blockText($, $(it).find('.elementor-tab-content, .e-n-accordion-item > div, details > div').first(), lines);
        L.push(`  - Q: ${q}`, ...lines.map((l) => `    A: ${l}`));
      });
      break;
    }
    case 'price-table': {
      L.push('**Price table:**');
      const g = (s) => clean(cont.find(s).first().text());
      L.push(`  - heading: ${g('.elementor-price-table__heading')}`, `  - subheading: ${g('.elementor-price-table__subheading')}`);
      L.push(`  - price: ${clean(cont.find('.elementor-price-table__price').text())}`, `  - period: ${g('.elementor-price-table__period')}`);
      cont.find('.elementor-price-table__features-list li').each((_, li) => L.push(`    - ${clean($(li).text())}`));
      const b = cont.find('.elementor-price-table__button');
      if (b.length) L.push(`  - button: "${clean(b.text())}" → \`${b.attr('href')}\``);
      L.push(`  - footer: ${g('.elementor-price-table__additional_info')}`, `  - ribbon: ${g('.elementor-price-table__ribbon-inner')}`);
      break;
    }
    case 'divider':
    case 'spacer':
      L.push(`_(${type})_`);
      break;
    case 'icon': {
      const a = cont.find('a').attr('href');
      L.push(`**Icon:** \`${cont.find('i, svg').attr('class')}\`${a ? ` → \`${a}\`` : ''}`);
      break;
    }
    case 'html':
    case 'shortcode': {
      L.push(`**${type} embed:**`, '```html', cont.html().trim(), '```');
      cont.find('iframe').each((_, i) => ctx.embeds.push({ type: 'iframe', src: $(i).attr('src') }));
      cont.find('script[src]').each((_, s) => ctx.embeds.push({ type: 'script', src: $(s).attr('src') }));
      cont.find('form').each((_, f) => ctx.forms.push(formInfo($, $(f), `${type} widget form`)));
      break;
    }
    default: {
      // Unknown/third-party widgets (marquee addons, premium addons, Woo widgets, etc.): verbatim text + images + links
      L.push(`**Widget \`${type || $(w).attr('class').split(' ').slice(0, 3).join('.')}\`:**`);
      const lines = [];
      const copy = cont.clone();
      // marquee plugins duplicate their items to loop; keep a note of the raw count
      blockText($, copy, lines);
      L.push(...dedupeRuns(lines).map((l) => `  ${l}`));
      cont.find('img').each((_, i) => {
        if (!lines.some((l) => l.includes('[image]'))) L.push(`  - image: ${imgDesc($, i)}`);
        ctx.images.push(i);
      });
      cont.find('a[href]').each((_, a) => L.push(`  - link: "${clean($(a).text())}" → \`${$(a).attr('href')}\``));
      cont.find('iframe').each((_, i) => ctx.embeds.push({ type: 'iframe', src: $(i).attr('src') }));
      cont.find('form').each((_, f) => ctx.forms.push(formInfo($, $(f), `${type} form`)));
    }
  }
  return L.map((l, i) => (i === 0 ? l + vis : l));
}

function dedupeRuns(lines) {
  // collapse an exact repetition of the whole list (marquee/loop clones)
  for (let k = 2; k <= 6; k++) {
    if (!lines.length || lines.length % k) continue;
    const n = lines.length / k;
    const chunk = lines.slice(0, n).join('\n');
    if (Array.from({ length: k }, (_, i) => lines.slice(i * n, (i + 1) * n).join('\n')).every((c) => c === chunk))
      return [...lines.slice(0, n), `_(above items repeated ${k}× in the markup for looping)_`];
  }
  return lines;
}

function formInfo($, f, kind) {
  const fields = [];
  f.find('input, select, textarea').each((_, el) => {
    const $el = $(el);
    const type = el.tagName === 'input' ? $el.attr('type') || 'text' : el.tagName;
    const id = $el.attr('id');
    const group = $el.closest('.elementor-field-group, .form-row, p, .woocommerce-form-row');
    let label = id ? clean(f.find(`label[for="${id}"]`).first().text()) : '';
    if (!label) label = clean(group.find('label').first().text());
    fields.push({
      type,
      name: $el.attr('name'),
      id,
      label,
      placeholder: $el.attr('placeholder'),
      required: $el.is('[required]') || $el.attr('aria-required') === 'true',
      value: type === 'hidden' || type === 'submit' ? $el.attr('value') : undefined,
      options: el.tagName === 'select' ? $el.find('option').map((_, o) => clean($(o).text())).get() : undefined,
      autocomplete: $el.attr('autocomplete'),
    });
  });
  const btn = f.find('button[type=submit], input[type=submit], button').last();
  return {
    kind,
    name: f.attr('name'),
    id: f.attr('id'),
    method: (f.attr('method') || 'get').toUpperCase(),
    action: f.attr('action') || '',
    submitLabel: clean(btn.find('.elementor-button-text').text() || btn.text() || btn.attr('value')),
    fields,
    note:
      kind === 'Elementor Pro form'
        ? 'Elementor Pro forms have no action attribute: they POST via AJAX to /wp-admin/admin-ajax.php with action=elementor_pro_forms_send_form plus post_id, form_id, referer_title and queried_id. The handler (and its email/webhook actions) lives inside WordPress.'
        : undefined,
  };
}

function sectionTree($, el, depth, ctx, bgMap) {
  const out = [];
  $(el)
    .children()
    .each((_, c) => {
      const t = $(c).attr('data-element_type');
      const cls = $(c).attr('class') || '';
      if (t === 'widget') out.push(...widget($, c, ctx).map((l) => '  '.repeat(depth) + l));
      else if (t === 'container' || t === 'section' || t === 'column') {
        const id = $(c).attr('data-id');
        if (bgMap[id]) out.push('  '.repeat(depth) + `_(background image: ${[...bgMap[id]].map((b) => '`' + b + '`').join(', ')})_`);
        const s = JSON.parse($(c).attr('data-settings') || '{}');
        if (s.background_video_link) out.push('  '.repeat(depth) + `_(background video: \`${s.background_video_link}\`)_`), ctx.videos.push(s.background_video_link);
        if (s.background_slideshow_gallery) s.background_slideshow_gallery.forEach((g) => out.push('  '.repeat(depth) + `_(background slideshow image: \`${g.url}\`)_`));
        const v = visibility(cls);
        if (v) out.push('  '.repeat(depth) + `_(container${v})_`);
        out.push(...sectionTree($, c, depth, ctx, bgMap));
      } else out.push(...sectionTree($, c, depth, ctx, bgMap));
    });
  return out;
}

function firstHeading($, sec) {
  const h = $(sec).find('.elementor-heading-title, h1, h2, h3').first();
  return clean(h.text()).slice(0, 80) || '(no heading)';
}

function linksIn($, root, where, set) {
  $(root)
    .find('a[href]')
    .each((_, a) => {
      const href = $(a).attr('href').trim();
      let kind = 'external';
      if (href.startsWith('mailto:')) kind = 'mailto';
      else if (href.startsWith('tel:')) kind = 'tel';
      else if (href.startsWith('#') || href === '') kind = 'anchor';
      else
        try {
          const u = new URL(href, ORIGIN);
          if (u.username) kind = 'MALFORMED (credentials in URL; probably missing mailto:)';
          else if (u.hostname.replace(/^www\./, '') === 'theaccountingxchange.com') kind = 'internal';
        } catch {
          kind = 'MALFORMED';
        }
      const text = clean($(a).text()) || clean($(a).find('.elementor-screen-only').text()) || $(a).attr('aria-label') || '(no text)';
      const key = `${where}|${href}|${text}`;
      if (!set.has(key)) set.set(key, { where, kind, href, text, target: $(a).attr('target') });
    });
}

// ---------- run over pages ----------
const pages = [];
const icons = new Map(); // font-awesome name -> inline svg markup
const assetAlts = new Map(); // asset path -> Set(alt)
const sharedBlocks = {}; // header/footer by elementor id -> {hash, md}

for (const file of pageFiles.sort()) {
  const route = routeOf(file);
  const html = await fs.readFile(file, 'utf8');
  const $ = cheerio.load(html);
  const url = ORIGIN + route;
  const status = crawl.pages[url];
  const bodyCls = $('body').attr('class') || '';
  const pageId = (bodyCls.match(/(?:page-id|postid)-(\d+)/) || [])[1];
  const meta = {
    title: $('title').first().text(),
    description: $('meta[name="description"]').attr('content') ?? null,
    robots: $('meta[name="robots"]').attr('content') ?? null,
    canonical: $('link[rel="canonical"]').attr('href') ?? null,
    og: Object.fromEntries($('meta[property^="og:"], meta[property^="article:"]').map((_, m) => [[$(m).attr('property'), $(m).attr('content')]]).get()),
    twitter: Object.fromEntries($('meta[name^="twitter:"]').map((_, m) => [[$(m).attr('name'), $(m).attr('content')]]).get()),
    lang: $('html').attr('lang'),
    icons: $('link[rel*="icon"]').map((_, l) => ({ rel: $(l).attr('rel'), sizes: $(l).attr('sizes'), href: $(l).attr('href') })).get(),
  };
  const bg = Object.assign({}, ...[pageId, '41', '83'].map((id) => backgroundsFrom(readCss(id))));
  const ctx = { images: [], videos: [], forms: [], embeds: [] };

  // third-party embed scripts inside HTML widgets (e.g. the LeadConnector booking widget's form_embed.js)
  $('[data-widget_type^="html"] script[src]').each((_, sc) => ctx.embeds.push({ type: 'script', src: $(sc).attr('src') }));
  $('script, style, noscript').remove();

  // header / footer (Elementor Pro theme builder)
  const blocks = {};
  for (const [name, sel] of [
    ['header', '[data-elementor-type="header"]'],
    ['footer', '[data-elementor-type="footer"]'],
  ]) {
    const el = $(sel).first();
    if (!el.length) continue;
    const hctx = { images: [], videos: [], forms: [], embeds: [] };
    const md = sectionTree($, el, 0, hctx, bg);
    const id = el.attr('data-elementor-id');
    blocks[name] = id;
    const key = `${name}-${id}`;
    const h = md.join('\n');
    if (!sharedBlocks[key]) sharedBlocks[key] = { name, id, md, pages: [], variants: new Set([h]), ctx: hctx };
    sharedBlocks[key].pages.push(route);
    sharedBlocks[key].variants.add(h);
    hctx.images.forEach((i) => ctx.images.push(i));
    ctx.forms.push(...hctx.forms);
  }

  // main content
  let root = $(`[data-elementor-type="wp-page"], [data-elementor-type="wp-post"], [data-elementor-type="archive"], [data-elementor-type="single-page"], [data-elementor-type="single-post"]`).first();
  let builder = 'elementor';
  if (!root.length) {
    builder = 'wordpress (non-Elementor)';
    root = $('main, #main, .site-main').first();
  }
  const sections = [];
  const topLevel = root.children('[data-element_type="container"], [data-element_type="section"]');
  if (builder === 'elementor' && topLevel.length) {
    topLevel.each((i, sec) => {
      const id = $(sec).attr('data-id');
      const md = [];
      if (bg[id]) md.push(`_(background image: ${[...bg[id]].map((b) => '`' + b + '`').join(', ')})_`);
      const s = JSON.parse($(sec).attr('data-settings') || '{}');
      if (s.background_video_link) md.push(`_(background video: \`${s.background_video_link}\`)_`), ctx.videos.push(s.background_video_link);
      md.push(...sectionTree($, sec, 0, ctx, bg));
      sections.push({ index: i + 1, elementId: id, label: firstHeading($, sec), md, visibility: visibility($(sec).attr('class') || '') });
    });
  } else {
    // GeneratePress / Gutenberg / WooCommerce markup
    const lines = [];
    const body = root.find('article, .woocommerce, .page-header').length ? root : root;
    blockText($, body, lines);
    body.find('img').each((_, i) => ctx.images.push(i));
    body.find('form').each((_, f) => ctx.forms.push(formInfo($, $(f), 'WordPress/WooCommerce form')));
    body.find('iframe').each((_, i) => ctx.embeds.push({ type: 'iframe', src: $(i).attr('src') }));
    sections.push({ index: 1, elementId: null, label: 'Main content', md: lines.map((l) => (l.startsWith('-') || l.startsWith('<h') ? l : `> ${l}`)) });
  }
  // search form etc. outside content/header/footer
  $('form').each((_, f) => {
    if ($(f).closest('[data-elementor-type], main, #main').length) return;
    ctx.forms.push(formInfo($, $(f), 'Theme form (outside content)'));
  });

  // links
  const linkMap = new Map();
  linksIn($, $('[data-elementor-type="header"]').first(), 'header', linkMap);
  linksIn($, root, 'content', linkMap);
  linksIn($, $('[data-elementor-type="footer"]').first(), 'footer', linkMap);

  // assets
  const imgs = [
    ...new Map(
      ctx.images.map((i) => {
        const $i = $(i);
        const src = $i.attr('data-src') || $i.attr('src');
        const full = fullSizeOf($i);
        const srcset = ($i.attr('srcset') || '').split(',').map((s) => s.trim().split(/\s+/)[0]).filter(Boolean);
        return [src, { src, full, srcset, alt: $i.attr('alt') ?? null, width: $i.attr('width'), height: $i.attr('height') }];
      })
    ).values(),
  ];
  for (const i of imgs)
    for (const u of new Set([i.src, i.full, ...i.srcset])) {
      const p = toAssetPath(u);
      if (p) (assetAlts.get(p) || assetAlts.set(p, new Set()).get(p)).add(i.alt ?? '(no alt attribute)');
    }
  const bgs = [...new Set(Object.values(bg).flatMap((s) => [...s].map((x) => x.replace(/ \(@.*$/, ''))))];

  pages.push({
    route,
    url,
    status,
    pageId,
    builder,
    blocks,
    meta,
    sections,
    images: imgs,
    backgrounds: bgs,
    videos: [...new Set(ctx.videos.filter(Boolean))],
    forms: ctx.forms,
    embeds: ctx.embeds,
    links: [...linkMap.values()],
  });
}

// nav-linked pages = the live, public site
const navLinked = new Set();
for (const p of pages)
  for (const l of p.links)
    if (l.kind === 'internal' && l.where !== 'content') {
      try {
        let r = new URL(l.href, ORIGIN).pathname;
        if (!r.endsWith('/')) r += '/';
        navLinked.add(r);
      } catch {}
    }
const homeLinks = new Set(pages.find((p) => p.route === '/').links.filter((l) => l.kind === 'internal').map((l) => new URL(l.href, ORIGIN).pathname.replace(/([^/])$/, '$1/')));
const classify = (p) => {
  if (/-old\/$|-draft\/$/.test(p.route)) return 'Legacy/draft page (in sitemap, not in navigation)';
  if (['/cart/', '/checkout/', '/my-account/', '/my-account/lost-password/', '/shop/'].includes(p.route)) return 'WooCommerce system page';
  if (p.route.startsWith('/author/') || p.route.startsWith('/category/') || p.route === '/hello-world/') return 'WordPress default/archive page';
  if (navLinked.has(p.route) || homeLinks.has(p.route)) return 'Primary page (linked from navigation)';
  return 'Published page (in sitemap, not linked from navigation)';
};
pages.forEach((p) => (p.category = classify(p)));
const order = ['Primary page (linked from navigation)', 'Published page (in sitemap, not linked from navigation)', 'Legacy/draft page (in sitemap, not in navigation)', 'WooCommerce system page', 'WordPress default/archive page'];
pages.sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category) || (a.route === '/' ? -1 : b.route === '/' ? 1 : a.route.localeCompare(b.route)));

// ---------- 2. copy assets ----------
const uploads = path.join(REF, 'wp-content/uploads');
const copied = [];
(function walk(dir) {
  for (const e of fss.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (path.relative(uploads, p).startsWith('elementor')) continue; // generated CSS, not media
      walk(p);
    } else if (MEDIA_RE.test(e.name)) copied.push(path.relative(uploads, p).split(path.sep).join('/'));
  }
})(uploads);
for (const rel of copied) {
  const dest = path.join(PUB_ASSETS, 'uploads', rel);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(path.join(uploads, rel), dest);
}
await fs.mkdir(path.join(PUB_ASSETS, 'icons'), { recursive: true });
for (const [name, svg] of icons) {
  const out = svg.includes('xmlns=') ? svg : svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  await fs.writeFile(path.join(PUB_ASSETS, 'icons', `${name}.svg`), out);
}
if (fss.existsSync(path.join(REF, 'favicon.ico'))) await fs.copyFile(path.join(REF, 'favicon.ico'), path.join(PUB_ASSETS, 'favicon.ico'));
const assetMap = Object.fromEntries(
  copied.map((rel) => {
    const p = `/assets/uploads/${rel}`;
    return [`${ORIGIN}/wp-content/uploads/${rel}`, { path: p, alts: assetAlts.has(p) ? [...assetAlts.get(p)] : [], usedOn: pages.filter((pg) => JSON.stringify(pg).includes(`/wp-content/uploads/${rel}`)).map((pg) => pg.route) }];
  })
);
// a later manual retry may have recovered an asset the crawl missed
const missing = Object.entries(crawl.assets).filter(([u, s]) => s !== 200 && !fss.existsSync(path.join(REF, decodeURIComponent(new URL(u).pathname))));

// ---------- 3. brand tokens ----------
const livePages = pages.filter((p) => p.category === 'Primary page (linked from navigation)');
const cssIdsLive = [...new Set(['41', '83', ...livePages.map((p) => p.pageId).filter(Boolean)])];
const cssIdsAll = [...new Set(['41', '83', ...pages.map((p) => p.pageId).filter(Boolean)])];
const hexNorm = (c) => {
  c = c.toLowerCase();
  if (/^#[0-9a-f]{3}$/.test(c)) c = '#' + [...c.slice(1)].map((x) => x + x).join('');
  return c.toUpperCase();
};
function colorUsage(ids) {
  const use = {};
  for (const id of ids) {
    for (const r of cssRules(readCss(id))) {
      for (const d of r.decls.split(';')) {
        const m = d.match(/^\s*([a-z-]+)\s*:\s*(.+)$/i);
        if (!m) continue;
        const prop = m[1];
        for (const c of m[2].matchAll(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b|rgba?\([^)]*\)/gi)) {
          const key = c[0].startsWith('#') ? hexNorm(c[0]) : c[0].replace(/\s+/g, '');
          const u = (use[key] ||= { count: 0, props: {}, widgets: {}, posts: new Set() });
          u.count++;
          u.props[prop] = (u.props[prop] || 0) + 1;
          u.posts.add(id);
          const wt = (r.selector.match(/elementor-(heading-title|button|image-box-title|image-box-description|icon-box-title|nav-menu|field|social-icon|icon-list-text|icon|divider|price-table)/) || [])[1] || (/elementor-element-/.test(r.selector) ? 'container/section' : 'other');
          u.widgets[wt] = (u.widgets[wt] || 0) + 1;
        }
      }
    }
  }
  return use;
}
function fontUsage(ids) {
  const use = {};
  for (const id of ids)
    for (const r of cssRules(readCss(id))) {
      const fam = r.decls.match(/font-family:\s*([^;]+)/);
      if (!fam) continue;
      const f = fam[1].replace(/,\s*Sans-serif/i, '').replace(/"/g, '').trim();
      const w = (r.decls.match(/font-weight:\s*([^;]+)/) || [])[1] || '(inherit)';
      const size = (r.decls.match(/font-size:\s*([^;]+)/) || [])[1];
      const wt = (r.selector.match(/elementor-(heading-title|button|image-box-title|image-box-description|icon-box-title|icon-box-description|nav-menu|field-group|field|social-icon|icon-list-text|counter|price-table|testimonial|tab-title|text-editor|widget-text-editor)/) || [])[1] || 'other';
      const u = (use[f] ||= { count: 0, weights: {}, widgets: {}, sizes: new Set(), posts: new Set() });
      u.count++;
      u.weights[w] = (u.weights[w] || 0) + 1;
      u.widgets[wt] = (u.widgets[wt] || 0) + 1;
      if (size && !r.media) u.sizes.add(size.trim());
      u.posts.add(id);
    }
  return use;
}
const kit = readCss('17');
const kitVars = Object.fromEntries([...kit.matchAll(/--(e-global-[a-z0-9-]+):\s*([^;}]+)/g)].map((m) => [m[1], m[2].trim()]));
const homeHtml = await fs.readFile(path.join(REF, 'index.html'), 'utf8');
const gpRoot = (homeHtml.match(/:root\{--contrast:[^}]*\}/) || [''])[0];
const gFonts = [...new Set([...homeHtml.matchAll(/href='(https:\/\/fonts\.googleapis\.com[^']+)'/g)].map((m) => m[1].replace(/&#038;/g, '&')))];
const colorsLive = colorUsage(cssIdsLive);
const colorsAll = colorUsage(cssIdsAll);
const fontsLive = fontUsage(cssIdsLive);

// logo images in header/footer
const logos = Object.values(sharedBlocks).flatMap((b) =>
  b.ctx.images.map((i) => ({ block: `${b.name} (elementor-${b.id})`, src: i.attribs['data-src'] || i.attribs.src, srcset: i.attribs.srcset, alt: i.attribs.alt ?? null, width: i.attribs.width, height: i.attribs.height }))
);

// ---------- 4. write docs ----------
await fs.mkdir(DOCS, { recursive: true });
const ser = (o) => JSON.stringify(o, (k, v) => (k === 'ctx' ? undefined : v instanceof Set ? [...v] : v), 2);
await fs.writeFile(path.join(DOCS, 'inventory.json'), ser({ generated: new Date().toISOString(), origin: ORIGIN, pages, shared: sharedBlocks, missingAssets: missing }));
await fs.writeFile(path.join(DOCS, 'asset-map.json'), ser(assetMap));
await fs.writeFile(path.join(DOCS, 'brand-tokens.json'), ser({ kitVars, gpRoot, gFonts, colorsLive, colorsAll, fontsLive, logos }));

const md = [];
const P = (...x) => md.push(...x);
P('# Content Inventory: theaccountingxchange.com', '');
P(`Generated by \`npm run extract\` from the \`/reference\` mirror (crawled ${new Date().toISOString().slice(0, 10)}). Machine-readable copy: \`docs/inventory.json\`.`, '');
P('Text below is verbatim. Markdown markers are added only for structure: `**bold**`, `_italic_`, `[link](href)`, `<hN>` heading level, `> ` paragraph. _(Italic notes in parentheses)_ are extractor annotations, not site copy.', '');
P('## Page index', '', '| # | Route | Title | Category | Status | Builder |', '|---|---|---|---|---|---|');
pages.forEach((p, i) => P(`| ${i + 1} | \`${p.route}\` | ${p.meta.title} | ${p.category} | ${p.status} | ${p.builder} |`));
P('');
P('## Shared header & footer', '');
for (const b of Object.values(sharedBlocks)) {
  P(`### ${b.name[0].toUpperCase() + b.name.slice(1)} (Elementor template ${b.id})`, '');
  P(`Used on ${b.pages.length} page(s). ${b.variants.size === 1 ? 'Identical on every page.' : `**${b.variants.size} variants found across pages. Check per-page differences.**`}`, '');
  P(...b.md, '');
}
for (const p of pages) {
  P(`---`, '', `## \`${p.route}\`: ${p.meta.title}`, '');
  P(`- **URL:** ${p.url}`, `- **Category:** ${p.category}`, `- **Crawl status:** ${p.status}`, `- **WordPress ID:** ${p.pageId ?? '(none)'}  ·  **Builder:** ${p.builder}`);
  P(`- **<title>:** ${p.meta.title}`, `- **Meta description:** ${p.meta.description ?? '_(none)_'}`, `- **Robots:** ${p.meta.robots ?? '_(none)_'}`, `- **Canonical:** ${p.meta.canonical ?? '_(none)_'}`);
  P(`- **OG tags:** ${Object.keys(p.meta.og).length ? '' : '_(none)_'}`, ...Object.entries(p.meta.og).map(([k, v]) => `  - \`${k}\`: ${v}`));
  if (Object.keys(p.meta.twitter).length) P('- **Twitter tags:**', ...Object.entries(p.meta.twitter).map(([k, v]) => `  - \`${k}\`: ${v}`));
  P('');
  P('### Content', '');
  for (const s of p.sections) {
    P(`#### Section ${s.index}: ${s.label}${s.elementId ? ` _(element ${s.elementId})_` : ''}${s.visibility || ''}`, '');
    P(...(s.md.length ? s.md : ['_(empty)_']), '');
  }
  P('### Assets', '');
  if (p.images.length) {
    P('| Image (largest size) | alt | Size |', '|---|---|---|');
    p.images.forEach((i) => P(`| \`${(i.full || i.src || '').replace(ORIGIN, '')}\` | ${i.alt === null ? '_(no alt attr)_' : i.alt === '' ? '_(empty)_' : i.alt} | ${i.width || '?'}×${i.height || '?'} |`));
  } else P('_(no images)_');
  if (p.backgrounds.length) P('', '**Background images (from Elementor CSS):**', ...p.backgrounds.map((b) => `- \`${b.replace(ORIGIN, '')}\``));
  if (p.videos.length) P('', '**Videos:**', ...p.videos.map((v) => `- ${v}`));
  P('');
  P('### Links', '');
  const contentLinks = p.links.filter((l) => l.where === 'content');
  if (contentLinks.length) {
    P('| Text | href | Type |', '|---|---|---|');
    contentLinks.forEach((l) => P(`| ${l.text} | \`${l.href}\` | ${l.kind}${l.target ? ` (target=${l.target})` : ''} |`));
  } else P('_(no links in page content)_');
  P('', '_Header and footer links: see the shared header & footer section above._', '');
  P('### Forms & embeds', '');
  if (!p.forms.length && !p.embeds.length) P('_(none)_');
  for (const f of p.forms) {
    P(`**${f.kind}**: name=\`${f.name ?? ''}\` id=\`${f.id ?? ''}\` method=${f.method} action=\`${f.action || '(none)'}\` submit="${f.submitLabel}"`, '');
    P('| Label | Type | name | Placeholder | Required | Value/Options |', '|---|---|---|---|---|---|');
    f.fields.forEach((x) => P(`| ${x.label || ''} | ${x.type} | \`${x.name ?? ''}\` | ${x.placeholder ?? ''} | ${x.required ? 'yes' : ''} | ${x.options ? x.options.join(' / ') : (x.value ?? '')} |`));
    if (f.note) P('', `> ${f.note}`);
    P('');
  }
  p.embeds.forEach((e) => P(`- ${e.type}: \`${e.src}\``));
  P('');
}
P('---', '', '## Asset summary', '');
P(`- ${copied.length} media files copied to \`public/assets/uploads/\` (original WordPress year/month paths and filenames kept). Full map with alt text: \`docs/asset-map.json\`.`);
P(`- ${icons.size} inline Font Awesome SVG icons saved to \`public/assets/icons/\`: ${[...icons.keys()].map((k) => '`' + k + '`').join(', ')}`);
P(`- Favicon / site icons: ${pages[0].meta.icons.map((i) => `\`${i.href.replace(ORIGIN, '')}\` (${i.rel}${i.sizes ? ' ' + i.sizes : ''})`).join(', ')}`);
P('', '**Assets referenced by the live site that the live server returns as missing (cannot be migrated):**', '');
missing.forEach(([u, s]) => P(`- \`${u.replace(ORIGIN, '')}\`: ${s} (referenced on ${pages.filter((p) => JSON.stringify(p).includes(u.replace(ORIGIN, ''))).map((p) => '`' + p.route + '`').join(', ') || 'CSS'})`));
await fs.writeFile(path.join(DOCS, 'inventory.md'), md.join('\n'));

// brand-tokens.md
const B = [];
const top = (o, n = 99) => Object.entries(o).sort((a, b) => b[1].count - a[1].count).slice(0, n);
const fmt = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ×${v}`).join(', ');
B.push('# Brand Tokens: theaccountingxchange.com', '', 'Generated by `npm run extract` from the live CSS in `/reference`. Raw data: `docs/brand-tokens.json`.', '');
// Resolved from the measurements below plus computed styles taken with Playwright on /, /services/, /about-us/, /contact-us/ (1440px).
B.push(
  '## Resolved tokens (used in `tailwind.config.js`)',
  '',
  '| Token | Value | Evidence on the live site |',
  '|---|---|---|',
  '| `brand-navy` (primary) | `#002140` | Header/hero/footer section backgrounds, H2 headings, primary buttons (bg), image-box titles |',
  '| `brand-cyan` (accent) | `#00AFEF` | Logo "A" + "ACCOUNTING", the band under the hero, header icons, footer top border (4px), footer CTA button, icon-list icons, offset box-shadows |',
  '| `brand-cyan-form` (secondary accent) | `#30B0ED` | Submit button on the Elementor forms only |',
  '| `ink` (text) | `#000000` | Body/heading text on light sections (Elementor sets pure black) |',
  '| `surface-gray` (section bg) | `#EEEEEE` | Alternating light section background |',
  '| `surface-page` (page bg) | `#F7F8F9` | `<body>` background (GeneratePress `--base-2`) |',
  '| `white` | `#FFFFFF` | Text on navy, card backgrounds |',
  '| `line` (border) | `#D6D6D6` | Container borders |',
  '| `line-strong` | `#1F2124` | Form card border |',
  '| `divider` | `#BDBDBD` | Divider widgets |',
  '',
  '**Fonts**',
  '',
  '- **Merriweather** (serif): the primary typeface for H1 (50px/600), H2 (40px/600), body-size headings (18-20px/400), nav (18px/600), buttons (18px/500), and card titles (20px/700). Weights used: 400, 500, 600, 700, 800.',
  '- **Sora** (sans): secondary. Footer (CTA heading 35px/800, contact info 16px/400, button 16px/500) and the whole Contact Us page (80px/800 title, 34px/600 subhead, 22px/700 contact links). Weights used: 300-800.',
  '- Roboto / Roboto Slab load via the untouched Elementor kit, but no visible element renders in them, so they are not brand fonts. The page body falls back to the system stack.',
  '- Both families come from Google Fonts. The rebuild loads only Merriweather and Sora.',
  '',
  '**Shape:** buttons use a 12px radius, form cards a 22px radius.',
  '',
  '**Logo:** there is only ONE logo variant, a light version for dark backgrounds (cyan "A" + "ACCOUNTING", light gray "X" + "XCHANGE", transparent PNG). There is no dark-on-light version, so the logo must always sit on `brand-navy` (or another dark surface).',
  '',
  '**Not brand colors (ignore):** the Elementor kit globals `#6EC1E4`, `#61CE70`, `#54595F`, `#7A7A7A` (factory defaults), GeneratePress defaults (`#1E73BE` etc.), and `#00386D` / DM Sans, which appear only on legacy `-old`/`-draft` pages. `/pricing/` also uses two background gradients, `#E0E7FF -> #FFFFFF` and `#00AFEF -> #002140`; `#E0E7FF` is a pale tint, so the rebuild uses the neutral page background instead.',
  ''
);
B.push('## Colors actually used on the live pages', '', `Measured from the Elementor CSS of the header (41), footer (83) and every primary page (${cssIdsLive.join(', ')}). Count = number of CSS declarations.`, '');
B.push('| Color | Count | Used as (CSS property) | Used on (widget) |', '|---|---|---|---|');
top(colorsLive, 30).forEach(([c, u]) => B.push(`| \`${c}\` | ${u.count} | ${fmt(u.props)} | ${fmt(u.widgets)} |`));
B.push('', '## Elementor Global Kit (post-17): factory defaults', '', 'These are the values Elementor ships with. The page designs override them almost everywhere.', '');
Object.entries(kitVars).forEach(([k, v]) => B.push(`- \`--${k}\`: \`${v}\``));
B.push('', '## GeneratePress theme variables', '', '```css', gpRoot, '```', '');
B.push('## Fonts actually used on the live pages', '', '| Family | Declarations | Weights | Used for (widget) | Desktop sizes |', '|---|---|---|---|---|');
top(fontsLive).forEach(([f, u]) => B.push(`| ${f} | ${u.count} | ${fmt(u.weights)} | ${fmt(u.widgets)} | ${[...u.sizes].slice(0, 12).join(', ')} |`));
B.push('', '**Google Fonts stylesheets loaded by the site:**', ...gFonts.map((g) => `- ${g}`), '');
B.push('## Logo variants', '', '| Location | File | alt | Size |', '|---|---|---|---|');
logos.forEach((l) => B.push(`| ${l.block} | \`${l.src.replace(ORIGIN, '')}\` | ${l.alt === '' ? '_(empty)_' : (l.alt ?? '_(none)_')} | ${l.width}×${l.height} |`));
B.push('', '**Site icons:** ' + pages[0].meta.icons.map((i) => `\`${i.href.replace(ORIGIN, '')}\``).join(', '), '');
await fs.writeFile(path.join(DOCS, 'brand-tokens.md'), B.join('\n'));

console.log(`pages: ${pages.length}, media copied: ${copied.length}, missing on live: ${missing.length}`);
console.log('categories:', pages.map((p) => `${p.route} → ${p.category}`).join('\n  '));
