import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, realpathSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TextDecoder } from 'node:util';
import process from 'node:process';
import console from 'node:console';
import ts from 'typescript';
import { assertH6Source } from './check-h6-preservation.mjs';

const baseline = 'a7152397079f5d9f493687eec9052d707b2ef596';
const accepted = '79533bc22afb8571f8ff53e37cd95eaa6c65e5d8';
const originalInventoryFile = 'docs/HARNESS_H5_ORIGINAL_INVENTORY.json';
const originalInventoryBlob = '0a1579dfc032d4b8a3eb9b6ca0e73dd0bc6db76a';
const originalInventorySha256 = '94fcb446315c3af719939c120c2c20820d69ce205dfd4b0fdc0d59ce1cf26fa5';
// Separate owner-authorized H6 PNG decomposition, never a test-tree exemption.
const h6File = 'tests/m10/dealerCleanup.test.tsx';
const h6OriginalCommit = '245591e7e08164ec2f750f359280f9a3d59325b9';
const h6Original = { oid: '8d23a01eedc9c10a863b534cbc313dcc9e6326bf', sha256: '621781f312b5ecc06654a853fd0e3ba4c228501463531b31e324d99409c5c99e' };
const h6Approved = { oid: 'd8d0e72a4cc172ca66e1a5eb62fe0d550f4f832b', sha256: 'db319051336b59dba1e55b0f518a024b482f64415caa511ef8a8ca9214f2aa3e' };
const h6ContractFile = 'docs/HARNESS_H6_SOURCE_EXCEPTION.json';
const h6ContractIdentity = { oid: '45928d874bb0b4712b8624ba4a1ffb1345e92f60', sha256: '80539af8c48ebe45e27947cd4c01bb7d0fe234e72d80182156b9b27fb12633c0' };
// Owner-authorized Repair7 exception: only explicit H5 manifest selection.
const publicationValidatorFile = 'scripts/verify-evidence-publication.mjs';
const publicationTestFile = 'tests/tools/publicationManifest.test.mjs';
const publicationOriginal = {"oid":"9d65ccd42edc4d3060fa5dacf3ff28177f53da51","sha256":"7069ea541040b8ba48ac47abe8816bb07eca1d2c946ae2a22a65127873e533bf"};
const publicationApproved = {"oid":"c0e20e9218380dc061b22a892944a77b003820ac","sha256":"297e9e9e9adf5ab2234df064d1d3aa2b608ffdc34358adc7d03e0a410cd43d54"};
const publicationTestIdentity = {"oid":"39200335c8c8ae28fa5cd4b409a21d7bb78e25b8","sha256":"4744fe01b3cb55a49bc2d7a8bf641f334a0daf1065ebff06319fbda88dd3775c"};
const publicationOriginalLine = "const manifest = JSON.parse(fs.readFileSync('docs/M15_EVIDENCE/h2/classification.json', 'utf8'));";
const publicationSelection = "const historicalManifestPath = 'docs/M15_EVIDENCE/h2/classification.json';\nconst h5ManifestPath = 'docs/HARNESS_H5_PUBLICATION/classification-v1.json';\nconst args = process.argv.slice(2);\nassert(args.length === 0 ||\n  (args.length === 2 && args[0] === '--manifest' && args[1] === h5ManifestPath),\n'Expected no arguments or --manifest ' + h5ManifestPath);\nconst manifest = JSON.parse(fs.readFileSync(args.length === 0 ? historicalManifestPath : h5ManifestPath, 'utf8'));";
const scope = [
  ['tests/browser/m10/dealerPresentation.spec.ts', 'M10-D-E08'],
  ['tests/browser/m10/formalDealers.spec.ts', 'M10-F-E06'],
  ['tests/browser/m10a/controlIntegration.spec.ts', 'M10A-CB06'],
  ['tests/browser/m10a/t07.spec.ts', 'M10A-T07-B01'],
  ['tests/browser/m10a/t09.spec.ts', 'M10A-T09-B02'],
];
const viewports = [{ width: 1280, height: 900 }, { width: 768, height: 1024 }, { width: 320, height: 720 }];
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const git = (root, args, options = {}) => {
  if (preservationInvocation?.root === root) preservationInvocation.subprocesses++;
  return execFileSync('git', args, { cwd: root, windowsHide: true, maxBuffer: 32 * 1024 * 1024, ...options });
};
const gitLine = (root, ...args) => git(root, args).toString('utf8').replace(/\r?\n$/, '');
// Immutable objects and a single current attribute snapshot are invocation-local.
// Working bytes are always read/hash-checked afresh. Every later invocation
// acquires attributes again; failed checks discard all state through finally.
let preservationInvocation;
function withinPreservation(root, check) {
  root = repositoryRoot(root);
  if (preservationInvocation?.root === root) return check(root);
  const previous = preservationInvocation;
  preservationInvocation = { root, blobs: new Map(), objects: new Map(), subprocesses: 0 };
  try { return check(root); } finally { preservationInvocation = previous; }
}

