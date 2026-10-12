import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { Buffer } from 'node:buffer';
import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';
import { comparePublicationValidatorSource } from '../../scripts/check-h5-preservation.mjs';

const repository = fileURLToPath(new URL('../../', import.meta.url));
const validatorFile = 'scripts/verify-evidence-publication.mjs';
const validator = path.join(repository, validatorFile);
const historicalPath = 'docs/M15_EVIDENCE/h2/classification.json';
const h5Path = 'docs/HARNESS_H5_PUBLICATION/classification-v1.json';
const explicit = ['--manifest', h5Path];
const expectedHead = '59100ce7abde397dec972da0c86c2f946704c357';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const originalResult = spawnSync('git', ['show', expectedHead + ':' + validatorFile], { cwd: repository });
assert.equal(originalResult.status, 0, originalResult.stderr.toString());
const original = originalResult.stdout.toString('utf8');
const current = () => fs.readFileSync(validator, 'utf8').replace(/\r\n/g, '\n');
const originalSelection = "const manifest = JSON.parse(fs.readFileSync('docs/M15_EVIDENCE/h2/classification.json', 'utf8'));";
// This independent literal is the complete owner-approved source change.
const approvedSelection = [
  "const historicalManifestPath = 'docs/M15_EVIDENCE/h2/classification.json';",
  "const h5ManifestPath = 'docs/HARNESS_H5_PUBLICATION/classification-v1.json';",
  'const args = process.argv.slice(2);',
  'assert(args.length === 0 ||',
  "  (args.length === 2 && args[0] === '--manifest' && args[1] === h5ManifestPath),",
  "'Expected no arguments or --manifest ' + h5ManifestPath);",
  "const manifest = JSON.parse(fs.readFileSync(args.length === 0 ? historicalManifestPath : h5ManifestPath, 'utf8'));",
].join('\n');
const authored = file => ({ path: file, category: 'AUTHORED_TEXT', provenance: 'Isolated runtime fixture', reason: 'Normal authored text', byteExactPreservationRequired: false });
const rawEntry = (file, sha256) => ({ path: file, category: 'RAW_IMMUTABLE_EVIDENCE', provenance: 'Independent literal byte fixture', reason: 'Retain exact working and index bytes', byteExactPreservationRequired: true, publicationSha256: sha256 });

function fixture(t) {
  const temporaryRoot = fs.realpathSync(tmpdir());
  const cwd = fs.mkdtempSync(path.join(temporaryRoot, 'blackjack-h5-publication-'));
  const write = (file, bytes) => {
    fs.mkdirSync(path.dirname(path.join(cwd, file)), { recursive: true });
    fs.writeFileSync(path.join(cwd, file), bytes);
  };
  const git = (...args) => {
    const result = spawnSync('git', ['-c', 'core.safecrlf=false', ...args], { cwd, encoding: 'utf8', windowsHide: true });
    assert.equal(result.status, 0, result.stderr);
    return result;
  };
  git('init', '-q');
  git('config', 'core.autocrlf', 'true');
  git('config', 'core.safecrlf', 'false');
  write('.gitattributes', '* text=auto\n/raw.bin binary\n/large.bin binary\n');
  write('authored.ts', 'export const fixture = 1;\n');
  write('raw.bin', Buffer.from('first\r\nlast  '));
  const common = ['.gitattributes', 'authored.ts', historicalPath].map(authored);
  common.push(rawEntry('raw.bin', 'beb899af1c3e8bf8b204e7bd0288196ad93994f47393ff8e253a1db8e3b87676'));
  const h5Entries = [...common, authored(h5Path), authored('h5-only.ts')];
  const writeH5 = () => write(h5Path, JSON.stringify({ task: 'HARNESS-H5/H6', version: 1, entries: h5Entries }, null, 2) + '\n');
  write(historicalPath, JSON.stringify({ task: 'HARNESS-H2', entries: common }, null, 2) + '\n');
  const historicalSha256 = hash(fs.readFileSync(path.join(cwd, historicalPath)));
  writeH5();
  git('add', '--', '.gitattributes', 'authored.ts', 'raw.bin', historicalPath);
  const run = (args = [], source = validator) => spawnSync(process.execPath, [source, ...args], { cwd, encoding: 'utf8', windowsHide: true });
  const stageH5 = () => {
    write('h5-only.ts', 'export const selectedH5 = true;\n');
    git('add', '--', h5Path, 'h5-only.ts');
  };
  t.after(() => {
    // Verify an absolute, freshly created, task-specific tmp boundary before deletion.
    const actual = fs.realpathSync(cwd);
    assert.equal(path.dirname(actual), temporaryRoot, 'Fixture must remain a direct child of the temporary root');
    assert(path.basename(actual).startsWith('blackjack-h5-publication-'), 'Fixture task prefix');
    assert.equal(hash(fs.readFileSync(path.join(cwd, historicalPath))), historicalSha256, 'Historical fixture manifest was never changed');
    fs.rmSync(actual, { recursive: true, force: true });
  });
  return { cwd, write, git, common, h5Entries, writeH5, run, stageH5 };
}

