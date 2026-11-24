// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Покер: гаманець (черга записів), боти, сезон, скіни

/* ---------- Покер: гаманець (черга записів), боти, сезон, скіни ---------- */
let _walQ=Promise.resolve();
function walMut(fn){const m=myStaff();if(!m)return Promise.resolve(false);const run=async()=>{const ref=S.db.doc('wallets/'+m.id);const sn=await ref.get();const w=sn.exists?JSON.parse(JSON.stringify(sn.data())):{bal:0};
  psMig(w);const r=fn(w);if(r===false)return false;w.at=Date.now();await ref.set(w);if(S.wal)S.wal[m.id]=w;return r===undefined?true:r;};
  const p=_walQ.then(run,run);_walQ=p.catch(()=>{});return p;}
/* --- Боти --- */
const PK_BOTS=[{nm:'Бот Кряк',ag:.55,lv:.10},{nm:'Бот Ряска',ag:.35,lv:.14},{nm:'Бот Селезень',ag:.7,lv:.08},{nm:'Бот Очерет',ag:.45,lv:.16}];
function pkIsBot(s){return !!(s&&s.bot);}
function pkHumans(T){return (T.seats||[]).filter(s=>s&&!s.bot).length;}
function pkEquity(hole,board,opp,sims){const known=new Set(hole.concat(board));const rest=[];for(const r of PK_R)for(const su of 'shdc'){const c=r+su;if(!known.has(c))rest.push(c);}
  const need=opp*2+5-board.length;let win=0;
  for(let k=0;k<sims;k++){const d=rest.slice();for(let j=0;j<need;j++){const x=j+Math.floor(Math.random()*(d.length-j));const t=d[j];d[j]=d[x];d[x]=t;}
    let q=0;const take=()=>d[q++];const bd=board.slice();while(bd.length<5)bd.push(take());const me=pkBest(hole.concat(bd)).r;let ok=1,tie=0;
    for(let o=0;o<opp;o++){const r=pkBest([take(),take()].concat(bd)).r;const c=pkCmp(me,r);if(c<0){ok=0;break;}if(c===0)tie++;}
    if(ok)win+=tie?1/(tie+1):1;}
  return win/sims;}
function pkBotDecide(T,i){const h=T.hand,p=h.p[i],s=T.seats[i];const P=PK_BOTS.find(b=>b.nm===s.nm)||PK_BOTS[0];const opp=Math.max(1,pkLive(T).length-1);
  const eq=pkEquity(p.c,h.board,Math.min(opp,4),h.board.length?160:110);const e=eq+(Math.random()*2-1)*(.1+P.lv);const toCall=h.curBet-p.bet;const pot=h.pot+Object.values(h.p).reduce((a,x)=>a+x.bet,0);
  const max=p.bet+s.stack;const raiseTo=f=>Math.min(max,Math.max(h.curBet+h.minRaise,Math.round((h.curBet+pot*f)/T.sb)*T.sb));const r=Math.random();
  if(toCall<=0){if(e>.6+(1-P.ag)*.12&&r<.75)return {k:'raise',to:raiseTo(.45+Math.random()*.4)};if(r<.07*P.ag)return {k:'raise',to:raiseTo(.4)};return {k:'check'};}
  const odds=toCall/(pot+toCall);const big=toCall>s.stack*.45;
  if(big&&e<.52+Math.random()*.08)return r<P.lv*.6?{k:'call'}:{k:'fold'};
  if(e<odds-.04)return (toCall<=T.bb*2&&r<.25+P.lv)?{k:'call'}:{k:'fold'};
  if(e>.72&&r<.45+P.ag*.3)return {k:max<=h.curBet*2.5?'allin':'raise',to:raiseTo(.6+Math.random()*.5)};
  return {k:'call'};}
async function pkAddBot(T){const used=new Set((T.seats||[]).filter(pkIsBot).map(s=>s.nm));const b=PK_BOTS.find(x=>!used.has(x.nm));if(!b){toast('Ботів досить');return;}
  await pkMut(T.id,X=>{const i=X.seats.findIndex(s=>!s);if(i<0||X.seats.filter(pkIsBot).length>=3)return false;X.seats[i]={sid:'bot:'+i+':'+Date.now().toString(36),nm:b.nm,stack:X.buy,bot:true,miss:0,out:false,sk:{back:['classic','duck','neon','marble'][i%4]}};});}
