import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import process from 'node:process';

// Harness evidence belongs to this checkout, not the shared objects/refs store.
// Let Git resolve ordinary directories and linked-worktree gitfiles alike.
export function resolveGitDir(cwd = process.cwd()) {
  const directory = execFileSync('git', ['rev-parse', '--git-dir'], {
    cwd, encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
  if (!directory) throw new Error('Git returned an empty Git directory');
  return resolve(cwd, directory);
}
