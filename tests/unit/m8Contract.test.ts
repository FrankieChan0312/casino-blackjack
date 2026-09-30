import { readFileSync, readdirSync } from 'node:fs';
import { expect, it } from 'vitest';
import { CLASSIC, CHARLIE } from '../../src/domain/profile.js';
import { REPLAY_VERSION } from '../../src/domain/replay.js';
import { AUDIT_VERSION } from '../../src/domain/audit.js';
import { SEEDED_ALGORITHM } from '../../src/domain/random.js';
it('[REG-M8-074] M8 profile RNG replay audit and UX documentation matches implemented identifiers and safe boundary',()=>{
  const design=readFileSync('docs/DESIGN.md','utf8');expect(design).toContain(CLASSIC);expect(design).toContain(CHARLIE);expect(design).toContain(SEEDED_ALGORITHM);
  expect(REPLAY_VERSION).toBe(1);expect(AUDIT_VERSION).toBe(1);
  const replay=readFileSync('docs/REPLAY.md','utf8');expect(replay).toContain('replayVersion=1');expect(replay).toContain('COMMITTED/VOID');expect(replay).toContain('No state snapshot');
  const audit=readFileSync('docs/AUDIT.md','utf8');expect(audit).toContain('auditVersion=1');expect(audit).toContain('physical card IDs');expect(audit).toContain('not an event-sourced database');
  expect(readFileSync('docs/UX_UI.md','utf8')).toContain('Replay mode');
});
it('[REG-M8-075] runtime source and package have no network persistence auth payment or deployment capability',()=>{
  const files=readdirSync('src',{recursive:true}).map(String).filter(p=>/\.tsx?$/.test(p));
  for(const file of files){const source=readFileSync(`src/${file}`,'utf8');
    expect(source,file).not.toMatch(/\b(fetch|WebSocket|localStorage|sessionStorage|indexedDB)\s*[.(]/);
    expect(source,file).not.toMatch(/from ['"](?:https?:|@aws-sdk|firebase|supabase|stripe)/);
  }
  const pkg=JSON.parse(readFileSync('package.json','utf8')) as {scripts:Record<string,string>;dependencies:Record<string,string>};
  expect(Object.keys(pkg.scripts)).not.toContain('deploy');expect(Object.keys(pkg.dependencies).sort()).toEqual(['react','react-dom']);
});
it('[REG-M8-076] public project text makes no affirmative RTP house-edge certification or production gambling claims',()=>{
  for(const file of ['README.md','docs/REPLAY.md','docs/AUDIT.md']){
    const source=readFileSync(file,'utf8');expect(source,file).not.toMatch(/(?:is|provides|uses|offers) (?:a )?(?:certified RNG|certified fairness|verified RTP|production casino)/i);
    expect(source,file).not.toMatch(/(?:RTP|house edge)\s*[:=]\s*\d/i);
  }
});