async function pkKickBot(T,i){await pkMut(T.id,(X,now)=>{const s=X.seats[i];if(!pkIsBot(s))return false;const h=X.hand;if(h&&h.street!=='done'&&h.p[i]&&!h.p[i].f){if(h.turn===i)pkAct(X,i,'fold',0,now);else{h.p[i].f=true;if(pkLive(X).length===1)pkAdvance(X,i,now);}}X.seats[i]=null;});}
function pkBotTurn(T){const h=T.hand;const i=h.turn;const seq=h.seq||0,n=h.n;
  return pkMut(T.id,(X,now)=>{const H=X.hand;if(!H||H.n!==n||(H.seq||0)!==seq||H.turn!==i||!pkIsBot(X.seats[i]))return false;const d=pkBotDecide(X,i);
    if(pkAct(X,i,d.k,d.to,now))return true;const toC=H.curBet-H.p[i].bet;return pkAct(X,i,toC>0?'call':'check',0,now)||pkAct(X,i,'fold',0,now);});}
/* --- Сезон / бойова перепустка ---
   Розділ 1 «Осінній ставок» (1–30) і розділ 2 «Крижаний ставок» (31–60). Рівні дорожчають; після 60 — бонусні скрині.
   XP за роздачі має денний ліміт, з самими ботами — половина. Щоденні завдання: легке + середнє + складне, бонус за всі три.
   Тижневі випробування однакові для всіх. Старі гаманці (до bp:2) перераховуються в нову криву без втрати відкритих рівнів. */
const PS_SEASON={id:'S1',name:'Осінній ставок',end:'2026-12-31',lvls:60,prem:2500,ch2:31,ch2name:'Крижаний ставок',handCap:250,trio:60,bonusXp:600};
const PS_COST=l=>l<=10?120:l<=20?180:l<=30?250:l<=40?350:l<=50?450:550;
const PS_THR=(()=>{const a=[0];for(let l=1;l<=PS_SEASON.lvls;l++)a[l]=a[l-1]+PS_COST(l);return a;})();
const PS_SKINS={
 back:{classic:['Класика','бірюзова сорочка'],duck:['Каченята','жовтий візерунок'],pumpkin:['Гарбуз','хелловінська'],gold:['Золото','чорна з золотом'],neon:['Неон','фіолетово-бірюзова'],marble:['Мармур','світлий камінь'],diamond:['Діамант','легенда батл пасу'],
   ice:['Крига','блакитний іній'],ember:['Жар','вугілля з іскрами'],aurora:['Полярне сяйво','зелено-фіолетова'],crown:['Корона','легенда розділу 2']},
 felt:{green:['Зелене сукно','класика'],blue:['Синє сукно','спокійне'],night:['Нічне','темно-синє'],burgundy:['Бордо','як у казино'],ocean:['Океан','бірюзово-синє'],royal:['Королівське','фіолетове'],
   frost:['Морозне','сріблясто-блакитне'],ember:['Жаровня','темно-червоне'],aurora:['Сяйво','північне']},
 frame:{none:['Без рамки',''],silver:['Срібло',''],gold:['Золото',''],fire:['Вогонь',''],ice:['Лід',''],frost:['Іній',''],aurora:['Сяйво',''],crown:['Корона','']},
 title:{none:['Без титулу',''],rookie:['Новачок столу',''],cold:['Холоднокровний',''],shark:['Акула ставка',''],bluff:['Майстер блефу',''],king:['Король ставка',''],
   grinder:['Невтомний',''],icy:['Крижане серце',''],whale:['Кит банку',''],legend:['Легенда ставка','']}};
