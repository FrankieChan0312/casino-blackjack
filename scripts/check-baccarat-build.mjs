import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { log } from 'node:console';
const files=readdirSync('dist',{recursive:true}).filter(file=>/\.(js|html|map)$/.test(file));
assert(files.length>0,'Production build required');
for(const file of files){const source=readFileSync(join('dist',file),'utf8');
  for(const marker of ['baccarat-e2e-only-controlled-shoe','Unknown controlled Baccarat fixture','createBaccaratFixture','baccaratTestController','baccaratTestUnmount','baccaratFixture'])assert(!source.includes(marker),file+': excluded Baccarat test factory');
}
log('PASS: Baccarat controlled inventory/fixture query/diagnostic excluded from production ('+files.length+' browser files)');