function sourceText(bytes) {
  assert(Buffer.isBuffer(bytes), 'Source identity requires bytes');
  const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
  assert(!text.includes('\0'), 'TypeScript source must not contain NUL bytes');
  return text;
}
function repositoryRoot(root) {
  const requested = realpathSync(resolve(root));
  if (preservationInvocation?.root === requested) return requested;
  const actual = realpathSync(gitLine(requested, 'rev-parse', '--show-toplevel'));
  const same = process.platform === 'win32' ? requested.toLowerCase() === actual.toLowerCase() : requested === actual;
  assert(same, 'Git canonicalization must use the repository root');
  return requested;
}
function sourcePath(file) {
  assert(typeof file === 'string' && !isAbsolute(file) && !file.includes('\\') &&
    file.split('/').every(part => part !== '' && part !== '.' && part !== '..'), 'Repository-relative source path');
}
function blobSources(root, oids) {
  for (const oid of oids) assert.match(oid, /^[0-9a-f]{40}$/, 'Git blob OID');
  const cache = preservationInvocation?.root === root ? preservationInvocation.blobs : new Map();
  const missing = [...new Set(oids)].filter(oid => !cache.has(oid));
  if (missing.length) {
    const output = git(root, ['cat-file', '--batch'], { input: missing.join('\n') + '\n' });
    const sources = [];
    let offset = 0;
    for (const oid of missing) {
      const headerEnd = output.indexOf(10, offset);
      assert(headerEnd >= offset, 'Git batch object header');
      const [actualOid, type, sizeText] = output.subarray(offset, headerEnd).toString('ascii').split(' ');
      assert.equal(actualOid, oid, 'Exact requested object and batch order');
      assert.equal(type, 'blob', 'Source object must be a blob');
      assert.match(sizeText, /^\d+$/, 'Git blob byte size');
      const size = Number(sizeText), end = headerEnd + 1 + size;
      assert(Number.isSafeInteger(size) && end < output.length, 'Complete Git blob bytes');
      assert.equal(output[end], 10, 'Git batch object terminator');
      const bytes = output.subarray(headerEnd + 1, end);
      sources.push({ oid, sha256: sha(bytes), bytes, text: sourceText(bytes) });
      offset = end + 1;
    }
    assert.equal(offset, output.length, 'Exact complete Git batch response');
    for (const source of sources) cache.set(source.oid, source);
  }
  return oids.map(oid => cache.get(oid));
}
function blobSource(root, oid) { return blobSources(root, [oid])[0]; }

function immutableObjects(root, refs) {
  for (const ref of refs) {
    assert.match(ref, /^[0-9a-f]{40}:/, 'Immutable commit/path reference');
    sourcePath(ref.slice(41));
  }
  const cache = preservationInvocation.objects;
  const missing = [...new Set(refs)].filter(ref => !cache.has(ref));
  if (missing.length) {
    const objects = git(root, ['rev-parse', ...missing]).toString('utf8').replace(/\r?\n$/, '').split('\n');
    assert.equal(objects.length, missing.length, 'Complete immutable object resolution');
    for (const oid of objects) assert.match(oid, /^[0-9a-f]{40}$/, 'Resolved Git object');
    for (const [index, ref] of missing.entries()) cache.set(ref, objects[index]);
  }
  return refs.map(ref => cache.get(ref));
}
function immutableObject(root, ref) { return immutableObjects(root, [ref])[0]; }
function primeSources(root, refs, identities) {
  immutableObjects(root, refs);
  readGitBlobs(root, identities);
}

