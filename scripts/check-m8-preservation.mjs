import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { cwd } from 'node:process';
import { log } from 'node:console';

const sha = '8f5aca327f41f1078fc4fef20b611fd9cd494492';
function git(...args) {
  return execFileSync('git', ['-c', `safe.directory=${cwd().replaceAll('\\', '/')}`, ...args], { encoding: 'utf8' });
}
const files = git('ls-tree', '-r', '--name-only', sha, 'tests').trim().split(/\r?\n/)
  .filter(file => /\.(?:test\.tsx?|spec\.ts)$/.test(file));
assert.equal(files.filter(file => /\.test\.tsx?$/.test(file)).length, 66);
assert.equal(files.filter(file => /\.spec\.ts$/.test(file)).length, 5);
for (const file of files) {
  const baseline = git('show', `${sha}:${file}`).replaceAll('\r\n', '\n').trimEnd();
  let current = readFileSync(file, 'utf8').replaceAll('\r\n', '\n').trimEnd();
  if (file === 'tests/unit/m8Contract.test.ts') {
    // Only approved historical inventory/document input adaptations. Every
    // registration, assertion and other statement must still match accepted M8.
    current = current.replace("import { execFileSync } from 'node:child_process';\n", '')
      .replace(/ {2}\/\/ Authorized M9 historical document boundary:[\s\S]*? {2}\/\/ End historical document boundary\.\n/, '')
      .replace('    // M8 inventory is the preserved accepted suite; M9 owns its added scenarios.\n', '')
      .replace("    if (file === 'm9.spec.ts') continue;\n", '')
      .replace(" && !/^m9[\\\\/]/.test(file)", '')
      .replaceAll('readAcceptedM8(', 'readFileSync(');
  }
  assert.equal(current, baseline, `Accepted M8 test/assertion change: ${file}`);
}
assert.equal(git('diff', sha, '--', 'src/domain').trim(), '', 'Accepted M8 domain source changed');
log('PASS: accepted M8 domain unchanged; 66 Vitest / 5 browser source files and every original assertion preserved');