function passed(result) {
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.signal, null);
  const report = JSON.parse(result.stdout);
  assert.equal(report.status, 'PASS');
  return report;
}
function failed(result, diagnostic) {
  assert.notEqual(result.status, 0);
  assert.equal(result.signal, null);
  assert.match(result.stderr, diagnostic);
}

// A and B use distinct classifications to prove actual selection, not just argument parsing.
test('A: no argument reads the historical H2 manifest even with an invalid H5 manifest present', t => {
  const f = fixture(t);
  f.write(h5Path, '{ invalid JSON');
  const report = passed(f.run());
  assert.equal(report.staged, 4);
  assert.deepEqual(report.counts, { AUTHORED_TEXT: 3, RAW_IMMUTABLE_EVIDENCE: 1, BINARY_ASSET: 0, UNKNOWN: 0 });
});

test('B: explicit H5 manifest validates the H5-only staged paths', t => {
  const f = fixture(t); f.stageH5();
  const report = passed(f.run(explicit));
  assert.equal(report.staged, 6);
  assert.deepEqual(report.counts, { AUTHORED_TEXT: 5, RAW_IMMUTABLE_EVIDENCE: 1, BINARY_ASSET: 0, UNKNOWN: 0 });
  failed(f.run(), /UNKNOWN staged path/);
});

for (const args of [
  ['--manifest'],
  ['--manifest', 'docs/other.json'],
  ['--manifest', '../classification.json'],
  ['--manifest', '/tmp/classification.json'],
  ['--manifest', 'C:\\outside\\classification.json'],
  ['--manifest', 'docs\\HARNESS_H5_PUBLICATION\\classification-v1.json'],
  ['--manifest=' + h5Path],
  ['--unknown', h5Path],
  [...explicit, '--skip'],
  [...explicit, ...explicit],
]) test('C: invalid option/path fails closed: ' + JSON.stringify(args), t => {
  const f = fixture(t);
  failed(f.run(args), /Expected no arguments or --manifest/);
});

test('D: missing explicitly selected H5 manifest fails closed without H2 fallback', t => {
  const f = fixture(t);
  fs.unlinkSync(path.join(f.cwd, h5Path));
  failed(f.run(explicit), /ENOENT/);
});

test('E: invalid JSON in explicitly selected H5 manifest fails closed without H2 fallback', t => {
  const f = fixture(t);
  f.write(h5Path, '{ invalid JSON');
  failed(f.run(explicit), /SyntaxError/);
});

test('F: duplicate classification is rejected by the real H5 validator', t => {
  const f = fixture(t); f.h5Entries.push(f.h5Entries[0]); f.writeH5(); f.stageH5();
  failed(f.run(explicit), /Duplicate classification/);
});

test('G: an unclassified staged H5 source fails closed', t => {
  const f = fixture(t);
  f.h5Entries.splice(f.h5Entries.findIndex(entry => entry.path === 'h5-only.ts'), 1);
  f.writeH5(); f.stageH5();
  failed(f.run(explicit), /UNKNOWN staged path: h5-only.ts/);
});

test('H: working raw evidence SHA mismatch fails before index validation', t => {
  const f = fixture(t); f.stageH5();
  f.write('raw.bin', Buffer.from('wrong working bytes'));
  failed(f.run(explicit), /Evidence working bytes changed: raw.bin/);
});

test('I: indexed raw evidence SHA mismatch fails while working bytes remain correct', t => {
  const f = fixture(t); f.stageH5();
  f.write('raw.bin', Buffer.from('wrong indexed bytes')); f.git('add', '--', 'raw.bin');
  f.write('raw.bin', Buffer.from('first\r\nlast  '));
  failed(f.run(explicit), /Evidence index bytes changed: raw.bin/);
});