// Only Git's path-aware text policy may reconcile checkout EOL differences.
// Decode before hashing so malformed UTF-8 and binary/NUL sources fail closed.
export function readGitBlob(root, identity) {
  root = repositoryRoot(root);
  assert.match(identity.sha256, /^[0-9a-f]{64}$/, 'Canonical SHA256');
  const source = blobSource(root, identity.oid);
  assert.equal(source.sha256, identity.sha256, 'Accepted canonical Git SHA256');
  return source;
}
export function readGitBlobs(root, identities) {
  return withinPreservation(root, root => {
    for (const identity of identities) assert.match(identity.sha256, /^[0-9a-f]{64}$/, 'Canonical SHA256');
    const sources = blobSources(root, identities.map(identity => identity.oid));
    for (const [index, source] of sources.entries()) assert.equal(source.sha256, identities[index].sha256, 'Accepted canonical Git SHA256');
    return sources;
  });
}
const sourceAttributes = ['filter', 'working-tree-encoding'];
export function parseGitSourceAttributes(files, output) {
  assert(files.length > 0 && new Set(files).size === files.length, 'Unique requested attribute paths');
  for (const file of files) { sourcePath(file); assert(!file.includes('\0'), 'No NUL in attribute paths'); }
  assert(Buffer.isBuffer(output), 'Git attribute response bytes');
  const fields = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(output).split('\0');
  assert.equal(fields.pop(), '', 'NUL-terminated Git attribute response');
  assert.equal(fields.length, files.length * sourceAttributes.length * 3, 'Complete Git attribute triples');
  const results = new Map(files.map(file => [file, new Map()]));
  for (let index = 0; index < fields.length; index += 3) {
    const [file, attribute, value] = fields.slice(index, index + 3), values = results.get(file);
    assert(values, 'Exact requested Git attribute path');
    assert(sourceAttributes.includes(attribute), 'Exact requested Git attribute name');
    assert(!values.has(attribute), 'No duplicate Git path/attribute result');
    assert(value.length > 0, 'Git attribute value');
    values.set(attribute, value);
  }
  for (const values of results.values())
    assert(sourceAttributes.every(attribute => values.has(attribute)), 'Both source attributes for every path');
  return results;
}
export function readGitSourceAttributes(root, files) {
  root = repositoryRoot(root);
  // Validate paths before passing NUL-delimited stdin to the native query.
  for (const file of files) { sourcePath(file); assert(!file.includes('\0'), 'No NUL in attribute paths'); }
  assert(files.length > 0 && new Set(files).size === files.length, 'Unique requested attribute paths');
  return parseGitSourceAttributes(files, git(root, ['check-attr', '-z', '--stdin', ...sourceAttributes],
    { input: Buffer.from(files.join('\0') + '\0', 'utf8') }));
}
export function canonicalizeGitSource(root, file, bytes) {
  root = repositoryRoot(root);
  sourcePath(file);
  sourceText(bytes);
  const snapshot = preservationInvocation?.root === root ? preservationInvocation.attributes : undefined;
  const attributes = (snapshot ?? readGitSourceAttributes(root, [file])).get(file);
  assert(attributes, 'Working source belongs to this invocation attribute snapshot');
  for (const value of attributes.values())
    assert(['unspecified', 'unset'].includes(value), 'Source identity permits EOL conversion, not content filters/encodings');
  const oid = gitLineWithInput(root, ['hash-object', '-w', `--path=${file}`, '--stdin'], bytes);
  return blobSource(root, oid);
}
function gitLineWithInput(root, args, input) {
  return git(root, args, { input }).toString('utf8').replace(/\r?\n$/, '');
}
export function verifyWorkingSource(root, file, identity) {
  const source = canonicalizeGitSource(root, file, readFileSync(resolve(root, file)));
  assert.equal(source.oid, identity.oid, `${file}: working canonical Git blob`);
  assert.equal(source.sha256, identity.sha256, `${file}: working canonical SHA256`);
  return source;
}
function walk(node, visit) { visit(node); ts.forEachChild(node, child => walk(child, visit)); }
function parse(text, file = 'historical.spec.ts') {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  assert.equal(source.parseDiagnostics.length, 0, 'Valid TypeScript source');
  return source;
}
function target(source, id) {
  const matches = [];
  walk(source, node => {
    if (ts.isCallExpression(node) && node.expression.getText(source) === 'test' &&
        node.arguments[0]?.getText(source).includes(`[${id}`)) matches.push(node);
  });
  assert.equal(matches.length, 1, `${id}: unique registration factory`);
  const call = matches[0], callback = call.arguments[1];
  assert(ts.isArrowFunction(callback) && ts.isBlock(callback.body), `${id}: independent callback`);
  assert.equal(callback.parameters[0].getText(source).replaceAll(' ', ''), '{page}', `${id}: existing page fixture`);
  return { call, callback };
}
function tokens(text) {
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, true, ts.LanguageVariant.Standard, text);
  const result = [];
  while (scanner.scan() !== ts.SyntaxKind.EndOfFileToken) result.push(scanner.getTokenText());
  return result;
}
function viewportLoop(node, source) {
  return ts.isForOfStatement(node) && ts.isVariableDeclarationList(node.initializer) &&
    node.initializer.declarations.length === 1 && node.initializer.declarations[0].name.getText(source) === 'viewport';
}
function viewportValues(loop, source) {
  let expression = loop.expression;
  if (ts.isIdentifier(expression)) {
    const name = expression.text, declarations = [];
    walk(source, node => { if (ts.isVariableDeclaration(node) && node.name.getText(source) === name) declarations.push(node); });
    assert.equal(declarations.length, 1, 'Unique viewport constant');
    expression = declarations[0].initializer;
  }
  assert(expression && ts.isArrayLiteralExpression(expression), 'Explicit viewport array');
  return expression.elements.map(element => {
    assert(ts.isObjectLiteralExpression(element), 'Literal viewport');
    return Object.fromEntries(element.properties.map(property => {
      assert(ts.isPropertyAssignment(property) && ts.isNumericLiteral(property.initializer), 'Literal viewport dimensions');
      return [property.name.getText(source), Number(property.initializer.text)];
    }));
  });
}

