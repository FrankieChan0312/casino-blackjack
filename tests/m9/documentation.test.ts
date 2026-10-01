import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import ts from 'typescript';
import { execFileSync } from 'node:child_process';
import { expect, it } from 'vitest';

const currentDocs = ['README.md', 'docs/STATE.md', 'docs/PLAN.md', 'docs/DEVELOPMENT_LOG.md',
  'docs/UX_UI.md', 'docs/LAB_MANUAL.md', 'docs/PORTFOLIO.md', 'docs/M8_REVIEW_HANDOFF.md', 'docs/SPEC.md', 'docs/DESIGN.md'];

it('[M9-D01] current authoritative headers distinguish accepted M8 from unaccepted M9 and retain real ledgers/settings', () => {
  const priorLog = execFileSync('git', ['-c', `safe.directory=${process.cwd().replaceAll('\\', '/')}`, 'show',
    '3bf59fd83df6988096f4dd70b08603046b4e330e:docs/DEVELOPMENT_LOG.md'], { encoding: 'utf8' }).replaceAll('\r\n', '\n').trimEnd();
  expect(readFileSync('docs/DEVELOPMENT_LOG.md', 'utf8').replaceAll('\r\n', '\n')).toContain(priorLog);
  for (const file of currentDocs) {
    const current = readFileSync(file, 'utf8').split('<!-- END CURRENT M9 -->')[0];
    expect(current, file).toContain('M1-M8 HUMAN ACCEPTED');
    expect(current, file).toContain('M8 HUMAN ACCEPTED at `8f5aca327f41f1078fc4fef20b611fd9cd494492`');
    expect(current, file).toContain('MEDIUM-05 CLOSED');
    expect(current, file).toContain('`0,2,3,2,2,1,2,6,4`');
    expect(current, file).toContain('`0,2,1,1,3,0,2,1,5`');
    expect(current, file).toContain('M9 NOT ACCEPTED');
    expect(current, file).toContain('Fresh-session review NOT RUN');
    expect(current, file).toContain('actual model/effort NOT VERIFIED / NOT VERIFIED');
    expect(current, file).not.toMatch(/M8 NOT ACCEPTED|MEDIUM-05 OPEN/);
  }
});

it('[M9-D02] all fifteen ACs have evidence links and executed screenshot artifacts with accurate review gates', () => {
  const mapping = readFileSync('docs/M9_MAPPING.md', 'utf8');
  const ids = [...mapping.matchAll(/^\| (AC-M9-\d+) \|/gm)].map(m => m[1]);
  expect(ids).toEqual(Array.from({ length: 15 }, (_, n) => `AC-M9-${String(n + 1).padStart(3, '0')}`));
  for (const file of ['README.md', 'docs/PORTFOLIO.md', 'docs/M9_MAPPING.md', 'docs/M9_REVIEW_HANDOFF.md', 'docs/M9_VISUAL_CHECKLIST.md']) {
    const source = readFileSync(file, 'utf8');
    for (const m of source.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = m[1].split('#')[0]; if (/^https?:/.test(target) || !target) continue;
      expect(existsSync(resolve(dirname(file), target)), `${file}: ${target}`).toBe(true);
    }
  }
  for (const name of ['ready', 'table-1280', 'table-768', 'table-320', 'results', 'tools']) {
    const data = readFileSync(`docs/images/m9-${name}.png`);
    expect([...data.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]); expect(data.length).toBeGreaterThan(1000);
  }
  expect(readFileSync('docs/M9_REVIEW_HANDOFF.md', 'utf8')).toContain('Genuinely fresh independent review NOT RUN');
  expect(readFileSync('docs/M9_VISUAL_CHECKLIST.md', 'utf8')).toContain('Owner evaluation NOT RUN');
});

it('[M9-D03] current inventory includes every literal executable M9 and browser registration without skipped tests', () => {
  let browser = 0; let m9 = 0;
  const browserFiles = readdirSync('tests/browser').filter(f => f.endsWith('.spec.ts'));
  const m9Files = readdirSync('tests/m9').filter(f => /\.test\.tsx?$/.test(f));
  function count(file: string, kind: 'test' | 'it') {
    let count = 0;
    const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
    function visit(node: ts.Node) {
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === kind) {
        expect(ts.isStringLiteral(node.arguments[0]), file).toBe(true); count++;
      }
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
        expect(node.expression.name.text, file).not.toMatch(/^(skip|todo|only|skipIf|runIf)$/);
      }
      ts.forEachChild(node, visit);
    }
    visit(source); return count;
  }
  for (const file of browserFiles) browser += count(`tests/browser/${file}`, 'test');
  for (const file of m9Files) m9 += count(`tests/m9/${file}`, 'it');
  const unitFiles = readdirSync('tests', { recursive: true }).map(String).filter(f => /\.test\.tsx?$/.test(f)).length;
  expect(unitFiles).toBe(68); expect(m9).toBe(22); expect(browser).toBe(55);
  for (const file of [...currentDocs, 'docs/M9_MAPPING.md', 'docs/M9_REVIEW_HANDOFF.md']) {
    const inventory = readFileSync(file, 'utf8').match(/\*\*(\d+) Vitest files \/ (\d+) tests\*\*, \*\*(\d+) Chromium project \/ (\d+) tests\*\*/);
    expect(inventory, file).not.toBeNull(); expect(inventory!.slice(1).map(Number), file).toEqual([unitFiles, 956 + m9, 1, browser]);
  }
});
