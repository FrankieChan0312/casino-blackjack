import { expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createBrowserController } from '../../src/browser/controller.js';
import { CLASSIC, CLASSIC_V1_2 } from '../../src/domain/profile.js';
import { App } from '../../src/ui/App.js';
import { behindFixture } from '../helpers/behindFixture.js';
import { noRandom } from '../helpers/tableFixture.js';

function controller() {
  return createBrowserController({playerMode:true,random:noRandom,factory:()=> {
    const state = behindFixture(['10','10','A','10','9','7','7','A','7','8','A','9','6','9']);
    return {...state,table:{...state.table,profileId:CLASSIC_V1_2}};
  }});
}
it('[RSA-030] normal Player Mode starts Classic V1.2 while explicit historical/manual sessions retain V1.1', () => {
  expect(createBrowserController({playerMode:true,seed:7}).getSnapshot().profileId).toBe('CLASSIC_6D_S17_V1_2');
  expect(createBrowserController().getSnapshot().profileId).toBe(CLASSIC);
  expect(createBrowserController({playerMode:true,seed:7,profileId:CLASSIC}).getSnapshot().profileId).toBe(CLASSIC);
});
it('RA1 browser authority rejects hidden direct Hit and explains the optional Soft 12 decline', () => {
  const c = controller(); expect(c.dispatch({type:'DEAL',amount:200})).toBe(true);
  expect(c.dispatch({type:'ACT',action:'SPLIT',handId:c.getSnapshot().interaction.handId})).toBe(true);
  const before = c.getSnapshot(); expect(before.interaction.actions.filter(a=>a.enabled).map(a=>a.action)).toEqual(['STAND','SPLIT']);
  const html = renderToStaticMarkup(createElement(App,{controller:c}));
  expect(html).toContain('Stand to keep Soft 12'); expect(html).toContain('rsa-choice');
  expect(c.dispatch({type:'ACT',action:'HIT',handId:before.interaction.handId})).toBe(false);
  expect(c.getSnapshot().round).toEqual(before.round); expect(c.getSnapshot().human).toEqual(before.human);
  expect(c.dispatch({type:'ACT',action:'STAND',handId:before.interaction.handId})).toBe(true);
  expect(c.getSnapshot().phase).toBe('COMMITTED'); expect(c.getSnapshot().human).toMatchObject({available:2000,reserved:0});
});
it('RA1 browser RSA automatically settles three ordinary leaves and retains the original Repeat Bet stake', () => {
  const c = controller(); c.dispatch({type:'DEAL',amount:200});
  for (let n=0;n<2;n++) expect(c.dispatch({type:'ACT',action:'SPLIT',handId:c.getSnapshot().interaction.handId})).toBe(true);
  expect(c.getSnapshot().phase).toBe('COMMITTED'); expect(c.getSnapshot().lastBet).toBe(200);
  expect(c.getSnapshot().ownResults.map(r=>[r.handId,r.stake,r.returned])).toEqual([
    ['round-1/seat-4.1.1',200,400],['round-1/seat-4.1.2',200,200],['round-1/seat-4.2',200,400]]);
  expect(c.getSnapshot().human).toMatchObject({available:2400,reserved:0});
});