// The oracle is the unmodified accepted Git callback. Erase ONLY its viewport
// loop header (and its outer grouping braces), then compare every remaining
// lexical token with the new callback. All fixtures/actions/assertions/helpers,
// screenshots/keyboard/geometry/accounting order must therefore survive.
export function compareH5Source(originalText, currentText, entry) {
  const original = originalText, current = currentText;
  assert.equal(sha(Buffer.from(original, 'utf8')), entry.historicalGitSha256, `${entry.id}: historical SHA256`);
  assert.equal(sha(Buffer.from(current, 'utf8')), entry.approvedSourceSha256, `${entry.id}: approved H5 SHA256`);
  const oldSource = parse(original), newSource = parse(current);
  const old = target(oldSource, entry.id), next = target(newSource, entry.id);
  const loops = [];
  walk(old.callback.body, node => { if (viewportLoop(node, oldSource)) loops.push(node); });
  assert.equal(loops.length, 1, `${entry.id}: one historical viewport loop`);
  const oldLoop = loops[0];
  const wrapper = next.call.parent.parent;
  assert(viewportLoop(wrapper, newSource), `${entry.id}: viewport-scoped registration`);
  assert.equal(wrapper.initializer.flags & ts.NodeFlags.Const, ts.NodeFlags.Const, 'Immutable viewport binding');
  assert.deepEqual(viewportValues(oldLoop, oldSource), viewports, 'Historical viewports');
  assert.deepEqual(viewportValues(wrapper, newSource), viewports, 'New viewports');
  assert(ts.isExpressionStatement(wrapper.statement) && wrapper.statement.expression === next.call, 'No shared mutable test state');
  const oldTitle = old.call.arguments[0];
  assert(ts.isStringLiteral(oldTitle), 'Historical title');
  assert.equal(next.call.arguments[0].getText(newSource), '`' + oldTitle.text.replace(`[${entry.id}]`, `[${entry.id}-${'${viewport.width}'}]`) + '`', 'Traceable unique titles');
  assert.deepEqual(next.callback.parameters.map(p => p.getText(newSource)), old.callback.parameters.map(p => p.getText(oldSource)), 'Unchanged test fixture parameters');
  assert.equal(current.slice(0, wrapper.getStart(newSource)), original.slice(0, old.call.parent.getStart(oldSource)), 'Unchanged non-target prefix');
  assert.equal(current.slice(wrapper.end), original.slice(old.call.parent.end), 'Unchanged non-target suffix');
  const start = old.callback.body.getStart(oldSource), edits = [];
  const removal = (from, to) => {
    const lineStart = original.lastIndexOf('\n', from - 1) + 1;
    const newline = original.indexOf('\n', to), lineEnd = newline < 0 ? original.length : newline;
    // Removing a whole loop-token line must also remove that line's indentation.
    // Never trim other lines, historical source, or callback whitespace.
    if (/^[ \t]*$/.test(original.slice(lineStart, from)) && /^[ \t]*$/.test(original.slice(to, lineEnd))) from = lineStart;
    return [from - start, to - start];
  };
  if (oldLoop.parent === old.callback.body) {
    assert(ts.isBlock(oldLoop.statement), 'Historical viewport group');
    edits.push(removal(oldLoop.getStart(oldSource), oldLoop.statement.getStart(oldSource) + 1));
    edits.push(removal(oldLoop.statement.end - 1, oldLoop.statement.end));
  } else {
    edits.push(removal(oldLoop.getStart(oldSource), oldLoop.statement.getStart(oldSource)));
  }
  let oldBody = old.callback.body.getText(oldSource);
  for (const [from, to] of edits.sort((a, b) => b[0] - a[0])) oldBody = oldBody.slice(0, from) + oldBody.slice(to);
  assert.deepEqual(tokens(next.callback.body.getText(newSource)), tokens(oldBody), `${entry.id}: all original semantic tokens/order`);
  assert.equal(next.callback.body.getText(newSource), oldBody, `${entry.id}: only the approved viewport-loop body delta`);
  return { id: entry.id, newIds: viewports.map(v => `${entry.id}-${v.width}`) };
}

const m15Scope = [
  'tests/browser/baccarat/m15.spec.ts',
  'tests/browser/baccarat/m15Performance.spec.ts',
  'tests/browser/baccarat/m15Zoom.spec.ts',
];
const outputImport = "import { mkdirSync, writeFileSync } from 'node:fs';\n";
const gitDirectoryImport = "import { resolveGitDir } from '../../../scripts/git-directory.mjs';\n";
const pathImport = "import { resolve } from 'node:path';\n";
const m15Edits = [
  [{ from: outputImport, to: outputImport + pathImport + gitDirectoryImport },
    { from: "const evidence='.git/m15/visual';", to: "const evidence=resolve(resolveGitDir(),'m15/visual');" }],
  [{ from: outputImport, to: outputImport + pathImport + gitDirectoryImport },
    { from: "const directory='.git/m15/performance';", to: "const directory=resolve(resolveGitDir(),'m15/performance');" }],
  [{ from: pathImport, to: pathImport + gitDirectoryImport },
    { from: "resolve('.git/overnight')", to: "resolve(resolveGitDir(), 'overnight')" },
    { from: "resolve('.git/m15/visual')", to: "resolve(resolveGitDir(), 'm15/visual')" }],
];

