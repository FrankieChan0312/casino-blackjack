import { animate } from 'motion/mini';
import type { AnchorRegistry } from '../presentation/anchors.js';
import { wagerFlight, type WagerEvent } from '../presentation/wagers.js';
import { MOTION_TOKENS } from '../presentation/motionTokens.js';
import type { VisualStep } from '../presentation/timeline.js';
import { credits, resultLabel } from './presentation.js';

export function playWagerMotion(event:WagerEvent,anchors:AnchorRegistry,arrive:()=>void):VisualStep|void {
  const flight=wagerFlight(event),fallback=anchors.measure(`wager:${event.seat}`)??anchors.measure(`seat-${event.seat}`);
  const source=anchors.measure(flight.from)??fallback,target=anchors.measure(flight.to)??fallback;
  if(!source||!target||flight.amount<=0){arrive();return;}
  const layer=document.createElement('div'),stack=document.createElement('span');
  layer.dataset.wagerFlight=event.id;layer.dataset.wagerStage=event.type;layer.dataset.wagerKind=event.kind;
  layer.dataset.wagerSeat=String(event.seat);layer.dataset.wagerAmount=String(flight.amount);layer.dataset.wagerDestination=flight.to;
  if(event.type==='SETTLE_RESULT')layer.dataset.wagerOutcome=event.outcome;
  layer.setAttribute('aria-hidden','true');
  Object.assign(layer.style,{position:'absolute',inset:'0',height:`${document.documentElement.scrollHeight}px`,overflow:'clip',pointerEvents:'none',zIndex:'100'});
  const x=target.left+target.width/2+scrollX,y=target.top+target.height/2+scrollY;
  Object.assign(stack.style,{position:'absolute',left:`${x}px`,top:`${y}px`,display:'flex',alignItems:'center',gap:'5px',transform:'translate(-50%, -50%)',fontSize:'12px',fontWeight:'700',whiteSpace:'nowrap',color:'#fff1bd'});
  const discs=document.createElement('span');Object.assign(discs.style,{display:'inline-block',width:'28px',height:'24px',borderRadius:'50%',background:'#23564b',border:'3px dashed #d3b56d',boxShadow:'0 4px 0 #b79a54, 0 7px 8px #0008'});
  const label=document.createElement('span');label.textContent=`${event.type==='SETTLE_RESULT'?resultLabel(event.outcome):event.kind.replaceAll('_',' ')} · ${credits(flight.amount)} credits`;
  Object.assign(label.style,{background:'#15392eee',borderRadius:'4px',padding:'3px 5px'});stack.append(discs,label);layer.append(stack);document.body.append(layer);
  const transform=`translate(calc(-50% + ${source.left+source.width/2+scrollX-x}px), calc(-50% + ${source.top+source.height/2+scrollY-y}px))`;
  const controls=animate(stack,{transform:[transform,'translate(-50%, -50%)']},{duration:MOTION_TOKENS.wager,ease:[...MOTION_TOKENS.arrivalEase]});
  let settled=false;
  return {finished:new Promise<void>((resolve,reject)=>controls.then(resolve,reject)),cancel(){controls.cancel();layer.remove();},settle(){layer.remove();if(!settled){settled=true;arrive();}}};
}
