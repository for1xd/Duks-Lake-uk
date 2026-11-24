// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Покер: інтерфейс і синхронізація

/* ---------- Покер: інтерфейс і синхронізація ---------- */
const PK_DAILY=1000,PK_COIN='🪙';
const PK_PRESETS=[{id:'micro',name:'Мікро',sb:1,bb:2,buy:100,d:'для розминки'},{id:'std',name:'Звичайний',sb:2,bb:5,buy:250,d:'основний стіл'},{id:'high',name:'Хайролер',sb:10,bb:20,buy:1000,d:'великі банки'}];
function canPoker(){return !!myStaff()||isDev();}
function pkCoins(v){return (Math.round(v||0)).toLocaleString('uk-UA');}
function pkWal(sid){return (S.wal||{})[sid]||{bal:0};}
function pkTables(){return (S.pkT||[]).slice().sort((a,b)=>(a.created||0)-(b.created||0));}
function pkMySeat(T){const m=myStaff();if(!m||!T||!T.seats)return -1;return T.seats.findIndex(s=>s&&s.sid===m.id);}
const pkSleep=ms=>new Promise(r=>setTimeout(r,ms));
async function pkMut(id,fn){const ref=S.db.doc('poker/'+id);const holder=(S.myId||'x')+':'+(pkMut.tab||(pkMut.tab=Math.random().toString(36).slice(2,8)));
  for(let k=0;k<8;k++){let ok=true;if(ref.acquire){try{const r=await ref.acquire({holder,ttlMs:4000});ok=r.acquired;}catch(e){ok=true;}}
    if(!ok){await pkSleep(250+Math.random()*350);continue;}
    const sn=await ref.get();if(!sn.exists)return false;const T=JSON.parse(JSON.stringify(sn.data()));if(fn(T,Date.now())===false)return false;T.upd=Date.now();await ref.set(T);return T;}
  toast('Стіл зайнятий, спробуйте ще раз');return false;}
async function pkClaimOwed(){const m=myStaff();if(!m||pkClaimOwed.busy)return;const tabs=pkTables().filter(T=>T.owed&&(T.owed[m.id]||[]).length);
  const empty=pkTables().filter(T=>!(T.seats||[]).some(Boolean)&&!(T.owed&&Object.values(T.owed).some(a=>a&&a.length))&&Date.now()-(T.upd||T.created||0)>60000);
  if(!tabs.length&&!empty.length)return;pkClaimOwed.busy=true;let got=0;
  try{for(const T of tabs){const es=T.owed[m.id].slice();const keys=es.map(e=>e.k);
      const add=await walMut(w=>{w.pkc=w.pkc||[];let a=0;es.forEach(e=>{if(!w.pkc.includes(e.k)){a+=e.a;w.pkc.push(e.k);}});w.pkc=w.pkc.slice(-80);if(!a)return false;w.bal=(w.bal||0)+a;return a;});
      if(add)got+=add;
      const r=await pkMut(T.id,X=>{if(!X.owed||!X.owed[m.id])return false;X.owed[m.id]=X.owed[m.id].filter(e=>!keys.includes(e.k));if(!X.owed[m.id].length)delete X.owed[m.id];});
      if(r&&!r.seats.some(Boolean)&&!Object.keys(r.owed||{}).length){try{await S.db.doc('poker/'+T.id).delete();}catch(e){}if(S.pkTab===T.id)S.pkTab=null;}}
    for(const T of empty){try{await S.db.doc('poker/'+T.id).delete();}catch(e){}}
  }catch(e){console.error(e);}finally{pkClaimOwed.busy=false;}
  if(got>0){try{SND.play('coin');}catch(e){}toast('Повернуто '+pkCoins(got)+' '+PK_COIN+' зі столу');render();}}
async function pkWalAdd(delta){const r=await walMut(w=>{if(delta<0&&(w.bal||0)+delta<0)return false;w.bal=(w.bal||0)+delta;});if(!r&&delta<0)toast('Недостатньо '+PK_COIN);return !!r;}
async function pkClaim(){if(pkClaim.busy)return;pkClaim.busy=true;const msgs=[];try{const today=ymd(new Date());const ok=await walMut(w=>{if(w.day===today)return false;w.bal=(w.bal||0)+PK_DAILY;w.day=today;w.got=(w.got||0)+1;w.xp=(w.xp||0)+20;psBump(w,'claim',1,msgs);});
  if(ok)SND.play('coin');toast(ok?'+'+pkCoins(PK_DAILY)+' '+PK_COIN+' і +20 XP'+(msgs.length?' · '+msgs[0]:''):'Сьогоднішній бонус уже отримано');render();}catch(e){toast('Не вдалося отримати бонус');}finally{pkClaim.busy=false;}}