function m15Inventory(text, file) {
  const source = parse(text, file);
  const inventory = { originalRegistrations: [], originalAssertions: [], originalOutputOperations: [],
    originalOutputNames: [], originalOutputNameBindings: [], originalTimeouts: [] };
  const record = node => ({ text: node.getText(source), line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1 });
  walk(source, node => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) &&
        ['file', 'extension', 'profile'].includes(node.name.text) && node.initializer)
      inventory.originalOutputNameBindings.push(record(node));
    if (!ts.isCallExpression(node)) return;
    const expression = node.expression.getText(source);
    if (expression === 'test' || expression === 'it') inventory.originalRegistrations.push(record(node.arguments[0]));
    if (ts.isPropertyAccessExpression(node.expression) && /^expect(?:\(|\.poll\()/.test(expression))
      inventory.originalAssertions.push(record(node));
    if (expression === 'test.setTimeout') inventory.originalTimeouts.push(record(node));
    const output = ['capture', 'writeFileSync', 'mkdirSync', 'mkdtempSync', 'page.screenshot'].includes(expression) ||
      (expression === 'cdp.send' && node.arguments[0]?.getText(source) === "'Page.captureScreenshot'");
    if (output) inventory.originalOutputOperations.push(record(node));
    if (expression === 'capture') inventory.originalOutputNames.push(record(node.arguments[1]));
    if (['writeFileSync', 'mkdtempSync'].includes(expression)) inventory.originalOutputNames.push(record(node.arguments[0]));
    if (expression === 'page.screenshot' && ts.isObjectLiteralExpression(node.arguments[0])) {
      const path = node.arguments[0].properties.find(property => ts.isPropertyAssignment(property) && property.name.getText(source) === 'path');
      if (path && ts.isPropertyAssignment(path)) inventory.originalOutputNames.push(record(path.initializer));
    }
  });
  return inventory;
}

function m15Transformation(original, entry) {
  const index = m15Scope.indexOf(entry.file);
  assert(index >= 0, 'Only the separately authorized three M15 files');
  assert.deepEqual(entry.approvedEdits, m15Edits[index], 'Exact output-root/import delta; manifest cannot expand authorization');
  let transformed = original;
  for (const { from, to } of m15Edits[index]) {
    assert.equal(transformed.split(from).length, 2, 'Unique approved output edit');
    transformed = transformed.replace(from, to);
  }
  return transformed;
}
export function compareM15Source(original, current, entry) {
  assert.equal(sha(Buffer.from(original, 'utf8')), entry.originalSha256, 'Original M15 canonical SHA256');
  assert.equal(sha(Buffer.from(current, 'utf8')), entry.approvedSha256, 'Approved M15 canonical SHA256');
  assert.equal(current, m15Transformation(original, entry), 'Exactly the approved M15 output-root/import changes');
  return { file: entry.file };
}

export function verifyM15OutputPreservation(root = process.cwd()) {
  return withinPreservation(root, verifyM15OutputAtRoot);
}
function verifyM15OutputAtRoot(root) {
  root = repositoryRoot(root);
  const contract = JSON.parse(readFileSync(resolve(root, 'docs/HARNESS_H5_M15_OUTPUT.json'), 'utf8'));
  assert.equal(contract.version, 1);
  assert.equal(contract.baseline, baseline);
  assert.equal(contract.accepted, baseline, 'Separate M15 accepted source baseline');
  assert.deepEqual(contract.entries.map(entry => entry.file), m15Scope, 'Exactly three separately authorized M15 output paths');
  primeSources(root, contract.entries.map(entry => baseline + ':' + entry.file), contract.entries.flatMap(entry => [
    { oid: entry.originalBlob, sha256: entry.originalSha256 }, { oid: entry.approvedBlob, sha256: entry.approvedSha256 },
  ]));
  const expectedCounts = [[10,75,22,17,0,2], [1,8,2,1,1,1], [1,9,10,7,2,0]];
  const results = contract.entries.map((entry, index) => {
    assert.equal(immutableObject(root, `${contract.accepted}:${entry.file}`), entry.originalBlob, 'Original accepted M15 blob');
    const original = readGitBlob(root, { oid: entry.originalBlob, sha256: entry.originalSha256 });
    const transformed = m15Transformation(original.text, entry);
    const expected = canonicalizeGitSource(root, entry.file, Buffer.from(transformed, 'utf8'));
    assert.equal(expected.oid, entry.approvedBlob, 'Approved M15 blob is exactly the path-only transformation');
    assert.equal(expected.sha256, entry.approvedSha256, 'Approved M15 canonical SHA256');
    const current = verifyWorkingSource(root, entry.file, { oid: entry.approvedBlob, sha256: entry.approvedSha256 });
    assert.deepEqual(current.bytes, expected.bytes, 'No M15 assertion/fixture/registration/timeout/output-content change');
    compareM15Source(original.text, current.text, entry);
    const inventory = m15Inventory(original.text, entry.file);
    for (const field of Object.keys(inventory)) assert.deepEqual(entry[field], inventory[field], `Independent original M15 ${field}`);
    assert.deepEqual(Object.values(inventory).map(items => items.length), expectedCounts[index], 'Historical M15 inventory counts');
    assert.equal(entry.nativeRegistrations.length, [25,2,3][index], 'Historical native M15 registrations');
    assert.equal(new Set(entry.nativeRegistrations.map(test => test.originalPlaywrightID)).size, entry.nativeRegistrations.length, 'Unique original M15 registrations');
    return { file: entry.file, originalBlob: original.oid, approvedBlob: current.oid, originalSha256: original.sha256,
      approvedSha256: current.sha256, nativeCases: entry.nativeRegistrations.length, inventoryCounts: expectedCounts[index] };
  });
  return { status: 'PASS', files: 3, nativeCases: 30, results };
}

