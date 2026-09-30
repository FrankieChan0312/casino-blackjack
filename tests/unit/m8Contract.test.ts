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

it('[REG-M8-096] eight current documents distinguish completed reviews closed findings and pending batch2 closure', () => {
  const files = ['docs/LAB_MANUAL.md', 'docs/STATE.md', 'docs/PLAN.md', 'docs/DEVELOPMENT_LOG.md',
    'docs/UX_UI.md', 'README.md', 'docs/PORTFOLIO.md', 'docs/M8_REVIEW_HANDOFF.md'];
  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    const status = source.match(/## Current M8 review status\r?\n([\s\S]*?M8 NOT ACCEPTED\. Deployment NOT RUN\.)/)?.[1];
    expect(status, file).toBeDefined();
    expect(status, file).toContain('Original fresh review: COMPLETED at eb85032604b03031b5b934818fda773ea9aae666');
    expect(status, file).toContain('Repair batch 1: COMPLETED at 5218bb9594580090cf39bad219a0b40f268c9781');
    expect(status, file).toContain('Independent recheck #1: COMPLETED at 5218bb9594580090cf39bad219a0b40f268c9781');
    expect(status, file).toContain('(0 BLOCKER / 0 HIGH / 1 MEDIUM / 1 LOW)');
    expect(status, file).toContain('CLOSED BY RECHECK: MEDIUM-01, MEDIUM-02, MEDIUM-03, LOW-01, LOW-02.');
    for (const finding of ['MEDIUM-04', 'LOW-03']) expect(status, file).toMatch(new RegExp(`${finding}: OPEN — repair (?:IMPLEMENTED; verification pending|VERIFIED; independent recheck #2 pending)\\.`));
    expect(status, file).toMatch(/Repair batch 2: (?:IMPLEMENTED;.*pending|VERIFIED;.*)\./);
    expect(status, file).not.toMatch(/(?:fresh review|recheck #1).*NOT RUN|all (?:six )?findings.*OPEN/i);
  }
  // The original defect was outside the later review section: test the entry header itself.
  const labHeader = readFileSync(files[0], 'utf8').split('## 1. Purpose')[0];
  expect(labHeader).toMatch(/Status:.*original M8 fresh review and independent recheck #1 COMPLETED/);
  expect(labHeader).not.toMatch(/M8 fresh review NOT RUN/);
  const uxCurrent = readFileSync('docs/UX_UI.md', 'utf8').split('## 36. Current implementation status')[1];
  expect(uxCurrent).toContain('Independent recheck #1 completed');
  expect(uxCurrent).not.toMatch(/All six findings remain OPEN|M8 independent reviewer RECHECK: PENDING/);
});