const PS_TOP=['diamond','king','crown','legend'];
function psR(t,v){return {t,v};}
const PS_FREE={1:psR('coins',200),2:psR('back','duck'),3:psR('coins',300),4:psR('title','rookie'),5:psR('chest',1),6:psR('felt','blue'),7:psR('coins',400),8:psR('frame','silver'),9:psR('coins',500),10:psR('back','pumpkin'),
 11:psR('coins',300),12:psR('chest',1),13:psR('coins',400),14:psR('felt','night'),15:psR('coins',1000),16:psR('coins',400),17:psR('chest',1),18:psR('title','cold'),19:psR('coins',500),20:psR('back','gold'),
 21:psR('coins',500),22:psR('chest',1),23:psR('coins',600),24:psR('frame','gold'),25:psR('title','king'),26:psR('chest',1),27:psR('coins',700),28:psR('coins',1500),29:psR('chest',1),30:psR('felt','royal'),
 31:psR('coins',400),32:psR('chest',1),33:psR('title','grinder'),34:psR('coins',500),35:psR('back','ice'),36:psR('chest',1),37:psR('coins',600),38:psR('frame','frost'),39:psR('coins',600),40:psR('felt','frost'),
 41:psR('chest',1),42:psR('coins',700),43:psR('title','icy'),44:psR('coins',800),45:psR('back','ember'),46:psR('chest',1),47:psR('coins',900),48:psR('coins',900),49:psR('chest',2),50:psR('felt','ember'),
 51:psR('coins',1000),52:psR('chest',2),53:psR('coins',1000),54:psR('title','whale'),55:psR('coins',1200),56:psR('chest',2),57:psR('coins',1500),58:psR('chest',2),59:psR('coins',2000),60:psR('title','legend')};
const PS_PREM={1:psR('coins',500),2:psR('back','neon'),3:psR('coins',500),4:psR('felt','burgundy'),5:psR('chest',2),6:psR('frame','fire'),7:psR('coins',700),8:psR('title','bluff'),9:psR('coins',700),10:psR('back','marble'),
 11:psR('coins',800),12:psR('chest',2),13:psR('coins',800),14:psR('felt','ocean'),15:psR('coins',1500),16:psR('frame','ice'),17:psR('chest',2),18:psR('coins',1000),19:psR('coins',1000),20:psR('title','shark'),
 21:psR('coins',1000),22:psR('chest',2),23:psR('coins',1200),24:psR('coins',1200),25:psR('chest',3),26:psR('coins',1500),27:psR('coins',1500),28:psR('chest',3),29:psR('coins',2000),30:psR('back','diamond'),
 31:psR('back','aurora'),32:psR('coins',800),33:psR('chest',2),34:psR('felt','aurora'),35:psR('coins',1000),36:psR('frame','aurora'),37:psR('coins',1000),38:psR('chest',2),39:psR('coins',1200),40:psR('coins',1500),
 41:psR('chest',3),42:psR('coins',1200),43:psR('coins',1200),44:psR('chest',2),45:psR('coins',1500),46:psR('coins',1500),47:psR('chest',3),48:psR('coins',1800),49:psR('coins',1800),50:psR('frame','crown'),
 51:psR('coins',2000),52:psR('chest',3),53:psR('coins',2000),54:psR('coins',2000),55:psR('chest',3),56:psR('coins',2500),57:psR('coins',2500),58:psR('chest',4),59:psR('coins',3000),60:psR('back','crown')};
/* Події з роздачі: hand, sd (дійшов до розкриття), win, sdwin, hwin (виграш із живим суперником), big800, big3000,
   straight / flush / fullhouse (виграш на розкритті з такою або сильнішою комбінацією), aiwin, streak (серія перемог), dq (виконане щоденне) */
const PS_QD=[
 {id:'h15',tier:1,ev:'hand',g:15,xp:50,t:'Зіграй 15 роздач'},{id:'sd3',tier:1,ev:'sd',g:3,xp:50,t:'Дійди до розкриття карт 3 рази'},{id:'w3',tier:1,ev:'win',g:3,xp:55,t:'Виграй 3 банки'},
 {id:'w6',tier:2,ev:'win',g:6,xp:90,t:'Виграй 6 банків'},{id:'sdw2',tier:2,ev:'sdwin',g:2,xp:90,t:'Виграй 2 рази на розкритті карт'},{id:'hum3',tier:2,ev:'hwin',g:3,xp:100,t:'Виграй 3 банки в живих гравців'},
 {id:'big8',tier:2,ev:'big800',g:1,xp:90,t:'Виграй банк від 800 🪙'},{id:'h40',tier:2,ev:'hand',g:40,xp:100,t:'Зіграй 40 роздач'},
 {id:'str',tier:3,ev:'straight',g:1,xp:120,t:'Виграй на розкритті зі стрітом або сильніше'},{id:'stk2',tier:3,ev:'streak',g:2,xp:120,max:true,t:'Виграй 2 роздачі поспіль'},
 {id:'aiw',tier:3,ev:'aiwin',g:1,xp:130,t:'Піди ва-банк і виграй'},{id:'fl',tier:3,ev:'flush',g:1,xp:140,t:'Виграй на розкритті з флешем або сильніше'}];
