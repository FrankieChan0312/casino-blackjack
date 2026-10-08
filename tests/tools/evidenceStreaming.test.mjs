import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { Buffer } from 'node:buffer';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, URL } from 'node:url';
import { hashStream, hashGitBlob } from '../../scripts/evidence-hash.mjs';

test('66 MiB SHA256 consumes bounded chunks with an independent expected hash', async () => {
  const block = Buffer.alloc(32768, 97);
  async function* chunks() { for (let i = 0; i < 2112; i++) yield block; }
  const result = await hashStream(chunks());
  assert.equal(result.bytes, 66 * 1024 * 1024);
  assert.equal(result.maxChunkBytes, block.length);
  assert.equal(result.sha256, '7a4f3b16c8a9ad2dcbc2f4a6a35038d9a9ebb6a2f4da6161aaabed250bbf2593');
  // Synthetic input creates no large temporary fixture or repository artifact.
});

const validator = fileURLToPath(new URL('../../scripts/verify-evidence-publication.mjs', import.meta.url));
const fixture = t => {
  const cwd = fs.mkdtempSync(path.join(tmpdir(), 'blackjack h2 streaming '));
  t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));
  const git = (...args) => {
    const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  };
  git('init', '-q');
  fs.mkdirSync(path.join(cwd, 'docs/M15_EVIDENCE/h2'), { recursive: true });
  fs.writeFileSync(path.join(cwd, '.gitattributes'), '* text=auto\n/raw.bin binary\n');
  fs.writeFileSync(path.join(cwd, 'raw.bin'), Buffer.from('first\r\nlast  '));
  fs.writeFileSync(path.join(cwd, 'small.md'), 'Authored Markdown\n');
  fs.writeFileSync(path.join(cwd, 'small.json'), '{"authored":true}\n');
  const entries = ['.gitattributes', 'small.md', 'small.json', 'docs/M15_EVIDENCE/h2/classification.json'].map(file => ({ path: file, category: 'AUTHORED_TEXT', provenance: 'Runtime fixture', reason: 'Ordinary authored text', byteExactPreservationRequired: false }));
  entries.push({ path: 'raw.bin', category: 'RAW_IMMUTABLE_EVIDENCE', provenance: 'Runtime fixture', reason: 'Exact raw bytes', byteExactPreservationRequired: true, publicationSha256: 'beb899af1c3e8bf8b204e7bd0288196ad93994f47393ff8e253a1db8e3b87676' });
  const writeManifest = () => fs.writeFileSync(path.join(cwd, 'docs/M15_EVIDENCE/h2/classification.json'), JSON.stringify({ entries }) + '\n');
  writeManifest(); git('add', '.');
  return { cwd, git, entries, writeManifest, run: () => spawnSync('node', [validator], { cwd, encoding: 'utf8' }) };
};

test('Git nonzero exit preserves code, signal, stderr and operation with spaced cwd', async t => {
  const f = fixture(t);
  await assert.rejects(hashGitBlob('missing evidence.bin', { cwd: f.cwd }), error => {
    assert.equal(error.exitCode, 128);
    assert.equal(error.signal, null);
    assert.match(error.stderr, /missing evidence.bin/);
    assert.equal(error.operation, 'staged SHA256');
    assert.deepEqual(error.args, ['-c', 'core.safecrlf=false', 'show', ':missing evidence.bin']);
    return true;
  });
});

test('small authored Markdown/JSON and raw CRLF/trailing/no EOF pass the real validator', t => {
  const f = fixture(t), result = f.run();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).status, 'PASS');
});

for (const category of ['UNKNOWN', 'INVALID']) test('classification fails closed: ' + category, t => {
  const f = fixture(t); f.entries[0].category = category; f.writeManifest(); f.git('add', '.');
  const result = f.run(); assert.notEqual(result.status, 0); assert.match(result.stderr, /Invalid classification/);
});

test('duplicate classification fails closed', t => {
  const f = fixture(t); f.entries.push(f.entries[0]); f.writeManifest(); f.git('add', '.');
  const result = f.run(); assert.notEqual(result.status, 0); assert.match(result.stderr, /Duplicate classification/);
});
