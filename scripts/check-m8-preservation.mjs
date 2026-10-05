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
  // M10-T05 explicitly adds Motion and a public presentation adapter. Reverse
  // exactly those two allowlist entries; all other accepted statements still match.
  if (file === 'tests/integration/browserDemo.test.ts') {
    const extension = "'getSnapshot','presentation','queryWager'";
    assert.equal(current.split(extension).length, 2, 'T05 public adapter boundary changed');
    current = current.replace(extension, "'getSnapshot','queryWager'");
  }
  if (file === 'tests/unit/m8Contract.test.ts') {
    const extension = "['motion','react','react-dom']";
    assert.equal(current.split(extension).length, 2, 'T05 dependency boundary changed');
    current = current.replace(extension, "['react','react-dom']");
    // Only approved historical inventory/document input adaptations. Every
    // registration, assertion and other statement must still match accepted M8.
    current = current.replace("import { execFileSync } from 'node:child_process';\n", '')
      .replace(/ {2}\/\/ Authorized M9 historical document boundary:[\s\S]*? {2}\/\/ End historical document boundary\.\n/, '')
      .replace('    // M8 inventory is the preserved accepted suite; M9 owns its added scenarios.\n', '')
      .replace("    if (file === 'm9.spec.ts') continue;\n", '')
      .replace(" && !/^m9[\\\\/]/.test(file)", '')
      .replace('    // RA1 owns its new scenarios; this remains the accepted M8 inventory.\n', '')
      .replace("    if (file === 'ra1.spec.ts') continue;\n", '')
      .replace(" && !/^ra1[\\\\/]/.test(file)", '')
      .replace('    // PA1 owns its new scenarios; this remains the accepted M8 inventory.\n', '')
      .replace("    if (file === 'pa1.spec.ts') continue;\n", '')
      .replace(" && !/^pa1[\\\\/]/.test(file)", '')
      .replace('    // M10 owns new geometry scenarios; retain the historical M8 inventory.\n', '')
      .replace("    if (file === 'm10.spec.ts') continue;\n", '')
      .replace(" && !/^m10[\\\\/]/.test(file)", '')
      .replaceAll('readAcceptedM8(', 'readFileSync(');
  }
  assert.equal(current, baseline, `Accepted M8 test/assertion change: ${file}`);
}
// RA1 explicitly authorizes version-aware RSA in these three domain modules.
// All accepted M8 assertions still run against current production handlers.
const domainChanges = git('diff', '--name-only', sha, '--', 'src/domain').trim().split(/\r?\n/).filter(Boolean);
for (const file of domainChanges) assert(['src/domain/profile.ts', 'src/domain/advancedGame.ts',
  'src/domain/behindController.ts'].includes(file), `Unrelated accepted domain source change: ${file}`);
log('PASS: domain changes bounded to authorized RA1 modules; 66 Vitest / 5 browser source files and every original assertion preserved');
