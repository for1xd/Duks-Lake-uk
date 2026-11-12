// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: shell

/* ---------- shell ---------- */
function fitTitle(){const h=document.getElementById('pageTitle');if(!h)return;h.style.removeProperty('font-size');let fs=parseFloat(getComputedStyle(h).fontSize)||24;let n=0;while(h.scrollWidth>h.clientWidth+1&&fs>13&&n<30){fs-=1;h.style.setProperty('font-size',fs+'px','important');n++;}}
addEventListener('resize',()=>requestAnimationFrame(fitTitle));
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>fitTitle());[300,900,2000].forEach(t=>setTimeout(fitTitle,t));
if(document.fonts&&document.fonts.addEventListener)document.fonts.addEventListener('loadingdone',()=>fitTitle());

function hwDeco(){let d=document.getElementById('hwDeco');const on=document.documentElement.classList.contains('hw');
  if(!on){if(d)d.remove();const b=document.getElementById('hwBats');if(b)b.remove();return;}if(d)return;
  const web=cls=>el('span',{class:'hwd-web '+cls},artSvg(`<g fill="none" stroke="currentColor" stroke-width=".9" stroke-linecap="round"><path d="M0 0L60 60M0 0L30 64M0 0L64 30M0 0L12 66M0 0L66 12"/><path d="M14 0Q16 14 0 14M28 0Q31 27 0 28M44 0Q48 44 0 44M60 0Q64 60 0 60"/></g>`,'0 0 66 66'));
  const spider=el('span',{class:'hwd-spider'},el('i',{class:'thread'}),artSvg(`<g fill="#1A1024"><ellipse cx="20" cy="22" rx="7" ry="8"/><circle cx="20" cy="12" r="4.6"/></g><g stroke="#1A1024" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M14 18 5 12 2 16M14 22 3 22 1 27M14 26 5 31 4 36M26 18l9-6 3 4M26 22h11l2 5M26 26l9 5 1 5"/></g><circle cx="18.3" cy="11.4" r="1.1" fill="#FFD166"/><circle cx="21.7" cy="11.4" r="1.1" fill="#FFD166"/>`,'0 0 40 40'));
  const bat=c=>el('span',{class:'hwd-bat '+c},svg('<path d="M12 8c-1.2-1.6-3-1.4-3.6.2-1-1.6-3.5-2-5.4-.8 1.6.7 2.4 2.3 2.2 3.8 1.3-.9 2.9-.7 3.6.5.4-1 1.4-1.4 2.2-1.2l1 1.5 1-1.5c.8-.2 1.8.2 2.2 1.2.7-1.2 2.3-1.4 3.6-.5-.2-1.5.6-3.1 2.2-3.8-1.9-1.2-4.4-.8-5.4.8C15 6.6 13.2 6.4 12 8z" fill="currentColor" stroke="none"/>'));
  d=el('div',{id:'hwDeco','aria-hidden':'true'},web('tl'),web('tr'),spider,el('span',{class:'hwd-fog'}));document.body.prepend(d);document.body.append(el('div',{id:'hwBats','aria-hidden':'true'},bat('a'),bat('b'),bat('c')));}

const MON_N=['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня'];
function pageSubText(){const m=myStaff();const t=S.tab;const today=ymd(new Date());
  if(t==='today')return 'Огляд дня';
  if(t==='schedule')return 'Тиждень '+dm(S.weekStart)+' – '+dm(addDays(S.weekStart,6));
  if(t==='meet')return 'Облік, SOS і планове ТО · звіт у PDF';
  if(t==='pm'){const u=pmUrgent().length,s10=pmSoon().length;return u?u+' ТО потребують уваги':s10?s10+' ТО найближчі 10 днів':'Графік обслуговування систем';}
  if(t==='sos'){const o=(S.sos||[]).filter(x=>x.status!=='done').length;return o?o+' відкритих ситуацій':'Відкритих ситуацій немає';}
  if(t==='map')return 'Зони території · '+mzAll().filter(mzTaskable).length+' зон';
  if(t==='tasks'){const n=S.tasks.filter(x=>!isDone(x)).length;const k=n%10,h=n%100;return n?n+(k===1&&h!==11?' відкрита задача':(k>=2&&k<=4&&(h<12||h>14)?' відкриті задачі':' відкритих задач')):'Усі задачі виконано';}
  if(t==='chat'){if(S.room&&!WIDE2.matches)return roomMeta(S.room).desc||'';const n=sortedStaff().filter(x=>x.userId&&isOnline(x.id)).length;return myRooms().length+' чатів · '+n+' у мережі';}
  if(t==='team')return S.staff.length+' людей у колективі';
  if(t==='shift')return earns(m)?'Відмітки з фото та години':'Контроль виходу на зміни';
  if(t==='fun')return 'Міні-ігри та рейтинги';
  if(t==='uk')return S.ukSec?'Облік · '+UKS[S.ukSec].name:'Facility відділ';
  if(t==='support')return isDev()?'Запити від колективу':'Помилки й пропозиції';
  if(t==='profile')return 'Ваші дані та налаштування';
  return '';}
