// Read-only PA1 source audit. Decode the supplied non-interlaced RGBA8 PNGs.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { inflateSync } from 'node:zlib';
import { join, relative } from 'node:path';
import process from 'node:process';

const directory = process.argv[2] ?? 'art/source/characters/PA1_character_sources';
const names = ['elf_male', 'elf_female', 'knight_male', 'knight_female',
  'mage_male', 'mage_female', 'noble_male', 'noble_female',
  'halforc_male', 'halforc_female', 'dwarf_male', 'dwarf_female'].map(id => `${id}.png`);
// Separate approved Dealer variants do not belong to the immutable twelve-player receipt.
const actual = readdirSync(directory).filter(name => !(directory === 'public/characters' && name === 'dealer' &&
  statSync(join(directory, name)).isDirectory())).sort();
if (JSON.stringify(actual) !== JSON.stringify([...names].sort())) throw new Error('Canonical filename set mismatch');

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function paeth(left, up, corner) {
  const predicted = left + up - corner;
  const a = Math.abs(predicted - left), b = Math.abs(predicted - up), c = Math.abs(predicted - corner);
  return a <= b && a <= c ? left : b <= c ? up : corner;
}
const results = names.map(name => {
  const path = join(directory, name), file = readFileSync(path);
  if (file.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error(`${name}: PNG signature`);
  const chunks = [], data = [], metadata = [];
  let offset = 8, width, height;
  while (offset < file.length) {
    if (offset + 12 > file.length) throw new Error(`${name}: truncated chunk`);
    const length = file.readUInt32BE(offset), end = offset + 12 + length;
    if (end > file.length) throw new Error(`${name}: truncated payload`);
    const type = file.toString('ascii', offset + 4, offset + 8);
    if (crc32(file.subarray(offset + 4, end - 4)) !== file.readUInt32BE(end - 4)) throw new Error(`${name}: ${type} CRC`);
    const payload = file.subarray(offset + 8, end - 4);
    chunks.push(type);
    if (type === 'IHDR') {
      if (offset !== 8 || length !== 13) throw new Error(`${name}: IHDR order/length`);
      width = payload.readUInt32BE(0); height = payload.readUInt32BE(4);
      if (!width || !height || payload[8] !== 8 || payload[9] !== 6 || payload[10] || payload[11] || payload[12]) {
        throw new Error(`${name}: unsupported PNG encoding; audit explicitly requires supplied RGBA8/non-interlaced format`);
      }
    } else if (type === 'IDAT') data.push(payload);
    else if (type !== 'IEND') metadata.push({ type, bytes: length,
      isText: ['tEXt', 'zTXt', 'iTXt', 'eXIf'].includes(type),
      c2pa: type === 'caBX' && payload.includes(Buffer.from('c2pa')) });
    offset = end;
    if (type === 'IEND') {
      if (length || offset !== file.length) throw new Error(`${name}: IEND/trailing bytes`);
      break;
    }
  }
  if (chunks.at(-1) !== 'IEND' || !data.length) throw new Error(`${name}: incomplete PNG`);
  if (metadata.some(entry => entry.type !== 'sRGB' && (entry.type !== 'caBX' || !entry.c2pa))) throw new Error(`${name}: unexpected image metadata`);
  const stride = width * 4, inflated = inflateSync(Buffer.concat(data));
  if (inflated.length !== height * (stride + 1)) throw new Error(`${name}: decoded length`);
  const pixels = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    const filter = inflated[y * (stride + 1)];
    if (filter > 4) throw new Error(`${name}: row filter`);
    for (let x = 0; x < stride; x++) {
      const index = y * stride + x;
      const left = x >= 4 ? pixels[index - 4] : 0, up = y ? pixels[index - stride] : 0;
      const corner = y && x >= 4 ? pixels[index - stride - 4] : 0;
      const adjustment = [0, left, up, Math.floor((left + up) / 2), paeth(left, up, corner)][filter];
      pixels[index] = (inflated[y * (stride + 1) + x + 1] + adjustment) & 255;
    }
  }
  const alphaHistogram = Array(256).fill(0);
  for (let index = 3; index < pixels.length; index += 4) alphaHistogram[pixels[index]]++;
  const total = width * height;
  if (alphaHistogram[0] / total < 0.01) throw new Error(`${name}: no material fully transparent background`);
  if (alphaHistogram.slice(128).reduce((a, b) => a + b, 0) / total < 0.1) throw new Error(`${name}: no substantial visible subject`);
  return { name, path: relative('.', path).replaceAll('\\', '/'), bytes: file.length,
    sha256: createHash('sha256').update(file).digest('hex'),
    decodedRgbaSha256: createHash('sha256').update(pixels).digest('hex'),
    format: 'PNG', readable: true, chunkCrcs: 'PASS', width, height,
    aspectRatio: width / height, bitDepth: 8, colorType: 6, alphaChannel: true,
    transparentPixels: alphaHistogram[0], transparentPercent: 100 * alphaHistogram[0] / total,
    opaquePixels: alphaHistogram[255], lowAlphaPixels: alphaHistogram.slice(1, 16).reduce((a, b) => a + b, 0),
    highAlphaPixels: alphaHistogram.slice(240).reduce((a, b) => a + b, 0),
    alphaHistogram, metadata, textMetadataPresent: metadata.some(entry => entry.isText),
    mechanical: 'PASS' };
});
if (new Set(results.map(entry => entry.sha256)).size !== names.length ||
  new Set(results.map(entry => entry.decodedRgbaSha256)).size !== names.length) throw new Error('Duplicate sources');
process.stdout.write(`${JSON.stringify({ directory, files: results, duplicateFiles: false }, null, 2)}\n`);