const validatorFile = 'casino-tests/baccarat/m15Validator.test.ts';
const validatorOriginalBlob = '10dd500af7586644bd859c9dcfa6550b58fd1af5';
const validatorOriginalSha256 = '11db7e9babafdef78ff76cea210dfe6fff7dc8a0c8870108357bad94d69419a9';
const validatorEdits = [
  { from: outputImport, to: outputImport + pathImport + "import { resolveGitDir } from '../../scripts/git-directory.mjs';\n" },
  { from: "const directory='.git/m15/validators';", to: "const directory=resolve(resolveGitDir(),'m15/validators');" },
];
export function compareM15ValidatorSource(original, current, entry) {
  assert.equal(entry.file, validatorFile, 'Exactly the fourth authorized M15 source');
  assert.equal(entry.originalSha256, validatorOriginalSha256, 'Original validator SHA256 remains fixed');
  assert.equal(sha(Buffer.from(original, 'utf8')), validatorOriginalSha256);
  assert.equal(sha(Buffer.from(current, 'utf8')), entry.approvedSha256);
  assert.deepEqual(entry.approvedEdits, validatorEdits, 'Only the exact validator import/root delta');
  let expected = original;
  for (const { from, to } of validatorEdits) {
    assert.equal(expected.split(from).length, 2, 'Unique validator path edit');
    expected = expected.replace(from, to);
  }
  assert.equal(current, expected, 'Both independent validators and JSON writes remain byte-identical outside approved edits');
  return { file: validatorFile };
}
export function verifyM15ValidatorPreservation(root = process.cwd()) {
  return withinPreservation(root, verifyM15ValidatorAtRoot);
}
function verifyM15ValidatorAtRoot(root) {
  root = repositoryRoot(root);
  const contract = JSON.parse(readFileSync(resolve(root, 'docs/HARNESS_H5_M15_VALIDATOR_OUTPUT.json'), 'utf8'));
  assert.equal(contract.version, 1);
  assert.equal(contract.accepted, baseline);
  assert.equal(contract.baseline, baseline);
  assert.equal(contract.entries.length, 1);
  const entry = contract.entries[0];
  assert.equal(entry.file, validatorFile);
  assert.equal(entry.originalBlob, validatorOriginalBlob);
  primeSources(root, [baseline + ':' + validatorFile], [
    { oid: validatorOriginalBlob, sha256: validatorOriginalSha256 }, { oid: entry.approvedBlob, sha256: entry.approvedSha256 },
  ]);
  assert.equal(immutableObject(root, baseline + ':' + validatorFile), validatorOriginalBlob);
  const original = readGitBlob(root, { oid: validatorOriginalBlob, sha256: validatorOriginalSha256 });
  const current = verifyWorkingSource(root, validatorFile, { oid: entry.approvedBlob, sha256: entry.approvedSha256 });
  compareM15ValidatorSource(original.text, current.text, entry);
  const inventory = m15Inventory(original.text, validatorFile);
  for (const field of Object.keys(inventory)) assert.deepEqual(entry[field], inventory[field], `Original validator ${field}`);
  assert.deepEqual(inventory.originalRegistrations.map(item => item.text.match(/\[M15-V0[12]\]/)?.[0]), ['[M15-V01]', '[M15-V02]']);
  assert.deepEqual(inventory.originalOutputNames.map(item => item.text), ['`${directory}/shoe.json`', '`${directory}/pairs.json`']);
  return { status: 'PASS', files: 1, nativeCases: 2, assertions: inventory.originalAssertions.length,
    originalBlob: original.oid, approvedBlob: current.oid, originalSha256: original.sha256, approvedSha256: current.sha256 };
}