function onlinePop(anchor){const old=document.getElementById('onlPop');if(old){old.remove();return;}
  const all=S.staff.filter(x=>x.userId);const onl=all.filter(x=>isOnline(x.id));const off=all.filter(x=>!isOnline(x.id)).sort((a,b)=>(((S.pres[b.id]||{}).at||0)-((S.pres[a.id]||{}).at||0)));
  const row=x=>el('button',{type:'button',class:'op-r',onclick:()=>{pop.remove();openPerson(x.id);}},avatarP(x),el('span',{class:'op-t'},el('b',{text:x.name}),el('small',{class:isOnline(x.id)?'online':'',text:seenText(x.id)})),
    myStaff()&&x.id!==myStaff().id?el('span',{class:'op-dm',title:'Написати',onclick:e=>{e.stopPropagation();pop.remove();go('chat');openRoom(dmId(myStaff().id,x.id));}},svg('<path d="M4 5h16v11H9l-5 4z"/>')):null);
  const pop=el('div',{id:'onlPop',class:'onl-pop'},el('span',{class:'t-lbl',text:'У мережі · '+onl.length}),onl.length?onl.map(row):el('span',{class:'muted small',style:'padding:4px 8px',text:'Зараз нікого'}),off.length?el('span',{class:'t-lbl',text:'Не в мережі · '+off.length}):null,off.map(row));
  document.body.append(pop);const r=anchor.getBoundingClientRect();pop.style.top=(r.bottom+8)+'px';pop.style.left=Math.max(8,Math.min(innerWidth-pop.offsetWidth-8,r.left+r.width/2-pop.offsetWidth/2))+'px';
  setTimeout(()=>document.addEventListener('pointerdown',function h(e){if(!pop.contains(e.target)&&!anchor.contains(e.target)){pop.remove();document.removeEventListener('pointerdown',h,true);}},true),0);}
function renderHdrInfo(){const box=document.getElementById('hdrInfo');const sub=document.getElementById('pageSub');if(!box)return;
  if(sub)sub.textContent=pageSubText();
  if(!WIDE.matches||!S.db){box.replaceChildren();return;}
  const d=new Date();const tIdx=todayIdx();const thisWk=S.weekStart===mondayOf(d)&&S.week;
  const onl=sortedStaff().filter(x=>x.userId&&isOnline(x.id));
  const onShift=thisWk?sortedStaff().filter(s=>isWorking(dayValue(s.id,tIdx))).length:null;
  const myT=myStaff()?S.tasks.filter(t=>myOpen(t,myStaff())).length:0;
  box.replaceChildren(...[
    el('span',{class:'hi-chip clock'},svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),el('span',{},el('b',{text:pad(d.getHours())+':'+pad(d.getMinutes())}),' '+DS[tIdx].toLowerCase()+', '+d.getDate()+' '+MON_N[d.getMonth()])),
    el('button',{type:'button',class:'hi-chip',onclick:e=>onlinePop(e.currentTarget),title:onl.map(x=>x.name).join(', ')},el('span',{class:'hi-avs'},onl.slice(0,3).map(x=>avatar(x))),el('span',{},el('b',{text:String(onl.length)}),' у мережі')),
    onShift!=null?el('button',{type:'button',class:'hi-chip',onclick:()=>go('schedule')},svg('<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/>'),el('span',{},el('b',{text:String(onShift)}),' на зміні')):null,
    el('button',{type:'button',class:'hi-chip'+(myT?' hot':''),onclick:()=>go('tasks')},svg('<path d="m4 12 4 4 12-12"/>'),el('span',{},el('b',{text:String(myT)}),' мої задачі')),
    inspCanReview()&&(inspPending()+clPending())?el('button',{type:'button',class:'hi-chip hot',onclick:()=>{if(!inspPending()){if(S.tab!=='uk')go('uk');S.fg='clean';S.ukSec=null;S.clTab='revs';S.clF={per:'all',st:'submitted'};S.clR=null;S.clW=null;render();return;}S.inspTab='feed';S.inspF={per:'all',s:'submitted'};if(S.tab!=='uk')go('uk');S.fg='insp';S.ukSec=null;S.inspR=null;S.inspW=null;render();}},svg('<path d="M9 4h6v3H9z"/><path d="M15 5.5h2a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2h2"/><path d="m9 13 2 2 4-4"/>'),el('span',{},el('b',{text:String(inspPending()+clPending())}),' на перевірці')):null].filter(Boolean));}
