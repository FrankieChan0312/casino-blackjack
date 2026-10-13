import { createServer } from 'node:http';
import { lstat, open, realpath } from 'node:fs/promises';
import { extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { Buffer } from 'node:buffer';
import process from 'node:process';
import console from 'node:console';

const routes = new Set(['/', '/casino', '/casino/', '/blackjack', '/blackjack/', '/baccarat', '/baccarat/']);
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function portFromArguments(args) {
  if (args.length === 0) return 0;
  if (args.length !== 2 || args[0] !== '--port' || !/^\d+$/.test(args[1])) {
    throw new Error('Usage: node start-demo.mjs [--port 0..65535]');
  }
  const port = Number(args[1]);
  if (!Number.isSafeInteger(port) || port > 65535) {
    throw new Error('The port must be an integer from 0 through 65535.');
  }
  return port;
}

function inside(root, target) {
  const child = relative(root, target);
  return child !== '..' && !child.startsWith(`..${sep}`) && !isAbsolute(child);
}

function requestPath(rawUrl) {
  if (!rawUrl?.startsWith('/')) return null;
  const rawPath = rawUrl.split('?')[0];
  let pathname;
  try {
    pathname = decodeURIComponent(rawPath);
  } catch {
    return null;
  }
  // Inspect before URL/path normalization, including encoded separators and dot segments.
  if (/[\\:%#]/.test(pathname) || [...pathname].some((char) => char.codePointAt(0) <= 31 || char.codePointAt(0) === 127)) return null;
  if (pathname.split('/').some((part) => part.startsWith('.') || /[. ]$/.test(part))) return null;
  return pathname;
}

function errorResponse(request, response, status, message) {
  const body = `${message}\n`;
  response.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'X-Content-Type-Options': 'nosniff',
    ...(status === 405 ? { Allow: 'GET, HEAD' } : {}),
  });
  response.end(request.method === 'HEAD' ? undefined : body);
}

async function main() {
  const version = process.versions.node.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!version || Number(version[1]) !== 24 || Number(version[2]) < 19) {
    throw new Error(`Unsupported Node ${process.versions.node}. Install Node >=24.19.0 <25, then try again.`);
  }
  const port = portFromArguments(process.argv.slice(2));
  const dist = fileURLToPath(new URL('./dist/', import.meta.url));
  let distRoot;
  try {
    if (!(await lstat(dist)).isDirectory()) throw new Error('dist is not a directory');
    distRoot = await realpath(dist);
    const index = await realpath(resolve(distRoot, 'index.html'));
    if (!inside(distRoot, index) || !(await lstat(index)).isFile()) throw new Error('invalid index.html');
  } catch {
    throw new Error('Missing or invalid dist/index.html. Extract the whole demo ZIP before launching.');
  }

  let readyPort;
  const server = createServer(async (request, response) => {
    const hosts = request.rawHeaders.filter((value, index) => index % 2 === 0 && value.toLowerCase() === 'host');
    if (hosts.length !== 1 || request.headers.host !== `127.0.0.1:${readyPort}`) {
      errorResponse(request, response, 403, 'Forbidden Host. Use the printed 127.0.0.1 URL.');
      return;
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      errorResponse(request, response, 405, 'Only GET and HEAD are supported.');
      return;
    }
    const pathname = requestPath(request.url);
    if (pathname === null) {
      errorResponse(request, response, 400, 'Invalid or unsafe request path.');
      return;
    }
    const candidate = resolve(distRoot, routes.has(pathname) ? 'index.html' : `.${pathname}`);
    if (!inside(distRoot, candidate)) {
      errorResponse(request, response, 403, 'Forbidden path.');
      return;
    }

    let file;
    try {
      const physical = await realpath(candidate);
      const segments = relative(distRoot, physical).split(sep);
      if (!inside(distRoot, physical) || segments.some((part) => part.startsWith('.'))) {
        errorResponse(request, response, 403, 'Forbidden path.');
        return;
      }
      file = await open(physical, 'r');
      const info = await file.stat();
      if (!info.isFile()) {
        await file.close();
        errorResponse(request, response, 404, 'File not found.');
        return;
      }
      response.writeHead(200, {
        'Content-Type': contentTypes[extname(physical).toLowerCase()] ?? 'application/octet-stream',
        'Content-Length': info.size,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-cache',
      });
      if (request.method === 'HEAD') {
        await file.close();
        response.end();
      } else {
        const stream = file.createReadStream();
        stream.on('error', () => response.destroy());
        response.on('close', () => stream.destroy());
        stream.pipe(response);
      }
    } catch (error) {
      if (file) await file.close().catch(() => {});
      if (response.headersSent) response.destroy();
      else errorResponse(request, response, ['ENOENT', 'ENOTDIR'].includes(error.code) ? 404 : 500,
        ['ENOENT', 'ENOTDIR'].includes(error.code) ? 'File not found.' : 'Could not read the requested file.');
    }
  });

  await new Promise((fulfill, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', fulfill);
  }).catch((error) => {
    if (error.code === 'EADDRINUSE') throw new Error(`Port ${port} is already in use. Close this demo or choose another --port; no process was stopped.`);
    throw new Error(`Could not start the local demo: ${error.message}`);
  });
  readyPort = server.address().port;
  server.on('error', (error) => {
    console.error(`Local server error: ${error.message}`);
    process.exitCode = 1;
    server.close();
  });
  let stopping = false;
  const stop = () => {
    if (stopping) return;
    stopping = true;
    server.close(() => console.log('Demo stopped.'));
    server.closeAllConnections();
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
  console.log(`Casino Interview Demo ready: http://127.0.0.1:${readyPort}/`);
  console.log('Open this URL in your browser. Press Ctrl+C to stop. Simulated credits only.');
}

main().catch((error) => {
  console.error(`Demo startup failed: ${error.message}`);
  process.exitCode = 1;
});
