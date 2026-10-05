import { test, expect } from '@playwright/test';

test('[T05-B01] real Motion controls finish via explicit completion, then skip/resize/hidden/unmount clean up',async({page})=>{
  await page.goto('/?fixture=player');
  const result=await page.evaluate(async()=>{
    const providerUrl='/src/ui/PresentationProvider.tsx',timelineUrl='/src/presentation/timeline.ts',eventsUrl='/src/presentation/events.ts';
    const {playMotionStep,connectPresentation,createPresentationRuntime}=await import(providerUrl),{createPresentationTimeline}=await import(timelineUrl),{createPresentationFeed}=await import(eventsUrl);
    const element=document.createElement('div');element.textContent='Infrastructure harness';document.body.append(element);
    const step=playMotionStep(element,{opacity:[0,1]},0.001);await step.finished;step.settle();
    const settled=element.style.opacity;
    const feed=createPresentationFeed(),runtime=createPresentationRuntime();let cancelled=0,finished=0;
    runtime.timeline=createPresentationTimeline(()=>{
      const motion=playMotionStep(element,{opacity:[0,1]},1);
      return{finished:motion.finished,cancel(){cancelled++;motion.cancel();},settle(){finished++;motion.settle();}};
    });
    const cleanup=connectPresentation(feed,runtime,'FULL_MOTION');
    const enqueue=()=>feed.append('r1','CLOSE',[{type:'DEALER_STATE',state:'DEALING'}]);
    enqueue();const active=runtime.timeline.getSnapshot().activeId;
    window.dispatchEvent(new Event('resize'));const resized=runtime.timeline.getSnapshot().activeId;
    enqueue();Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));delete (document as unknown as {hidden?:boolean}).hidden;
    enqueue();runtime.timeline.skip();enqueue();cleanup();element.remove();
    const empty=runtime.timeline.getSnapshot();enqueue();
    return{settled,active,resized,cancelled,finished,empty,after:runtime.timeline.getSnapshot(),batches:feed.getSnapshot().batches.length,running:element.getAnimations().filter(a=>a.playState==='running').length};
  });
  expect(result.settled).toBe('1');expect(result.active).not.toBeNull();expect(result.resized).toBeNull();
  expect(result.cancelled).toBe(4);expect(result.finished).toBe(4);expect(result.empty).toMatchObject({activeId:null,pending:0});expect(result.after).toEqual(result.empty);expect(result.batches).toBe(1);
  expect(result.running).toBe(0);
});

test('[T05-B02] StrictMode consumes batches once; React anchor refs survive rerender and unmount',async({page})=>{
  await page.goto('/?fixture=player');
  const result=await page.evaluate(async()=>{
    const providerUrl='/src/ui/PresentationProvider.tsx',eventsUrl='/src/presentation/events.ts',reactUrl='/node_modules/.vite/deps/react.js',rootUrl='/node_modules/.vite/deps/react-dom_client.js';
    const {PresentationProvider,usePresentationAnchor,usePresentationRuntime}=await import(providerUrl),{createPresentationFeed}=await import(eventsUrl),{default:React}=await import(reactUrl),{default:ReactDOM}=await import(rootUrl);
    const feed=createPresentationFeed();feed.append('r1','CLOSE',[{type:'DEALER_STATE',state:'WAITING_PLAYER'}]);let callbacks=0;
    const append=feed.append;feed.append=(...args:Parameters<typeof append>)=>{callbacks++;return append(...args);};
    let acknowledge!:()=>void;const consumedSignal=new Promise<void>(resolve=>{acknowledge=resolve;});
    const originalAcknowledge=feed.acknowledge;feed.acknowledge=(revision:number)=>{originalAcknowledge(revision);acknowledge();};
    const host=document.createElement('div');document.body.append(host);const root=ReactDOM.createRoot(host);
    let observed: {anchors:{get(id:string):HTMLElement|null;measure(id:string):DOMRect|null}}|undefined;
    function Probe(){const ref=usePresentationAnchor('deal-origin');observed=usePresentationRuntime();return React.createElement('div',{ref},'Anchor probe');}
    const render=()=>root.render(React.createElement(React.StrictMode,null,React.createElement(PresentationProvider,{feed},React.createElement(Probe))));
    render();await consumedSignal;
    const consumed=feed.getSnapshot().batches.length,registered=observed?.anchors.get('deal-origin')===host.firstChild,measured=!!observed?.anchors.measure('deal-origin');render();root.unmount();
    const detached=observed?.anchors.get('deal-origin')===null;
    feed.append('r1','CLOSE',[{type:'DEALER_STATE',state:'IDLE'}]);host.remove();return{consumed,callbacks,pending:feed.getSnapshot().batches.length,registered,measured,detached};
  });
  expect(result).toEqual({consumed:0,callbacks:1,pending:1,registered:true,measured:true,detached:true});
});

