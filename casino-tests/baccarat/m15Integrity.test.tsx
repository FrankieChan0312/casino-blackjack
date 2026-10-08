import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createBaccarat } from '../../src/baccarat/domain/engine.js';
import { createBaccaratController } from '../../src/baccarat/controller.js';
import { BaccaratTable } from '../../src/baccarat/BaccaratTable.js';

it('[M15-I01] retired integrity shoe never advertises ready; refund then new generation preserve balance and no false history',()=>{
  const initial=createBaccarat(77),controller=createBaccaratController({...initial,shoe:{...initial.shoe,cards:initial.shoe.cards.slice(0,12)}});
  expect(controller.dispatch({type:'WAGER',target:'PLAYER_PAIR',amountUnits:1000}).ok).toBe(true);
  expect(controller.dispatch({type:'DEAL'}).ok).toBe(true);
  const view=controller.getSnapshot();expect(view.phase).toBe('INTEGRITY_ERROR');expect(view.shoe.mayBeginRound).toBe(false);expect(view.remainingCards).toBe(0);
  let html=renderToStaticMarkup(<BaccaratTable controller={controller}/>);
  expect(html).toContain('SHOE UNAVAILABLE');expect(html).not.toContain('Shoe ready');expect(html).toContain('Void round');
  expect(controller.dispatch({type:'VOID'}).ok).toBe(true);html=renderToStaticMarkup(<BaccaratTable controller={controller}/>);
  expect(html).toContain('SHOE RETIRED');expect(html).not.toContain('Shoe ready');expect(controller.getSnapshot().availableUnits).toBe(100000);
  expect(controller.dispatch({type:'NEXT'}).ok).toBe(true);expect(controller.getSnapshot().shoe.generation).toBe(2);
  expect(controller.getSnapshot().shoe.mayBeginRound).toBe(true);expect(controller.getSnapshot().history).toEqual([]);
});