setInterval(()=>{if(WIDE.matches)renderHdrInfo();},30000);
function render(){{const fe=document.fullscreenElement||document.webkitFullscreenElement;if(fe&&fe.classList&&fe.classList.contains('pk-3d')){S._pendRender=true;return;}}if(typeof dzTipOff==='function')dzTipOff();hwDeco();setTimeout(()=>{renderHdrInfo();tgHead();fitTitle();fancySel(document.getElementById('app'));},0);document.body.dataset.tab=S.tab;if(S.tab!=='map')document.body.classList.remove('mz-lock');setTimeout(fitPad,0);setTimeout(chatFade,0);setTimeout(chatFade,300);requestAnimationFrame(fitTitle);setTimeout(fitTitle,250);updBar();
  asBar();if(!S.db)return;
  renderTabs();renderMe();if(S.loaded&&S.loaded.staff)welcomeMaybe();
  const td=TABS.find(t=>t.id===S.tab);document.getElementById('pageTitle').textContent=(S.tab==='uk'&&S.wObjSel&&S.ukSec==='water')?((S.wObj.find(o=>o.id===S.wObjSel)||{}).name||'Об’єкт'):(S.tab==='uk'&&S.ukSec)?(WIDE.matches?UKS[S.ukSec].name:UKS[S.ukSec].short):(S.tab==='uk'&&S.fg==='arch'&&S.arB)?arTitle():(S.tab==='uk'&&S.fg)?(FG.find(g=>g.id===S.fg)||{}).name:(S.tab==='chat'&&S.room&&!WIDE2.matches)?roomMeta(S.room).name:td?tabName(td):(S.tab==='ticket'?'Запит':((staffById(S.viewSid)||{}).name||'Профіль'));
  const app=document.getElementById('app');
  if(!S.loaded.staff){return;}
  const view={uk:viewUK,fun:viewFun,shift:viewShift,today:viewToday,schedule:viewSchedule,map:mapView,sos:viewSos,pm:viewPm,meet:viewMeet,tasks:viewTasks,team:viewTeam,chat:viewChat,profile:viewProfile,person:viewPerson,support:viewSupport,ticket:viewTicket}[S.tab]();
  let arr=[].concat(view).filter(Boolean);
  if(WIDE2.matches&&['today','profile','person'].includes(S.tab)){const i=arr.findIndex(n=>n&&n.classList&&n.classList.contains('split'));
    if(i>0)arr=[el('div',{class:'cols2'},el('div',{class:'stack colA'},...arr.slice(0,i)),el('div',{class:'stack colB'},...arr.slice(i)))];}
  const ae=document.activeElement;const fk=ae&&ae.dataset&&ae.dataset.k;const fv=fk?ae.value:null;
  app.replaceChildren(...arr);
  if(fk){const n=app.querySelector('[data-k="'+fk+'"]');if(n){n.value=fv;n.focus({preventScroll:true});}}
  const bb=document.getElementById('backBtn');bb.hidden=WIDE.matches?!(S.tab==='person'||S.tab==='ticket'||(S.tab==='uk'&&(S.ukSec||S.fg))||(S.tab==='chat'&&S.room&&!WIDE2.matches)):!(canBack()&&(S.hist.length>0||!BAR.includes(S.tab)||(S.tab==='chat'&&S.room)));bb.onclick=back;document.body.classList.toggle('hasback',!bb.hidden);
  const chatOn=S.tab==='chat'&&(!!S.room||WIDE2.matches);document.body.classList.toggle('chatmode',chatOn);
  document.getElementById('composer').hidden=!(chatOn&&myStaff());
  if(chatOn){markChatSeen();if(S.chatStick){const sm=!!S.chatShown&&S.shownRoom===curRoom();if(sm)requestAnimationFrame(()=>{const e=SC();e.scrollTo({top:e.scrollHeight,behavior:'smooth'});});else stickBottom();}S.chatShown=true;S.shownRoom=curRoom();}else{S.chatShown=false;S.knownMsgs=null;}
  drawFab();placeComposer();
}
function badgeFor(id){if(id==='pm')return pmCan()?pmUrgent().length:0;if(id==='sos')return (S.sos||[]).filter(x=>x.status!=='done'&&x.sev==='crit').length||0;const mine=myStaff();
  if(id==='tasks'){const n=mine?S.tasks.filter(t=>myOpen(t,mine)).length:0;return n;}
  if(id==='team')return canAdmin()?S.requests.length:0;
  if(id==='chat')return unreadChat();
  if(id==='fun')return psMyPending();
  if(id==='uk')return inspBadge()+clBadge();
  if(id==='support')return tkBadge();
  return 0;}
