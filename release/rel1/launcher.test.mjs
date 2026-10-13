import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { copyFile, lstat, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { request as httpRequest } from 'node:http';
import { createConnection, createServer } from 'node:net';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL, URL } from 'node:url';
import { clearTimeout, setTimeout } from 'node:timers';
import { Buffer } from 'node:buffer';
import process from 'node:process';

const source = fileURLToPath(new URL('./start-demo.mjs', import.meta.url));
const indexBody = '<!doctype html><title>Independent launcher fixture</title>';
const children = new Set();

function launch(script, args = [], prefix = '') {
  const command = prefix ? ['--input-type=module', '--eval', `${prefix}\nawait import(${JSON.stringify(pathToFileURL(script).href)});`, '--', ...args]
    : [script, ...args];
  const child = spawn(process.execPath, command, { cwd: tmpdir(), stdio: ['pipe', 'pipe', 'pipe'] });
  children.add(child);
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (chunk) => { stdout += chunk; });
  child.stderr.on('data', (chunk) => { stderr += chunk; });
  const exited = new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', (code, signal) => {
      children.delete(child);
      resolve({ code, signal, stdout, stderr });
    });
  });
  return { child, exited, output: () => ({ stdout, stderr }) };
}

async function ready(run) {
  let timer;
  return Promise.race([
    new Promise((resolve, reject) => {
      timer = setTimeout(() => reject(new Error(`Ready URL timeout: ${JSON.stringify(run.output())}`)), 5000);
      run.child.stdout.on('data', () => {
        const match = run.output().stdout.match(/ready: http:\/\/127\.0\.0\.1:(\d+)\//);
        if (match) resolve(Number(match[1]));
      });
    }),
    run.exited.then((result) => { throw new Error(`Launcher exited before ready: ${JSON.stringify(result)}`); }),
  ]).finally(() => clearTimeout(timer));
}

function get(port, path = '/', { method = 'GET', host = `127.0.0.1:${port}`, setHost = true } = {}) {
  return new Promise((resolve, reject) => {
    const request = httpRequest({ hostname: '127.0.0.1', port, path, method, setHost,
      headers: host === null ? {} : { Host: host }, agent: false }, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.once('error', reject);
      response.once('end', () => resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks).toString() }));
    });
    request.once('error', reject);
    request.setTimeout(5000, () => request.destroy(new Error('HTTP request timeout')));
    request.end();
  });
}

function rawGet(port, headers) {
  return new Promise((resolve, reject) => {
    const socket = createConnection({ host: '127.0.0.1', port });
    let output = '';
    socket.once('error', reject);
    socket.setTimeout(5000, () => socket.destroy(new Error('Raw request timeout')));
    socket.once('connect', () => socket.end(`GET / HTTP/1.1\r\n${headers}\r\nConnection: close\r\n\r\n`));
    socket.on('data', (chunk) => { output += chunk; });
    socket.once('end', () => resolve(output));
  });
}