const PS_QW=[{id:'ww20',ev:'win',g:20,xp:300,t:'Виграй 20 банків'},{id:'wh120',ev:'hand',g:120,xp:300,t:'Зіграй 120 роздач'},{id:'wfh',ev:'fullhouse',g:1,xp:350,t:'Виграй на розкритті з фул-хаусом або сильніше'},
 {id:'wbig',ev:'big3000',g:1,xp:350,t:'Виграй банк від 3 000 🪙'},{id:'wstk3',ev:'streak',g:3,xp:350,max:true,t:'Виграй 3 роздачі поспіль'},{id:'whum8',ev:'hwin',g:8,xp:350,t:'Виграй 8 банків у живих гравців'},
 {id:'wdq',ev:'dq',g:10,xp:300,t:'Виконай 10 щоденних завдань'}];
const PS_TIER=['','легке','середнє','складне'];
function psHash(s){let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h;}
function psQuests(sid){const d=ymd(new Date());let h=psHash(sid+d);return [1,2,3].map(t=>{const pool=PS_QD.filter(q=>q.tier===t);const q=pool[h%pool.length];h=psHash(String(h));return q;});}
function psWeekId(){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return ymd(d);}
function psWeekLeft(){const d=parseYmd(psWeekId());d.setDate(d.getDate()+7);return Math.max(1,Math.ceil((d.getTime()-Date.now())/864e5));}
function psWQuests(){const pool=PS_QW.slice();let h=psHash('wk'+psWeekId());const out=[];while(out.length<3){out.push(pool.splice(h%pool.length,1)[0]);h=psHash(String(h));}return out;}
/* XP з урахуванням перерахунку старого гаманця (100 XP на рівень, 30 рівнів) у нову криву */
function psXp(w){const x=+(w&&w.xp)||0;if(w&&w.bp===2)return x;const L=Math.min(30,Math.floor(x/100));
  return L<30?PS_THR[L]+Math.round((x-L*100)/100*PS_COST(L+1)):PS_THR[30]+Math.round((x-3000)*.5);}
function psMig(w){if(!w||w.bp===2)return;w.xp=psXp(w);w.bp=2;}
function psLevel(w){const x=psXp(w);let L=0;while(L<PS_SEASON.lvls&&x>=PS_THR[L+1])L++;return L;}
function psBonusN(w){const x=psXp(w)-PS_THR[PS_SEASON.lvls];return x<0?0:Math.max(0,Math.floor(x/PS_SEASON.bonusXp)-((w&&w.bxc)||0));}
function psDaysLeft(){return Math.max(0,Math.ceil((parseYmd(PS_SEASON.end).getTime()+864e5-Date.now())/864e5));}
function psQState(w){const d=ymd(new Date());return w.q&&w.q.day===d&&w.q.v===2?w.q:{day:d,v:2,p:{},done:[]};}
function psWState(w){const k=psWeekId();return w.wq&&w.wq.wk===k?w.wq:{wk:k,p:{},done:[]};}
function psBump(w,ev,n,msgs){const sid=(myStaff()||{}).id||'';const q=psQState(w);w.q=q;const wq=psWState(w);w.wq=wq;
  const apply=(list,st,daily)=>list.forEach(Q=>{if(Q.ev!==ev||st.done.includes(Q.id))return;st.p[Q.id]=Q.max?Math.max(st.p[Q.id]||0,n):(st.p[Q.id]||0)+n;
    if(st.p[Q.id]>=Q.g){st.done.push(Q.id);w.xp=(w.xp||0)+Q.xp;msgs.push((daily?'Завдання':'Випробування тижня')+' «'+Q.t+'» · +'+Q.xp+' XP');
      if(daily){psBump(w,'dq',1,msgs);if(!q.trio&&psQuests(sid).every(x=>q.done.includes(x.id))){q.trio=1;w.xp+=PS_SEASON.trio;msgs.push('Усі завдання дня виконано · +'+PS_SEASON.trio+' XP');}}}});
  apply(psQuests(sid),q,true);apply(psWQuests(),wq,false);}