function SC(){return document.getElementById('scroller');}
function stickBottom(){const e=SC();if(!e)return;const t0=performance.now();let user=false;const stopU=()=>{user=true;};e.addEventListener('wheel',stopU,{passive:true,once:true});e.addEventListener('touchstart',stopU,{passive:true,once:true});
  e.scrollTop=e.scrollHeight;const loop=()=>{if(user||performance.now()-t0>900||S.tab!=='chat')return;e.scrollTop=e.scrollHeight;S.chatStick=true;requestAnimationFrame(loop);};requestAnimationFrame(loop);}
function placeInd(){const nav=document.querySelector('nav.tabs');if(!nav)return;let ind=nav.querySelector('.tab-ind');
  if(!ind){ind=el('span',{class:'tab-ind','aria-hidden':'true'});nav.prepend(ind);}
  const a=nav.querySelector('.in button.nb[aria-current="page"]');if(!a){ind.style.opacity='0';return;}
  const nr=nav.getBoundingClientRect(),r=a.getBoundingClientRect();
  const inn=a.closest('.in');const ir=inn?inn.getBoundingClientRect():nr;const ct=Math.max(0,ir.top-r.top),cb=Math.max(0,r.bottom-ir.bottom);if(ct+cb>=r.height){ind.style.opacity='0';return;}ind.style.clipPath=(ct||cb)?'inset('+ct+'px 0 '+cb+'px 0 round 16px)':'none';
  ind.style.opacity='1';ind.style.left=(r.left-nr.left)+'px';ind.style.top=(r.top-nr.top)+'px';ind.style.width=r.width+'px';ind.style.height=r.height+'px';}
window.addEventListener('resize',()=>requestAnimationFrame(placeInd));
document.addEventListener('scroll',e=>{const t=e.target;if(!t||!t.closest||!t.closest('nav.tabs'))return;const nav=t.closest('nav.tabs');nav.classList.add('ind-scroll');placeInd();clearTimeout(nav._st);nav._st=setTimeout(()=>nav.classList.remove('ind-scroll'),160);},true);
function fitChatPad(){const c=document.getElementById('composer');const sc=SC();if(!c||!sc)return;
  if(c.hidden||S.tab!=='chat'){document.documentElement.style.removeProperty('--cpb');return;}
  const r=c.getBoundingClientRect();const vh=window.visualViewport?visualViewport.height:innerHeight;
  const stick=sc.scrollTop+sc.clientHeight>=sc.scrollHeight-40;
  document.documentElement.style.setProperty('--cpb',Math.max(60,Math.round(vh-r.top+10))+'px');
  if(stick)sc.scrollTop=sc.scrollHeight;}
