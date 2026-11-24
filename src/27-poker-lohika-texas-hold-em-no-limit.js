// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Покер: логіка (Texas Hold'em, No-Limit)

/* ---------- Покер: логіка (Texas Hold'em, No-Limit) ---------- */
const PK_R='23456789TJQKA',PK_SU={s:'♠',h:'♥',d:'♦',c:'♣'};
const PK_HN=['Старша карта','Пара','Дві пари','Сет','Стріт','Флеш','Фул-хаус','Каре','Стріт-флеш'];
const PK_TURN_MS=30000,PK_NEXT_MS=6000,PK_SEATS=6;
function pkDeck(){const d=[];for(const r of PK_R)for(const s of 'shdc')d.push(r+s);const rnd=new Uint32Array(d.length);(window.crypto||{}).getRandomValues?crypto.getRandomValues(rnd):rnd.forEach((_,i)=>rnd[i]=Math.random()*4294967296);
  for(let i=d.length-1;i>0;i--){const j=rnd[i]%(i+1);[d[i],d[j]]=[d[j],d[i]];}return d;}
function pkRank5(cs){const v=cs.map(c=>PK_R.indexOf(c[0])).sort((a,b)=>b-a);const fl=cs.every(c=>c[1]===cs[0][1]);
  let u=[...new Set(v)];let st=-1;if(u.length===5){if(u[0]-u[4]===4)st=u[0];else if(u[0]===12&&u[1]===3)st=3;}
  const cnt={};v.forEach(x=>cnt[x]=(cnt[x]||0)+1);const g=Object.entries(cnt).map(([k,n])=>[n,+k]).sort((a,b)=>b[0]-a[0]||b[1]-a[1]);const ks=g.map(x=>x[1]);
  if(st>=0&&fl)return [8,st];if(g[0][0]===4)return [7,...ks];if(g[0][0]===3&&g[1][0]===2)return [6,...ks];if(fl)return [5,...v];if(st>=0)return [4,st];
  if(g[0][0]===3)return [3,...ks];if(g[0][0]===2&&g[1][0]===2)return [2,...ks];if(g[0][0]===2)return [1,...ks];return [0,...v];}
function pkCmp(a,b){for(let i=0;i<Math.max(a.length,b.length);i++){const d=(a[i]||0)-(b[i]||0);if(d)return d;}return 0;}
function pkBest(cards){let best=null,bc=null;const n=cards.length;
  for(let a=0;a<n;a++)for(let b=a+1;b<n;b++)for(let c=b+1;c<n;c++)for(let d=c+1;d<n;d++)for(let e=d+1;e<n;e++){const h=[cards[a],cards[b],cards[c],cards[d],cards[e]];const r=pkRank5(h);if(!best||pkCmp(r,best)>0){best=r;bc=h;}}
  return {r:best,cards:bc,name:best?PK_HN[best[0]]:''};}
/* table helpers */
function pkP(T,i){return T.hand&&T.hand.p&&T.hand.p[i];}
function pkNext(T,from,pred){for(let k=1;k<=PK_SEATS;k++){const i=(from+k)%PK_SEATS;if(pred(i))return i;}return -1;}
function pkLive(T){return Object.keys(T.hand.p).map(Number).filter(i=>!T.hand.p[i].f);}
function pkCanAct(T,i){const p=pkP(T,i);return !!p&&!p.f&&!p.a;}
function pkNeeds(T,i){const p=pkP(T,i);return pkCanAct(T,i)&&(!p.acted||p.bet<T.hand.curBet);}
function pkPost(T,i,amt){const s=T.seats[i],p=T.hand.p[i];amt=Math.max(0,Math.min(amt,s.stack));s.stack-=amt;p.bet+=amt;p.tot+=amt;if(s.stack===0)p.a=true;return amt;}
function pkLog(T,t){const h=T.hand;h.log=(h.log||[]).concat(t).slice(-14);}
function pkNm(T,i){const s=T.seats[i];return s?(s.nm||'Гравець'):'Гравець';}
function pkReady(T){return T.seats.map((s,i)=>s&&!s.out&&s.stack>0?i:-1).filter(i=>i>=0);}
function pkStart(T,now){const act=pkReady(T);if(act.length<2)return false;
  const prevD=T.hand?T.hand.dealer:-1;const n=(T.hand?T.hand.n:0)+1;const dealer=pkNext(T,prevD<0?act[act.length-1]:prevD,i=>act.includes(i));
  const deck=pkDeck();const p={};act.forEach(i=>p[i]={c:[deck.pop(),deck.pop()],bet:0,tot:0,f:false,a:false,acted:false});
  T.hand={n,dealer,deck,board:[],street:'pre',pot:0,curBet:0,minRaise:T.bb,p,log:[],res:null,turn:-1,dl:0};
  const hu=act.length===2;const sbI=hu?dealer:pkNext(T,dealer,i=>act.includes(i));const bbI=pkNext(T,sbI,i=>act.includes(i));
  pkPost(T,sbI,T.sb);pkPost(T,bbI,T.bb);T.hand.curBet=T.bb;T.hand.sbI=sbI;T.hand.bbI=bbI;
  pkLog(T,'Роздача №'+n+' · блайнди '+T.sb+'/'+T.bb);
  const first=pkNext(T,bbI,i=>pkNeeds(T,i));if(first<0)return pkRound(T,now)||true;T.hand.turn=first;T.hand.dl=now+PK_TURN_MS;return true;}
