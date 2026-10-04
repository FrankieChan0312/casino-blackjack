import { readFileSync } from 'node:fs';
const delta: { before: string; after: string }[] = JSON.parse(readFileSync('tests/m10/configurationDelta.json', 'utf8'));
// Reverse only the explicit, reviewed configuration edits. Any other gameplay
// statement still has to match the accepted historical source byte for byte.
export function acceptedController(source: string): string {
  let result = source.replaceAll('\r\n', '\n');
  for (const { before, after } of [...delta].reverse()) {
    if (result.split(after).length !== 2) throw new Error('Configuration delta no longer matches');
    result = result.replace(after, before);
  }
  return result;
}
