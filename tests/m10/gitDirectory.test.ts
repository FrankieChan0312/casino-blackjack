import { expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { resolveGitDir } from '../../scripts/git-directory.mjs';

const git = (cwd: string, ...args: string[]) => execFileSync('git', args, {
  cwd, encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
}).trim();

it('[H4-GIT-U01] ordinary checkout resolves its actual directory with literal Windows paths', () => {
  const root = mkdtempSync(join(tmpdir(), "blackjack-h4 空格 ' [ordinary]-"));
  git(root, 'init', '-q');
  expect(statSync(join(root, '.git')).isDirectory()).toBe(true);
  expect(resolveGitDir(root)).toBe(join(root, '.git'));
  expect(resolve(root, git(root, 'rev-parse', '--git-common-dir'))).toBe(join(root, '.git'));
  expect(resolve(git(root, 'rev-parse', '--show-toplevel'))).toBe(root);
});

it('[H4-GIT-U02] actual checkout evidence uses local metadata and preserves shared-directory semantics', () => {
  const root = resolve(git(process.cwd(), 'rev-parse', '--show-toplevel'));
  const local = resolveGitDir(root), common = resolve(root, git(root, 'rev-parse', '--git-common-dir'));
  expect(local).toBe(resolve(root, git(root, 'rev-parse', '--git-dir')));
  expect(statSync(local).isDirectory()).toBe(true);
  expect(statSync(common).isDirectory()).toBe(true);
  if (statSync(join(root, '.git')).isFile()) expect(local).not.toBe(common);
  else expect(local).toBe(common);
});

it.each([false, true])('[H4-GIT-U03] failed Git resolution fails closed; malformed gitfile=$0', malformed => {
  const root = mkdtempSync(join(tmpdir(), 'blackjack-h4-invalid-'));
  if (malformed) writeFileSync(join(root, '.git'), 'not a valid gitfile\n');
  let failure: { status?: number; stderr?: Buffer } | undefined;
  try { resolveGitDir(root); } catch (error) { failure = error as typeof failure; }
  expect(failure?.status).toBe(128);
  expect(failure?.stderr?.toString()).toMatch(/fatal:/);
});