function pkAct(T,i,kind,to,now,auto){const h=T.hand;if(!h||h.street==='done'||h.turn!==i)return false;const p=h.p[i],s=T.seats[i];if(!p||p.f||p.a||!s)return false;
  const toCall=h.curBet-p.bet;
  if(kind==='fold'){p.f=true;pkLog(T,pkNm(T,i)+' — пас');}
  else if(kind==='check'){if(toCall>0)return false;pkLog(T,pkNm(T,i)+' — чек');}
  else if(kind==='call'){if(toCall<=0)return false;const a=pkPost(T,i,toCall);pkLog(T,pkNm(T,i)+' — колл '+a+(p.a?' (ва-банк)':''));}
  else if(kind==='raise'||kind==='allin'){const max=p.bet+s.stack;let X=kind==='allin'?max:Math.min(Math.floor(to),max);
    if(X<=h.curBet){if(X<max)return false;pkPost(T,i,X-p.bet);pkLog(T,pkNm(T,i)+' — ва-банк '+X);}
    else{if(X<h.curBet+h.minRaise&&X<max)return false;const full=X-h.curBet>=h.minRaise;pkPost(T,i,X-p.bet);if(full)h.minRaise=X-h.curBet;h.curBet=X;
      Object.keys(h.p).forEach(k=>{if(+k!==i&&!h.p[k].f&&!h.p[k].a&&full)h.p[k].acted=false;});pkLog(T,pkNm(T,i)+(p.a?' — ва-банк ':' — рейз до ')+X);}}
  else return false;
  p.acted=true;if(!auto)s.miss=0;h.seq=(h.seq||0)+1;return pkAdvance(T,i,now)||true;}
function pkAdvance(T,from,now){const h=T.hand;const live=pkLive(T);
  if(live.length===1){h.pot+=Object.values(h.p).reduce((a,p)=>a+p.bet,0);Object.values(h.p).forEach(p=>p.bet=0);const w=live[0];T.seats[w]&&(T.seats[w].stack+=h.pot);
    h.res={wins:[{i:w,amt:h.pot,nm:pkNm(T,w),hand:''}],show:[],at:now};pkLog(T,pkNm(T,w)+' забирає '+h.pot);h.street='done';h.turn=-1;return true;}
  const nx=pkNext(T,from,i=>pkNeeds(T,i));if(nx>=0){h.turn=nx;h.dl=now+PK_TURN_MS;return true;}
  return pkRound(T,now);}
function pkRound(T,now){const h=T.hand;
  for(;;){h.pot+=Object.values(h.p).reduce((a,p)=>a+p.bet,0);Object.values(h.p).forEach(p=>{p.bet=0;p.acted=false;});h.curBet=0;h.minRaise=T.bb;
    if(h.street==='river')return pkShow(T,now);
    h.deck.pop();const k=h.street==='pre'?3:1;for(let j=0;j<k;j++)h.board.push(h.deck.pop());h.street=h.street==='pre'?'flop':h.street==='flop'?'turn':'river';
    pkLog(T,({flop:'Флоп',turn:'Терн',river:'Рівер'})[h.street]+': '+h.board.slice(h.street==='flop'?0:-1).map(pkCardTxt).join(' '));
    const can=pkLive(T).filter(i=>pkCanAct(T,i));if(can.length>=2){h.turn=pkNext(T,h.dealer,i=>pkCanAct(T,i));h.dl=now+PK_TURN_MS;return true;}}}
