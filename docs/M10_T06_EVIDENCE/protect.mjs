import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { gzipSync, gunzipSync } from 'node:zlib';
import process from 'node:process';
import { Buffer } from 'node:buffer';

const root = 'docs/M10_T06_EVIDENCE/';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const files = execFileSync('git', ['ls-files', '-z']).toString().split('\0').filter(Boolean);
if (process.argv[2] === 'baseline') {
  if (existsSync(root + 'baseline.json')) throw Error('Baseline already captured');
  const hashes = {}, originals = {};
  for (const file of files) {
    const bytes = readFileSync(file); hashes[file] = sha(bytes);
    if (file.startsWith('docs/images/') || file.startsWith('docs/M10_T01_EVIDENCE/')) originals[file] = bytes.toString('base64');
  }
  writeFileSync(root + 'baseline.json', JSON.stringify(hashes, null, 2) + '\n');
  writeFileSync(root + 'legacy-originals.json.gz', gzipSync(JSON.stringify(originals)));
} else if (process.argv[2] === 'restore') {
  const originals = JSON.parse(gunzipSync(readFileSync(root + 'legacy-originals.json.gz')));
  const folder = root + process.argv[3]; if (existsSync(folder)) throw Error('Archive already exists'); mkdirSync(folder);
  const changes = [];
  for (const [file, encoded] of Object.entries(originals)) {
    const before = Buffer.from(encoded, 'base64'), current = readFileSync(file);
    if (sha(before) === sha(current)) continue;
    const archive = `${changes.length}.gz`; writeFileSync(folder + '/' + archive, gzipSync(current));
    changes.push({file, archive, generated: sha(current), original: sha(before)}); writeFileSync(file, before);
  }
  writeFileSync(folder + '/index.json', JSON.stringify(changes, null, 2) + '\n');
} else throw Error('Expected baseline or restore');
