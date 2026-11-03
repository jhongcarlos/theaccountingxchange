import fs from 'node:fs/promises';

// Reads the list of rebuilt routes from src/routes.js (the `pages` array) without importing JSX.
export async function builtRoutes() {
  const src = await fs.readFile('src/routes.js', 'utf8');
  const block = src.slice(src.indexOf('export const pages'), src.indexOf('];', src.indexOf('export const pages')));
  return [...block.matchAll(/path:\s*'([^']+)'/g)].map((m) => m[1]);
}

export async function redirectMap() {
  const src = await fs.readFile('src/routes.js', 'utf8');
  const block = src.slice(src.indexOf('export const redirects'));
  return Object.fromEntries([...block.matchAll(/'([^']+)':\s*'([^']+)'/g)].map((m) => [m[1], m[2]]));
}