function pkShow(T,now){const h=T.hand;const live=pkLive(T);const ev={};live.forEach(i=>ev[i]=pkBest(h.p[i].c.concat(h.board)));
  const all=Object.keys(h.p).map(Number);const tot=i=>h.p[i].tot;const levels=[...new Set(live.map(tot))].sort((a,b)=>a-b);
  const won={};let prev=0,dist=0,lastW=[];
  for(const L of levels){const part=all.reduce((a,i)=>a+Math.max(0,Math.min(tot(i),L)-Math.min(tot(i),prev)),0);const el2=live.filter(i=>tot(i)>=L);
    let best=null,ws=[];el2.forEach(i=>{const c=best?pkCmp(ev[i].r,best):1;if(c>0){best=ev[i].r;ws=[i];}else if(c===0)ws.push(i);});
    const each=Math.floor(part/ws.length);ws.forEach((i,k)=>won[i]=(won[i]||0)+each+(k===0?part-each*ws.length:0));dist+=part;prev=L;lastW=ws;}
  const rest=h.pot-dist;if(rest>0&&lastW.length)won[lastW[0]]=(won[lastW[0]]||0)+rest;
  Object.entries(won).forEach(([i,a])=>{if(T.seats[i])T.seats[i].stack+=a;});
  h.res={wins:Object.entries(won).filter(([,a])=>a>0).map(([i,a])=>({i:+i,amt:a,nm:pkNm(T,+i),hand:ev[i].name,best:ev[i].cards})),show:live,ev:Object.fromEntries(live.map(i=>[i,ev[i].name])),at:now};
  h.res.wins.forEach(w=>pkLog(T,w.nm+' виграє '+w.amt+' · '+w.hand));h.street='done';h.turn=-1;return true;}
function pkTimeout(T,now,force){const h=T.hand;if(!h||h.street==='done'||h.turn<0||(!force&&now<h.dl))return false;const i=h.turn;const s=T.seats[i];if(s){s.miss=(s.miss||0)+1;if(s.miss>=2)s.out=true;}
  return pkAct(T,i,h.curBet-h.p[i].bet>0?'fold':'check',0,now,true);}
/* Хто з гравців зараз не в мережі (за статусом присутності застосунку) */
function pkOffline(s){if(!s||s.bot||!S.pres||!Object.keys(S.pres).length)return false;const me=myStaff();if(me&&me.id===s.sid)return document.visibilityState!=='visible';
  const p=S.pres[s.sid];if(!p)return true;const age=Date.now()-(p.at||0);return p.off?age>20000:age>180000;}
function pkMarkOffline(X){let ch=false;X.seats.forEach(s=>{if(s&&!s.bot&&!s.out&&pkOffline(s)){s.out=true;ch=true;}});return ch;}
/* Роздача, яку ніхто не веде понад 3 хв, скасовується: ставки повертаються гравцям */
function pkCancelStale(X,now){const h=X.hand;if(!h||h.street==='done'||now-(X.upd||0)<180000)return false;
  Object.keys(h.p).forEach(k=>{const s=X.seats[k];if(s)s.stack+=h.p[k].tot||0;});h.pot=0;Object.values(h.p).forEach(p=>{p.bet=0;p.tot=0;});
  pkLog(X,'Роздачу скасовано — ставки повернуто');h.street='done';h.turn=-1;h.res={wins:[],show:[],at:now-PK_NEXT_MS};return true;}
async function pkJanitor(){if(pkJanitor.busy||!S.db||!canPoker())return;const now=Date.now();pkJanitor.last=pkJanitor.last||{};pkJanitor.busy=true;
  try{for(const T of pkTables()){if(now-(pkJanitor.last[T.id]||0)<30000)continue;const h=T.hand;const idle=!h||h.street==='done';
      const need=(h&&h.street!=='done'&&now-(T.upd||0)>180000)||(idle&&(T.seats||[]).some(s=>s&&!s.bot&&(s.out||pkOffline(s))));if(!need)continue;pkJanitor.last[T.id]=now;
      await pkMut(T.id,(X,n)=>{const a=pkCancelStale(X,n);const hh=X.hand;if(hh&&hh.street!=='done')return a?true:false;const b=pkMarkOffline(X);const c=pkSweep(X,n);return (a||b||c)?true:false;}).catch(()=>{});}}
  finally{pkJanitor.busy=false;}}
function pkOwe(T,sid,amt){amt=Math.round(amt||0);if(!sid||amt<=0||String(sid).startsWith('bot:'))return;T.owed=T.owed||{};(T.owed[sid]=T.owed[sid]||[]).push({k:Date.now().toString(36)+Math.random().toString(36).slice(2,7),a:amt});}
/* Між роздачами: гравців, що відійшли, знімаємо зі столу, а їхні фішки відкладаємо до повернення в гаманець */
function pkSweep(T,now){const h=T.hand;if(h&&h.street!=='done')return false;let ch=false;
  T.seats.forEach((s,i)=>{if(!s)return;if(!s.bot&&s.out){pkOwe(T,s.sid,s.stack);if(h)pkLog(T,(s.nm||'Гравець')+' відійшов — фішки повернуто в гаманець');T.seats[i]=null;ch=true;}
    else if(s.bot&&s.stack<=0){T.seats[i]=null;ch=true;}});
  if(!pkHumans(T)&&T.seats.some(Boolean)){T.seats=T.seats.map(()=>null);T.hand=null;ch=true;}
  if(!T.seats.some(Boolean)&&T.hand){T.hand=null;ch=true;}
  return ch;}
function pkCardTxt(c){return (c[0]==='T'?'10':c[0])+PK_SU[c[1]];}