function psOwned(w,kind,id){if(id==='classic'||id==='green'||id==='none')return true;return ((w.own||{})[kind]||[]).includes(id);}
function psGrant(w,r,msgs){if(r.t==='coins'){w.bal=(w.bal||0)+r.v;msgs.push('+'+pkCoins(r.v)+' '+PK_COIN);}
  else if(r.t==='chest'){for(let k=0;k<r.v;k++){const roll=Math.random();const lock=Object.entries(PS_SKINS).flatMap(([kind,o])=>Object.keys(o).filter(id=>!psOwned(w,kind,id)&&!PS_TOP.includes(id)).map(id=>[kind,id]));
      if(roll<.25&&lock.length){const [kind,id]=lock[Math.floor(Math.random()*lock.length)];w.own=w.own||{};(w.own[kind]=w.own[kind]||[]).push(id);msgs.push('Скриня: '+PS_SKINS[kind][id][0]);}
      else{const c=[150,250,400,600,1000][Math.floor(Math.random()*Math.random()*5)];w.bal=(w.bal||0)+c;msgs.push('Скриня: +'+pkCoins(c)+' '+PK_COIN);}}}
  else{w.own=w.own||{};const a=(w.own[r.t]=w.own[r.t]||[]);if(!a.includes(r.v))a.push(r.v);msgs.push('Нове: '+PS_SKINS[r.t][r.v][0]);}}
function psRewardTxt(r){if(r.t==='coins')return [PK_COIN,pkCoins(r.v)];if(r.t==='chest')return ['🎁',r.v>1?'Скриня ×'+r.v:'Скриня'];const lab={back:'Сорочка карт',felt:'Сукно столу',frame:'Рамка',title:'Титул'}[r.t];return [{back:'🂠',felt:'🟩',frame:'◯',title:'🏷'}[r.t],PS_SKINS[r.t][r.v][0],lab];}
async function psClaim(lvl,prem){const msgs=[];const ok=await walMut(w=>{if(psLevel(w)<lvl)return false;if(prem&&!w.prem)return false;w.cl=w.cl||{f:[],p:[]};const arr=prem?w.cl.p:w.cl.f;if(arr.includes(lvl))return false;arr.push(lvl);psGrant(w,(prem?PS_PREM:PS_FREE)[lvl],msgs);});
  if(ok){SND.play('level');S.psJust=[(prem?'p':'f')+lvl];toast(msgs.join(' · ')||'Отримано');setTimeout(()=>{S.psJust=null;},900);}if(!psPatch())render();}
async function psClaimAll(){const msgs=[];S.psJust=[];await walMut(w=>{const L=psLevel(w);w.cl=w.cl||{f:[],p:[]};let n=0;for(let l=1;l<=L;l++){if(!w.cl.f.includes(l))S.psJust.push('f'+l);if(w.prem&&!w.cl.p.includes(l))S.psJust.push('p'+l);}for(let l=1;l<=L;l++){if(!w.cl.f.includes(l)){w.cl.f.push(l);psGrant(w,PS_FREE[l],msgs);n++;}if(w.prem&&!w.cl.p.includes(l)){w.cl.p.push(l);psGrant(w,PS_PREM[l],msgs);n++;}}if(!n)return false;});
  if(msgs.length)SND.play('level');toast(msgs.length?'Отримано '+msgs.length+' '+plural(msgs.length,'нагороду','нагороди','нагород'):'Немає нових нагород');setTimeout(()=>{S.psJust=null;},900);if(!psPatch())render();}
async function psClaimBonus(){const msgs=[];let n=0;await walMut(w=>{n=psBonusN(w);if(!n)return false;for(let k=0;k<n;k++)psGrant(w,psR('chest',w.prem?2:1),msgs);w.bxc=(w.bxc||0)+n;});
  if(n){SND.play('level');toast(msgs.join(' · '));}if(!psPatch())render();}
async function psBuyPrem(){const m=myStaff();if(!m)return;confirmSheet('Відкрити преміум-доріжку за '+pkCoins(PS_SEASON.prem)+' '+PK_COIN+'?','Відкрити',async()=>{
  const ok=await walMut(w=>{if(w.prem)return false;if((w.bal||0)<PS_SEASON.prem)return false;w.bal-=PS_SEASON.prem;w.prem=true;});toast(ok?'Преміум відкрито — заберіть нагороди':'Недостатньо '+PK_COIN);render();});}
