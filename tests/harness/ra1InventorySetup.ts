import { afterEach, beforeEach, vi } from 'vitest';

// Keep the frozen RA1 test source intact. Only its inventory invocation can
// reuse real, immutable Git outputs; every other subprocess is delegated.
const invocation = vi.hoisted(() => ({ reset: () => {}, report: (): unknown => undefined }));
vi.mock(import('node:child_process'), async importOriginal => {
  const actual = await importOriginal();
  const { expect } = await import('vitest');
  const { createHash } = await import('node:crypto');
  const sha = 'e8e8e2e1586611473f0cdb94540ce995d9bd64e7';
  const title = 'RA1 has exactly thirty unique executable RSA owners and truthful current suite/status headers';
  let cache: Map<string, string> | undefined;
  const requests: string[][] = [], processes: string[][] = [];
  const inputs: { path: string; bytes: number; sha256: string }[] = [];
  invocation.reset = () => { cache = undefined; requests.length = processes.length = inputs.length = 0; };
  invocation.report = () => requests.length ? { requests, processes, inputs } : undefined;
  const key = (args: string[]) => args.join('\0');
  const text = (value: string) => value.replaceAll('\r\n', '\n').trimEnd();
  function prepare(prefix: string[]) {
    const values = new Map<string, string>();
    function tree(directory: string) {
      const args = ['ls-tree', '-r', '--name-only', sha, directory];
      processes.push(args);
      const output = actual.execFileSync('git', [...prefix, ...args], { encoding: 'utf8' });
      values.set(key(args), output);
      return text(output).split('\n');
    }
    const rsa = tree('tests').filter(file => /^tests\/ra1\/.*\.test\.tsx?$/.test(file));
    const browser = tree('tests/browser').filter(file => file.endsWith('.spec.ts') && !file.slice('tests/browser/'.length).includes('/'));
    const docs = ['README.md', ...['STATE', 'PLAN', 'DEVELOPMENT_LOG', 'UX_UI', 'LAB_MANUAL', 'PORTFOLIO', 'SPEC', 'DESIGN', 'RA1_EVIDENCE', 'RA1_REVIEW_HANDOFF', 'RA1_MAPPING'].map(name => `docs/${name}.md`)];
    const paths = [...rsa, ...browser, ...docs];
    if (paths.length !== 24) throw new Error('RA1 protected input inventory changed');
    processes.push(['cat-file', '--batch']);
    const batch = actual.execFileSync('git', [...prefix, 'cat-file', '--batch'], {
      input: paths.map(path => `${sha}:${path}\n`).join(''), maxBuffer: 16 * 1024 * 1024,
    });
    let offset = 0;
    for (const path of paths) {
      const end = batch.indexOf(10, offset);
      const header = batch.subarray(offset, end).toString('utf8').match(/^[0-9a-f]{40} blob (\d+)$/);
      if (end < offset || !header) throw new Error(`Invalid Git blob header: ${path}`);
      const size = Number(header[1]), start = end + 1;
      if (start + size >= batch.length || batch[start + size] !== 10) throw new Error(`Invalid Git blob size: ${path}`);
      const bytes = batch.subarray(start, start + size);
      values.set(key(['show', `${sha}:${path}`]), bytes.toString('utf8'));
      inputs.push({ path, bytes: size, sha256: createHash('sha256').update(bytes).digest('hex') });
      offset = start + size + 1;
    }
    if (offset !== batch.length) throw new Error('Unexpected trailing Git batch output');
    return values;
  }
  const execFileSync = ((file: string, args: string[], options: { encoding?: string }) => {
    const state = expect.getState();
    const target = state.testPath?.replaceAll('\\', '/').endsWith('/tests/ra1/inventory.test.ts') && state.currentTestName === title;
    const safe = `safe.directory=${process.cwd().replaceAll('\\', '/')}`;
    if (target && file === 'git' && args?.[0] === '-c' && args[1] === safe && options?.encoding === 'utf8' && Object.keys(options).length === 1) {
      const command = args.slice(2);
      const tree = command.length === 5 && command[0] === 'ls-tree' && command[1] === '-r' && command[2] === '--name-only' && command[3] === sha && ['tests', 'tests/browser'].includes(command[4]);
      const show = command.length === 2 && command[0] === 'show' && command[1].startsWith(`${sha}:`);
      if (tree || show) {
        cache ??= prepare(args.slice(0, 2));
        const output = cache.get(key(command));
        if (output !== undefined) { requests.push(command); return output; }
      }
    }
    return Reflect.apply(actual.execFileSync, actual, [file, args, options]);
  }) as typeof actual.execFileSync;
  return { ...actual, execFileSync };
});
beforeEach(() => invocation.reset());
afterEach(() => {
  const receipt = invocation.report();
  if (receipt) console.info('RA1 immutable Git batch receipt: ' + JSON.stringify(receipt));
  invocation.reset();
});
