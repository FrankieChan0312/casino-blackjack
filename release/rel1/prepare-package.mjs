import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, readFile, readdir, realpath, stat, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { log } from 'node:console';

const baseline = '920e1035f22eb7c770c50a409e977bcb33ee66ca';
const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, '../..');
const destination = resolve(process.argv[2] ?? '');
assert(process.argv.length === 3, 'Usage: node release/rel1/prepare-package.mjs NEW_OUTPUT_DIRECTORY');
const outputRelative = relative(source, destination);
assert(outputRelative === '..' || outputRelative.startsWith('..' + sep) || isAbsolute(outputRelative), 'Keep generated packages outside the source tree');
const git = (...args) => execFileSync('git', args, { cwd: source, encoding: 'utf8', env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' } }).trim();
const digest = (data) => createHash('sha256').update(data).digest('hex');
const inputs = ['src', 'public', 'index.html', 'package.json', 'package-lock.json', 'vite.config.ts', 'tsconfig.json', 'tsconfig.domain.json', 'tsconfig.baccarat.json', 'eslint.config.mjs', 'scripts/check-browser-build.mjs', 'scripts/check-baccarat-build.mjs'];
assert.equal(git('diff', '--name-only', baseline, 'HEAD', '--', ...inputs), '', 'Game/build inputs must match the pinned baseline');
assert.equal(git('diff', '--name-only', 'HEAD', '--', ...inputs, 'release/rel1'), '', 'Package sources must be committed before provenance is generated');
assert.equal(git('ls-files', '--others', '--exclude-standard', '--', ...inputs, 'release/rel1'), '', 'Uncommitted package/input files are forbidden');
const packagingSourceCommit = git('rev-parse', 'HEAD');
const inputManifest = [];
for (const path of git('ls-tree', '-r', '--name-only', baseline, '--', ...inputs).split('\n')) {
  assert.equal(git('hash-object', '--path', path, path), git('rev-parse', `${baseline}:${path}`), `Input changed: ${path}`);
  inputManifest.push({ path, gitBlob: git('rev-parse', `${baseline}:${path}`) });
}
await mkdir(destination); // Exclusive new destination; failed candidates are never overwritten.
const packageRoot = join(destination, 'casino-interview-demo');
await mkdir(packageRoot);
async function files(root) {
  const result = [];
  async function visit(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      assert(!entry.isSymbolicLink(), `Symlink cannot enter payload: ${path}`);
      if (entry.isDirectory()) await visit(path);
      else { assert(entry.isFile(), `Non-file payload: ${path}`); result.push(path); }
    }
  }
  await visit(root);
  return result.sort();
}
const distRoot = await realpath(join(source, 'dist'));
const buildFiles = await files(distRoot);
assert(buildFiles.length > 3 && buildFiles.some(path => path.endsWith('index.html')), 'Fresh complete production build required');
const assets = git('ls-tree', '-r', '--name-only', baseline, '--', 'public').split('\n');
for (const asset of assets) {
  assert.deepEqual(await readFile(join(distRoot, asset.slice('public/'.length))), await readFile(join(source, asset)), `Runtime asset changed/missing: ${asset}`);
}
for (const path of buildFiles) {
  const rel = relative(distRoot, path);
  assert(!/\.map$|(^|[\\/])\./.test(rel), 'No sourcemaps/hidden files in payload');
  if (/\.(js|css|html)$/.test(rel)) {
    const text = await readFile(path, 'utf8');
    assert(!/(?:[A-Za-z]:[\\/]Users[\\/]|\/Users\/|\/home\/|AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{30}|-----BEGIN .*PRIVATE KEY-----)/.test(text), `Private path/secret marker: ${rel}`);
  }
  const output = join(packageRoot, 'dist', rel);
  await mkdir(dirname(output), { recursive: true });
  await copyFile(path, output);
}
for (const name of ['START-DEMO.cmd', 'start-demo.mjs', 'START-HERE.md']) await copyFile(join(here, name), join(packageRoot, name));

// Only runtime dependency notices enter the demo. Builder dependency licenses do not.
const packageJson = JSON.parse(await readFile(join(source, 'package.json'), 'utf8'));
const visited = new Set();
const notices = ['Casino Interview Demo — third-party notices', '', 'Game snapshot: ' + baseline, 'Artwork: owner-provided and approved project inputs. Artwork generation/licensing was not independently verified. No repository or artwork license is invented by this package.', 'The notices below cover runtime software dependencies only.', ''];
async function notice(name) {
  if (visited.has(name)) return;
  visited.add(name);
  const root = join(source, 'node_modules', name);
  const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
  const licenseFiles = (await readdir(root)).filter(file => /^(license|licence|copying)(\.|$)/i.test(file));
  assert(licenseFiles.length > 0, `Required license unavailable: ${name}`);
  notices.push(`===== ${name} ${pkg.version} (${pkg.license ?? 'see notice'}) =====`);
  for (const file of licenseFiles.sort()) notices.push(await readFile(join(root, file), 'utf8'));
  for (const dependency of Object.keys(pkg.dependencies ?? {}).sort()) await notice(dependency);
}
for (const name of Object.keys(packageJson.dependencies).sort()) await notice(name);
await writeFile(join(packageRoot, 'THIRD-PARTY-NOTICES.txt'), notices.join('\n'), 'utf8');
const payloadManifest = [];
for (const path of await files(packageRoot)) {
  const bytes = await readFile(path);
  payloadManifest.push({ path: relative(packageRoot, path).replaceAll('\\', '/'), bytes: bytes.length, sha256: digest(bytes) });
}
payloadManifest.sort((a, b) => a.path.localeCompare(b.path, 'en'));
const manifestIdentity = digest(JSON.stringify(payloadManifest));
const version = {
  releaseVersion: '1.0.0', gameBaselineCommit: baseline, packagingSourceCommit,
  runtimeRequirement: 'Node >=24.19.0 <25',
  testedRuntimePlatform: { node: process.version, platform: process.platform, arch: process.arch },
  payloadManifestIdentity: { algorithm: 'SHA-256', sha256: manifestIdentity, encoding: 'UTF-8 JSON.stringify(payloadManifest)', excludes: ['VERSION.json (self-reference)'] },
  payloadManifest,
};
await writeFile(join(packageRoot, 'VERSION.json'), JSON.stringify(version, null, 2) + '\n');
await writeFile(join(destination, 'candidate-inputs.json'), JSON.stringify({ baseline, packagingSourceCommit, inputManifest, runtimeDependencies: [...visited].sort(), payloadManifestIdentity: manifestIdentity }, null, 2) + '\n');
log(JSON.stringify({ status: 'PASS', packageRoot, packagingSourceCommit, gameBaselineCommit: baseline, files: payloadManifest.length + 1, payloadBytes: (await Promise.all((await files(packageRoot)).map(path => stat(path)))).reduce((sum, item) => sum + item.size, 0), payloadManifestIdentity: manifestIdentity }));