async function psEquip(kind,id){const m=myStaff();await walMut(w=>{if(!psOwned(w,kind,id))return false;w.eq=w.eq||{};w.eq[kind]=id;});
  for(const T of pkTables()){const i=pkMySeat(T);if(i>=0)await pkMut(T.id,X=>{if(!X.seats[i])return false;X.seats[i].sk=Object.assign({},X.seats[i].sk,{[kind]:id});});}render();}
/* Нарахування за роздачі: кожен клієнт рахує лише себе */
const _psSeen=new Set();
function pkProgress(){const m=myStaff();if(!m||!canPoker())return;for(const T of pkTables()){const i=pkMySeat(T);const h=T.hand;if(i<0||!h||h.street!=='done'||!h.res||!h.p||!h.p[i])continue;
  const key=T.id+':'+h.n;if(_psSeen.has(key))continue;_psSeen.add(key);const w=pkWal(m.id);if((w.lh||[]).includes(key))continue;
  const p=h.p[i];const won=h.res.wins.find(x=>x.i===i);const sd=(h.res.show||[]).includes(i);const rank=sd&&h.res.ev&&h.res.ev[i]?PK_HN.indexOf(h.res.ev[i]):-1;const msgs=[];
  walMut(W=>{W.lh=(W.lh||[]).concat(key).slice(-30);if((W.lh||[]).filter(k=>k===key).length>1)return false;const L0=psLevel(W);
    const hum=pkHumans(T)>=2;const d=ymd(new Date());if(!W.hx||W.hx.day!==d)W.hx={day:d,v:0};
    let xp=3;if(!p.f)xp+=4;if(won){xp+=8;if(sd)xp+=4;if(won.amt>=(T.bb||20)*15)xp+=4;}if(!hum)xp=Math.ceil(xp/2);
    const give=Math.max(0,Math.min(xp,PS_SEASON.handCap-W.hx.v));W.hx.v+=give;W.xp=(W.xp||0)+give;
    if(give<xp&&!W.hx.warn){W.hx.warn=1;msgs.push('Денний ліміт XP за роздачі вичерпано — завдання й випробування ще дають XP');}
    W.st=W.st||{h:0,w:0,big:0};W.st.h++;if(won){W.st.w++;W.st.big=Math.max(W.st.big||0,won.amt);}W.ws=won?(W.ws||0)+1:0;
    psBump(W,'hand',1,msgs);if(sd)psBump(W,'sd',1,msgs);
    if(won){psBump(W,'win',1,msgs);psBump(W,'streak',W.ws,msgs);if(sd)psBump(W,'sdwin',1,msgs);if(hum)psBump(W,'hwin',1,msgs);if(won.amt>=800)psBump(W,'big800',1,msgs);if(won.amt>=3000)psBump(W,'big3000',1,msgs);
      if(p.a)psBump(W,'aiwin',1,msgs);if(sd&&rank>=4)psBump(W,'straight',1,msgs);if(sd&&rank>=5)psBump(W,'flush',1,msgs);if(sd&&rank>=6)psBump(W,'fullhouse',1,msgs);}
    const L1=psLevel(W);if(L1>L0)msgs.push(L1===PS_SEASON.ch2?'Відкрито розділ 2 «'+PS_SEASON.ch2name+'» · рівень '+L1+'!':'Новий рівень батл пасу: '+L1+'!');else if(L1>=PS_SEASON.lvls&&psBonusN(W)>0&&msgs.length===0)msgs.push('Бонусна скриня готова!');})
   .then(()=>{if(msgs.length)toast(msgs[msgs.length-1]);if(S.tab==='fun'&&S.funGame==='poker'&&!S.pkTab)render();});}}