if(window.visualViewport)visualViewport.addEventListener('resize',()=>setTimeout(fitChatPad,60));
document.addEventListener('load',e=>{if(e.target&&e.target.tagName==='IMG'&&S.tab==='chat'&&S.chatStick){const sc=SC();if(sc)sc.scrollTop=sc.scrollHeight;}},true);
addEventListener('resize',()=>setTimeout(fitChatPad,60));
if(window.ResizeObserver){const _ro=new ResizeObserver(()=>fitChatPad());setTimeout(()=>{const c=document.getElementById('composer');if(c)_ro.observe(c);},0);}
function placeAside(){const a=document.querySelector('.chataside'),g=document.querySelector('.chatgrid');if(!a||!g)return;const r=g.getBoundingClientRect();a.style.left=(r.right-a.offsetWidth)+'px';}
addEventListener('resize',()=>requestAnimationFrame(placeAside));
function placeComposer(){setTimeout(fitChatPad,0);requestAnimationFrame(placeAside);const c=document.getElementById('composer');if(!c)return;const col=document.querySelector('.chatcol');
  if(WIDE.matches&&S.tab==='chat'&&col){const r=col.getBoundingClientRect();c.style.setProperty('left',r.left+'px','important');c.style.setProperty('width',r.width+'px','important');c.style.setProperty('right','auto','important');
    const fb=document.getElementById('toBottom');if(fb){fb.style.left=(r.right-62)+'px';fb.style.right='auto';}}
  else{c.style.removeProperty('left');c.style.removeProperty('width');c.style.removeProperty('right');const fb=document.getElementById('toBottom');if(fb){fb.style.left='';fb.style.right='';}}}
window.addEventListener('resize',()=>requestAnimationFrame(placeComposer));
function drawFab(){const b=document.getElementById('toBottom');if(!b)return;const show=S.tab==='chat'&&!S.chatStick;b.hidden=!show;
  b.replaceChildren(...[svg('<path d="M12 5v14M6 13l6 6 6-6"/>'),S.belowNew?el('span',{class:'badge',text:String(S.belowNew)}):null].filter(Boolean));}
function snap(){return {tab:S.tab,sid:S.viewSid,tk:S.viewTicket,room:S.room,uk:S.ukSec,wo:S.wObjSel,fg:S.fg,ab:S.arB,af:S.arF,at:S.arT,iw:S.inspW,ir:S.inspR,ia:S.inspA};}
function animIn(dir){const a=document.getElementById('app');a.style.transition='';a.style.transform='';a.style.opacity='';a.classList.remove('enter-l','enter-r');void a.offsetWidth;a.classList.add(dir>0?'enter-r':'enter-l');
  const t=document.getElementById('pageTitle');t.classList.remove('tfade');void t.offsetWidth;t.classList.add('tfade');}
function go(id,opt){if(id==='uk'&&S.tab==='uk'&&(S.ukSec||S.fg)){closeMenu();S.hist=S.hist.filter(h=>h.tab!=='uk');S.ukSec=null;S.wObjSel=null;S.fg=null;S.arB=null;S.inspW=null;S.inspR=null;S.inspA=false;S.inspDone=null;SC().scrollTop=0;render();animIn(-1);return;}
  if(id==='chat'&&S.tab==='chat'&&S.room&&!WIDE2.matches){closeMenu();S.hist=S.hist.filter(h=>h.tab!=='chat');S.room=null;SC().scrollTop=0;render();animIn(-1);return;}
  if(id===S.tab){closeMenu();SC().scrollTo({top:0,behavior:'smooth'});return;}if(id==='chat')S.room=null;if(id==='uk'){S.ukSec=null;S.wObjSel=null;}
  const order=TABS.map(t=>t.id);const dir=(S.tab==='person'||S.tab==='ticket')?-1:(order.indexOf(id)>order.indexOf(S.tab)?1:-1);
  const rootSwitch=BAR.includes(id)&&id!=='chat'&&(BAR.includes(S.tab)&&S.tab!=='chat');
  if(rootSwitch)S.hist=[];else S.hist.push(snap());
  if(S.hist.length>30)S.hist.shift();
  S.tab=id;S.chatStick=true;try{localStorage.setItem('dl.tab',id);}catch(e){}closeMenu();SC().scrollTop=0;render();animIn(dir);}