async function pkCreate(pr){const id='t'+Date.now().toString(36);try{await S.db.doc('poker/'+id).set({pre:pr.id,name:pr.name,sb:pr.sb,bb:pr.bb,buy:pr.buy,seats:Array(PK_SEATS).fill(null),hand:null,created:Date.now(),by:S.myId||'',upd:Date.now()});toast('Стіл створено');}catch(e){toast('Не вдалося створити стіл');}}
async function pkDelete(T){if(T.seats.some(Boolean)){toast('Спершу всі мають встати з-за столу');return;}if(T.owed&&Object.values(T.owed).some(a=>a&&a.length)){toast('На столі ще є фішки, які не повернулися гравцям');return;}confirmSheet('Видалити стіл «'+T.name+'»?','Видалити',async()=>{try{await S.db.doc('poker/'+T.id).delete();if(S.pkTab===T.id)S.pkTab=null;render();}catch(e){toast('Не вдалося видалити');}});}
async function pkPlay(pr){const m=myStaff();if(!m)return;if(pkWal(m.id).bal<pr.buy){toast('Потрібно '+pkCoins(pr.buy)+' '+PK_COIN+' — заберіть щоденний бонус');return;}
  const mine=pkTables().find(t=>pkMySeat(t)>=0&&t.pre===pr.id);if(mine){S.pkTab=mine.id;render();return;}
  let T=pkTables().find(t=>t.pre===pr.id&&(t.seats||[]).some(x=>!x)&&pkHumans(t)>0)||pkTables().find(t=>t.pre===pr.id&&(t.seats||[]).some(x=>!x));
  if(!T){const id='t'+Date.now().toString(36);T={id,pre:pr.id,name:pr.name,sb:pr.sb,bb:pr.bb,buy:pr.buy,seats:Array(PK_SEATS).fill(null),hand:null,created:Date.now(),by:S.myId||'',upd:Date.now()};
    try{const {id:_,...doc}=T;await S.db.doc('poker/'+id).set(doc);}catch(e){toast('Не вдалося відкрити стіл');return;}}
  S.pkTab=T.id;render();const seat=T.seats.findIndex(x=>!x);await pkSit(T,seat<0?0:seat);}
async function pkSit(T,seat){const m=myStaff();if(!m){toast('Профіль працівника не знайдено');return;}try{await pkSit2(T,seat,m);}catch(e){console.error(e);toast('Не вдалося сісти: '+(e&&e.message||'помилка'));}}
async function pkSit2(T,seat,m){if(pkMySeat(T)>=0)return;if(pkWal(m.id).bal<T.buy){toast('Потрібно '+pkCoins(T.buy)+' '+PK_COIN+' — заберіть щоденний бонус');return;}
  if(!await pkWalAdd(-T.buy))return;
  let r=false;try{r=await pkMut(T.id,X=>{if(X.seats[seat]||X.seats.some(s=>s&&s.sid===m.id))return false;X.seats[seat]={sid:m.id,nm:m.name,stack:X.buy,miss:0,out:false,sk:Object.assign({},pkWal(m.id).eq||{}),tt:((pkWal(m.id).eq||{}).title)||''};});}catch(e){console.error(e);r=false;}
  if(!r){await pkWalAdd(T.buy);toast('Місце вже зайняли');}}
async function pkLeave(T){const i=pkMySeat(T);if(i<0)return;const me=myStaff().id;
  let r=false;try{r=await pkMut(T.id,(X,now)=>{const s=X.seats[i];if(!s||s.sid!==me)return false;const h=X.hand;
    if(h&&h.street!=='done'&&h.p[i]&&!h.p[i].f){if(h.turn===i)pkAct(X,i,'fold',0,now,true);else{h.p[i].f=true;pkLog(X,s.nm+' — встав з-за столу');if(pkLive(X).length===1)pkAdvance(X,i,now);}}
    pkOwe(X,me,X.seats[i]?X.seats[i].stack:0);X.seats[i]=null;if(!pkHumans(X)){X.seats=X.seats.map(()=>null);X.hand=null;}});}catch(e){console.error(e);}
  if(!r){toast('Не вдалося встати — спробуйте ще раз');return;}
  S.pkTab=null;render();toast('Ви встали з-за столу');await pkClaimOwed();}