/* Візуал сезону */
function psPending(w){if(!w)return 0;const L=psLevel(w),cl=w.cl||{f:[],p:[]};let n=psBonusN(w);for(let l=1;l<=L;l++){if(!(cl.f||[]).includes(l))n++;if(w.prem&&!(cl.p||[]).includes(l))n++;}return n;}
function psMyPending(){const m=myStaff();return m&&canPoker()?psPending(pkWal(m.id)):0;}
function psView(){const m=myStaff();const w=m?pkWal(m.id):{};const L=psLevel(w);const xp=psXp(w);const max=L>=PS_SEASON.lvls;const need=max?PS_SEASON.bonusXp:PS_COST(L+1);
  const inL=max?(xp-PS_THR[PS_SEASON.lvls])%PS_SEASON.bonusXp:xp-PS_THR[L];const cl=w.cl||{f:[],p:[]};const out=[];const bon=psBonusN(w);const ch=L>=PS_SEASON.ch2-1?2:1;
  const pend=[...Array(L)].map((_,k)=>k+1).reduce((a,l)=>a+(cl.f.includes(l)?0:1)+(w.prem&&!cl.p.includes(l)?1:0),0);
  out.push(el('section',{class:'card ps-head'},el('div',{class:'ps-hl'},el('span',{class:'eyebrow',text:'Батл пас · розділ '+ch}),el('h3',{text:ch===2?PS_SEASON.ch2name:PS_SEASON.name}),
      el('small',{class:'muted',text:'До кінця сезону '+psDaysLeft()+' '+plural(psDaysLeft(),'день','дні','днів')+' · '+PS_SEASON.lvls+' рівнів, далі — бонусні скрині'})),
    el('div',{class:'ps-lv'},el('span',{class:'ps-badge'},el('small',{text:'рівень'}),el('b',{text:String(L)})),el('div',{class:'ps-xp'},el('div',{class:'ps-bar'},el('i',{style:'width:'+Math.min(100,inL/need*100)+'%'})),
      el('small',{class:'muted',text:max?inL+' / '+need+' XP до бонусної скрині':inL+' / '+need+' XP до рівня '+(L+1)}))),
    el('div',{class:'ps-acts'},bon?el('button',{type:'button',class:'btn ps-bonus',onclick:psClaimBonus},'🎁 Бонусна скриня'+(bon>1?' ×'+bon:'')):null,pend?el('button',{type:'button',class:'btn',onclick:psClaimAll},'Забрати все ('+pend+')'):null,
      w.prem?el('span',{class:'ps-prem on',text:'★ Преміум'}):el('button',{type:'button',class:'btn ghost',onclick:psBuyPrem},'★ Преміум за '+pkCoins(PS_SEASON.prem)+' '+PK_COIN))));
  const cell=(lvl,prem)=>{const r=(prem?PS_PREM:PS_FREE)[lvl];const [ic,nm,lab]=psRewardTxt(r);const got=(prem?cl.p:cl.f).includes(lvl);const open=L>=lvl&&(!prem||w.prem);
    const key=(prem?'p':'f')+lvl;return el('button',{type:'button','data-k':key,class:'ps-c'+(prem?' prem':'')+(got?' got':open?' ready':' lock')+(S.psJust&&S.psJust.includes(key)?' just':'')+' t-'+r.t,disabled:open&&!got?null:true,onclick:()=>psClaim(lvl,prem),title:(lab?lab+': ':'')+nm},
      r.t==='back'?pkCard(null,'bk-'+r.v+' ps-cv'):r.t==='felt'?el('span',{class:'ps-felt fl-'+r.v}):el('span',{class:'ps-ic',text:ic}),el('small',{text:nm}),got?el('span',{class:'ps-ok',text:'✓'}):!open?el('span',{class:'ps-lk',text:prem&&!w.prem?'★':'🔒'}):null);};
  const track=el('div',{class:'ps-track'},el('div',{class:'ps-rows'},el('span',{class:'ps-rl',text:'Безкоштовно'}),el('span',{class:'ps-rl prem',text:'★ Преміум'})),
    [...Array(PS_SEASON.lvls)].flatMap((_,k)=>{const l=k+1;const col=el('div',{class:'ps-col'+(l===L+1?' next':'')+(l<=L?' done':''),'data-l':String(l),title:PS_COST(l)+' XP'},el('span',{class:'ps-n',text:String(l)}),cell(l,false),cell(l,true));
      return l===PS_SEASON.ch2?[el('div',{class:'ps-chap'+(L>=l-1?' on':'')},el('span',{text:'❄'}),el('b',{text:'Розділ 2'}),el('small',{text:PS_SEASON.ch2name})),col]:[col];}));
  const tw=el('div',{class:'card ps-tw',onscroll:e=>{S.psSL=e.currentTarget.scrollLeft;}},track);out.push(tw);if(S.psSL==null)setTimeout(()=>{const n=track.querySelector('.ps-col.next')||track.querySelector('.ps-col:last-child');if(n&&tw.isConnected){tw.scrollLeft=Math.max(0,n.offsetLeft-120);S.psSL=tw.scrollLeft;}},0);
  const qrow=(Q,st,tag)=>{const v=Math.min(Q.g,st.p[Q.id]||0);const done=st.done.includes(Q.id);return el('div',{class:'ps-qi'+(done?' done':'')},el('span',{class:'ps-qc',text:done?'✓':''}),
    el('div',{class:'ps-qt'},el('b',{},tag?el('span',{class:'ps-tier t'+Q.tier,text:tag}):null,Q.t),el('div',{class:'ps-bar sm'},el('i',{style:'width:'+v/Q.g*100+'%'}))),el('span',{class:'ps-qx'},el('b',{text:'+'+Q.xp}),' XP'),el('small',{class:'muted',text:v+'/'+Q.g}));};
  const qs=m?psQuests(m.id):[];const q=psQState(w);const hx=w.hx&&w.hx.day===ymd(new Date())?w.hx.v:0;
  out.push(el('div',{class:'card ps-q'},el('div',{class:'row between'},el('h3',{style:'margin:0',text:'Завдання дня'}),el('small',{class:'muted',text:'оновлюються щодня'})),
    qs.map(Q=>qrow(Q,q,PS_TIER[Q.tier])),
    el('div',{class:'ps-trio'+(q.trio?' done':'')},el('span',{text:q.trio?'✓':'★'}),el('span',{text:q.trio?'Усі три виконано — бонус отримано':'Виконайте всі три — ще +'+PS_SEASON.trio+' XP'})),
    el('div',{class:'ps-cap'},el('div',{class:'row between'},el('small',{class:'muted',text:'XP за роздачі сьогодні'}),el('small',{},el('b',{text:String(hx)}),' / '+PS_SEASON.handCap)),el('div',{class:'ps-bar sm'},el('i',{style:'width:'+Math.min(100,hx/PS_SEASON.handCap*100)+'%'})),
      el('small',{class:'muted',text:'Роздача: 3 XP, дограв до кінця +4, перемога +8, на розкритті +4, великий банк +4. Тільки з ботами — половина. Завдання в ліміт не входять.'}))));
  const wq=psWState(w);out.push(el('div',{class:'card ps-q ps-wk'},el('div',{class:'row between'},el('h3',{style:'margin:0',text:'Випробування тижня'}),el('small',{class:'muted',text:'однакові для всіх · ще '+psWeekLeft()+' '+plural(psWeekLeft(),'день','дні','днів')})),
    psWQuests().map(Q=>qrow(Q,wq,null))));
  const st=w.st||{};out.push(el('div',{class:'ps-stats'},[['Роздач',st.h||0],['Перемог',st.w||0],['Найбільший банк',pkCoins(st.big||0)],['XP усього',xp]].map(([l,v])=>el('div',{class:'card mt-k'},el('span',{class:'mt-kl',text:l}),el('b',{text:String(v)})))));
  return out;}