function verifyH6SourceAtRoot(root) {
  assert.equal(immutableObject(root, baseline + ':' + h6File), h6Original.oid, 'Original H6 baseline blob');
  assert.equal(immutableObject(root, h6OriginalCommit + ':' + h6File), h6Original.oid, 'Original accepted H6 blob');
  const original = readGitBlob(root, h6Original);
  const current = verifyWorkingSource(root, h6File, h6Approved);
  // Bind every H6 manifest field to the component-verified immutable contract.
  const manifest = verifyWorkingSource(root, h6ContractFile, h6ContractIdentity);
  const contract = JSON.parse(manifest.text);
  assert.equal(contract.originalBlob, h6Original.oid);
  assert.equal(contract.approvedBlob, h6Approved.oid);
  assert.equal(contract.assertions.length, 10);
  assert.equal(contract.deadlinePerTestMs, 5000);
  assert.equal(contract.combinedDeadlinePreserved, false);
  return { status: 'PASS', originalAssertions: 10, ...assertH6Source(current.text, original.text) };
}

export function comparePublicationValidatorSource(original, current) {
  assert.equal(sha(Buffer.from(original)), publicationOriginal.sha256, 'Pinned original publication validator');
  assert.equal(original.split(publicationOriginalLine).length, 2, 'Exactly one original manifest loader');
  assert.equal(current, original.replace(publicationOriginalLine, publicationSelection),
    'Only the exact manifest-selection interface may change; all evidence checks remain');
  assert.equal(sha(Buffer.from(current)), publicationApproved.sha256, 'Pinned approved publication validator');
  return { file: publicationValidatorFile };
}
function verifyPublicationValidatorAtRoot(root) {
  assert.equal(immutableObject(root, baseline + ':' + publicationValidatorFile), publicationOriginal.oid);
  const original = readGitBlob(root, publicationOriginal);
  const current = verifyWorkingSource(root, publicationValidatorFile, publicationApproved);
  comparePublicationValidatorSource(original.text, current.text);
  verifyWorkingSource(root, publicationTestFile, publicationTestIdentity);
  return { status: 'PASS', originalBlob: original.oid, approvedBlob: current.oid,
    originalSha256: original.sha256, approvedSha256: current.sha256 };
}