test('REL1 extracted-package launcher', { timeout: 30000 }, async (t) => {
  const scratch = await mkdtemp(join(tmpdir(), 'casino-rel1-launcher-'));
  const packagePath = join(scratch, 'Interview demo 中文 with spaces');
  const launcher = join(packagePath, 'start-demo.mjs');
  const dist = join(packagePath, 'dist');
  t.after(async () => {
    await Promise.all([...children].map((child) => new Promise((resolve) => {
      child.once('close', resolve);
      child.kill();
    })));
    await rm(scratch, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  });
  await mkdir(join(dist, 'assets'), { recursive: true });
  await copyFile(source, launcher);
  await copyFile(fileURLToPath(new URL('./START-DEMO.cmd', import.meta.url)), join(packagePath, 'START-DEMO.cmd'));
  await writeFile(join(dist, 'index.html'), indexBody);
  await writeFile(join(dist, '.env'), 'PRIVATE FIXTURE');
  await writeFile(join(scratch, 'outside.txt'), 'OUTSIDE FIXTURE');
  const mimeFixtures = [
    ['app.js', 'text/javascript; charset=utf-8'],
    ['app.css', 'text/css; charset=utf-8'],
    ['data.json', 'application/json; charset=utf-8'],
    ['portrait.png', 'image/png'], ['card.svg', 'image/svg+xml'],
    ['image.webp', 'image/webp'], ['font.woff2', 'font/woff2'],
    ['favicon.ico', 'image/x-icon'], ['unknown.bin', 'application/octet-stream'],
  ];
  for (const [name] of mimeFixtures) await writeFile(join(dist, 'assets', name), `fixture:${name}`);

  const running = launch(launcher);
  const port = await ready(running);

  await t.test('OS-assigned loopback URL; paths with spaces/non-ASCII; different working directory', async () => {
    assert(port > 0 && port <= 65535);
    assert.match(running.output().stdout, new RegExp(`http://127\\.0\\.0\\.1:${port}/`));
    assert.equal((await get(port)).body, indexBody);
  });

  await t.test('confirmed application routes and refresh entries only', async () => {
    for (const path of ['/', '/casino', '/casino/', '/blackjack', '/blackjack/', '/baccarat', '/baccarat/', '/casino?view=demo']) {
      const response = await get(port, path);
      assert.equal(response.status, 200, path);
      assert.equal(response.body, indexBody, path);
      assert.equal(response.headers['content-type'], 'text/html; charset=utf-8', path);
    }
    for (const path of ['/unknown', '/casino/nope', '/BLACKJACK', '/assets/missing.js', '/missing.png', '/assets/']) {
      const response = await get(port, path);
      assert.equal(response.status, 404, path);
      assert.equal(response.body, 'File not found.\n', path);
    }
  });

  await t.test('MIME types, GET bodies and HEAD with identical length and no body', async () => {
    for (const [name, mime] of mimeFixtures) {
      const response = await get(port, `/assets/${name}`);
      assert.equal(response.status, 200, name);
      assert.equal(response.headers['content-type'], mime, name);
      assert.equal(response.headers['x-content-type-options'], 'nosniff', name);
      assert.equal(response.body, `fixture:${name}`, name);
      const head = await get(port, `/assets/${name}`, { method: 'HEAD' });
      assert.equal(head.status, 200, name);
      assert.equal(head.body, '', name);
      assert.equal(head.headers['content-length'], response.headers['content-length'], name);
      assert.equal(head.headers['content-type'], mime, name);
    }
    const head = await get(port, '/baccarat', { method: 'HEAD' });
    assert.equal(head.status, 200);
    assert.equal(head.body, '');
    assert.equal(Number(head.headers['content-length']), Buffer.byteLength(indexBody));
    assert.equal((await get(port, '/missing.png', { method: 'HEAD' })).status, 404);
  });

  await t.test('unsupported methods return 405', async () => {
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
      const response = await get(port, '/', { method });
      assert.equal(response.status, 405, method);
      assert.equal(response.headers.allow, 'GET, HEAD', method);
      assert.equal(response.body, 'Only GET and HEAD are supported.\n', method);
    }
  });

  await t.test('exact local Host boundary including missing and duplicate Host', async () => {
    for (const host of ['example.com', `localhost:${port}`, `127.0.0.1:${port + 1}`, `127.0.0.1:${port}.evil`, `127.0.0.1`, `[::1]:${port}`]) {
      assert.equal((await get(port, '/', { host })).status, 403, host);
    }
    const missing = await get(port, '/', { host: null, setHost: false });
    assert([400, 403].includes(missing.status), 'missing Host rejected by HTTP parser or handler');
    assert.doesNotMatch(missing.body, /Independent launcher fixture/);
    const duplicate = await rawGet(port, `Host: 127.0.0.1:${port}\r\nHost: example.com`);
    assert.match(duplicate, /^HTTP\/1\.1 (400|403) /);
    assert.doesNotMatch(duplicate, /Independent launcher fixture/);
  });

  await t.test('raw/encoded traversal, hidden files and malformed paths rejected', async () => {
    for (const path of ['/../outside.txt', '/assets/../../outside.txt', '/%2e%2e/outside.txt', '/assets/%2E%2E/%2E%2E/outside.txt',
      '/%252e%252e/outside.txt', '/assets%2f..%2f..%2foutside.txt', '/assets%5c..%5coutside.txt',
      '/.env', '/%2eenv', '/assets/.hidden/file', '/assets/app.js:stream', '/assets/app.js.', '/assets/app.js%20', '/%00', '/%zz']) {
      const response = await get(port, path);
      assert.equal(response.status, 400, path);
      assert.equal(response.body, 'Invalid or unsafe request path.\n', path);
    }
    const absolute = await get(port, `http://127.0.0.1:${port}/`);
    assert.equal(absolute.status, 400);
  });

  await t.test('escaping directory symlinks rejected; internal symlink stays in dist', async () => {
    const kind = process.platform === 'win32' ? 'junction' : 'dir';
    await symlink(scratch, join(dist, 'escape'), kind);
    await symlink(join(dist, 'assets'), join(dist, 'inside'), kind);
    assert.equal((await get(port, '/escape/outside.txt')).status, 403);
    const internal = await get(port, '/inside/app.js');
    assert.equal(internal.status, 200);
    assert.equal(internal.body, 'fixture:app.js');
  });

  await t.test('missing dist and missing index produce actionable startup errors', async () => {
    for (const withDist of [false, true]) {
      const folder = join(scratch, withDist ? 'missing-index' : 'missing-dist');
      await mkdir(withDist ? join(folder, 'dist') : folder, { recursive: true });
      const script = join(folder, 'start-demo.mjs');
      await copyFile(source, script);
      const result = await launch(script).exited;
      assert.equal(result.code, 1);
      assert.match(result.stderr, /Missing or invalid dist\/index.html/);
      assert.doesNotMatch(result.stdout, /ready:/);
    }
  });

  await t.test('unsupported runtime guard and invalid CLI arguments fail before listening', async () => {
    for (const version of ['22.0.0', '24.18.9', '25.0.0']) {
      const result = await launch(launcher, [], `Object.defineProperty(process.versions, 'node', { value: '${version}' });`).exited;
      assert.equal(result.code, 1);
      assert.match(result.stderr, /Unsupported Node .*Install Node >=24\.19\.0 <25/);
    }
    for (const args of [['--port', '-1'], ['--port', '65536'], ['--port', '1.5'], ['--port'], ['--host', '0.0.0.0']]) {
      const result = await launch(launcher, args).exited;
      assert.equal(result.code, 1, args.join(' '));
      assert.match(result.stderr, /Usage:|port must be an integer/, args.join(' '));
    }
  });

  await t.test('occupied explicit port reports error without stopping its owner', async () => {
    const occupied = createServer((socket) => socket.end('owner remains alive'));
    await new Promise((resolve) => occupied.listen(0, '127.0.0.1', resolve));
    try {
      const occupiedPort = occupied.address().port;
      const result = await launch(launcher, ['--port', String(occupiedPort)]).exited;
      assert.equal(result.code, 1);
      assert.match(result.stderr, new RegExp(`Port ${occupiedPort} is already in use`));
      assert.equal(occupied.listening, true);
      assert.match(await new Promise((resolve, reject) => {
        const socket = createConnection({ host: '127.0.0.1', port: occupiedPort });
        let body = '';
        socket.once('error', reject);
        socket.on('data', (chunk) => { body += chunk; });
        socket.once('end', () => resolve(body));
      }), /owner remains alive/);
    } finally {
      await new Promise((resolve) => occupied.close(resolve));
    }
  });

  await t.test('explicit port zero and SIGINT listener clean shutdown; released port reusable', async () => {
    // On Windows child.kill(SIGINT) terminates the process directly. Emit the event in
    // this owned child to verify the same cleanup listener used by console Ctrl+C.
    const run = launch(launcher, ['--port', '0'],
      `process.argv = [process.execPath, ${JSON.stringify(launcher)}, ...process.argv.slice(1)];
process.stdin.once('data', () => { process.stdin.destroy(); process.emit('SIGINT'); });`);
    const assigned = await ready(run);
    assert.equal((await get(assigned)).status, 200);
    run.child.stdin.end('stop\n');
    const result = await run.exited;
    assert.equal(result.code, 0, JSON.stringify(result));
    assert.equal(result.signal, null);
    assert.match(result.stdout, /Demo stopped\./);
    const next = launch(launcher, ['--port', String(assigned)]);
    assert.equal(await ready(next), assigned);
    assert.equal((await get(assigned)).status, 200);
  });
});

