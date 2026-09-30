import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { expect, it } from 'vitest';

it('portfolio relative links resolve and public text excludes private local paths or stale milestone status', () => {
  for (const file of ['README.md', 'docs/PORTFOLIO.md']) {
    const text = readFileSync(file, 'utf8');
    expect(text, file).not.toMatch(/C:\\Users\\|AppData|M[78].*NOT STARTED|M7.*NOT ACCEPTED/);
    for (const match of text.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = match[1].split('#')[0];
      if (!target || /^https?:/.test(target)) continue;
      expect(existsSync(resolve(dirname(file), target)), `${file}: ${target}`).toBe(true);
    }
  }
});
it('README runnable commands match package scripts and required verification tools', () => {
  const readme = readFileSync('README.md', 'utf8');
  const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> };
  for (const match of readme.matchAll(/npm\.cmd run ([\w:]+)/g)) expect(pkg.scripts).toHaveProperty(match[1]);
  expect(readme).toContain('npm.cmd ci');
  expect(readme).toContain('npx.cmd playwright install chromium');
  expect(existsSync('scripts/verify.ps1')).toBe(true);
  expect(existsSync('tests/browser/portfolio.spec.ts')).toBe(true);
  expect(readme).toContain('REG-M8-001..092');
});