export function verifyH5Preservation(root = process.cwd()) {
  return withinPreservation(root, verifyH5AtRoot);
}
function verifyH5AtRoot(root) {
  root = repositoryRoot(root);
  const contract = JSON.parse(readFileSync(resolve(root, 'docs/HARNESS_H5_MAPPING.json'), 'utf8'));
  assert.equal(contract.version, 1);
  assert.equal(contract.baseline, baseline);
  assert.equal(contract.accepted, accepted);
  assert.deepEqual(contract.entries.map(e => [e.file, e.id]), scope, 'Exactly five owner-authorized paths/IDs');
  assert.equal(contract.originalInventoryFile, originalInventoryFile, 'Independent prior-inventory path');
  assert.equal(contract.originalInventoryBlob, originalInventoryBlob, 'Original inventory Git object is fixed');
  assert.equal(contract.originalInventorySha256, originalInventorySha256, 'Original inventory SHA256 is fixed');
  // Acquire immutable objects and current attributes inside this invocation.
  // Every source retains its original fresh read and path-aware Git hash.
  const browserContract = JSON.parse(readFileSync(resolve(root, 'docs/HARNESS_H5_M15_OUTPUT.json'), 'utf8'));
  const validatorContract = JSON.parse(readFileSync(resolve(root, 'docs/HARNESS_H5_M15_VALIDATOR_OUTPUT.json'), 'utf8'));
  assert.deepEqual(browserContract.entries.map(entry => entry.file), m15Scope);
  assert.deepEqual(validatorContract.entries.map(entry => entry.file), [validatorFile]);
  const outputEntries = [...browserContract.entries, ...validatorContract.entries];
  preservationInvocation.attributes = readGitSourceAttributes(root, [originalInventoryFile,
    ...contract.entries.map(entry => entry.file), ...outputEntries.map(entry => entry.file),
    h6File, h6ContractFile, publicationValidatorFile, publicationTestFile]);
  primeSources(root, [
    ...contract.entries.flatMap(entry => [accepted + ':' + entry.file, baseline + ':' + entry.file]),
    ...outputEntries.map(entry => baseline + ':' + entry.file),
    baseline + ':' + h6File, h6OriginalCommit + ':' + h6File,
    baseline + ':' + publicationValidatorFile,
  ], [
    { oid: originalInventoryBlob, sha256: originalInventorySha256 },
    h6Original, h6Approved, h6ContractIdentity,
    publicationOriginal, publicationApproved, publicationTestIdentity,
    ...contract.entries.flatMap(entry => [{ oid: entry.originalBlob, sha256: entry.historicalGitSha256 },
      { oid: entry.approvedBlob, sha256: entry.approvedSourceSha256 }]),
    ...outputEntries.flatMap(entry => [{ oid: entry.originalBlob, sha256: entry.originalSha256 },
      { oid: entry.approvedBlob, sha256: entry.approvedSha256 }]),
  ]);
  const inventorySource = verifyWorkingSource(root, originalInventoryFile, { oid: originalInventoryBlob, sha256: originalInventorySha256 });
  const inventoryBlob = readGitBlob(root, { oid: originalInventoryBlob, sha256: originalInventorySha256 });
  assert.deepEqual(inventorySource.bytes, inventoryBlob.bytes, 'Prior original inventory remains retrievable byte-for-byte');
  const inventory = JSON.parse(inventoryBlob.text);
  assert.deepEqual(inventory.tests.map(test => [test.path, test.id]), scope, 'Independent original inventory scope');
  const results = contract.entries.map((entry, index) => {
    assert.equal(immutableObject(root, `${accepted}:${entry.file}`), entry.originalBlob, 'Original accepted blob');
    assert.equal(immutableObject(root, `${baseline}:${entry.file}`), entry.originalBlob, 'Original baseline blob');
    const original = readGitBlob(root, { oid: entry.originalBlob, sha256: entry.historicalGitSha256 });
    const current = verifyWorkingSource(root, entry.file, { oid: entry.approvedBlob, sha256: entry.approvedSourceSha256 });
    const oracle = inventory.tests[index];
    assert.equal(oracle.sourceSha256, original.sha256, 'Original inventory binds to the accepted source');
    assert.deepEqual([entry.checkpoints, entry.assertionSites, entry.screenshots],
      [oracle.scenarioCount, oracle.assertionSitesWithHelpers, oracle.screenshotCount], 'Independent original coverage counts');
    assert.deepEqual(entry.scenarios, oracle.scenarios.map(scenario => ({ ...scenario,
      newTestId: `${entry.id}-${scenario.viewport.width}` })), 'Every original scenario maps exactly once; no invented/omitted fixture/state');
    assert.equal(entry.scenarios.length, entry.checkpoints);
    assert.deepEqual([...new Set(entry.scenarios.map(s => s.viewport.width))], [1280, 768, 320]);
    for (const scenario of entry.scenarios) assert.equal(scenario.newTestId, `${entry.id}-${scenario.viewport.width}`);
    assert.deepEqual(entry.newIds, viewports.map(viewport => `${entry.id}-${viewport.width}`), 'Explicit approved new IDs');
    return compareH5Source(original.text, current.text, entry);
  });
  assert.deepEqual(contract.entries.map(e => [e.checkpoints, e.assertionSites, e.screenshots]), [[18,9,18],[18,12,18],[12,8,12],[24,9,6],[12,15,12]], 'Original independently inventoried coverage');
  const m15 = verifyM15OutputPreservation(root);
  const m15Validator = verifyM15ValidatorPreservation(root);
  const h6 = verifyH6SourceAtRoot(root);
  const publicationValidator = verifyPublicationValidatorAtRoot(root);
  const originals = git(root, ['ls-tree', '-r', '--name-only', '-z', baseline, 'src', 'tests', 'casino-tests', 'scripts', 'art', 'public',
    'package.json', 'package-lock.json', 'playwright.config.ts', 'vite.config.ts', 'tsconfig.json', 'tsconfig.domain.json', 'eslint.config.mjs', '.gitattributes', 'AGENTS.md', 'SKILL.md']).toString('utf8').split('\0').filter(Boolean);
  const nonTargets = originals.filter(file => !scope.some(([path]) => path === file) && !m15Scope.includes(file) && file !== validatorFile && file !== h6File && file !== publicationValidatorFile);
  git(root, ['diff', '--exit-code', baseline, '--', ...nonTargets]);
  const additions = ['scripts/check-h5-preservation.mjs', 'scripts/check-h5-preservation.d.mts', 'casino-tests/harnessH5.test.ts',
    'scripts/check-h6-preservation.mjs', 'scripts/check-h6-preservation.d.mts', 'casino-tests/harnessH6.test.ts', publicationTestFile];
  const actual = git(root, ['ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', 'src', 'tests', 'casino-tests', 'scripts', 'art', 'public']).toString('utf8').split('\0').filter(Boolean);
  for (const file of actual) assert(originals.includes(file) || additions.includes(file), `Unauthorized technical path: ${file}`);
  assert.equal(gitLine(root, 'rev-parse', 'blackjack-v1.0^{}'), accepted, 'Frozen local tag');
  return { status: 'PASS', factories: results.length, newCases: results.flatMap(r => r.newIds).length,
    checkpoints: 84, staticAssertionSites: 53, screenshotOperations: 66, missingScenarios: 0,
    omittedAssertions: 0, omittedScreenshots: 0, nonTargetPaths: nonTargets.length, m15, m15Validator, h6, publicationValidator, results,
    gitSubprocessesWithinInvocation: preservationInvocation.subprocesses };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(JSON.stringify(verifyH5Preservation(), null, 2));
