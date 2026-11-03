// Screenshots every rebuilt route at 375/768/1440 into docs/screenshots.
// Usage: node scripts/screenshots.mjs [baseUrl] [route ...]   (default base: http://localhost:4173)
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import { builtRoutes } from './lib/routes.mjs';

const base = process.argv[2] || 'http://localhost:4173';
const routes = process.argv.length > 3 ? process.argv.slice(3) : await builtRoutes();
const widths = [375, 768, 1440];

await fs.mkdir('docs/screenshots', { recursive: true });
const browser = await chromium.launch();
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: 'networkidle' });
    // scroll through so every whileInView reveal fires, then return to top
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);
    const name = route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replace(/\//g, '_');
    await page.screenshot({ path: `docs/screenshots/${name}-${width}.png`, fullPage: true });
    console.log(`docs/screenshots/${name}-${width}.png`);
  }
  await page.close();
}
await browser.close();
