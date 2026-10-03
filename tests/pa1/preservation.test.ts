import { expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const baseline = 'e8e8e2e1586611473f0cdb94540ce995d9bd64e7';
function git(...args: string[]) {
  return execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,...args],{encoding:'utf8'}).replaceAll('\r\n','\n').trimEnd();
}
it('[PA1-P01] every pre-PA1 test assertion is unchanged except explicit historical inputs and two amended portrait queries', () => {
  const files = git('ls-tree','-r','--name-only',baseline,'tests').split('\n').filter(file => /\.(test\.tsx?|spec\.ts)$/.test(file));
  expect(files.filter(file => /\.test\.tsx?$/.test(file))).toHaveLength(73);
  // One Git batch retains every exact blob comparison without per-file processes.
  const blobs = execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,'cat-file','--batch'],
    { input: files.map(file => `${baseline}:${file}\n`).join('') });
  let offset = 0;
  for (const file of files) {
    const newline = blobs.indexOf(10,offset), header = blobs.subarray(offset,newline).toString('ascii');
    expect(header,file).toMatch(/^[a-f0-9]{40} blob \d+$/);
    const size = Number(header.split(' ')[2]);
    const historical = blobs.subarray(newline + 1,newline + 1 + size).toString('utf8').replaceAll('\r\n','\n').trimEnd();
    offset = newline + 1 + size + 1;
    let current = readFileSync(file,'utf8').replaceAll('\r\n','\n').trimEnd();
    if (file === 'tests/ra1/inventory.test.ts') current = current
      .replace("import { existsSync } from 'node:fs';","import { readFileSync, readdirSync, existsSync } from 'node:fs';")
      .replace(/\/\/ BEGIN PA1 historical RA1 input adapter[\s\S]*?\/\/ END PA1 historical RA1 input adapter\n/,'')
      .replace("baseline,ra1Sha,'--','src'","baseline,'--','src'");
    if (file === 'tests/unit/m8Contract.test.ts') current = current
      .replace('    // PA1 owns its new scenarios; this remains the accepted M8 inventory.\n','')
      .replace("    if (file === 'pa1.spec.ts') continue;\n",'')
      .replace(" && !/^pa1[\\\\/]/.test(file)",'');
    if (file === 'tests/unit/m8Contract.test.ts') current = current
      .replace('    // M10 owns new geometry scenarios; retain the historical M8 inventory.\n','')
      .replace("    if (file === 'm10.spec.ts') continue;\n",'')
      .replace(" && !/^m10[\\\\/]/.test(file)",'');
    if (file === 'tests/browser/m9.spec.ts') current = current.replaceAll("{ name: /^Computer guest: / }","{ name: 'Original illustrated computer guest in evening attire', exact: true }");
    expect(current,file).toBe(historical);
  }
  expect(offset).toBe(blobs.length);
});
it('[PA1-P02] domain rules RNG replay digests and computer policy remain exact baseline bytes; presentation has no gameplay dependency', () => {
  expect(git('diff','--name-only',baseline,'--','src/domain')).toBe('');
  for (const file of readdirSync('src/presentation').filter(file => /\.ts$/.test(file))) {
    const source = readFileSync(`src/presentation/${file}`,'utf8');
    expect(source).not.toMatch(/from ['"].*(domain|browser)|Math\.random\s*\(|RandomSource|dispatch\s*\(/);
  }
});
