import { strictEqual } from 'node:assert';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { verifyH5Preservation } from './check-h5-preservation.mjs';

const baseline = '59100ce7abde397dec972da0c86c2f946704c357';
const file = 'tests/m10/dealerCleanup.test.tsx';
const originalBlob = '8d23a01eedc9c10a863b534cbc313dcc9e6326bf';
const originalSha256 = '621781f312b5ecc06654a853fd0e3ba4c228501463531b31e324d99409c5c99e';
const approvedSha256 = 'db319051336b59dba1e55b0f518a024b482f64415caa511ef8a8ca9214f2aa3e';
const canonical = source => source.replaceAll('\r\n', '\n');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });

export function assertH6Source(source, original) {
  strictEqual(sha(original), originalSha256, 'Original accepted Git source identity');
  const oldTitle = "it('[PRE-T11-U01] supplied generic PNG is independently decoded and deterministic conversion reproduces exact bytes', () => {";
  const rebuild = "  expect(JSON.parse(execFileSync(process.execPath, ['scripts/build-generic-dealer.mjs', '--check'], { encoding: 'utf8' })).status).toBe('PASS');";
  const expected = original.replace(oldTitle, "it('[PRE-T11-U01-A] generic Dealer PNG source/runtime audit', () => {")
    .replace(rebuild, "});\nit('[PRE-T11-U01-B] Chromium deterministic PNG rebuild reproduces exact bytes', () => {\n" + rebuild);
  strictEqual(sha(expected), approvedSha256, 'Version 1 approved transformed source identity');
  strictEqual(canonical(source), expected, 'Only the exact PRE-T11-U01 decomposition is authorized');
  return { originalBlob, originalSha256, approvedSha256 };
}

export function verifyH6Preservation() {
  strictEqual(git('rev-parse', `${baseline}:${file}`).trim(), originalBlob, 'Original blob OID');
  const original = git('cat-file', 'blob', originalBlob);
  const identity = assertH6Source(readFileSync(file, 'utf8'), original);
  const contract = JSON.parse(readFileSync('docs/HARNESS_H6_SOURCE_EXCEPTION.json', 'utf8'));
  strictEqual(contract.version, 1);
  strictEqual(contract.path, file);
  strictEqual(contract.originalBlob, originalBlob);
  strictEqual(contract.originalSha256, originalSha256);
  strictEqual(contract.approvedSha256, approvedSha256);
  strictEqual(contract.originalBody, original.slice(original.indexOf("it('[PRE-T11-U01]"), original.indexOf("it('[PRE-T11-U02]")));
  strictEqual(contract.deadlinePerTestMs, 5000);
  strictEqual(contract.combinedDeadlinePreserved, false);
  // The combined guard validates every exact H5/H6 exception before checking
  // all remaining historical sources. No wildcard historical exclusion.
  strictEqual(verifyH5Preservation().status, 'PASS', 'Combined historical source preservation');
  strictEqual(git('diff', '--name-only', baseline, '--', 'src', 'art', 'public', 'package.json', 'package-lock.json', 'vite.config.ts', 'playwright.config.ts', 'scripts/verify.ps1', 'scripts/verify-generic-dealer.mjs', 'scripts/build-generic-dealer.mjs').trim(), '', 'Product, assets, tools, dependencies and deadlines unchanged');
  const protectedFiles = {
    'art/source/dealers/generic_female/formal.png': '6d0e58c7d074fd9b38da042f8d60ff2acb44c8b0196fac5f627d8a9e0c84c65c',
    'public/characters/dealer/generic_female/formal.png': '37a797a09a91ad59f96686a2a27f1db981c517bc4eb42bf426b0ebd62c77a6ce',
    'art/source/dealers/generic_female/MANIFEST.json': '2e757e358bb3cf98df42634077103ed7a718cd9148fe0b0046a9b4ecdda71f6c',
    'scripts/verify-generic-dealer.mjs': '9251f263afde3b022f4d881bc414825ce4211a852aa6e90fc51b3701ebb5a059',
    'scripts/build-generic-dealer.mjs': 'c8232cf9992ca2f1a830b3890b08b5e888d81dbf0450fa29764308af96fea576',
  };
  for (const [path, hash] of Object.entries(protectedFiles)) {
    const bytes = path.endsWith('.png') ? readFileSync(path) : canonical(readFileSync(path, 'utf8'));
    strictEqual(sha(bytes), hash, `Protected identity: ${path}`);
  }
  return { status: 'PASS', version: 1, ...identity, protectedFiles };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.stdout.write(JSON.stringify(verifyH6Preservation(), null, 2) + '\n');
}
