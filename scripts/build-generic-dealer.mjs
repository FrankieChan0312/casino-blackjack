// Deterministic PA1-style conversion of the owner-supplied generic portrait.
/* global Image, document */
import { chromium } from '@playwright/test';
import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import process from 'node:process';
import { strictEqual } from 'node:assert';
import { auditDealerPng } from './verify-dealer-assets.mjs';

const source = 'art/source/dealers/generic_female/formal.png';
const runtime = 'public/characters/dealer/generic_female/formal.png';
const manifest = 'art/source/dealers/generic_female/MANIFEST.json';
const sourceSha256 = '6d0e58c7d074fd9b38da042f8d60ff2acb44c8b0196fac5f627d8a9e0c84c65c';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const tool = { node: 'v24.19.0', playwright: '1.63.0', chromium: '153.0.8010.12' };
strictEqual(process.version, tool.node);
strictEqual(JSON.parse(readFileSync('node_modules/@playwright/test/package.json', 'utf8')).version, tool.playwright);
const original = readFileSync(source);
const sourceAudit = auditDealerPng(source, [1086, 1448], sourceSha256);
const browser = await chromium.launch();
let bytes;
try {
  strictEqual(browser.version(), tool.chromium);
  const page = await browser.newPage();
  const encoded = await page.evaluate(async base64 => {
    const image = new Image(); image.src = `data:image/png;base64,${base64}`;
    await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = 240; canvas.height = 320;
    const context = canvas.getContext('2d', { alpha: true });
    context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high';
    const scale = Math.min(240 / image.naturalWidth, 320 / image.naturalHeight);
    const width = image.naturalWidth * scale, height = image.naturalHeight * scale;
    context.drawImage(image, (240 - width) / 2, (320 - height) / 2, width, height);
    return canvas.toDataURL('image/png').split(',')[1];
  }, original.toString('base64'));
  bytes = Buffer.from(encoded, 'base64');
} finally { await browser.close(); }
const receipt = { task: 'M10-PRE-T11', role: 'dealer', variant: 'formal', nonRoster: true,
  ownerApproved: true, approval: 'Owner supplied and approved this standalone generic fallback in the M10-PRE-T11 request.',
  provenance: 'Owner-supplied original copied byte-for-byte; deterministic local resize only; no generated replacement.',
  independentlyVerifiedGenerationOrLicensing: false, tool,
  method: 'uniform contain; centered; transparent 240x320 canvas; high-quality smoothing; no crop',
  source: { path: source, sha256: sourceSha256, width: sourceAudit.width, height: sourceAudit.height },
  runtime: { path: runtime, sha256: sha(bytes), width: 240, height: 320, alphaExtrema: [0, 254] } };
if (process.argv.includes('--check')) {
  strictEqual(readFileSync(runtime).equals(bytes), true, 'Runtime PNG must reproduce byte-for-byte');
  strictEqual(readFileSync(manifest, 'utf8').replaceAll('\r\n', '\n'), JSON.stringify(receipt, null, 2) + '\n');
} else {
  mkdirSync('public/characters/dealer/generic_female', { recursive: true });
  writeFileSync(runtime, bytes);
  writeFileSync(manifest, JSON.stringify(receipt, null, 2) + '\n');
}
strictEqual(sha(readFileSync(source)), sourceSha256);
auditDealerPng(runtime, [240, 320], receipt.runtime.sha256, 254);
process.stdout.write(JSON.stringify({ status: 'PASS', ...receipt }, null, 2) + '\n');
