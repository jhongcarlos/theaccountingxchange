# The Accounting Xchange: Website Redesign

Full visual redesign of https://theaccountingxchange.com/ in React (JavaScript).
Design and motion are inspired by https://calmbooks-accounting.framer.website/ and https://rebanking.framer.website/.

## Hard rules (non-negotiable)

1. **ZERO content changes.** Keep every headline, paragraph, list item, button label, form label, testimonial, FAQ, legal text, phone, email, and address exactly as written. Do not rewrite, shorten, "improve," or add copy. No lorem ipsum, no placeholder text, no stock images.
2. **ZERO brand changes.** Use the existing logo files and the exact brand colors and fonts from the live site. Do not invent new brand colors. Neutrals (white, off-white, near-black, grays) may be added only for backgrounds and borders.
3. **Keep ALL assets:** every image, icon, logo, SVG, video, favicon, and OG image. Store them in `/public/assets` and keep the original alt text.
4. **Keep ALL links:** the same internal URL paths, the same external links, mailto/tel links, social links, booking/calendar links, and all embedded forms or third-party widgets. Keep their original endpoints/embed code so submissions still work.
5. **Redesign EVERY page** on the site, not just the homepage.
6. **JavaScript only.** Use `.jsx`/`.js` files. No TypeScript.

## Stack

React (JavaScript) + Vite + Tailwind CSS v3 + Framer Motion + Lenis + React Router + react-helmet-async.
Dev tooling: Playwright (screenshots, content diff, link check) and cheerio (extraction).

## Sources of truth

- Content: `/docs/inventory.md`, generated from the `/reference` mirror by `npm run extract`
- Colors and fonts: `/docs/brand-tokens.md`, mirrored in `tailwind.config.js`
- Page copy lives in `/src/content` as JS objects copied verbatim from the inventory. Never hardcode copy inside layout components.

## Workflow

- Commit after each completed page with the message `page: <route>`.
- Before marking any page done, run `npm run build`, the content diff (`npm run diff`), and the link check (`npm run linkcheck`). `npm run verify` runs all three.
- Screenshot every route at 375/768/1440 (`npm run screenshots`) and review for layout bugs.
