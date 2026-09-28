import { existsSync, readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

test('the approved engineering documents exist at their intended paths', () => {
  const requiredDocuments: readonly string[] = [
    'AGENTS.md',
    'README.md',
    'SKILL.md',
    'docs/RULES.md',
    'docs/SPEC.md',
    'docs/DESIGN.md',
    'docs/PLAN.md',
    'docs/STATE.md',
    'docs/DEVELOPMENT_LOG.md',
    'docs/LAB_MANUAL.md',
    'docs/UX_UI.md',
  ];

  for (const path of requiredDocuments) {
    expect(existsSync(new URL(`../${path}`, import.meta.url)), path).toBe(true);
  }
});

test('the agent entry point references the supplied coding guidelines', () => {
  const instructions = readFileSync(new URL('../AGENTS.md', import.meta.url), 'utf8');

  expect(instructions).toContain('Follow `SKILL.md`.');
});
