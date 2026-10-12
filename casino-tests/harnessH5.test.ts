import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { performance } from 'node:perf_hooks';
import { basename, dirname, join, resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { compareH5Source, compareM15Source, compareM15ValidatorSource, parseGitSourceAttributes, readGitSourceAttributes, readGitBlob, readGitBlobs, verifyH5Preservation, verifyM15OutputPreservation, verifyM15ValidatorPreservation, verifyWorkingSource } from '../scripts/check-h5-preservation.mjs';

const digest = (bytes: Buffer | string) => createHash('sha256').update(bytes).digest('hex');
const fixture = "import { expect, test } from '@playwright/test';\n" +
  "test('[ORIGINAL] two scenarios', async ({ page }) => {\n" +
  "  expect(1).toBe(1);\n" +
  "  const scenario = 'second';\n" +
  "  expect(scenario).toBe('second');\n" +
  "  await page.screenshot({ path: 'original.png' });\n" +
  "});\n";

describe('H5-ID canonical source identity', () => {
  let root = '';
  const file = 'tests/ canonical 中文.spec.ts';
  let identity: { oid: string; sha256: string };
  const git = (args: string[], input?: Buffer) => execFileSync('git', args,
    { cwd: root, input, windowsHide: true, encoding: 'utf8' }).replace(/\r?\n$/, '');
  const check = (bytes: string | Buffer) => {
    writeFileSync(join(root, file), bytes);
    return verifyWorkingSource(root, file, identity);
  };
  beforeAll(() => {
    root = mkdtempSync(join(tmpdir(), 'casino-h5-identity-'));
    mkdirSync(join(root, 'tests'));
    git(['init', '--quiet']);
    git(['config', 'core.autocrlf', 'false']);
    writeFileSync(join(root, '.gitattributes'), '*.ts text eol=crlf\n');
    // The independent fixture's LF bytes establish the historical object.
    // Do not derive expected bytes with the canonicalization code under test.
    const bytes = Buffer.from(fixture, 'utf8');
    identity = { oid: git(['hash-object', '-w', '--stdin'], bytes), sha256: digest(bytes) };
  });
  afterAll(() => {
    if (root) {
      expect(dirname(realpathSync(root))).toBe(realpathSync(tmpdir()));
      expect(basename(root)).toMatch(/^casino-h5-identity-/);
      rmSync(root, { recursive: true });
    }
  });
  it('[H5-ID-A] LF source matches exact accepted blob bytes and SHA256', () => {
    expect(readGitBlob(root, identity).bytes).toEqual(Buffer.from(fixture, 'utf8'));
    expect(check(fixture)).toMatchObject(identity);
  });
  it('[H5-ID-B] Git attributes permit CRLF checkout with the same canonical identity', () => {
    expect(git(['check-attr', 'text', 'eol', '--', file])).toContain('eol: crlf');
    const crlf = fixture.replaceAll('\n', '\r\n');
    expect(digest(crlf)).not.toBe(identity.sha256);
    expect(check(crlf)).toMatchObject(identity);
  });
  it('[H5-BATCH-A] multiple immutable blobs retain independent bytes; no verification survives a later working mutation', () => {
    const other = Buffer.from(fixture.replace('[ORIGINAL]', '[SECOND]'), 'utf8');
    const second = { oid: git(['hash-object', '-w', '--stdin'], other), sha256: digest(other) };
    expect(readGitBlobs(root, [identity, second, identity]).map(source => source.bytes))
      .toEqual([Buffer.from(fixture, 'utf8'), other, Buffer.from(fixture, 'utf8')]);
    expect(check(fixture)).toMatchObject(identity);
    expect(() => check(fixture.replace('expect(1).toBe(1)', 'expect(1).toBe(2)'))).toThrow();
    expect(check(fixture.replaceAll('\n', '\r\n'))).toMatchObject(identity);
  });
  it('[H5-BATCH-B] a later missing, wrong-type, corrupt or wrong-hash blob fails the entire batch closed', () => {
    const treeBytes = Buffer.alloc(0);
    const tree = { oid: git(['hash-object', '-t', 'tree', '-w', '--stdin'], treeBytes), sha256: digest(treeBytes) };
    const corrupt = [Buffer.from([0xc3, 0x28]), Buffer.from(fixture + '\0')].map(bytes =>
      ({ oid: git(['hash-object', '-w', '--stdin'], bytes), sha256: digest(bytes) }));
    for (const bad of [{ oid: '0'.repeat(40), sha256: identity.sha256 }, tree, ...corrupt,
      { ...identity, sha256: '0'.repeat(64) }, { ...identity, sha256: 'invalid' }])
      expect(() => readGitBlobs(root, [identity, bad])).toThrow();
    expect(readGitBlobs(root, [identity])[0]!.bytes).toEqual(Buffer.from(fixture, 'utf8'));
  });
  it('[H5-ATTR-A] native NUL batch equals single-path results and reads working attributes rather than cached index attributes', () => {
    const attributes = join(root, '.gitattributes'), previous = readFileSync(attributes);
    const other = 'tests/other.spec.ts', files = [file, other];
    try {
      git(['add', '--', '.gitattributes']);
      writeFileSync(attributes, '*.ts text eol=crlf\n/tests/other.spec.ts filter=example working-tree-encoding=UTF-8\n');
      const single = Buffer.concat(files.map(path => Buffer.from(execFileSync('git',
        ['check-attr', '-z', 'filter', 'working-tree-encoding', '--', path], { cwd: root, windowsHide: true }))));
      const native = execFileSync('git', ['check-attr', '-z', '--stdin', 'filter', 'working-tree-encoding'],
        { cwd: root, windowsHide: true, input: Buffer.from(files.join('\0') + '\0') });
      expect(native).toEqual(single);
      const values = readGitSourceAttributes(root, files);
      expect([...values.get(file)!]).toEqual([['filter', 'unspecified'], ['working-tree-encoding', 'unspecified']]);
      expect([...values.get(other)!]).toEqual([['filter', 'example'], ['working-tree-encoding', 'UTF-8']]);
      expect(git(['check-attr', '--cached', 'filter', '--', other])).toContain('unspecified');
      writeFileSync(join(root, other), fixture);
      expect(() => verifyWorkingSource(root, other, identity)).toThrow(/content filters\/encodings/);
      writeFileSync(attributes, '*.ts text eol=crlf -filter -working-tree-encoding\n');
      expect([...readGitSourceAttributes(root, files).get(other)!]).toEqual([['filter', 'unset'], ['working-tree-encoding', 'unset']]);
      expect(verifyWorkingSource(root, other, identity)).toMatchObject(identity);
    } finally { writeFileSync(attributes, previous); }
  });
  it('[H5-ATTR-B] exact mapping accepts complete reordered tuples and rejects malformed/missing/duplicate results', () => {
    const tuple = (path: string, attr: string, value: string) => [path, attr, value].join('\0') + '\0';
    const valid = tuple(file, 'filter', 'unspecified') + tuple(file, 'working-tree-encoding', 'unset');
    const reordered = tuple(file, 'working-tree-encoding', 'unset') + tuple(file, 'filter', 'unspecified');
    expect(parseGitSourceAttributes([file], Buffer.from(reordered)).get(file)!.get('filter')).toBe('unspecified');
    for (const bad of [Buffer.from(valid.slice(0, -1)), Buffer.from(valid + 'extra\0'),
      Buffer.from(tuple(file, 'filter', 'unspecified')), Buffer.from(tuple(file, 'filter', 'unspecified').repeat(2)),
      Buffer.from(tuple(file, 'filter', 'unspecified') + tuple(file, 'filter', 'unset')),
      Buffer.from(valid.replace('working-tree-encoding', 'unknown')), Buffer.from(valid.replace(file, 'tests/unknown.ts')),
      Buffer.from(valid.replace('unspecified', '')), Buffer.concat([Buffer.from([0xc3, 0x28]), Buffer.from(valid)])])
      expect(() => parseGitSourceAttributes([file], bad)).toThrow();
    expect(() => readGitSourceAttributes(root, [file, file])).toThrow(/Unique/);
    expect(() => readGitSourceAttributes(root, ['tests/nul\0path.ts'])).toThrow(/NUL/);
  });
  it('[H5-ATTR-C] linked worktree retains LF/CRLF identity, fresh attributes and native Git failure propagation', () => {
    writeFileSync(join(root, file), fixture);
    git(['add', '--', '.gitattributes', file]);
    git(['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-q', '-m', 'Attribute fixture']);
    const linked = join(root, 'linked');
    git(['worktree', 'add', '-q', '--detach', linked, 'HEAD']);
    expect(readFileSync(join(linked, '.git'), 'utf8')).toMatch(/^gitdir: /);
    expect(verifyWorkingSource(linked, file, identity)).toMatchObject(identity);
    writeFileSync(join(linked, file), fixture.replaceAll('\n', '\r\n'));
    expect(verifyWorkingSource(linked, file, identity)).toMatchObject(identity);
    writeFileSync(join(linked, '.gitattributes'), '*.ts text eol=crlf filter=example\n');
    expect(() => verifyWorkingSource(linked, file, identity)).toThrow(/content filters\/encodings/);
    const gitFile = join(linked, '.git'), previous = readFileSync(gitFile);
    const metadata = execFileSync('git', ['rev-parse', '--git-dir'],
      { cwd: linked, encoding: 'utf8', windowsHide: true }).replace(/\r?\n$/, '');
    const pointer = previous.toString('utf8').replace(/^gitdir: /, '').replace(/\r?\n$/, '');
    expect(realpathSync(resolve(linked, metadata))).toBe(realpathSync(resolve(linked, pointer)));
    // Invalid metadata is independently owned; never rewrite Git's valid gitfile.
    for (const [index, contents] of ['gitdir: missing-native-git-directory\n', 'not a valid gitfile\n'].entries()) {
      const invalid = join(root, `invalid-gitfile-${index}`);
      mkdirSync(invalid);
      writeFileSync(join(invalid, '.git'), contents, { flag: 'wx' });
      expect(readFileSync(join(invalid, '.git'), 'utf8')).toBe(contents);
      let failure: { status?: number } | undefined;
      try { readGitSourceAttributes(invalid, [file]); } catch (error) { failure = error as typeof failure; }
      expect(failure?.status).toBe(128);
    }
    expect(readFileSync(gitFile)).toEqual(previous);
  });
  it('[H5-ATTR-D] the versioned current guard identity rejects an unrelated assertion removal', () => {
    const guardFile = 'scripts/check-h5-preservation.mjs';
    const manifest = JSON.parse(readFileSync('docs/HARNESS_H5_PUBLICATION/classification-v1.json', 'utf8')) as {
      sourceIdentities: { file: string; oid: string; sha256: string }[];
    };
    const approved = manifest.sourceIdentities.find(entry => entry.file === guardFile)!;
    const bytes = readFileSync(guardFile), current = bytes.toString('utf8');
    const attributes = join(root, '.gitattributes'), previous = readFileSync(attributes);
    try {
      writeFileSync(attributes, Buffer.concat([previous, Buffer.from('*.mjs text eol=crlf\n')]));
      mkdirSync(join(root, 'scripts'), { recursive: true });
      writeFileSync(join(root, guardFile), bytes);
      expect(verifyWorkingSource(root, guardFile, approved)).toMatchObject({ oid: approved.oid, sha256: approved.sha256 });
      const removed = "assert(attributes, 'Working source belongs to this invocation attribute snapshot');";
      expect(current.split(removed)).toHaveLength(2);
      const changed = current.replace(removed, 'void attributes;');
      writeFileSync(join(root, guardFile), changed);
      expect(() => verifyWorkingSource(root, guardFile, approved)).toThrow(/working canonical Git blob/);
    } finally { writeFileSync(attributes, previous); }
  });
  it('[H5-ID-C] changed assertion is rejected', () => {
    expect(() => check(fixture.replace('expect(1).toBe(1)', 'expect(1).toBe(2)'))).toThrow();
  });
  it('[H5-ID-D] changed registration is rejected', () => {
    expect(() => check(fixture.replace('[ORIGINAL]', '[UNAPPROVED]'))).toThrow();
  });
  it('[H5-ID-E] removed scenario is rejected', () => {
    expect(() => check(fixture.replace("  const scenario = 'second';\n  expect(scenario).toBe('second');\n", ''))).toThrow();
  });
  it.each([
    ['import', fixture.replace("'@playwright/test'", "'vitest'")],
    ['whitespace', fixture.replace('expect(1)', 'expect(1) ')],
    ['screenshot', fixture.replace("  await page.screenshot({ path: 'original.png' });\n", '')],
  ])('[H5-ID-F-%s] unauthorized source change is rejected', (_kind, changed) => {
    expect(changed).not.toBe(fixture);
    expect(() => check(changed)).toThrow();
  });
  it('[H5-ID-G] wrong accepted blob is rejected', () => {
    const other = Buffer.from(fixture.replace('[ORIGINAL]', '[OTHER]'), 'utf8');
    const oid = git(['hash-object', '-w', '--stdin'], other);
    expect(() => readGitBlob(root, { oid, sha256: identity.sha256 })).toThrow();
    writeFileSync(join(root, file), fixture);
    expect(() => verifyWorkingSource(root, file, { oid, sha256: digest(other) })).toThrow();
  });
  it('[H5-ID-H] missing Git blob fails closed', () => {
    expect(() => readGitBlob(root, { oid: '0'.repeat(40), sha256: identity.sha256 })).toThrow();
  });
  it.each([
    ['malformed UTF-8', Buffer.from([0xc3, 0x28])],
    ['NUL', Buffer.from(fixture + '\0', 'utf8')],
  ])('[H5-ID-I-%s] corrupted checkout source fails closed', (_kind, bytes) => {
    expect(() => check(bytes)).toThrow();
  });
  it('[H5-ID-I-blob] malformed UTF-8 historical blob fails closed', () => {
    const bytes = Buffer.from([0xc3, 0x28]);
    const oid = git(['hash-object', '-w', '--stdin'], bytes);
    expect(() => readGitBlob(root, { oid, sha256: digest(bytes) })).toThrow();
  });
});

type Mapping = {
  entries: { file: string; id: string; originalBlob: string; historicalGitSha256: string;
    approvedBlob: string; approvedSourceSha256: string }[];
};
const mapping = () => JSON.parse(readFileSync('docs/HARNESS_H5_MAPPING.json', 'utf8')) as Mapping;

it('[H5-P01] dual source protection retains all 84 checkpoints/53 sites/66 screenshots and non-target source', () => {
  const started = performance.now();
  const result = verifyH5Preservation();
  expect(result).toMatchObject({ status: 'PASS', factories: 5, newCases: 15,
    checkpoints: 84, staticAssertionSites: 53, screenshotOperations: 66,
    missingScenarios: 0, omittedAssertions: 0, omittedScreenshots: 0,
    m15: { status: 'PASS', files: 3, nativeCases: 30 },
    h6: { status: 'PASS', originalAssertions: 10, originalBlob: '8d23a01eedc9c10a863b534cbc313dcc9e6326bf',
      approvedSha256: 'db319051336b59dba1e55b0f518a024b482f64415caa511ef8a8ca9214f2aa3e' } });
  // One bounded in-test observation, including all preservation/matcher work.
  // Root resolution precedes the invocation counter and is one further call.
  console.log('[H5-P01 timing] ' + JSON.stringify({ durationMs: performance.now() - started,
    gitSubprocesses: result.gitSubprocessesWithinInvocation + 1, rootResolutionCalls: 1, timeoutMs: 5000 }));
});
it('[H5-P02] rejects assertion, screenshot, viewport and source changes even with a refreshed proposed hash', () => {
  for (const entry of mapping().entries) {
    const original = readGitBlob(resolve('.'), { oid: entry.originalBlob, sha256: entry.historicalGitSha256 }).text;
    const current = verifyWorkingSource(resolve('.'), entry.file, { oid: entry.approvedBlob, sha256: entry.approvedSourceSha256 }).text;
    const mutations = [
      current.replace(/expect\(/, 'changedExpectation('),
      current.replace(/screenshot\(/, 'omittedScreenshot('),
      current.replace('width:1280', 'width:1279').replace('width: 1280', 'width: 1279'),
      current.replace('await page.', 'await  page.'),
      current + '\n// unauthorized source extension\n',
    ];
    for (const changed of mutations) {
      expect(changed).not.toBe(current);
      expect(() => compareH5Source(original, changed, { ...entry, approvedSourceSha256: digest(changed) })).toThrow();
    }
    expect(() => compareH5Source(original, current, { ...entry, historicalGitSha256: '0'.repeat(64) })).toThrow();
  }
});
it('[H5-M15-P01] exact separate three-file output exception retains original inventories and source semantics', () => {
  expect(verifyM15OutputPreservation()).toMatchObject({ status: 'PASS', files: 3, nativeCases: 30 });
});
it('[H5-M15-P02] rejects assertion, registration, threshold, screenshot, evidence-write and unauthorized changes', () => {
  const contract = JSON.parse(readFileSync('docs/HARNESS_H5_M15_OUTPUT.json', 'utf8')) as {
    entries: { file: string; originalBlob: string; originalSha256: string; approvedBlob: string; approvedSha256: string;
      approvedEdits: { from: string; to: string }[]; originalOutputOperations: { text: string; line: number }[] }[];
  };
  for (const entry of contract.entries) {
    const original = readGitBlob(resolve('.'), { oid: entry.originalBlob, sha256: entry.originalSha256 }).text;
    const current = verifyWorkingSource(resolve('.'), entry.file, { oid: entry.approvedBlob, sha256: entry.approvedSha256 }).text;
    const write = entry.originalOutputOperations.find(operation => operation.text.startsWith('writeFileSync('))!;
    const screenshot = entry.originalOutputOperations.find(operation => operation.text.startsWith('page.screenshot(') ||
      operation.text.startsWith("cdp.send('Page.captureScreenshot'"));
    const mutations = [current.replace(/expect\(/, 'changedExpectation('),
      current.replace('test(', 'changedRegistration('), current.replace(write.text, ''),
      current.replace('import {', 'import  {')];
    if (screenshot) mutations.push(current.replace(screenshot.text, ''));
    if (entry.file.endsWith('m15Performance.spec.ts')) mutations.push(current.replace('thresholdMs:2500', 'thresholdMs:2501'));
    for (const changed of mutations) {
      expect(changed).not.toBe(current);
      expect(() => compareM15Source(original, changed, { ...entry, approvedSha256: digest(changed) })).toThrow();
    }
    expect(() => compareM15Source(original, current, { ...entry, approvedEdits: [] })).toThrow();
  }
});

it('[H5-V-P01] the distinct fourth-file exception preserves both independent validators and output serialization', () => {
  expect(verifyM15ValidatorPreservation()).toMatchObject({ status: 'PASS', files: 1, nativeCases: 2 });
});
it('[H5-V-P02] validator contract rejects registration, assertion, oracle, output and unrelated import changes', () => {
  const entry = (JSON.parse(readFileSync('docs/HARNESS_H5_M15_VALIDATOR_OUTPUT.json', 'utf8')) as {
    entries: { file: string; originalBlob: string; originalSha256: string; approvedBlob: string; approvedSha256: string;
      approvedEdits: { from: string; to: string }[] }[];
  }).entries[0];
  const original = readGitBlob(resolve('.'), { oid: entry.originalBlob, sha256: entry.originalSha256 }).text;
  const current = verifyWorkingSource(resolve('.'), entry.file, { oid: entry.approvedBlob, sha256: entry.approvedSha256 }).text;
  for (const changed of [current.replace('[M15-V01]', '[CHANGED]'), current.replace('[M15-V02]', '[CHANGED]'),
    current.replace('expect(counts)', 'expect(changedCounts)'), current.replace('first===second', 'first!==second'),
    current.replace('shoe.json', 'changed.json'), current.replace('pairs.json', 'changed.json'),
    current.replace('null,2', 'null,4'), current.replace("+'\\n'", "+'\\r\\n'"),
    current.replace('writeFileSync(', 'omittedWrite('), current.replace('import {', 'import  {')]) {
    expect(changed).not.toBe(current);
    expect(() => compareM15ValidatorSource(original, changed, { ...entry, approvedSha256: digest(changed) })).toThrow();
  }
  expect(() => compareM15ValidatorSource(original, current, { ...entry, approvedEdits: [] })).toThrow();
  expect(() => compareM15ValidatorSource(original, current, { ...entry, originalSha256: '0'.repeat(64) })).toThrow();
});