function canBack(){if(S.tab==='chat'&&S.room&&!WIDE2.matches)return true;return S.hist.length>0||!(BAR.includes(S.tab)&&S.tab!=='chat');}
function back(){closeMenu();const p=S.hist.pop();
  if(p){S.tab=p.tab;S.viewSid=p.sid;S.viewTicket=p.tk;S.room=p.room||null;S.ukSec=p.uk||null;S.wObjSel=p.wo||null;S.fg=p.fg||null;S.arB=p.ab||null;S.arF=p.af==null?null:p.af;S.arT=p.at||'fl';S.arHi=null;S.inspW=p.iw||null;S.inspR=p.ir||null;S.inspA=p.ia||false;S.inspAD=null;S.inspDone=null;}else if(S.tab==='chat'&&S.room){S.room=null;}else{S.tab='today';}
  S.chatStick=true;try{if(TABS.some(t=>t.id===S.tab))localStorage.setItem('dl.tab',S.tab);}catch(e){}SC().scrollTop=0;render();animIn(-1);}
function initEdgeSwipe(){let st=null,raf=0;const app=()=>document.getElementById('app');
  const ind=el('div',{class:'edge-ind','aria-hidden':'true'},svg('<path d="M15 5l-7 7 7 7"/>'));document.body.append(ind);
  const TH=72;const rub=dx=>{const W=innerWidth,soft=Math.min(150,W*.36),max=Math.min(220,W*.5);return dx<=soft?dx:soft+(max-soft)*(1-Math.exp(-(dx-soft)/(max-soft)));};
  const paint=()=>{raf=0;if(!st)return;const d=rub(st.dx);const a=app();a.style.transform='translate3d('+d.toFixed(1)+'px,0,0)';
    const k=Math.min(1,st.dx/TH);ind.style.opacity=String(k);ind.style.transform='translate3d('+(-48+k*62).toFixed(1)+'px,-50%,0) scale('+(.6+.4*k).toFixed(3)+')';
    const ready=st.dx>TH;if(ready!==st.ready){st.ready=ready;ind.classList.toggle('ready',ready);if(ready&&navigator.vibrate)try{navigator.vibrate(8);}catch(_){}}};
  document.addEventListener('touchstart',e=>{if(e.touches.length!==1||!canBack())return;if(document.getElementById('sheetRoot').children.length||document.getElementById('mpopRoot'))return;
    const t=e.touches[0];if(t.clientX>28)return;st={x:t.clientX,y:t.clientY,dx:0,lock:null,ready:false};},{passive:true});
  document.addEventListener('touchmove',e=>{if(!st)return;const t=e.touches[0];const x=t.clientX-st.x,y=t.clientY-st.y;
    if(st.lock===null){if(Math.abs(x)<8&&Math.abs(y)<8)return;st.lock=(x>0&&Math.abs(x)>Math.abs(y)*1.3)?'x':'y';if(st.lock==='x'){const a=app();a.style.transition='none';a.style.willChange='transform';ind.style.transition='none';}}
    if(st.lock!=='x'){st=null;return;}
    st.dx=Math.max(0,x);if(!raf)raf=requestAnimationFrame(paint);},{passive:true});
  const end=()=>{if(!st)return;const go2=st.lock==='x'&&st.dx>TH;const a=app();st=null;cancelAnimationFrame(raf);raf=0;
    ind.style.transition='opacity .2s, transform .3s cubic-bezier(.2,.9,.25,1)';ind.style.opacity='0';ind.style.transform='translate3d(-40px,-50%,0) scale(.6)';ind.classList.remove('ready');
    if(go2){a.style.transition='';a.style.transform='';a.style.willChange='';back();}
    else{a.style.transition='transform .42s cubic-bezier(.2,.9,.25,1)';a.style.transform='';setTimeout(()=>{a.style.willChange='';},450);}};
  document.addEventListener('touchend',end);document.addEventListener('touchcancel',end);}