test('J: authored source trailing whitespace remains rejected under explicit H5 selection', t => {
  const f = fixture(t); f.stageH5();
  f.write('h5-only.ts', 'export const selectedH5 = true; \n'); f.git('add', '--', 'h5-only.ts');
  failed(f.run(explicit), /diff --cached --check/);
  const whitespace = spawnSync('git', ['-c', 'core.safecrlf=false', 'diff', '--cached', '--check'], { cwd: f.cwd, encoding: 'utf8', windowsHide: true });
  assert.equal(whitespace.status, 2);
  assert.match(whitespace.stdout, /trailing whitespace/);
});

test('K: the real validator streams a 66 MiB indexed artifact against an independent fixed hash', t => {
  const f = fixture(t), file = path.join(f.cwd, 'large.bin');
  const fd = fs.openSync(file, 'wx');
  try {
    const block = Buffer.alloc(32768, 97);
    for (let i = 0; i < 2112; i++) assert.equal(fs.writeSync(fd, block), block.length);
  } finally { fs.closeSync(fd); }
  // Independent known SHA for 66 MiB of ASCII 'a'; no production hash is used to create the oracle.
  f.h5Entries.push(rawEntry('large.bin', '7a4f3b16c8a9ad2dcbc2f4a6a35038d9a9ebb6a2f4da6161aaabed250bbf2593'));
  f.writeH5(); f.stageH5(); f.git('add', '--', 'large.bin');
  const report = passed(f.run(explicit));
  assert.equal(report.largestEvidencePath, 'large.bin');
  assert.equal(report.largestEvidenceBytes, 66 * 1024 * 1024);
  assert(report.maxChunkBytes > 0 && report.maxChunkBytes <= 65536, 'Working/index streams retain bounded chunks');
  assert.equal(report.counts.RAW_IMMUTABLE_EVIDENCE, 2);
});

test('L: historical default has the same real report as the exact original validator', t => {
  const f = fixture(t);
  f.write('original-validator.mjs', original);
  f.write('evidence-hash.mjs', fs.readFileSync(path.join(repository, 'scripts/evidence-hash.mjs')));
  const oldReport = passed(f.run([], path.join(f.cwd, 'original-validator.mjs')));
  const newReport = passed(f.run());
  for (const report of [oldReport, newReport]) {
    delete report.runtimeMs;
    delete report.rssBytesAtCompletion;
  }
  assert.deepEqual(newReport, oldReport, 'Default semantics and evidence checks remain unchanged');
});

test('validator source preserves the complete historical body with only the approved selection replacement', () => {
  assert.equal(original.split(originalSelection).length, 2, 'Exactly one original manifest read');
  assert.equal(current(), original.replace(originalSelection, approvedSelection));
  assert.deepEqual(comparePublicationValidatorSource(original, current()), { file: validatorFile });
});

for (const [label, before, after] of [
  ['working hash assertion', 'assert.equal(working.sha256, expected', 'assert.notEqual(working.sha256, expected'],
  ['index hash assertion', 'assert.equal(indexed.sha256, expected', 'assert.notEqual(indexed.sha256, expected'],
  ['Git attributes', "assert.equal(values[attribute], 'unset'", "assert.notEqual(values[attribute], 'unset'"],
  ['UNKNOWN category rejection', " && entry.category !== 'UNKNOWN'", ''],
  ['provenance requirement', 'assert(entry.provenance && entry.reason);', ''],
  ['duplicate rejection', "assert(!entries.has(entry.path), 'Duplicate classification: ' + entry.path);", ''],
  ['unknown staged path rejection', "for (const file of staged) assert(entries.has(file), 'UNKNOWN staged path: ' + file);", ''],
  ['authored whitespace', "git('diff', '--cached', '--check');", ''],
  ['argument arity', 'args.length === 2', 'args.length >= 2'],
  ['historical default selection', 'args.length === 0 ? historicalManifestPath : h5ManifestPath', 'h5ManifestPath'],
]) test('source protection rejects a mutation of ' + label, () => {
  const approved = current();
  assert.equal(approved.split(before).length, 2, 'Exactly one mutation site: ' + label);
  const mutated = approved.replace(before, after);
  assert.notEqual(mutated, approved);
  assert.throws(() => comparePublicationValidatorSource(original, mutated));
});

test('source protection rejects altered historical input identity and an unexpected source insertion', () => {
  assert.throws(() => comparePublicationValidatorSource(original + '// altered historical source\n', current()));
  assert.throws(() => comparePublicationValidatorSource(original, current() + '// unauthorized insertion\n'));
});
