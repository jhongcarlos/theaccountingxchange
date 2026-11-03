// npm run verify: build, start `vite preview`, run the content diff and the link check, stop the server.
import { spawn, execSync } from 'node:child_process';

const PORT = 4174;
const base = `http://localhost:${PORT}`;
const routes = process.argv.slice(2);

execSync('npm run build', { stdio: 'inherit' });
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { shell: true, stdio: 'ignore' });

let code = 0;
try {
  for (let i = 0; i < 40; i++) {
    try {
      if ((await fetch(base)).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  for (const script of ['content-diff', 'link-check']) {
    try {
      execSync(`node scripts/${script}.mjs ${base} ${routes.join(' ')}`, { stdio: 'inherit', env: { ...process.env, MSYS_NO_PATHCONV: '1' } });
    } catch {
      code = 1;
    }
  }
} finally {
  try {
    if (process.platform === 'win32') execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: 'ignore' });
    else server.kill();
  } catch {}
}
process.exit(code);
