import { chromium, expect, test } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { resolveGitDir } from '../../../scripts/git-directory.mjs';

type Observation = { start: number | null; end: number | null; targets: string[] };
type Sample = { sample: number; width: number; dealMs: number; targets: string[]; cards: number; overflow: boolean; overlays: number };
test.use({ reducedMotion: 'no-preference' });
for (const width of [1280,320]) test(`[M14-P-${width}] fixed ten fresh native six-card FULL_MOTION samples <=2500ms`, async ({ baseURL }) => {
  test.setTimeout(120000);
  const directory=join(resolveGitDir(),'overnight/m14-performance');mkdirSync(directory,{recursive:true});
  const file=`${directory}/${Date.now()}-${process.pid}-${width}.json`,samples:Sample[]=[];
  function save() {
    const sorted=samples.map(sample=>sample.dealMs).sort((a,b)=>a-b),middle=sorted.length/2;
    writeFileSync(file,JSON.stringify({width,thresholdMs:2500,requiredSamples:10,retries:0,freshBrowserPerSample:true,samples,
      medianMs:sorted.length?(sorted[Math.floor(middle)]!+sorted[Math.ceil(middle)-1]!)/2:null,worstMs:sorted.at(-1)??null,
      firstFailure:samples.find(sample=>sample.dealMs>2500||sample.cards!==6||sample.overflow||sample.overlays!==0)??null},null,2)+'\n');
  }
  save();
  for(let index=0;index<10;index++){
    const browser=await chromium.launch({channel:'chromium',headless:true});
    try{
      const context=await browser.newContext({baseURL,reducedMotion:'no-preference',viewport:{width,height:1500}}),page=await context.newPage();
      await page.goto('/baccarat?baccaratFixture=both-third');await expect(page.getByRole('button',{name:'Place Bet · Player'})).toBeVisible();
      await page.getByRole('button',{name:'Place Bet · Player'}).click();
      await page.evaluate(()=>{
        const observation:Observation={start:null,end:null,targets:[]};
        (window as unknown as{baccaratPerformance:Observation}).baccaratPerformance=observation;
        const root=document.querySelector<HTMLElement>('[data-game="baccarat"]')!;
        new MutationObserver(records=>{
          for(const record of records)for(const node of record.addedNodes)if(node instanceof HTMLElement&&node.dataset.dealTarget){
            observation.start??=performance.now();observation.targets.push(node.dataset.dealTarget.split('/').at(-1)!);
          }
          if(observation.start!==null&&observation.end===null&&root.dataset.cardsRunning==='false')observation.end=performance.now();
        }).observe(document.body,{childList:true,attributes:true,attributeFilter:['data-cards-running'],subtree:true});
      });
      await page.getByRole('button',{name:'Deal',exact:true}).click();
      await expect(page.locator('[data-game="baccarat"]')).toHaveAttribute('data-presentation-running','false');
      const sample=await page.evaluate(({sample,width})=>{
        const value=(window as unknown as{baccaratPerformance:Observation}).baccaratPerformance;
        if(value.start===null||value.end===null)throw Error('Native first-flight/card-settlement measurement missing');
        return{sample,width,dealMs:value.end-value.start,targets:value.targets,cards:document.querySelectorAll('.baccarat-hand-cards [role="img"]').length,
          overflow:document.documentElement.scrollWidth>innerWidth,overlays:document.querySelectorAll('[data-initial-deal-flight],[data-action-card-flight],[data-wager-flight]').length};
      },{sample:index+1,width});samples.push(sample);save();
    }finally{await browser.close();}
  }
  expect(samples).toHaveLength(10);
  for(const sample of samples){expect(sample.targets).toEqual(['player:0','banker:0','player:1','banker:1','player:2','banker:2']);expect(sample.cards).toBe(6);expect(sample.overlays).toBe(0);expect(sample.overflow).toBe(false);expect(sample.dealMs).toBeLessThanOrEqual(2500);}
});
