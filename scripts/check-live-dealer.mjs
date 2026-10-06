// Current product/active manifests only; historical evidence is never scanned.
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { strictEqual, ok } from 'node:assert';

export function assertLiveDealerReferences(files) {
  const forbidden = /Original illustrated female dealer|person-dealer|temporary-fallback|legacy[-/]dealer|cartoon[-/]dealer/i;
  for (const [path, source] of Object.entries(files)) {
    if (path === 'src/ui/CasinoPerson.tsx') continue; // retained module; caller restrictions below
    ok(!forbidden.test(source), `${path}: retired Dealer depiction referenced`);
    if (source.includes('CasinoPerson')) {
      strictEqual(path, 'src/ui/Table.tsx', `${path}: CasinoPerson is restricted to computer guests`);
      const references = source.split('\n').filter(line => line.includes('CasinoPerson')).map(line => line.trim());
      strictEqual(JSON.stringify(references), JSON.stringify([
        "import { CasinoPerson } from './CasinoPerson.js';",
        "{view.playerMode && !local && <CasinoPerson kind={seat.seatNumber === 3 ? 'gown' : seat.seatNumber === 6 ? 'tux' : 'suit'} />}",
      ]), 'CasinoPerson caller must retain only its three explicit computer-guest variants');
    }
  }
}
function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = `${directory}/${entry.name}`;
    return entry.isDirectory() ? sourceFiles(path) : /\.(ts|tsx|css)$/.test(path) ? [path] : [];
  });
}
export function checkLiveDealer() {
  const paths = [...sourceFiles('src'), 'art/source/dealers/MANIFEST.json',
    'art/source/dealers/generic_female/MANIFEST.json', 'art/character-production.json'];
  const files = Object.fromEntries(paths.map(path => [path, readFileSync(path, 'utf8')]));
  assertLiveDealerReferences(files);
  const retiredModuleSha256 = createHash('sha256').update(readFileSync('src/ui/CasinoPerson.tsx')).digest('hex');
  return { status: 'PASS', scope: 'current src and active asset manifests; excludes historical records',
    scannedFiles: paths.length, liveLegacyDealerCallers: 0, genericFallback: 'non-roster formal PNG',
    retainedModule: 'src/ui/CasinoPerson.tsx', retiredModuleSha256,
    retainedLiveUse: 'three computer-guest variants only; no dealer caller' };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.stdout.write(JSON.stringify(checkLiveDealer(), null, 2) + '\n');
}
