// Read-only validation of the owner-provided source/runtime pairs; never regenerates art.
import { readFileSync } from 'node:fs';
import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { inflateSync } from 'node:zlib';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { deepStrictEqual, strictEqual, ok } from 'node:assert';

const ids = ['noble_female', 'knight_female', 'mage_female', 'elf_female', 'halforc_female'];
const names = ['Celestine', 'Seraphine', 'Nyra', 'Elaria', 'Vesha'];
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function paeth(left, up, corner) {
  const p = left + up - corner, a = Math.abs(p - left), b = Math.abs(p - up), c = Math.abs(p - corner);
  return a <= b && a <= c ? left : b <= c ? up : corner;
}
export function auditDealerPng(path, dimensions, expectedSha256, expectedAlphaMax = 255) {
  const file = readFileSync(path);
  strictEqual(sha(file), expectedSha256, path + ': supplied bytes changed');
  strictEqual(file.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', path + ': PNG signature');
  let offset = 8, width, height;
  const chunks = [], data = [];
  while (offset < file.length) {
    ok(offset + 12 <= file.length, path + ': truncated chunk');
    const length = file.readUInt32BE(offset), end = offset + 12 + length;
    ok(end <= file.length, path + ': truncated payload');
    const type = file.toString('ascii', offset + 4, offset + 8), payload = file.subarray(offset + 8, end - 4);
    strictEqual(crc32(file.subarray(offset + 4, end - 4)), file.readUInt32BE(end - 4), path + ': ' + type + ' CRC');
    if (type === 'IHDR') {
      strictEqual(offset, 8); strictEqual(length, 13);
      width = payload.readUInt32BE(0); height = payload.readUInt32BE(4);
      deepStrictEqual([...payload.subarray(8)], [8, 6, 0, 0, 0], path + ': RGBA8/non-interlaced encoding');
    } else if (type === 'IDAT') data.push(payload);
    chunks.push(type); offset = end;
    if (type === 'IEND') { strictEqual(length, 0); strictEqual(offset, file.length); break; }
  }
  deepStrictEqual([width, height], dimensions, path + ': decoded dimensions');
  strictEqual(width * 4, height * 3, path + ': 3:4');
  strictEqual(chunks.at(-1), 'IEND'); ok(data.length > 0);
  const stride = width * 4, raw = inflateSync(Buffer.concat(data)), pixels = Buffer.alloc(width * height * 4);
  strictEqual(raw.length, height * (stride + 1));
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)]; ok(filter <= 4);
    for (let x = 0; x < stride; x++) {
      const index = y * stride + x, left = x >= 4 ? pixels[index - 4] : 0;
      const up = y ? pixels[index - stride] : 0, corner = y && x >= 4 ? pixels[index - stride - 4] : 0;
      const adjustment = filter === 0 ? 0 : filter === 1 ? left : filter === 2 ? up
        : filter === 3 ? Math.floor((left + up) / 2) : paeth(left, up, corner);
      pixels[index] = (raw[y * (stride + 1) + x + 1] + adjustment) & 255;
    }
  }
  const histogram = Array(256).fill(0), colours = new Set();
  for (let i = 0; i < pixels.length; i += 4) {
    histogram[pixels[i + 3]]++;
    if (pixels[i + 3] >= 128) colours.add(pixels.readUInt32BE(i));
  }
  ok(histogram[0] >= width * height * .01, path + ': meaningful transparency');
  ok(histogram.slice(128).reduce((a, b) => a + b, 0) >= width * height * .1, path + ': visible subject');
  ok(histogram[expectedAlphaMax] > 0 && colours.size > 100, path + ': nonblank subject');
  strictEqual(histogram.slice(expectedAlphaMax + 1).reduce((a, b) => a + b, 0), 0, path + ': actual alpha maximum');
  return { path: path.replaceAll('\\', '/'), bytes: file.length, sha256: sha(file), width, height, aspectRatio: '3:4',
    format: 'PNG', bitDepth: 8, alphaChannel: true, alphaExtrema: [0, expectedAlphaMax], transparentPixels: histogram[0],
    visiblePixels: histogram.slice(128).reduce((a, b) => a + b, 0), decodedRgbaSha256: sha(pixels), chunks, chunkCrcs: 'PASS', status: 'PASS' };
}
export function verifyDealerAssets(packRoot) {
  const manifestPath = packRoot ? packRoot + '/MANIFEST.json' : 'art/source/dealers/MANIFEST.json';
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  deepStrictEqual(manifest.dealer_pool_order, ids); strictEqual(manifest.assets.length, 5);
  const files = manifest.assets.map((asset, i) => {
    strictEqual(asset.canonical_id, ids[i]); strictEqual(asset.display_name, names[i]);
    strictEqual(asset.role, 'dealer'); strictEqual(asset.variant, 'formal'); strictEqual(asset.owner_approved, true);
    strictEqual(asset.source_path, 'source/' + ids[i] + '_formal_source.png');
    strictEqual(asset.runtime_path, 'runtime/' + ids[i] + '/formal.png');
    deepStrictEqual(asset.source_dimensions, [1086, 1448]); deepStrictEqual(asset.runtime_dimensions, [240, 320]);
    strictEqual(asset.source_has_alpha, true); strictEqual(asset.runtime_has_alpha, true);
    deepStrictEqual(asset.source_alpha_extrema, [0, 255]); deepStrictEqual(asset.runtime_alpha_extrema, [0, 255]);
    ok(typeof asset.provenance === 'string' && asset.provenance.length > 0);
    const source = packRoot ? packRoot + '/' + asset.source_path : 'art/source/dealers/' + ids[i] + '/formal.png';
    const runtime = packRoot ? packRoot + '/' + asset.runtime_path : 'public/characters/dealer/' + ids[i] + '/formal.png';
    return { name: names[i], characterId: ids[i], role: 'dealer', variant: 'formal', ownerApproved: true,
      provenance: { ownerManifestStatement: asset.provenance, independentlyVerifiedGenerationOrLicensing: false,
        importMethod: 'Supplied source/runtime pair imported byte-for-byte; resize method not declared in manifest' },
      source: auditDealerPng(source, [1086, 1448], asset.source_sha256), runtime: auditDealerPng(runtime, [240, 320], asset.runtime_sha256) };
  });
  strictEqual(new Set(files.map(f => f.source.decodedRgbaSha256)).size, 5);
  strictEqual(new Set(files.map(f => f.runtime.decodedRgbaSha256)).size, 5);
  return { status: 'PASS', manifestPath, files, regeneratedArtwork: false };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.stdout.write(JSON.stringify(verifyDealerAssets(process.argv[2]), null, 2) + '\n');
}