async function pkRebuy(T){const i=pkMySeat(T);if(i<0)return;if(!await pkWalAdd(-T.buy))return;
  let r=false;try{r=await pkMut(T.id,X=>{if(!X.seats[i]||X.seats[i].sid!==myStaff().id)return false;X.seats[i].stack+=X.buy;X.seats[i].out=false;X.seats[i].miss=0;});}catch(e){r=false;}if(!r){await pkWalAdd(T.buy);toast('Не вдалося докупити — '+PK_COIN+' повернуто');}}
function pkAway(away,now){const m=myStaff();if(!m||!S.db)return;clearTimeout(pkAway.t);
  const run=()=>pkTables().forEach(T=>{const i=pkMySeat(T);if(i<0)return;const s=T.seats[i];if(!!s.out===away)return;
    pkMut(T.id,X=>{const z=X.seats[i];if(!z||z.sid!==m.id||!!z.out===away)return false;z.out=away;if(!away)z.miss=0;}).catch(()=>{});});
  if(away&&!now)pkAway.t=setTimeout(run,15000);else run();}
async function pkBack(T){const i=pkMySeat(T);if(i<0)return;await pkMut(T.id,X=>{if(!X.seats[i])return false;X.seats[i].out=false;X.seats[i].miss=0;});}
async function pkDo(T,kind,to){const i=pkMySeat(T);if(i<0)return;S.pkBusy=true;pkRefresh();
  const r=await pkMut(T.id,(X,now)=>pkAct(X,i,kind,to,now));S.pkBusy=false;S.pkRaise=null;if(!r)toast('Хід уже змінився');pkRefresh();}
async function pkDeal(T){await pkMut(T.id,(X,now)=>{if(X.hand&&X.hand.street!=='done')return false;if(X.hand&&X.hand.res&&now<X.hand.res.at+PK_NEXT_MS-300)return false;const mo=pkMarkOffline(X);const sw=pkSweep(X,now);const st=pkStart(X,now);return (mo||sw||st)?true:false;});}
/* Автоматика: наступна роздача і пропуск ходу, коли гравець не відповідає */
function pkSchedule(){clearTimeout(S.pkTm);if(S.tab!=='fun'||S.funGame!=='poker'||!S.pkTab)return;const T=pkTables().find(t=>t.id===S.pkTab);if(!T||pkMySeat(T)<0)return;
  const h=T.hand,now=Date.now();const jit=200+Math.random()*700;
  if(h&&h.street==='done'&&h.res&&(pkReady(T).length>=2||T.seats.some(s=>s&&!s.bot&&(s.out||pkOffline(s))))){S.pkTm=setTimeout(()=>pkDeal(T),Math.max(0,h.res.at+PK_NEXT_MS-now)+jit);}
  else if(h&&h.street!=='done'&&h.turn>=0&&pkOffline(T.seats[h.turn])){const ti=h.turn;S.pkTm=setTimeout(()=>pkMut(T.id,(X,n)=>{const z=X.seats[ti];if(!z||!X.hand||X.hand.turn!==ti)return false;z.out=true;return pkTimeout(X,n,true);}),1500+jit);}
  else if(h&&h.street!=='done'&&h.turn>=0&&pkIsBot(T.seats[h.turn])){S.pkTm=setTimeout(()=>pkBotTurn(T),900+Math.random()*1500);}
  else if(h&&h.street!=='done'&&h.dl){S.pkTm=setTimeout(()=>pkMut(T.id,(X,n)=>pkTimeout(X,n)),Math.max(0,h.dl-now)+jit);}}
setInterval(()=>{if(S.tab!=='fun'||S.funGame!=='poker')return;const now=Date.now();document.querySelectorAll('.pkr-tbar[data-dl]').forEach(b=>{const dl=+b.dataset.dl;const left=Math.max(0,dl-now);b.firstChild.style.width=(left/PK_TURN_MS*100)+'%';b.classList.toggle('low',left<8000);});
  document.querySelectorAll('[data-pknext]').forEach(n=>{const s=Math.max(0,Math.ceil((+n.dataset.pknext-now)/1000));n.textContent=s?'Наступна роздача через '+s+' с':'Роздаємо…';});},250);