function psCollection(){const m=myStaff();const w=m?pkWal(m.id):{};const eq=w.eq||{};const out=[];const lab={back:'Сорочки карт',felt:'Сукно столу',frame:'Рамки аватара',title:'Титули'};
  Object.entries(PS_SKINS).forEach(([kind,o])=>{out.push(el('div',{class:'card ps-coll'},el('h3',{text:lab[kind]}),el('div',{class:'ps-sk'},Object.entries(o).map(([id,[nm,d]])=>{const own=psOwned(w,kind,id);const on=(eq[kind]||({back:'classic',felt:'green'}[kind]||'none'))===id;
    return el('button',{type:'button',class:'ps-s'+(on?' on':'')+(own?'':' lock'),disabled:own&&!on?null:true,onclick:()=>psEquip(kind,id)},
      kind==='back'?pkCard(null,'bk-'+id+' ps-cv'):kind==='felt'?el('span',{class:'ps-felt fl-'+id}):kind==='frame'?el('span',{class:'av ps-fr fr-'+id,text:m?m.name[0]:'?'}):el('span',{class:'ps-ic',text:'🏷'}),
      el('b',{text:nm}),el('small',{text:on?'вибрано':own?(d||'натисніть, щоб вибрати'):'відкривається в батл пасі'}));}))));});
  return out;}
