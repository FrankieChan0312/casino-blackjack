// Independent SHA256 oracle; does not import the restoration implementation.
import * as fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import console from 'node:console';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = path.resolve(process.argv[2]);
const local = path.join(root, '.git/harness-h1');
const hash = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const json = (file) => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const incoming = json(path.join(local, 'incoming.json'));
const preflight = json(path.join(local, 'real-preflight.json'));
const manifestPath = path.join(root, '.git/m15/baseline-preservation.json');
const manifest = json(manifestPath);
const result = json(path.join(local, 'real-result.json'));
assert.equal(result.status, 'PASS'); assert.equal(result.originallyFailedPngAttempts, 1); assert.equal(result.retries, 0);
assert.equal(hash(manifestPath), preflight.manifestSha256);
const outputHashes = new Map(manifest.outputs.map((item) => [item.file, item.sha256]));
const restored = new Map(result.completed.map((item) => [item.file, item.originalSha256]));
assert.equal(restored.size, 22);
const actual = new Map();
for (const item of incoming.files) {
  const digest = hash(path.join(root, item.file));
  assert.equal(digest, restored.get(item.file) ?? item.sha256, 'Unexpected incoming-byte change: ' + item.file);
  actual.set(item.file, digest);
}
for (const [file, expected] of outputHashes) assert.equal(actual.get(file), expected, 'Historical output mismatch: ' + file);
const currentInventory = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { cwd: root, maxBuffer: 32 * 1024 * 1024 }).toString().split('\0').filter(Boolean);
assert.deepEqual([...new Set(currentInventory)].sort(), incoming.files.map((item) => item.file).sort(), 'Incoming inventory changed');
for (const item of preflight.preflight) {
  assert.equal(hash(item.backupPath), item.expectedOriginalSha256);
  assert.equal(hash(item.archivePath), item.expectedGeneratedSha256);
  assert.equal(hash(item.preflightArchivePath), item.expectedGeneratedSha256);
}
for (const item of preflight.prior) {
  assert.equal(hash(path.join(root, '.git/m15/original', item.file)), item.backupSha256);
  assert.equal(hash(item.archivePath), item.archiveSha256);
}
for (const item of result.completed) {
  assert.equal(item.replacementAttempts, 1);
  assert.equal(fs.existsSync(item.temporaryPath), false);
  assert.equal(fs.existsSync(item.replacementPath), false);
}
for (const parent of new Set(result.completed.map((item) => path.dirname(item.targetPath)))) {
  assert.deepEqual(fs.readdirSync(parent).filter((name) => /^\.h1-(original|replace)-/.test(name)), [], 'Unremoved H1 temporary artifact');
}
assert.equal(hash(path.join(root, '.git/m15/repair7-resume/preserve-output.cjs')), hash(path.join(local, 'legacy-preserve-output.cjs')), 'Private M15 launcher was integrated unexpectedly');
assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), incoming.head);
assert.equal(execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim(), incoming.branch);
const record = {
  at: new Date().toISOString(), status: 'PASS', incomingFiles: incoming.files.length,
  incomingUnchanged: incoming.files.length - restored.size, authorizedHistoricalRestorations: restored.size,
  historicalOutputs: outputHashes.size, allHistoricalHashesMatch: true,
  previousGeneratedArchives: preflight.prior.length, newGeneratedArchives: preflight.preflight.length,
  preflightGeneratedCopies: preflight.preflight.length, backupsChecked: new Set([...preflight.prior, ...preflight.preflight].map((item) => item.file)).size,
  archivesPreserved: true, temporaryArtifacts: 0, originalPartial20Restored: preflight.prior.every((item) => actual.get(item.file) === item.backupSha256),
  productChanges: 0, privateLauncherIntegrated: false, mainHead: incoming.head, mainBranch: incoming.branch,
  failedPng: { finalSha256: actual.get('docs/M10_T06_EVIDENCE/reduced-seven-settled.png'),
    backupSha256: preflight.preflight[0].expectedOriginalSha256, generatedSha256: preflight.preflight[0].expectedGeneratedSha256, attempts: 1 },
};
fs.writeFileSync(path.join(local, 'final-integrity.json'), JSON.stringify(record, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(record));
