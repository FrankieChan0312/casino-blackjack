import { readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { expect, it } from 'vitest';
import ts from 'typescript';
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

it('[REG-M8-096] current review status and verification inventories agree with executable browser registrations', () => {
  // Authorized M9 historical document boundary: preserve every M8 assertion.
  function readAcceptedM8(file: string, encoding: 'utf8') {
    return execFileSync('git', ['-c', `safe.directory=${process.cwd().replaceAll('\\', '/')}`, 'show', `8f5aca327f41f1078fc4fef20b611fd9cd494492:${file}`], { encoding });
  }
  // End historical document boundary.
  let chromiumTests = 0;
  for (const file of readdirSync('tests/browser').filter(file => file.endsWith('.spec.ts'))) {
    // M8 inventory is the preserved accepted suite; M9 owns its added scenarios.
    if (file === 'm9.spec.ts') continue;
    // RA1 owns its new scenarios; this remains the accepted M8 inventory.
    if (file === 'ra1.spec.ts') continue;
    const source = ts.createSourceFile(file, readFileSync('tests/browser/' + file, 'utf8'), ts.ScriptTarget.Latest, true);
    function visit(node: ts.Node) {
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'test') {
        expect(ts.isStringLiteral(node.arguments[0]), file).toBe(true);
        chromiumTests++;
      }
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
        expect(node.expression.name.text, file).not.toMatch(/^(skip|todo|only|skipIf|runIf)$/);
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  const vitestFiles = readdirSync('tests', { recursive: true }).map(String).filter(file => /\.test\.tsx?$/.test(file) && !/^m9[\\/]/.test(file) && !/^ra1[\\/]/.test(file)).length;
  expect(vitestFiles).toBe(66);
  expect(chromiumTests).toBe(44);
  const expectedInventory = [vitestFiles, 956, 1, chromiumTests];
  function assertInventory(source: string, file: string) {
    const inventory = source.match(/\*\*(\d+) Vitest files\s*\/\s*(\d+) tests\*\*, \*\*(\d+) Chromium project\s*\/\s*(\d+) tests\*\*/);
    expect(inventory, file).not.toBeNull();
    expect(inventory!.slice(1).map(Number), file).toEqual(expectedInventory);
  }
  // These inventory paragraphs originally drifted independently of the shared status header.
  assertInventory(readAcceptedM8('README.md', 'utf8').split('## Verification')[1].split('## Profiles')[0], 'README verification');
  assertInventory(readAcceptedM8('docs/M8_REVIEW_HANDOFF.md', 'utf8').split('## Commands and expected inventory')[1].split('\n## ')[0], 'handoff commands');
  assertInventory(readAcceptedM8('docs/LAB_MANUAL.md', 'utf8').split('## 34.')[1], 'LAB section 34');
  assertInventory(readAcceptedM8('docs/M8_MAPPING.md', 'utf8'), 'mapping inventory');
  const files = ['docs/LAB_MANUAL.md', 'docs/STATE.md', 'docs/PLAN.md', 'docs/DEVELOPMENT_LOG.md',
    'docs/UX_UI.md', 'README.md', 'docs/PORTFOLIO.md', 'docs/M8_REVIEW_HANDOFF.md'];
  for (const file of files) {
    const source = readAcceptedM8(file, 'utf8');
    const status = source.match(/## Current M8 review status\r?\n([\s\S]*?M8 NOT ACCEPTED\. Deployment NOT RUN\.)/)?.[1];
    expect(status, file).toBeDefined();
    expect(status, file).toContain('Original fresh review: COMPLETED at eb85032604b03031b5b934818fda773ea9aae666');
    expect(status, file).toContain('Repair batch 1: COMPLETED at 5218bb9594580090cf39bad219a0b40f268c9781');
    expect(status, file).toContain('Independent recheck #1: COMPLETED at 5218bb9594580090cf39bad219a0b40f268c9781');
    expect(status, file).toContain('Reconstructed independent review: COMPLETED at 07dbcea77561c9a8dc30d4e8498f99ec2f8d3b54.');
    expect(status, file).toContain('CLOSED BY INDEPENDENT REVIEW: MEDIUM-01, MEDIUM-02, MEDIUM-03, MEDIUM-04, LOW-01, LOW-02, LOW-03.');
    for (const finding of ['LOW-04', 'LOW-05']) expect(status, file).toContain(finding + ': CLOSED by independent review at 1c639cb6ab35fa7bad80a6db174cda115666279f.');
    expect(status, file).toContain('Independent complete-harness review: COMPLETED at 1c639cb6ab35fa7bad80a6db174cda115666279f (0 BLOCKER / 0 HIGH / 1 MEDIUM / 0 LOW).');
    expect(status, file).toMatch(/MEDIUM-05: OPEN - repair (?:IMPLEMENTED; verification pending|VERIFIED; independent recheck pending)\./);
    expect(status, file).toContain('M1-M7 HUMAN ACCEPTED. M8 IMPLEMENTED / VERIFIED.');
    assertInventory(status!, file);
    expect(status, file).not.toMatch(/(?:fresh review|recheck #1).*NOT RUN|all (?:six )?findings.*OPEN/i);
  }
  // The original defect was outside the later review section: test the entry header itself.
  const labHeader = readAcceptedM8(files[0], 'utf8').split('## 1. Purpose')[0];
  expect(labHeader).toMatch(/Status:.*reconstructed independent review COMPLETED.*LOW-04 and LOW-05 CLOSED.*MEDIUM-05 OPEN/);
  expect(labHeader).not.toMatch(/M8 fresh review NOT RUN/);
  const uxCurrent = readAcceptedM8('docs/UX_UI.md', 'utf8').split('## 36. Current implementation status')[1];
  expect(uxCurrent).toContain('Reconstructed independent review completed');
  expect(uxCurrent).not.toMatch(/All six findings remain OPEN|M8 independent reviewer RECHECK: PENDING/);
});
