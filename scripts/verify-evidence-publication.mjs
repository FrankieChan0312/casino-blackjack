import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import console from 'node:console';
import process from 'node:process';
import { performance } from 'node:perf_hooks';
import { hashStream, hashGitBlob } from './evidence-hash.mjs';

const manifest = JSON.parse(fs.readFileSync('docs/M15_EVIDENCE/h2/classification.json', 'utf8'));
// Only bounded path/attribute/check metadata uses synchronous output buffers.
const git = (...args) => execFileSync('git', ['-c', 'core.safecrlf=false', ...args], { maxBuffer: 16 * 1024 * 1024 });
const started = performance.now();
let maxChunkBytes = 0, largestEvidenceBytes = 0, largestEvidencePath;
const entries = new Map();
const counts = { AUTHORED_TEXT: 0, RAW_IMMUTABLE_EVIDENCE: 0, BINARY_ASSET: 0, UNKNOWN: 0 };
let identical = 0;
for (const entry of manifest.entries) {
  assert(!entries.has(entry.path), 'Duplicate classification: ' + entry.path);
  assert(Object.hasOwn(counts, entry.category) && entry.category !== 'UNKNOWN', 'Invalid classification: ' + entry.path);
  assert(entry.provenance && entry.reason);
  entries.set(entry.path, entry);
  counts[entry.category]++;
}
const staged = git('diff', '--cached', '--name-only', '-z').toString().split('\0').filter(Boolean);
for (const file of staged) assert(entries.has(file), 'UNKNOWN staged path: ' + file);
// check-attr --stdin needs the publication paths on stdin, independently of extension.
const checked = execFileSync('git', ['check-attr', '-z', '--stdin', 'text', 'diff', 'merge'], {
  input: [...entries.keys()].join('\0') + '\0', maxBuffer: 16 * 1024 * 1024,
}).toString().split('\0');
const attrs = new Map();
for (let i = 0; i + 2 < checked.length; i += 3) {
  const values = attrs.get(checked[i]) ?? {};
  values[checked[i + 1]] = checked[i + 2];
  attrs.set(checked[i], values);
}
for (const entry of entries.values()) {
  const values = attrs.get(entry.path);
  assert(values, 'Missing Git attributes: ' + entry.path);
  if (entry.category === 'AUTHORED_TEXT') {
    assert.notEqual(values.text, 'unset', 'Authored text conversion disabled: ' + entry.path);
    assert.notEqual(values.diff, 'unset', 'Authored diff hidden: ' + entry.path);
    assert.equal(entry.byteExactPreservationRequired, false);
  } else {
    assert.equal(entry.byteExactPreservationRequired, true);
    for (const attribute of ['text', 'diff', 'merge']) assert.equal(values[attribute], 'unset', entry.path + ': ' + attribute);
    const expected = entry.preH2Sha256 ?? entry.publicationSha256;
    const working = await hashStream(fs.createReadStream(entry.path));
    assert.equal(working.sha256, expected, 'Evidence working bytes changed: ' + entry.path);
    const indexed = await hashGitBlob(entry.path);
    assert.equal(indexed.sha256, expected, 'Evidence index bytes changed: ' + entry.path);
    maxChunkBytes = Math.max(maxChunkBytes, working.maxChunkBytes, indexed.maxChunkBytes);
    if (indexed.bytes > largestEvidenceBytes) {
      largestEvidenceBytes = indexed.bytes;
      largestEvidencePath = entry.path;
    }
    if (entry.preH2Sha256) identical++;
  }
}
git('diff', '--cached', '--check');
console.log(JSON.stringify({ status: 'PASS', staged: staged.length, counts, historicalRawAndBinaryFiles: identical, byteIdentical: identical, changed: 0, authoredWhitespace: 'PASS', attributes: 'PASS', maxChunkBytes, largestEvidenceBytes, largestEvidencePath, runtimeMs: performance.now() - started, rssBytesAtCompletion: process.memoryUsage().rss }));