for(const reducedMotion of ['no-preference','reduce'] as const)test(`[T05-B03-${reducedMotion}] system policy preserves exact DOM/cards/controls/money on seven-player Split and four leaves`,async({page})=>{
  await page.emulateMedia({reducedMotion});await page.goto('/?fixture=player-seven-split');
  await page.getByLabel('Your main wager',{exact:false}).fill('100');await page.getByRole('button',{name:'Deal',exact:true}).click();
  await expect(page.locator('[data-dealer-presentation-state]')).toHaveAttribute('data-dealer-presentation-state','WAITING_PLAYER');
  const dealer=await page.locator('[data-dealer-character]').getAttribute('data-dealer-character');
  await page.getByRole('button',{name:'Split',exact:true}).click();await expect(page.locator('#player-hand article')).toHaveCount(2);
  expect(await page.locator('#player-hand [data-card-slot]').evaluateAll(els=>els.map(e=>e.getAttribute('data-card-slot')))).toEqual(['round-1/seat-4.1:0','round-1/seat-4.1:1','round-1/seat-4.2:0']);
  await page.setViewportSize({width:320,height:720});await expect(page.locator('[data-dealer-character]')).toHaveAttribute('data-dealer-character',dealer!);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(page.locator('.credits dd')).toHaveText(['800','200','0']);
  await page.goto('/?fixture=player-rsa-cap');await page.getByLabel('Your main wager',{exact:false}).fill('100');await page.getByRole('button',{name:'Deal',exact:true}).click();
  for(let i=0;i<3;i++)await page.getByRole('button',{name:'Split',exact:true}).click();
  await expect(page.locator('#player-hand article')).toHaveCount(4);await expect(page.locator('.credits dd')).toHaveText(['600','0','0']);
  await expect(page.locator('#player-hand .hud-state')).toHaveText(['Loss','Loss','Loss','Loss']);
});

for(const count of [1,7])test(`[T05-B04-${count}] count ${count} responsive authority remains immediate with no idle animation`,async({page})=>{
  await page.goto('/?fixture=player-setup');await page.getByLabel('Total players',{exact:true}).selectOption(String(count));await page.getByRole('button',{name:'Start table',exact:true}).click();
  await page.getByLabel('Your main wager',{exact:false}).fill('100');await page.getByRole('button',{name:'Deal',exact:true}).click();
  await expect(page.locator('.casino-table .seat')).toHaveCount(count);
  for(const viewport of [{width:1280,height:900},{width:768,height:1024},{width:320,height:720}]){
    await page.setViewportSize(viewport);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await expect(page.locator('#player-hand')).toContainText('YOU');
    // Existing finite button hover transitions are outside the T05 gameplay motion boundary.
    expect(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getTiming().iterations===Infinity).length)).toBe(0);
    expect(await page.locator('.casino-table .card').evaluateAll(els=>els.reduce((n,el)=>n+el.getAnimations().filter(a=>a.playState==='running').length,0))).toBe(0);
  }
});

test('[T05-B05] Motion mini cancellation leaves the same final frame; reduced-motion queue never starts a tween',async({page})=>{
  await page.goto('/?fixture=player');
  const result=await page.evaluate(async()=>{
    const providerUrl='/src/ui/PresentationProvider.tsx',eventsUrl='/src/presentation/events.ts',timelineUrl='/src/presentation/timeline.ts';
    const {playMotionStep}=await import(providerUrl),{createPresentationFeed}=await import(eventsUrl),{createPresentationTimeline}=await import(timelineUrl);
    const el=document.createElement('div');document.body.append(el);let calls=0;
    const q=createPresentationTimeline(()=>{calls++;return playMotionStep(el,{opacity:[0,1]},1);});
    const feed=createPresentationFeed();feed.append('r1','CLOSE',[{type:'DEALER_STATE',state:'DEALING'},{type:'DEALER_STATE',state:'WAITING_PLAYER'}]);const s=feed.getSnapshot();
    q.begin(s.generation);q.setMode('FULL_MOTION');q.enqueue(s.batches[0].events);q.skip();
    const frame=el.style.opacity;q.begin(s.generation+1);q.setMode('REDUCED_MOTION');q.enqueue(s.batches[0].events.map((event:object)=>({...event,generation:s.generation+1})));
    const controls=el.getAnimations().filter(a=>a.playState==='running').length;el.remove();return{frame,calls,controls,state:q.getSnapshot().dealerState};
  });
  expect(result).toEqual({frame:'1',calls:1,controls:0,state:'WAITING_PLAYER'});
});
