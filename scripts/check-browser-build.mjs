import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { log } from 'node:console';

const files = readdirSync('dist', { recursive: true }).filter((file) => /\.(js|html|map)$/.test(file));
assert(files.length > 0, 'Production browser output must exist');
for (const file of files) {
  const source = readFileSync(join('dist', file), 'utf8');
  for (const marker of ['e2e-only-controlled-shoe', 'Unknown controlled fixture', 'fixtureRandom', 'createFixtureController']) {
    assert(!source.includes(marker), `${file}: test factory must be excluded from production`);
  }
  assert(!source.includes('get("fixture")'), `${file}: no production fixture query`);
}
log(`PASS: production fixture boundary (${files.length} browser output files)`);