/* Візуал */
function pkCard(c,cls){if(!c)return el('span',{class:'pkc back'+(cls?' '+cls:'')+(cls&&cls.includes('bk-')?'':' bk-classic')});const red=c[1]==='h'||c[1]==='d';
  return el('span',{class:'pkc'+(red?' r':'')+(cls?' '+cls:'')},el('b',{text:c[0]==='T'?'10':c[0]}),el('i',{text:PK_SU[c[1]]}));}
function pkChips(v,cls){return el('span',{class:'pkr-chip'+(cls?' '+cls:'')},el('i'),pkCoins(v));}
const _pkSeen=new Set();function pkNew(k){if(_pkSeen.has(k))return false;_pkSeen.add(k);if(_pkSeen.size>3000)_pkSeen.clear();return true;}
function psPatch(){const root=document.getElementById('psRoot');if(!root||S.pkTab||S.pkLT!=='pass')return false;const oldTw=root.querySelector('.ps-tw');const sl=oldTw?oldTw.scrollLeft:S.psSL;const sy=SC().scrollTop;
  const nodes=pkLobby();const nr=nodes.find(n=>n.id==='psRoot');if(!nr)return false;root.replaceWith(nr);const oh=document.querySelector('.pkr-mini');if(oh&&nodes[0])oh.replaceWith(nodes[0]);const gc=document.querySelector('.gp-cnt');if(gc){const n=psMyPending();if(n)gc.textContent=n;else gc.remove();}const tw=nr.querySelector('.ps-tw');if(tw&&sl!=null)tw.scrollLeft=sl;SC().scrollTop=sy;
  document.querySelectorAll('.pkr-tabn').forEach(b=>{const n=psMyPending();b.textContent=n||'';b.hidden=!n;});try{renderTabs();}catch(e){}return true;}
function pkRefresh(){if(S.tab!=='fun'||S.funGame!=='poker')return;if(!S.pkTab&&S.pkLT==='pass'&&psPatch())return;const r=document.getElementById('pkrRoot');const T=S.pkTab&&pkTables().find(t=>t.id===S.pkTab);if(!r||!T){render();return;}
  const ae=document.activeElement;const rng=ae&&ae.classList&&ae.classList.contains('pkr-rng');if(rng&&T.hand&&T.hand.turn===pkMySeat(T))return;r.replaceChildren(...pkTableView(T));try{pkSounds(T);}catch(e){}setTimeout(pkSchedule,0);}
function viewPoker(){const m=myStaff();if(!canPoker())return [el('div',{class:'card empty'},el('p',{class:'muted',text:'Покер поки що в тестуванні.'}))];
  const T=S.pkTab?pkTables().find(t=>t.id===S.pkTab):null;if(S.pkTab&&!T)S.pkTab=null;
  setTimeout(pkSchedule,0);if(T)try{pkSounds(T);}catch(e){}return T?[el('div',{id:'pkrRoot'},pkTableView(T))]:pkLobby();}
function pkLobby(){const tabs=el('div',{class:'seg full pkr-seg'},[['tables','Столи'],['pass','Батл пас'],['coll','Колекція']].map(([k,l])=>{const n=k==='pass'?psMyPending():0;return el('button',{type:'button','aria-pressed':String((S.pkLT||'tables')===k),onclick:()=>{S.pkLT=k;render();}},el('span',{class:'pkr-tl2'},l,k==='pass'?el('span',{class:'pkr-tabn',hidden:n?null:true,text:n?String(n):''}):null));}));
  if(S.pkLT==='pass')return [pkLobbyHero(),tabs,el('div',{id:'psRoot'},psView())];if(S.pkLT==='coll')return [pkLobbyHero(),tabs,...psCollection()];
  const L=pkLobbyInner();L[0]=pkLobbyHero();L.splice(1,0,tabs);return L;}
function pkLobbyHero(){const m=myStaff();const w=m?pkWal(m.id):{bal:0};const can=m&&w.day!==ymd(new Date());
  return el('div',{class:'card pkr-mini'},el('span',{class:'pkr-mini-t'},el('small',{class:'muted',text:'Duck’s Poker · ваш рахунок'}),el('b',{},PK_COIN+' '+pkCoins(w.bal))),el('span',{class:'ps-badge sm'},el('small',{text:'рів.'}),el('b',{text:String(psLevel(w))})),
    el('button',{type:'button',class:'btn sm',disabled:can?null:true,onclick:()=>pkClaim()},can?'+'+pkCoins(PK_DAILY)+' '+PK_COIN:'Бонус завтра'));}
