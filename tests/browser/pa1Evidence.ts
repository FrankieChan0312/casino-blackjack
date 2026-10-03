import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const hash = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');
function pngDimensions(bytes: Buffer, path: string) {
  if (bytes.length < 33 || bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a'
      || bytes.readUInt32BE(8) !== 13 || bytes.toString('ascii', 12, 16) !== 'IHDR') {
    throw new Error(`Invalid PNG header: ${path}`);
  }
  const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
  if (!width || !height) throw new Error(`Empty PNG dimensions: ${path}`);
  return { width, height };
}

// Historical PA1 images document the accepted pre-M10 layout. Existing DOM,
// portrait and gameplay assertions remain the visual oracle, not pixel equality
// with that old layout. Compare saved capture bytes and baseline immutability.
export async function capturePa1Evidence(
  baselinePath: string,
  outputPath: string,
  capture: (path: string) => Promise<Buffer>,
  expected: { width?: number; minHeight?: number } = {},
) {
  if (resolve(baselinePath).toLowerCase() === resolve(outputPath).toLowerCase()) {
    throw new Error(`Fresh evidence must not overwrite canonical baseline: ${baselinePath}`);
  }
  const baseline = await readFile(baselinePath);
  pngDimensions(baseline, baselinePath);
  const captured = await capture(outputPath);
  const saved = await readFile(outputPath);
  const dimensions = pngDimensions(saved, outputPath);
  if (expected.width !== undefined && dimensions.width !== expected.width) {
    throw new Error(`Screenshot width mismatch: ${outputPath}: ${dimensions.width} != ${expected.width}`);
  }
  if (expected.minHeight !== undefined && dimensions.height < expected.minHeight) {
    throw new Error(`Screenshot height mismatch: ${outputPath}: ${dimensions.height} < ${expected.minHeight}`);
  }
  if (hash(saved) !== hash(captured)) throw new Error(`Saved screenshot content mismatch: ${outputPath}`);
  if (hash(await readFile(baselinePath)) !== hash(baseline)) {
    throw new Error(`Canonical baseline changed during capture: ${baselinePath}`);
  }
}
