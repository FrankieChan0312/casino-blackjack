import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { expect, it } from 'vitest';

it('M7 registrations uniquely and completely map REG-M7-001..064, UX-01..14 and E2E-01..15', () => {
  const files = ['tests/unit/domainBoundary.test.ts', 'tests/unit/browserShell.test.tsx', 'tests/integration/browserController.test.ts',
    'tests/unit/browserTable.test.tsx', 'tests/unit/browserBetting.test.tsx', 'tests/unit/browserActions.test.tsx',
    'tests/unit/browserDecisions.test.tsx', 'tests/browser/accessibility.spec.ts', 'tests/browser/gameplay.spec.ts'];
  const titles: string[] = [];
  for (const file of files) {
    const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
    function visit(node: ts.Node) {
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && ['it', 'test'].includes(node.expression.text)) {
        const title = node.arguments[0];
        expect(ts.isStringLiteral(title), `${file}: literal executable registration`).toBe(true);
        titles.push((title as ts.StringLiteral).text);
      }
      // Mapping evidence may not be hidden in skipped or conditional registrations.
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
        expect(node.expression.name.text, file).not.toMatch(/^(skip|todo|only|skipIf|runIf)$/);
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  expect(titles).toHaveLength(64);
  for (const [prefix, count, digits] of [['REG-M7', 64, 3], ['UX', 14, 2], ['E2E', 15, 2]] as const) {
    const ids = titles.flatMap((title) => [...title.matchAll(new RegExp(`\\[(${prefix}-\\d+)\\]`, 'g'))].map((match) => match[1]));
    expect(ids).toHaveLength(count);
    expect(new Set(ids).size).toBe(count);
    expect(ids.sort()).toEqual(Array.from({ length: count }, (_, n) => `${prefix}-${String(n + 1).padStart(digits, '0')}`));
  }
  const mapping = readFileSync('docs/M7_MAPPING.md', 'utf8');
  for (const title of titles) {
    const id = title.match(/REG-M7-\d+/)![0];
    expect(mapping.split('\n').filter((line) => line.startsWith(`| ${id} |`))).toHaveLength(1);
    expect(mapping).toContain(title.replace(/^(\[[^\]]+\] )+/, ''));
  }
});