function pkLobbyInner(){const m=myStaff();const w=m?pkWal(m.id):{bal:0};const today=ymd(new Date());const can=m&&w.day!==today;const out=[];
  const onT=m?pkTables().reduce((a,t)=>a+((t.seats||[]).find(s=>s&&s.sid===m.id)||{stack:0}).stack,0):0;
  out.push(el('section',{class:'pkr-hero'},el('div',{class:'pkr-hl'},el('span',{class:'eyebrow',text:'Duck’s Lake · бета'}),el('h2',{text:'Duck’s Poker'}),el('p',{text:'Техаський холдем з колегами або ботами. Щодня — '+pkCoins(PK_DAILY)+' '+PK_COIN+', XP і нагороди батл пасу.'})),
    el('div',{class:'pkr-wal'},el('span',{class:'pkr-wl',text:'Ваш рахунок'}),el('b',{},PK_COIN+' '+pkCoins(w.bal)),onT?el('small',{text:'+ '+pkCoins(onT)+' за столами'}):el('small',{text:'качкоїнів'}),
      el('button',{type:'button',class:'btn pkr-claim',disabled:can?null:true,onclick:()=>pkClaim()},can?'Забрати '+pkCoins(PK_DAILY)+' '+PK_COIN:'Бонус завтра'))));
  const ts=pkTables();out.push(el('div',{class:'pkr-sh'},el('h3',{text:'Швидка гра'}),el('small',{class:'muted',text:'сідаєте за стіл з колегами, а якщо нікого — додаєте ботів'})));
  out.push(el('div',{class:'pkr-qp'},PK_PRESETS.map(p=>{const live=ts.filter(t=>t.pre===p.id);const ppl=live.reduce((a,t)=>a+pkHumans(t),0);const mine=live.some(t=>pkMySeat(t)>=0);
    return el('button',{type:'button',class:'card pkr-qc'+(mine?' mys':''),onclick:()=>pkPlay(p)},el('span',{class:'pkr-felt-mini'},el('span',{text:p.sb+'/'+p.bb})),
      el('span',{class:'pkr-tt'},el('b',{text:p.name}),el('small',{},'вхід ',el('span',{class:'nw',text:pkCoins(p.buy)+' '+PK_COIN}),' · '+p.d)),
      el('span',{class:'pkr-go'},el('small',{text:mine?'ви за столом':ppl?ppl+' '+plural(ppl,'гравець','гравці','гравців'):'вільно'}),el('b',{text:mine?'Повернутися':'Грати'})));})));
  const open=ts.filter(t=>pkHumans(t)>0);if(open.length)out.push(el('div',{class:'pkr-sh'},el('h3',{text:'Відкриті столи'})));
  out.push(open.length?el('div',{class:'pkr-tl'},open.map(t=>{const seated=(t.seats||[]).filter(Boolean);const live=t.hand&&t.hand.street!=='done';const me=pkMySeat(t)>=0;
    return el('div',{class:'card pkr-tc'+(me?' mys':'')},el('button',{type:'button',class:'pkr-to',onclick:()=>{S.pkTab=t.id;S.pkRaise=null;render();}},
      el('span',{class:'pkr-felt-mini'},el('span',{text:t.bb/2+'/'+t.bb})),
      el('span',{class:'pkr-tt'},el('b',{text:t.name}),el('small',{text:'блайнди '+t.sb+'/'+t.bb+' · вхід '+pkCoins(t.buy)+' '+PK_COIN})),
      el('span',{class:'pkr-ts'},el('span',{class:'pkr-avs'},seated.slice(0,5).map(s=>{const st=staffById(s.sid);return st?avatar(st,'sm'):el('span',{class:'av sm',text:'?'});})),
        el('small',{text:seated.length+' / '+PK_SEATS+(live?' · йде гра':seated.length?' · чекають':' · вільно')}))),
      isDev()&&!seated.length?el('button',{type:'button',class:'pkr-del','aria-label':'Видалити стіл',onclick:()=>pkDelete(t)},svg('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>')):null);})):
    null);
  const rich=S.staff.map(s=>({s,v:pkWal(s.id).bal+pkTables().reduce((a,t)=>a+((t.seats||[]).find(x=>x&&x.sid===s.id)||{stack:0}).stack,0)})).filter(x=>x.v>0||(S.wal||{})[x.s.id]).sort((a,b)=>b.v-a.v);
  out.push(el('h3',{class:'pkr-h3',text:'Найбагатші'}));
  out.push(rich.length?el('div',{class:'card lb'},rich.slice(0,10).map((r,i)=>el('div',{class:'lb-r'+(m&&r.s.id===m.id?' me':'')+(i<3?' top t'+(i+1):'')},el('span',{class:'lb-n',text:i<3?['🥇','🥈','🥉'][i]:String(i+1)}),avatar(r.s),el('span',{class:'lb-nm'},el('b',{text:r.s.name}),(()=>{const w=pkWal(r.s.id);const t=(w.eq||{}).title;return el('small',{text:[t&&t!=='none'?PS_SKINS.title[t][0]:'','рівень '+psLevel(w)].filter(Boolean).join(' · ')});})()),el('span',{class:'lb-v'},el('b',{text:PK_COIN+' '+pkCoins(r.v)}))))):el('div',{class:'card empty'},el('p',{class:'muted',text:'Ще ніхто не грав.'})));
  out.push(el('p',{class:'muted small pkr-note',text:'Качкоїни — ігрова валюта лише для розваги: не купуються, не продаються й не обмінюються на гроші.'}));
  return out;}
