import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { Buffer } from 'node:buffer';

const classification = JSON.parse(fs.readFileSync('docs/M15_EVIDENCE/h2/classification.json', 'utf8'));
const raw = classification.entries.filter(item => item.category === 'RAW_IMMUTABLE_EVIDENCE');
const rawText = raw.find(item => item.path.endsWith('.txt')).path;
const rawJson = raw.find(item => item.path.endsWith('.json')).path;
const png = classification.entries.find(item => item.path.endsWith('.png')).path;
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const fixture = () => {
  const directory = fs.mkdtempSync(path.join(tmpdir(), 'blackjack-h2-'));
  const git = (...args) => {
    const result = spawnSync('git', args, { cwd: directory, encoding: 'utf8' });
    if (result.error) throw result.error;
    return result;
  };
  const write = (file, bytes) => {
    fs.mkdirSync(path.dirname(path.join(directory, file)), { recursive: true });
    fs.writeFileSync(path.join(directory, file), bytes);
  };
  for (const args of [['init', '-q'], ['config', 'user.name', 'H2 fixture'], ['config', 'user.email', 'h2@example.invalid'], ['config', 'core.autocrlf', 'true'], ['config', 'core.safecrlf', 'false']]) assert.equal(git(...args).status, 0);
  for (const file of ['.gitattributes', 'docs/M15_EVIDENCE/.gitattributes']) write(file, fs.readFileSync(file));
  assert.equal(git('add', '.gitattributes', 'docs/M15_EVIDENCE/.gitattributes').status, 0);
  assert.equal(git('commit', '-qm', 'Fixture attribute baseline').status, 0);
  return { directory, git, write };
};

for (const [label, file, bytes] of [
  ['authored Markdown trailing whitespace fails', 'docs/h2-fixture.md', 'Authored defect  \n'],
  ['authored source trailing whitespace fails', 'src/h2-fixture.ts', 'export const value = 1; \n'],
  ['authored JSON trailing whitespace fails', 'docs/M15_EVIDENCE/manifest.json', '{"authored":true} \n'],
]) test(label, () => {
  const f = fixture(); f.write(file, bytes);
  assert.equal(f.git('add', '--', file).status, 0);
  const result = f.git('diff', '--cached', '--check');
  assert.equal(result.status, 2);
  assert.match(result.stdout, /trailing whitespace/);
});

for (const [label, file, bytes] of [
  ['raw stderr preserves trailing whitespace', rawText, Buffer.from('stderr  \n\n')],
  ['raw CRLF preserves bytes', rawText, Buffer.from('first\r\nsecond \r\n')],
  ['raw no-final-newline preserves bytes', rawText, Buffer.from('closed stdout without newline')],
  ['raw machine JSON preserves BOM/CRLF', rawJson, Buffer.from('\uFEFF{ "raw": true } \r\n\r\n')],
  ['PNG bytes and binary policy unchanged', png, fs.readFileSync(png)],
]) test(label, () => {
  const f = fixture(); f.write(file, bytes);
  assert.equal(f.git('add', '--', file).status, 0);
  assert.equal(f.git('diff', '--cached', '--check').status, 0);
  const stored = spawnSync('git', ['show', ':' + file], { cwd: f.directory });
  assert.equal(stored.status, 0);
  assert.deepEqual(stored.stdout, bytes);
  assert.equal(hash(fs.readFileSync(path.join(f.directory, file))), hash(bytes));
  assert.match(f.git('diff', '--cached', '--', file).stdout, /Binary files/);
});

test('every pre-H2 immutable SHA remains identical', () => {
  for (const item of classification.entries.filter(item => item.byteExactPreservationRequired && item.preH2Sha256)) assert.equal(hash(fs.readFileSync(item.path)), item.preH2Sha256, item.path);
});

test('historical accepted PNG retains its independent expected SHA', () => {
  assert.equal(hash(fs.readFileSync('docs/M10_T06_EVIDENCE/reduced-seven-settled.png')), 'fb82b174f93685467c0b0fe9ae60e05795dddbd4a9b461bbcb711551d10b68f4');
});

test('exact raw basename rule does not hide an authored JSON in another directory', () => {
  const f = fixture(), file = 'docs/M15_EVIDENCE/other/performance-summary.json';
  f.write(file, '{"authored":true} \n');
  assert.equal(f.git('add', '--', file).status, 0);
  assert.equal(f.git('diff', '--cached', '--check').status, 2);
  assert.match(f.git('diff', '--cached', '--', file).stdout, /authored/);
});
