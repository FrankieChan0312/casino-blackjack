import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { assertH6Source, verifyH6Preservation } from '../scripts/check-h6-preservation.mjs';

const original = execFileSync('git', ['cat-file', 'blob', '8d23a01eedc9c10a863b534cbc313dcc9e6326bf'], { encoding: 'utf8' });
const approved = readFileSync('tests/m10/dealerCleanup.test.tsx', 'utf8').replaceAll('\r\n', '\n');

it('[H6-P01] exact versioned exception preserves the original object, all other tests and asset/tool identities', () => {
  expect(verifyH6Preservation().status).toBe('PASS');
  expect(assertH6Source(approved.replaceAll('\n', '\r\n'), original).approvedSha256).toBe('db319051336b59dba1e55b0f518a024b482f64415caa511ef8a8ca9214f2aa3e');
});

it.each([
  ['missing audit assertion', (s: string) => s.replace(" expect(audit.nonRoster).toBe(true);", '')],
  ['weakened assertion', (s: string) => s.replace('toBeGreaterThan(7680)', 'toBeGreaterThan(0)')],
  ['mocked audit', (s: string) => s.replace("['scripts/verify-generic-dealer.mjs']", "['-e', 'process.stdout.write(\"{}\")']")],
  ['missing real Chromium check', (s: string) => s.replace("['scripts/build-generic-dealer.mjs', '--check']", "['-e', 'process.stdout.write(\"{}\")']")],
  ['increased timeout', (s: string) => s.replace("});\nit('[PRE-T11-U01-B]", "}, 10000);\nit('[PRE-T11-U01-B]")],
  ['skipped Chromium check', (s: string) => s.replace("it('[PRE-T11-U01-B]", "it.skip('[PRE-T11-U01-B]")],
  ['changed U02', (s: string) => s.replace("toBe('rejected')", "toBe('accepted')")],
  ['changed U03', (s: string) => s.replace('toHaveLength(12)', 'toHaveLength(11)')],
  ['changed U04', (s: string) => s.replace('toBe(snapshot)', 'not.toBe(snapshot)')],
  ['unapproved import', (s: string) => "import './unapproved.js';\n" + s],
] as const)('[H6-P02] rejects %s', (_name, mutate) => {
  const changed = mutate(approved);
  expect(changed).not.toBe(approved);
  expect(() => assertH6Source(changed, original)).toThrow();
});

it('[H6-P03] rejects a substituted original source and the unsplit current registration', () => {
  expect(() => assertH6Source(approved, original.replace('toBeGreaterThan(7680)', 'toBeGreaterThan(0)'))).toThrow();
  expect(() => assertH6Source(original, original)).toThrow();
});
