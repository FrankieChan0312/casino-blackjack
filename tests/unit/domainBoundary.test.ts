import { readdirSync, readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import ts from 'typescript';
import { expect, it } from 'vitest';

it('[REG-M7-001] current authoritative domain imports only domain modules and contains no rendering files', () => {
  const root = resolve('src/domain');
  const files = readdirSync(root, { recursive: true }).map(String);
  expect(files.filter((file) => /\.(tsx|jsx|html)$/.test(file))).toEqual([]);
  for (const file of files.filter((file) => file.endsWith('.ts'))) {
    const source = ts.createSourceFile(file, readFileSync(resolve(root, file), 'utf8'), ts.ScriptTarget.Latest, true);
    function visit(node: ts.Node) {
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
        expect(ts.isStringLiteral(node.moduleSpecifier)).toBe(true);
        const specifier = (node.moduleSpecifier as ts.StringLiteral).text;
        expect(specifier.startsWith('./'), `${file}: ${specifier}`).toBe(true);
        expect(resolve(root, file, '..', specifier).startsWith(root + sep)).toBe(true);
      }
      if (ts.isCallExpression(node)) {
        expect(node.expression.kind, `${file}: no dynamic dependency escape`).not.toBe(ts.SyntaxKind.ImportKeyword);
        expect(ts.isIdentifier(node.expression) && node.expression.text === 'require').toBe(false);
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
});
