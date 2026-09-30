import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { expect, it } from 'vitest';
it('M8 mapping has exactly 91 unique executable owners REG-M8-001..091',()=>{
  const files=['tests/unit/profileRandom.test.ts','tests/integration/charlie.test.ts','tests/integration/replay.test.ts',
    'tests/integration/audit.test.ts','tests/integration/browserDemo.test.ts','tests/integration/m8Invariants.test.ts',
    'tests/unit/m8Contract.test.ts','tests/unit/m8Harness.test.ts','tests/browser/m8.spec.ts'];
  const owners:{id:string;title:string;file:string}[]=[];
  for(const file of files){
    const source=ts.createSourceFile(file,readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true);
    function visit(node:ts.Node){
      if(ts.isCallExpression(node)&&ts.isIdentifier(node.expression)&&['it','test'].includes(node.expression.text)){
        const title=node.arguments[0];expect(ts.isStringLiteral(title),file).toBe(true);
        const text=(title as ts.StringLiteral).text;const ids=[...text.matchAll(/\[(REG-M8-\d+)\]/g)].map(m=>m[1]);
        expect(ids,file).toHaveLength(1);owners.push({id:ids[0],title:text.replace(/^\[[^\]]+\] /,''),file});
      }
      if(ts.isCallExpression(node)&&ts.isPropertyAccessExpression(node.expression))expect(node.expression.name.text,file).not.toMatch(/^(skip|todo|only|skipIf|runIf)$/);
      ts.forEachChild(node,visit);
    }visit(source);
  }
  expect(owners).toHaveLength(91);expect(new Set(owners.map(o=>o.id)).size).toBe(91);
  expect(owners.map(o=>o.id).sort()).toEqual(Array.from({length:91},(_,i)=>`REG-M8-${String(i+1).padStart(3,'0')}`));
  const mapping=readFileSync('docs/M8_MAPPING.md','utf8');
  for(const o of owners){const rows=mapping.split('\n').filter(line=>line.startsWith(`| ${o.id} |`));expect(rows).toHaveLength(1);
    expect(rows[0]).toContain(o.file);expect(rows[0]).toContain(o.title);}
  expect(mapping.split('\n').filter(l=>/^\| REG-M8-\d+ \|/.test(l))).toHaveLength(91);
});
