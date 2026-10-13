import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import process from 'node:process';
import { log } from 'node:console';

assert.equal(process.argv.length, 3, 'Usage: node release/rel1/inspect-package.mjs EXTRACTED_PARENT');
const extraction = resolve(process.argv[2]);
assert.deepEqual(await readdir(extraction), ['casino-interview-demo'], 'Exactly one top-level directory required');
const root = join(extraction, 'casino-interview-demo');
assert.deepEqual((await readdir(root)).sort(), ['START-DEMO.cmd', 'START-HERE.md', 'THIRD-PARTY-NOTICES.txt', 'VERSION.json', 'dist', 'start-demo.mjs'].sort());
const hash = data => createHash('sha256').update(data).digest('hex');
const version = JSON.parse(await readFile(join(root, 'VERSION.json'), 'utf8'));
assert.equal(version.releaseVersion, '1.0.0');
assert.equal(version.gameBaselineCommit, '920e1035f22eb7c770c50a409e977bcb33ee66ca');
assert.match(version.packagingSourceCommit, /^[a-f0-9]{40}$/);
assert.equal(hash(JSON.stringify(version.payloadManifest)), version.payloadManifestIdentity.sha256, 'Manifest identity');
const actual = [];
async function visit(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    assert(!entry.isSymbolicLink(), 'ZIP contains no symlinks');
    if (entry.isDirectory()) await visit(path);
    else { assert(entry.isFile()); actual.push(relative(root, path).replaceAll('\\', '/')); }
  }
}
await visit(root);
const manifestFiles = version.payloadManifest.map(item => item.path);
assert.deepEqual(actual.sort(), [...manifestFiles, 'VERSION.json'].sort(), 'No missing or extra payload files');
for (const item of version.payloadManifest) {
  assert(!item.path.split('/').some(segment => segment === '..' || segment.startsWith('.')));
  const path = join(root, item.path);
  assert.equal((await stat(path)).size, item.bytes, item.path + ' size');
  assert.equal(hash(await readFile(path)), item.sha256, item.path + ' SHA-256');
}
assert.equal(manifestFiles.filter(path => path.endsWith('.png')).length, 18, 'All 18 baseline assets');
const launcher = await readFile(join(root, 'start-demo.mjs'), 'utf8');
assert(!/\b(?:npm|npx)\s+(?:install|run)|from\s+['"](?!node:)[^.'"]/.test(launcher), 'Launcher imports only Node built-ins');
const notice = await readFile(join(root, 'THIRD-PARTY-NOTICES.txt'), 'utf8');
for (const name of ['react ', 'react-dom ', 'scheduler ', 'motion ', 'framer-motion ', 'motion-dom ', 'motion-utils ', 'tslib ']) assert(notice.includes(`===== ${name}`), `Notice: ${name}`);
assert(!actual.some(path => /node_modules|\.git|evidence|\.map$/.test(path)), 'No development/history payload');
log(JSON.stringify({ status: 'PASS', files: actual.length, assets: 18, packagingSourceCommit: version.packagingSourceCommit, payloadManifestIdentity: version.payloadManifestIdentity.sha256 }));
