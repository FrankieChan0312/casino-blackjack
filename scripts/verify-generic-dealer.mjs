import { readFileSync } from 'node:fs';
import process from 'node:process';
import { strictEqual, ok } from 'node:assert';
import { auditDealerPng } from './verify-dealer-assets.mjs';

const manifestPath = 'art/source/dealers/generic_female/MANIFEST.json';
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
strictEqual(manifest.task, 'M10-PRE-T11');
strictEqual(manifest.role, 'dealer'); strictEqual(manifest.variant, 'formal');
strictEqual(manifest.nonRoster, true); strictEqual(manifest.ownerApproved, true);
strictEqual(manifest.source.sha256, '6d0e58c7d074fd9b38da042f8d60ff2acb44c8b0196fac5f627d8a9e0c84c65c');
strictEqual(manifest.source.path, 'art/source/dealers/generic_female/formal.png');
strictEqual(manifest.runtime.path, 'public/characters/dealer/generic_female/formal.png');
ok(manifest.provenance.length > 0 && manifest.approval.length > 0);
strictEqual(manifest.independentlyVerifiedGenerationOrLicensing, false);
const source = auditDealerPng(manifest.source.path, [1086, 1448], manifest.source.sha256);
const runtime = auditDealerPng(manifest.runtime.path, [240, 320], manifest.runtime.sha256, 254);
strictEqual(readFileSync('src/presentation/genericDealer.ts', 'utf8').includes(runtime.sha256), true);
process.stdout.write(JSON.stringify({ status: 'PASS', manifestPath, nonRoster: true, ownerApproved: true, source, runtime }, null, 2) + '\n');
