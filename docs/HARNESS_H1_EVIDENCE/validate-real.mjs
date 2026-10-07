// HARNESS-H1 one-shot evidence runner; never resumes M15 product validation.
import * as fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import console from 'node:console';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { restoreHistoricalOutput } from '../../scripts/restore-historical-output.mjs';

const root = path.resolve(process.argv[2]);
const local = path.join(root, '.git/harness-h1');
const json = (file) => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const hash = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const within = (base, file) => {
  const absolute = path.resolve(base, file);
  assert(absolute.startsWith(path.resolve(base) + path.sep), 'Path outside intended directory');
  return absolute;
};
const receiptPath = path.join(local, 'real-attempt.json');
assert(!fs.existsSync(receiptPath), 'Real attempt already recorded; do not retry');
assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), '507d6d53b529f38b4510a8b488ed272216c0f5a9');
const manifestPath = path.join(root, '.git/m15/baseline-preservation.json');
const manifest = json(manifestPath);
const pending = json(path.join(local, 'pre-restore-manifest-diff.json')).mismatches;
const partial = json(path.join(root, 'docs/M15_EVIDENCE/repair7-resume/restoration-partial-integrity.json')).partial;
assert.equal(pending.length, 22); assert.equal(partial.length, 20);
const known = 'docs/M10_T06_EVIDENCE/reduced-seven-settled.png';
assert.equal(pending[0].file, known);
assert.equal(pending[0].sha256, 'fb82b174f93685467c0b0fe9ae60e05795dddbd4a9b461bbcb711551d10b68f4');
assert.equal(pending[0].current, 'f437eb6cec0d03406a3f2df65cef66085c14d4b563a8d680603738c04c71279c');
const manifestHashes = new Map(manifest.outputs.map((item) => [item.file, item.sha256]));
const prior = partial.map((item) => {
  const backupPath = within(path.join(root, '.git/m15/original'), item.file);
  const archivePath = within(path.join(root, '.git/m15/generated/repair7-resume-before-unified'), item.file);
  assert.equal(hash(backupPath), item.original);
  assert.equal(hash(archivePath), item.archive);
  return { file: item.file, backupSha256: hash(backupPath), archivePath, archiveSha256: hash(archivePath) };
});
const preflight = pending.map((item) => {
  assert.equal(manifestHashes.get(item.file), item.sha256);
  const targetPath = within(path.join(root, 'docs'), path.relative('docs', item.file));
  const backupPath = within(path.join(root, '.git/m15/original'), item.file);
  assert.equal(hash(targetPath), item.current, 'Incoming generated file changed');
  assert.equal(hash(backupPath), item.sha256, 'Original backup changed');
  const preflightArchivePath = within(path.join(local, 'preflight-generated'), item.file);
  fs.mkdirSync(path.dirname(preflightArchivePath), { recursive: true });
  fs.writeFileSync(preflightArchivePath, fs.readFileSync(targetPath), { flag: 'wx', flush: true });
  assert.equal(hash(preflightArchivePath), item.current);
  return { file: item.file, targetPath, backupPath, expectedOriginalSha256: item.sha256, expectedGeneratedSha256: item.current,
    archivePath: within(path.join(local, 'generated/real-once'), item.file),
    diagnosticPath: within(path.join(local, 'failures'), item.file + '.json'), preflightArchivePath };
});
write(path.join(local, 'real-preflight.json'), { at: new Date().toISOString(), status: 'PASS', manifestSha256: hash(manifestPath), prior, preflight });
write(receiptPath, { at: new Date().toISOString(), status: 'ATTEMPT_STARTED', failedHistoricalFile: known, retries: 0 });
const completed = [];
try {
  // Exactly ONE attempt on the originally failed PNG, before any other target.
  completed.push({ file: known, ...restoreHistoricalOutput(preflight[0]) });
  fs.writeFileSync(path.join(local, 'completed.jsonl'), JSON.stringify(completed[0]) + '\n', { flag: 'wx' });
  // Remaining manifest-listed outputs each receive one attempt; this is not retry.
  for (const item of preflight.slice(1)) {
    const record = { file: item.file, ...restoreHistoricalOutput(item) };
    completed.push(record);
    fs.appendFileSync(path.join(local, 'completed.jsonl'), JSON.stringify(record) + '\n');
  }
  const result = { at: new Date().toISOString(), status: 'PASS', originallyFailedPngAttempts: 1, retries: 0, completed };
  write(path.join(local, 'real-result.json'), result);
  console.log(JSON.stringify({ ...result, completed: completed.length }));
} catch (error) {
  write(path.join(local, 'real-result.json'), { at: new Date().toISOString(), status: 'FAIL', completed, error: error.restorationFailure ?? { message: error.message, stack: error.stack }, retry: 'FORBIDDEN' });
  console.error(error);
  process.exitCode = 1;
}
