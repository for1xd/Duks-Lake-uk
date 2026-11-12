// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: sheet

/* ---------- sheet ---------- */

function sheetDrag(sh,bg){if(!IS_TOUCH)return;let y0=null,dy=0,act=false,raf=0;
  const paint=()=>{raf=0;const d=dy<0?0:dy;sh.style.transform='translate3d(0,'+d.toFixed(1)+'px,0)';bg.style.backgroundColor='rgba(6,20,24,'+(0.45*Math.max(.15,1-d/500)).toFixed(3)+')';};
  sh.addEventListener('touchstart',e=>{if(e.touches.length!==1)return;const onGrab=e.target.closest('.sheet-grab');if(!onGrab&&sh.scrollTop>2){y0=null;return;}
    y0=e.touches[0].clientY;dy=0;act=false;},{passive:true});
  sh.addEventListener('touchmove',e=>{if(y0==null)return;const d=e.touches[0].clientY-y0;
    if(!act){if(d>6&&sh.scrollTop<=2){act=true;sh.style.transition='none';bg.style.transition='none';}else if(d<-4){y0=null;return;}else return;}
    e.preventDefault();dy=d<0?0:d*(d>160?.85:1);if(!raf)raf=requestAnimationFrame(paint);},{passive:false});
  const end=()=>{if(y0==null)return;y0=null;if(!act)return;act=false;cancelAnimationFrame(raf);raf=0;
    if(dy>110){sh.style.transition='transform .22s cubic-bezier(.4,0,1,1)';sh.style.transform='translate3d(0,110%,0)';bg.style.transition='background-color .22s';bg.style.backgroundColor='rgba(6,20,24,0)';setTimeout(closeSheet,200);}
    else{sh.style.transition='transform .35s cubic-bezier(.2,1,.3,1)';sh.style.transform='';bg.style.transition='background-color .3s';bg.style.backgroundColor='';}};
  sh.addEventListener('touchend',end);sh.addEventListener('touchcancel',end);}
document.addEventListener('wheel',e=>{const sc=document.getElementById('scroller');if(!sc||e.ctrlKey)return;const t=e.target;if(!t||!t.closest)return;
  if(sc.contains(t)||t.closest('.sheet,.sheet-bg,.fx-pop,.pk-3d,canvas,nav.tabs .in,.chataside,#onlPop,.mpop'))return;sc.scrollBy({top:e.deltaY,left:0});},{passive:true});
function fancySel(root){(root||document).querySelectorAll('select:not([data-fx])').forEach(sel=>{if(sel.closest('.pk-3d'))return;sel.dataset.fx='1';
  const btn=el('button',{type:'button',class:'fx-btn'+(sel.classList.contains('dz-bsel')?' sm':'')+(sel.classList.contains('on')?' on':''),'aria-haspopup':'listbox'});
  const lab=()=>{const o=sel.options[sel.selectedIndex];btn.replaceChildren(el('span',{text:o?o.text:''}),svg('<path d="m6 9 6 6 6-6"/>'));};lab();
  sel.classList.add('fx-hidden');sel.after(btn);sel.addEventListener('change',lab);
  btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const old=document.getElementById('fxPop');if(old){const same=old._b===btn;old.remove();if(same)return;}
    const r=btn.getBoundingClientRect();const pop=el('div',{id:'fxPop',class:'fx-pop',role:'listbox'});pop._b=btn;
    [...sel.options].forEach((o,i)=>pop.append(el('button',{type:'button',class:'fx-o'+(i===sel.selectedIndex?' on':''),role:'option',onclick:ev=>{ev.stopPropagation();sel.selectedIndex=i;sel.dispatchEvent(new Event('change',{bubbles:true}));close();}},el('span',{text:o.text}),i===sel.selectedIndex?svg('<path d="m5 12 5 5 9-10"/>'):null)));
    document.body.append(pop);const w=Math.max(r.width,280);const below=innerHeight-r.bottom-12,above=r.top-12;const up=below<240&&above>below;const mh=Math.min(360,up?above:below);
    pop.style.cssText='left:'+Math.min(innerWidth-w-8,Math.max(8,r.left))+'px;width:'+w+'px;max-height:'+mh+'px;'+(up?'bottom:'+(innerHeight-r.top+6)+'px;transform-origin:bottom center':'top:'+(r.bottom+6)+'px;transform-origin:top center');
    requestAnimationFrame(()=>pop.classList.add('in'));const cur=pop.querySelector('.on');if(cur)cur.scrollIntoView({block:'nearest'});btn.classList.add('open');
    const close=()=>{pop.classList.remove('in');btn.classList.remove('open');setTimeout(()=>pop.remove(),160);document.removeEventListener('pointerdown',out,true);removeEventListener('scroll',close,true);};
    const out=ev=>{if(!pop.contains(ev.target)&&ev.target!==btn&&!btn.contains(ev.target))close();};setTimeout(()=>{document.addEventListener('pointerdown',out,true);addEventListener('scroll',ev=>{if(!pop.contains(ev.target))close();},{capture:true,once:true});},0);});});}
function openSheet(...kids){document.body.classList.add('sheet-open');
  const sh=el('div',{class:'sheet',role:'dialog','aria-modal':'true'},el('div',{class:'sheet-grab','aria-hidden':'true'}),...kids);
  const bg=el('div',{class:'sheet-bg',onclick:e=>{if(e.target===bg)closeSheet();}},sh);
  document.getElementById('sheetRoot').replaceChildren(bg);sheetDrag(sh,bg);fancySel(sh);
  document.addEventListener('keydown',escClose);
}
function escClose(e){if(e.key==='Escape')closeSheet();}
function closeSheet(){document.body.classList.remove('sheet-open');document.getElementById('sheetRoot').replaceChildren();document.removeEventListener('keydown',escClose);}
function confirmSheet(q,label,fn){openSheet(el('h2',{text:q}),el('div',{class:'row'},el('button',{class:'btn danger',type:'button',style:'flex:1',onclick:()=>{closeSheet();fn();}},label),el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати')));}

boot().catch(e=>{console.warn(e);window.DLS&&DLS.fail('Не вдалося запустити застосунок','Перевірте інтернет і спробуйте ще раз.');});
/* })(); — кінець обгортки застосунку */

/* auto-height for every textarea (chat composer has its own) */
function autoTA(t){if(!t||t.id==='chatText'||t.tagName!=='TEXTAREA')return;const max=Math.round(innerHeight*0.45);t.style.height='auto';const h=t.scrollHeight+2;t.style.height=Math.min(h,max)+'px';t.classList.toggle('ta-max',h>max);}
document.addEventListener('input',e=>{if(e.target&&e.target.tagName==='TEXTAREA')autoTA(e.target);},true);
new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){if(n.nodeType!==1)continue;if(n.tagName==='TEXTAREA')requestAnimationFrame(()=>autoTA(n));else if(n.querySelectorAll)n.querySelectorAll('textarea').forEach(t=>requestAnimationFrame(()=>autoTA(t)));}}).observe(document.documentElement,{childList:true,subtree:true});
/* bottom padding = exactly the floating nav + a little air */
function fitPad(){const n=document.querySelector('nav.tabs');if(!n)return;const wide=matchMedia('(min-width:900px)').matches;let pb=28;
  if(!wide){const r=n.getBoundingClientRect();if(r.height&&r.top>innerHeight/2)pb=Math.round(innerHeight-r.top+16);}
  document.documentElement.style.setProperty('--pb',pb+'px');}
addEventListener('resize',fitPad);setTimeout(fitPad,50);setTimeout(fitPad,600);
