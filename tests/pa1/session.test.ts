import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createBrowserController } from '../../src/browser/controller.js';
import { characters, createCharacterLineup, changeHumanCharacter } from '../../src/presentation/characters.js';
import { acceptedController } from '../m10/historicalConfiguration.js';
import { CLASSIC_V1_2 } from '../../src/domain/profile.js';

it('[PA1-S01] controller differs only by a browser-local session marker, with every gameplay statement unchanged', () => {
  const current = acceptedController(readFileSync('src/browser/controller.ts','utf8')).replaceAll('\r\n','\n')
    .replace('  let presentationSession = 0;\n','')
    .replace('playerMode, presentationSession, lastBet','playerMode, lastBet')
    .replace('    presentationSession++;\n','').trimEnd();
  const baseline = execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,'show',
    'e8e8e2e1586611473f0cdb94540ce995d9bd64e7:src/browser/controller.ts'],{encoding:'utf8'}).replaceAll('\r\n','\n').trimEnd();
  expect(current).toBe(baseline);
});
it('[PA1-S02] assignment and every avatar selection consume zero gameplay RNG and emit zero controller events', () => {
  let events = 0;
  const bounds: number[] = [];
  const c = createBrowserController({playerMode:true,random:{nextInt:n => { bounds.push(n); return n - 1; }}});
  // Independent shuffle bounds plus one accepted cut-position selection.
  const expected = [...Array.from({length:311},(_,index) => 312 - index),31];
  expect(bounds).toEqual(expected);
  c.subscribe(() => events++);
  const before = c.getSnapshot();
  let lineup = createCharacterLineup([1,3,6],() => 0);
  for (const entry of characters) lineup = changeHumanCharacter(lineup,entry.id);
  expect(bounds).toEqual(expected); expect(events).toBe(0); expect(c.getSnapshot()).toBe(before);
  expect(new Set([lineup.human,...Object.values(lineup.guests)]).size).toBe(4);
});
it('[PA1-S03] normal rounds and rejected resets retain session marker; only successful explicit new session changes it', () => {
  const c = createBrowserController({playerMode:true,seed:7});
  expect(c.getSnapshot().presentationSession).toBe(0);
  expect(c.dispatch({type:'DEAL',amount:200})).toBe(true);
  expect(c.startDemo(CLASSIC_V1_2,8)).toBe(false); expect(c.getSnapshot().presentationSession).toBe(0);
  expect(c.dispatch({type:'ACT',action:'STAND',handId:c.getSnapshot().interaction.handId})).toBe(true);
  expect(c.dispatch({type:'REPEAT'})).toBe(true); expect(c.getSnapshot().presentationSession).toBe(0);
  if (c.getSnapshot().interaction.insurance) c.dispatch({type:'ACE',choice:'DECLINE'});
  while (c.getSnapshot().phase === 'CLOSED') {
    expect(c.dispatch({type:'ACT',action:'STAND',handId:c.getSnapshot().interaction.handId})).toBe(true);
  }
  expect(c.getSnapshot().phase).toBe('COMMITTED');
  expect(c.startDemo(CLASSIC_V1_2,8)).toBe(true); expect(c.getSnapshot().presentationSession).toBe(1);
});
