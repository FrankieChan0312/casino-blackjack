// Read-only final PA1 asset receipt checks. Production regeneration stays pinned/offline.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { deepStrictEqual } from 'node:assert';
import process from 'node:process';

for (const [directory, receipt] of [
  ['art/source/characters/PA1_character_sources','docs/PA1_SOURCE_AUDIT.json'],
  ['public/characters','art/character-production-audit.json'],
]) {
  const actual = JSON.parse(execFileSync(process.execPath,['scripts/audit-character-sources.mjs',directory],
    {encoding:'utf8',maxBuffer:4 * 1024 * 1024}));
  deepStrictEqual(actual,JSON.parse(readFileSync(receipt,'utf8')));
  process.stdout.write(`PASS: complete twelve-file PNG receipt / original hashes: ${directory}\n`);
}
execFileSync(process.execPath,['scripts/build-character-assets.mjs','--check'],{stdio:'inherit'});
