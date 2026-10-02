// PA1 deterministic production conversion; original PNGs are read-only.
/* global Image, document */
import { chromium } from '@playwright/test';
import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

const check = process.argv.includes('--check');
const tool = { node: 'v24.19.0', playwright: '1.63.0', chromium: '153.0.8010.12' };
if (process.version !== tool.node || JSON.parse(readFileSync('node_modules/@playwright/test/package.json', 'utf8')).version !== tool.playwright) {
  throw new Error('Pinned PA1 production tool versions required');
}
const audit = JSON.parse(execFileSync(process.execPath, ['scripts/audit-character-sources.mjs'], { encoding: 'utf8' }));
const recorded = JSON.parse(readFileSync('docs/PA1_SOURCE_AUDIT.json', 'utf8'));
if (JSON.stringify(audit) !== JSON.stringify(recorded)) throw new Error('Source audit receipt changed; re-audit before conversion');
const outputDirectory = 'public/characters';
const receiptPath = 'art/character-production.json';
if (!check) mkdirSync(outputDirectory, { recursive: true });
const browser = await chromium.launch();
const files = [];
try {
  if (browser.version() !== tool.chromium) throw new Error('Pinned Chromium version required');
  const page = await browser.newPage();
  for (const source of audit.files) {
    const encoded = await page.evaluate(async base64 => {
      const image = new Image(); image.src = `data:image/png;base64,${base64}`;
      await image.decode();
      const canvas = document.createElement('canvas'); canvas.width = 240; canvas.height = 320;
      const context = canvas.getContext('2d', { alpha: true });
      context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high';
      const scale = Math.min(240 / image.naturalWidth, 320 / image.naturalHeight);
      const width = image.naturalWidth * scale, height = image.naturalHeight * scale;
      context.drawImage(image, (240 - width) / 2, (320 - height) / 2, width, height);
      const pixels = context.getImageData(0, 0, 240, 320).data;
      let transparent = 0;
      for (let index = 3; index < pixels.length; index += 4) if (pixels[index] === 0) transparent++;
      if (transparent < 240 * 320 * .01) throw new Error('Production transparency gate failed');
      return { png: canvas.toDataURL('image/png').split(',')[1], transparentPixels: transparent };
    }, readFileSync(source.path).toString('base64'));
    const bytes = Buffer.from(encoded.png, 'base64');
    if (bytes.length > 400000) throw new Error(`${source.name}: production size budget exceeded`);
    const path = join(outputDirectory, source.name);
    if (check) {
      if (!readFileSync(path).equals(bytes)) throw new Error(`${source.name}: production bytes not reproducible`);
    } else writeFileSync(path, bytes);
    files.push({ id: source.name.slice(0, -4), source: source.path, sourceSha256: source.sha256,
      output: path.replaceAll('\\', '/'), outputSha256: createHash('sha256').update(bytes).digest('hex'),
      width: 240, height: 320, bytes: bytes.length, transparentPixels: encoded.transparentPixels });
  }
} finally {
  await browser.close();
}
const receipt = `${JSON.stringify({ tool, framing: 'uniform contain; centered; transparent 240x320 canvas; high-quality smoothing; no crop', files }, null, 2)}\n`;
if (check) {
  if (readFileSync(receiptPath, 'utf8').replaceAll('\r\n', '\n') !== receipt) throw new Error('Production receipt mismatch');
} else writeFileSync(receiptPath, receipt);
process.stdout.write(`PASS: ${files.length} transparent 240x320 production PNGs ${check ? 'reproduced byte-for-byte' : 'generated'}; sources unchanged\n`);