if (process.env.REL1_LAUNCHER_PATH) {
  test('REL1 actual extracted ZIP launcher', { timeout: 15000 }, async (t) => {
    const launcher = process.env.REL1_LAUNCHER_PATH;
    const packageUrl = new URL('./', pathToFileURL(launcher));
    await assert.rejects(lstat(fileURLToPath(new URL('node_modules', packageUrl))), { code: 'ENOENT' });
    assert.equal(await readFile(launcher, 'utf8'), await readFile(source, 'utf8'), 'actual package uses the tested launcher bytes');
    const running = launch(launcher);
    t.after(async () => {
      if (children.has(running.child)) {
        running.child.kill();
        await running.exited;
      }
    });
    const port = await ready(running);
    const home = await get(port);
    assert.equal(home.status, 200);
    assert.equal(home.headers['content-type'], 'text/html; charset=utf-8');
    for (const route of ['/casino', '/casino/', '/blackjack', '/blackjack/', '/baccarat', '/baccarat/']) {
      const response = await get(port, route);
      assert.equal(response.status, 200, route);
      assert.equal(response.body, home.body, route);
    }
    const assetPaths = [...home.body.matchAll(/(?:src|href)="(\/assets\/[^"?#]+\.(?:js|css))"/g)].map((match) => match[1]);
    assert(assetPaths.some((path) => path.endsWith('.js')), 'production script exists');
    assert(assetPaths.some((path) => path.endsWith('.css')), 'production stylesheet exists');
    for (const path of [...new Set(assetPaths), '/characters/dealer/generic_female/formal.png', '/characters/knight_female.png']) {
      const response = await get(port, path);
      assert.equal(response.status, 200, path);
      assert.equal(response.headers['content-type'], path.endsWith('.js') ? 'text/javascript; charset=utf-8'
        : path.endsWith('.css') ? 'text/css; charset=utf-8' : 'image/png', path);
      assert(Number(response.headers['content-length']) > 0, path);
      const head = await get(port, path, { method: 'HEAD' });
      assert.equal(head.status, 200, path);
      assert.equal(head.body, '', path);
      assert.equal(head.headers['content-length'], response.headers['content-length'], path);
    }
    assert.equal((await get(port, '/assets/does-not-exist.js')).status, 404);
    assert.equal((await get(port, '/unknown-navigation')).status, 404);
    for (const path of ['/.env', '/%2eenv', '/%2e%2e/VERSION.json', '/%252e%252e/VERSION.json']) {
      assert.equal((await get(port, path)).status, 400, path);
    }
    assert.equal((await get(port, '/', { method: 'POST' })).status, 405);
    assert.equal((await get(port, '/', { host: `localhost:${port}` })).status, 403);
  });
}