const PK_POS=[[50,90],[9,70],[9,28],[50,9],[91,28],[91,70]];
function pkTableView(T){const m=myStaff();const me=pkMySeat(T);const h=T.hand;const now=Date.now();const out=[];const w=m?pkWal(m.id):{bal:0};
  const res=h&&h.street==='done'?h.res:null;const winI=res?res.wins.map(x=>x.i):[];
  out.push(el('div',{class:'pkr-top'},el('button',{type:'button',class:'btn ghost sm',onclick:()=>{S.pkTab=null;render();}},svg('<path d="m15 6-6 6 6 6"/>'),' Столи'),
    el('div',{class:'pkr-tn'},el('b',{text:T.name}),el('small',{text:'блайнди '+T.sb+'/'+T.bb+' · вхід '+pkCoins(T.buy)})),el('button',{type:'button',class:'iconbtn pkr-snd','aria-label':SND.on?'Вимкнути звук':'Увімкнути звук',onclick:()=>{SND.toggle();pkRefresh();}},svg(SND.on?'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>':'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="m17 9 5 6M22 9l-5 6"/>')),el('span',{class:'pkr-mywal'},PK_COIN+' '+pkCoins(w.bal))));
  const rot=me>=0?me:0;const pot=h?h.pot+Object.values(h.p||{}).reduce((a,p)=>a+p.bet,0):0;
  const seats=T.seats.map((s,i)=>{const pi=(i-rot+PK_SEATS)%PK_SEATS,pos=PK_POS[pi];const ps='left:clamp(var(--sw2),'+pos[0]+'%,calc(100% - var(--sw2)));top:'+pos[1]+'%';const p=h&&h.p?h.p[i]:null;const st=s?staffById(s.sid):null;const isMe=i===me;
    if(!s)return el('div',{class:'pkr-seat empty sp'+pi,style:ps},me<0&&m?el('button',{type:'button',class:'pkr-sit',onclick:()=>pkSit(T,i)},'Сісти'):el('span',{class:'pkr-free',text:'вільно'}));
    const turn=h&&h.street!=='done'&&h.turn===i;const show=res&&res.show&&res.show.includes(i);
    const bk='bk-'+((s.sk&&s.sk.back)||'classic');const nk=k=>pkNew(T.id+':'+h.n+':'+i+':'+k+(isMe||show?':f':''));const cards=p?(isMe||show?p.c.map((c,k)=>pkCard(c,(nk(k)?'deal d'+k+' ':'')+res&&winI.includes(i)&&res.wins.find(x=>x.i===i).best&&res.wins.find(x=>x.i===i).best.includes(c)?'hl':'')):[pkCard(null,bk+(nk(0)?' deal d0':'')),pkCard(null,bk+(nk(1)?' deal d1':''))]):null;
    return el('div',{class:'pkr-seat'+(turn?' turn':'')+(p&&p.f?' fold':'')+(winI.includes(i)?' win':'')+(isMe?' mys':'')+(s.out?' out':'')+' sp'+pi,style:ps},
      cards?el('div',{class:'pkr-cards'+(isMe?' mine':'')},cards):null,
      el('div',{class:'pkr-plate fr-'+((s.sk&&s.sk.frame)||'none')},s.bot?el('span',{class:'av sm pkr-bot',text:'🤖'}):st?avatar(st,'sm'):el('span',{class:'av sm',text:'?'}),el('span',{class:'pkr-pn'},el('b',{text:isMe?'Ви':s.nm}),(()=>{const wn=winI.includes(i)?res.wins.find(x=>x.i===i):null;const hn=show&&res.ev&&res.ev[i];return wn?el('small',{class:'pkr-wn',text:'+'+pkCoins(wn.amt)+(hn?' · '+hn:'')}):hn?el('small',{class:'pkr-hn2',text:hn}):el('small',{text:p&&p.a?'ва-банк':s.out?'відійшов':PK_COIN+' '+pkCoins(s.stack)});})()),s.bot&&isDev()?el('button',{type:'button',class:'pkr-kick','aria-label':'Прибрати бота',title:'Прибрати бота',onclick:e=>{e.stopPropagation();pkKickBot(T,i);}},'×'):null,
        h&&h.dealer===i?el('span',{class:'pkr-d',text:'D'}):null),
      turn?el('div',{class:'pkr-tbar','data-dl':String(h.dl)},el('i')):null,
      p&&p.bet?pkChips(p.bet,'bet'+(pkNew(T.id+':'+h.n+':'+h.street+':'+i+':'+p.bet)?' pop':'')):null,
      null);});
  const center=el('div',{class:'pkr-center'},el('div',{class:'pkr-board'},[0,1,2,3,4].map(k=>h&&h.board[k]?pkCard(h.board[k],(pkNew(T.id+':'+h.n+':b'+k)?'flip d'+Math.max(0,k-(h.board.length>3&&k>=3?k:0)):'')+(res&&res.wins.some(x=>x.best&&x.best.includes(h.board[k]))?' hl':'')):el('span',{class:'pkc slot'}))),
    pot?el('div',{class:'pkr-pot'},'Банк ',el('b',{text:pkCoins(pot)})):el('div',{class:'pkr-pot muted',text:h?'':(pkReady(T).length>=2?'Готові до роздачі':'Чекаємо гравців')}),
    res?el('div',{class:'pkr-res'},res.wins.map(x=>el('div',{},el('b',{text:x.nm}),' виграє '+pkCoins(x.amt)+(x.hand?' · '+x.hand:''))),pkReady(T).length>=2?el('small',{'data-pknext':String(res.at+PK_NEXT_MS)}):el('small',{text:'Чекаємо ще гравця'})):null);
  out.push(el('div',{class:'pkr-table'},el('div',{class:'pkr-rim'},el('div',{class:'pkr-felt fl-'+(((m&&pkWal(m.id).eq)||{}).felt||'green')},el('span',{class:'pkr-logo',text:'DUCK’S LAKE'}),center)),seats));
  /* панель дій */
  const bar=[];
  if(me<0){bar.push(m?el('div',{class:'pkr-join'},el('span',{},el('b',{text:'Натисніть «Сісти» на вільному місці'}),el('small',{class:'muted'},'Вхід ',el('span',{class:'nw',text:pkCoins(T.buy)+' '+PK_COIN}),' · у вас ',el('span',{class:'nw',text:pkCoins(pkWal(m.id).bal)+' '+PK_COIN}))),el('button',{type:'button',class:'btn',onclick:()=>{const i=T.seats.findIndex(x=>!x);if(i>=0)pkSit(T,i);}},'Сісти')):el('p',{class:'muted',style:'margin:0',text:'Профіль працівника не знайдено.'}));}
  else{const s=T.seats[me];const p=h&&h.p?h.p[me]:null;const my=h&&h.street!=='done'&&h.turn===me;
    if(p&&!p.f&&h.board.length+2>=5){const b=pkBest(p.c.concat(h.board));bar.push(el('div',{class:'pkr-mine'},'У вас: ',el('b',{text:b.name})));}
    else if(p&&!p.f&&h.street!=='done'){bar.push(el('div',{class:'pkr-mine'},'Ваші карти: ',el('b',{text:p.c.map(pkCardTxt).join(' ')})));}
    if(my&&!S.pkBusy){const toCall=h.curBet-p.bet;const max=p.bet+s.stack;const minR=Math.min(max,h.curBet+h.minRaise);const potNow=pot+toCall;
      let v=S.pkRaise!=null?S.pkRaise:minR;v=Math.max(minR,Math.min(max,v));
      const lbl=el('b',{text:pkCoins(v)});const rng=el('input',{type:'range',min:String(minR),max:String(max),step:String(T.sb),value:String(v),class:'pkr-rng','aria-label':'Сума рейзу'});
      const rb=el('button',{type:'button',class:'btn pkr-raise',onclick:()=>pkDo(T,v>=max?'allin':'raise',v)},v>=max?'Ва-банк ':'Рейз до ',lbl);
      const setV=x=>{v=Math.max(minR,Math.min(max,Math.round(x/T.sb)*T.sb||x));S.pkRaise=v;rng.value=String(v);lbl.textContent=pkCoins(v);rb.firstChild.textContent=v>=max?'Ва-банк ':'Рейз до ';};
      rng.addEventListener('input',()=>setV(+rng.value));
      bar.push(el('div',{class:'pkr-act'},
        el('div',{class:'pkr-main'},el('button',{type:'button',class:'btn ghost pkr-fold',onclick:()=>pkDo(T,'fold')},'Пас'),
          toCall>0?el('button',{type:'button',class:'btn pkr-call',onclick:()=>pkDo(T,'call')},s.stack<=toCall?'Колл ва-банк ':'Колл ',el('b',{text:pkCoins(Math.min(toCall,s.stack))})):el('button',{type:'button',class:'btn pkr-call',onclick:()=>pkDo(T,'check')},'Чек')),
        max>h.curBet?el('div',{class:'pkr-rz'},el('div',{class:'pkr-q'},[['Мін',minR],['½ банку',h.curBet+Math.round(potNow/2)],['Банк',h.curBet+potNow],['Ва-банк',max]].map(([l,x])=>el('button',{type:'button',class:'btn ghost sm',onclick:()=>setV(x)},l))),rng,rb):null));}
    else if(h&&h.street!=='done'){bar.push(el('p',{class:'muted',style:'margin:0'},S.pkBusy?'Надсилаємо хід…':h.turn>=0?['Хід: ',el('b',{text:pkNm(T,h.turn)})]:''));}
    const canBot=T.seats.some(x=>!x)&&T.seats.filter(pkIsBot).length<3;const waiting=!h||!res&&h.street==='done'||(!h);const ready=pkReady(T).length;
    if(!h||(!res&&h.street==='done')){
      bar.push(el('div',{class:'pkr-wait'},el('span',{class:'pkr-wi',text:ready>=2?'🃏':'⏳'}),
        el('div',{class:'pkr-wt'},el('b',{text:ready>=2?'Усі на місцях':'Чекаємо суперників'}),
          el('small',{class:'muted',text:ready>=2?'За столом '+ready+' '+plural(ready,'гравець','гравці','гравців')+'. Можна починати.':'Покличте колег або додайте бота — боти не бачать ваших карт.'})),
        el('div',{class:'pkr-wa'},ready>=2?el('button',{type:'button',class:'btn pkr-call',onclick:()=>pkDeal(T)},'Почати роздачу'):null,
          canBot?el('button',{type:'button',class:ready>=2?'btn ghost':'btn',onclick:()=>pkAddBot(T)},ready>=2?'+ Бот':'🤖 Додати бота'):null)));}
    const bots=isDev()?T.seats.map((x,j)=>pkIsBot(x)?el('button',{type:'button',class:'pkr-bchip',title:'Прибрати бота',onclick:()=>pkKickBot(T,j)},'🤖 '+x.nm.replace('Бот ',''),el('i',{text:'×'})):null).filter(Boolean):[];
    const inHand=h&&h.street!=='done'&&p&&!p.f;
    bar.push(el('div',{class:'pkr-sub'},
      el('div',{class:'pkr-sl'},bots.length?[el('small',{class:'muted',text:'Боти:'}),...bots]:null,
        h&&h.street!=='done'&&canBot?el('button',{type:'button',class:'pkr-bchip add',onclick:()=>pkAddBot(T)},'+ бот'):null),
      el('div',{class:'pkr-sr'},s.out?el('button',{type:'button',class:'btn sm',onclick:()=>pkBack(T)},'Я повернувся'):null,
        s.stack===0&&!inHand?el('button',{type:'button',class:'btn sm',onclick:()=>pkRebuy(T)},'Докупити '+pkCoins(T.buy)+' '+PK_COIN):null,
        el('button',{type:'button',class:'pkr-leave',onclick:()=>pkLeave(T)},svg('<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>'),'Встати з-за столу'))));}
  out.push(el('div',{class:'card pkr-bar'},bar));
  if(h&&h.log&&h.log.length)out.push(el('details',{class:'card pkr-log'},el('summary',{text:'Хід роздачі №'+h.n}),el('ul',{},h.log.slice().reverse().map(t=>el('li',{text:t})))));
  return out;}
