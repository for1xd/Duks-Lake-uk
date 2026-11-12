// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: boot

/* ---------- boot ---------- */
function dlsCheck(){if(!window.DLS||!DLS.active)return;if(S.loaded.staff&&S.loaded.tasks&&S.weekLoaded){DLS.stage('Майже готово…',.92);requestAnimationFrame(()=>requestAnimationFrame(()=>DLS.done()));}}
async function boot(){
  window.DLS&&DLS.stage('Підключаємось…',.12);
  const [db,user]=await Promise.all([claude.use('db'),claude.use('user')]);
  window.DLS&&DLS.stage('Завантажуємо колектив…',.35);
  S.db=db;S.user=user;
  claude.use('assets').then(a=>{S.assets=a;}).catch(()=>{S.assets=null;});
  if(user){const me=await user.me();S.me=me;S.myId=me.id;S.isOwner=me.isOwner;}
  if(!db){renderNoDb();window.DLS&&DLS.fail('Немає доступу до бази','Відкрийте застосунок за посиланням, увійшовши у свій обліковий запис Claude. Якщо не допомагає, попросіть керівника надати вам доступ.');return;}
  db.collection('staff').onSnapshot(q=>{S.staff=q.docs.map(d=>({id:d.id,...d.data()}));const first=!S.loaded.staff;S.loaded.staff=true;if(first){beat();if(window.DLS&&DLS.active){DLS.stage('Оновлюємо графік і задачі…',.65);const me=myStaff();if(me&&me.name)DLS.hi(me.name.trim().split(/\s+/)[0]);setTimeout(()=>window.DLS&&DLS.active&&DLS.done(),4000);}}render();dlsCheck();},e=>fail(e));
  db.collection('tasks').onSnapshot(q=>{S.tasks=q.docs.map(d=>({id:d.id,...d.data()}));S.loaded.tasks=true;render();dlsCheck();},e=>fail(e));
  db.collection('map_zones').onSnapshot(q=>{S.mzDb=q.docs.map(d=>({id:d.id,...d.data()})).filter(z=>Array.isArray(z.polygon)&&z.polygon.length);if(S.tab==='map'){if(S.mzEdit)mzSync();else render();}},()=>{});
  db.collection('inspections').onSnapshot(q=>{S.insp={};q.docs.forEach(d=>{S.insp[d.id]={id:d.id,...d.data()};});S.inspLoaded=true;if(S.tab==='uk')render();renderTabs();},()=>{S.inspLoaded=true;});
  db.collection('buildings_assignments').onSnapshot(q=>{S.inspAs={};q.docs.forEach(d=>{S.inspAs[d.id]=d.data()||{};});if(S.tab==='uk')render();renderTabs();},()=>{});
  db.collection('inspection_exports').onSnapshot(q=>{S.inspEx=q.docs.map(d=>({id:d.id,...d.data()}));},()=>{});
  inspLoadDrafts().then(()=>{if(S.tab==='uk')render();setTimeout(inspSync,1500);});
  db.collection('log').orderBy('at','desc').limit(400).onSnapshot(q=>{S.log=q.docs.map(d=>({id:d.id,...d.data()}));if(S.tab==='uk'&&S.fg==='dev')render();},()=>{});
  db.collection('maint').onSnapshot(q=>{S.pm=q.docs.map(d=>({id:d.id,...d.data()}));const first=!S._pmLoaded;S._pmLoaded=true;if(S.tab==='pm'||S.tab==='today')render();renderTabs();if(first){setTimeout(pmCheck,4000);setInterval(pmCheck,36e5);}},()=>{});
  db.collection('incidents').onSnapshot(q=>{S.sos=q.docs.map(d=>({id:d.id,...d.data()}));if(S.tab==='sos'||S.tab==='meet')render();if(S.db)renderTabs();},()=>{});
  db.doc('settings/main').onSnapshot(d=>{S.cfg=d.exists?(d.data()||{}):{};if(S.tab==='meet'||(S.tab==='uk'&&S.fg==='dev'))render();},()=>{});
  {const ld={};const fin=k=>{ld[k]=1;if(ld.c&&ld.o){const first=!S.clLoaded;S.clLoaded=true;if(first&&!Object.keys(S.clC||{}).length&&!Object.keys(S.clO||{}).length)setTimeout(()=>{if(!Object.keys(S.clC||{}).length&&!Object.keys(S.clO||{}).length)clSeed();},900);}if(S.tab==='uk'&&(S.fg==='clean'||!S.fg)||S.tab==='today')render();renderTabs();};
    db.collection('cl_cleaners').onSnapshot(q=>{S.clC={};q.docs.forEach(d=>{S.clC[d.id]={id:d.id,...d.data()};});fin('c');},()=>fin('c'));
    db.collection('cl_objects').onSnapshot(q=>{S.clO={};q.docs.forEach(d=>{S.clO[d.id]={id:d.id,...d.data()};});fin('o');},()=>fin('o'));
    db.collection('cl_locs').onSnapshot(q=>{S.clLoc={};q.docs.forEach(d=>{S.clLoc[d.id]={id:d.id,...d.data()};});fin('l');},()=>{});
    db.collection('cl_exc').onSnapshot(q=>{S.clExc={};q.docs.forEach(d=>{S.clExc[d.id]={id:d.id,...d.data()};});if(S.tab==='uk'&&S.fg==='clean')render();},()=>{});
    db.collection('cl_revisions').onSnapshot(q=>{S.clRev={};q.docs.forEach(d=>{S.clRev[d.id]={id:d.id,...d.data()};});fin('r');},()=>{});
    clLoadQ();}
  db.collection('docs').onSnapshot(q=>{S.dk={};q.docs.forEach(d=>{S.dk[d.id]={id:d.id,...d.data()};});S.dkLoaded=true;if(!q.docs.length)setTimeout(()=>{if(!Object.keys(S.dk||{}).length)dkSeed();},800);if(S.tab==='uk'&&(S.fg==='docs'||!S.fg))render();},()=>{S.dkLoaded=true;});
  db.collection('consItems').onSnapshot(q=>{S.consI=q.docs.map(d=>({id:d.id,...d.data()}));if(S.tab==='uk')render();},()=>{});
  db.collection('consOps').onSnapshot(q=>{S.consO=q.docs.map(d=>({id:d.id,...d.data()}));if(S.tab==='uk')render();},()=>{});
  db.collection('consHist').onSnapshot(q=>{S.consH=q.docs.map(d=>({id:d.id,...d.data()}));if(S.tab==='uk'&&S.consTab==='hist')render();},()=>{});
  db.collection('inv').onSnapshot(q=>{S.inv={};q.docs.forEach(d=>{S.inv[d.id]=d.data()||{};});if(S.tab==='uk'||S.tab==='meet')render();},e=>fail(e));
  db.collection('parking').onSnapshot(q=>{S.pk={};q.docs.forEach(d=>{S.pk[d.id]=d.data()||{};});if(S.tab==='uk'||S.tab==='meet')render();},e=>fail(e));
  db.collection('waste').onSnapshot(q=>{S.ws={};q.docs.forEach(d=>{S.ws[d.id]=d.data()||{};});if(S.tab==='uk'||S.tab==='meet')render();},e=>fail(e));
  db.collection('dzSnap').onSnapshot(q=>{S.dzSnap={};q.docs.forEach(d=>{S.dzSnap[d.id]=d.data()||{};});if(S.tab==='uk'||S.tab==='meet')render();},()=>{});
  db.collection('dz').onSnapshot(q=>{S.dz={};S.dzLoaded=true;q.docs.forEach(d=>{S.dz[d.id]=d.data()||{};});if(S.tab==='uk'||S.tab==='meet')render();},e=>fail(e));
  db.collection('wObjects').onSnapshot(q=>{S.wObj=q.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(a.order||0)-(b.order||0));if(S.tab==='uk'||S.tab==='meet')render();},e=>fail(e));
  db.collection('wMeters').onSnapshot(q=>{S.wMet=q.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(a.order||0)-(b.order||0));if(S.tab==='uk'||S.tab==='meet')render();},e=>fail(e));
  db.collection('wPeriods').onSnapshot(q=>{S.wPerD={};q.docs.forEach(d=>{S.wPerD[d.id]=d.data()||{};});if(S.tab==='uk'||S.tab==='meet')render();},e=>fail(e));
  db.collection('poker').onSnapshot(q=>{S.pkT=q.docs.map(d=>({id:d.id,...d.data()}));try{pkProgress();}catch(e){}setTimeout(()=>pkClaimOwed(),400);setTimeout(()=>pkJanitor(),1500);if(S.tab==='fun'&&S.funGame==='poker')pkRefresh();},()=>{});
  db.collection('wallets').onSnapshot(q=>{S.wal={};q.docs.forEach(d=>{S.wal[d.id]=d.data();});if(S.tab==='fun'&&S.funGame==='poker')pkRefresh();},()=>{});
  db.collection('games').onSnapshot(q=>{S.games=q.docs.map(d=>({id:d.id,...d.data()}));if(S.tab==='fun')render();},e=>fail(e));
  db.collection('shifts').onSnapshot(q=>{S.shifts=q.docs.map(d=>({id:d.id,...d.data()}));if(S.tab==='shift'||S.tab==='today')render();},e=>fail(e));
  db.collection('tickets').onSnapshot(q=>{S.tickets=q.docs.map(d=>({id:d.id,...d.data()}));if(S.tab==='support'||S.tab==='ticket')render();else renderTabs();},e=>fail(e));
  db.collection('requests').onSnapshot(async q=>{S.requests=q.docs.map(d=>({id:d.id,...d.data()}));
    if(user&&S.requests.length){S.profiles=await user.profiles(S.requests.map(r=>r.id));}render();},e=>fail(e));
  db.collection('chat').orderBy('at','desc').limit(400).onSnapshot(q=>{const prev=new Set(S.chat.map(x=>x.id));S.chat=q.docs.map(d=>({id:d.id,...d.data()})).reverse();
    if(S.tab==='chat'&&!S.chatStick&&prev.size){S.belowNew=(S.belowNew||0)+S.chat.filter(x=>!prev.has(x.id)&&x.by!==S.myId&&roomOf(x)===curRoom()).length;}render();},e=>fail(e));
  db.collection('presence').onSnapshot(q=>{S.pres={};q.docs.forEach(d=>{S.pres[d.id]=d.data()||{};});if(S.tab==='team'||S.tab==='chat')render();},e=>fail(e));
  setInterval(()=>{if(document.visibilityState==='visible')beat();},60000);
  setInterval(()=>{if(S.tab==='team'||S.tab==='chat')render();},30000);
  document.addEventListener('visibilitychange',()=>beat(document.visibilityState!=='visible'));
  window.addEventListener('pagehide',()=>{beat(true);pkAway(true,true);});
  document.addEventListener('visibilitychange',()=>pkAway(document.visibilityState!=='visible'));
  db.collection('rooms').onSnapshot(q=>{S.rooms={};q.docs.forEach(d=>{S.rooms[d.id]=d.data()||{};});if(S.tab==='chat')render();else renderTabs();},e=>fail(e));
  db.collection('reads').onSnapshot(q=>{S.reads={};S.readsR={};q.docs.forEach(d=>{const v=d.data()||{};S.reads[d.id]=v.at||0;S.readsR[d.id]=v.rooms||{};});if(S.tab==='chat')render();},e=>fail(e));
  document.addEventListener('visibilitychange',()=>{if(S.tab==='chat'&&document.visibilityState==='visible')markChatSeen();});
  buildComposer();initEdgeSwipe();applyTheme();
  SC().addEventListener('scroll',()=>{if(S.tab==='chat'){const e=SC();S.chatStick=e.scrollTop+e.clientHeight>=e.scrollHeight-120;if(S.chatStick)S.belowNew=0;drawFab();}},{passive:true});
  document.getElementById('toBottom').addEventListener('click',()=>{S.chatStick=true;S.belowNew=0;const e=SC();e.scrollTo({top:e.scrollHeight,behavior:'smooth'});drawFab();});
  watchWeek();
  try{const t=localStorage.getItem('dl.tab');if(t&&TABS.some(x=>x.id===t))S.tab=t;}catch(e){}
  const h=location.hash.slice(1);if(TABS.some(x=>x.id===h))S.tab=h;
  render();
}
function watchWeek(){if(unWeek)unWeek();S.week=null;S.weekExists=false;S.weekLoaded=false;
  unWeek=S.db.doc('weeks/'+S.weekStart).onSnapshot(d=>{S.weekExists=d.exists;S.week=d.exists?d.data():null;if(S.week&&S.scQ&&S.scQWs===S.weekStart){S.week.days=S.week.days||{};Object.assign(S.week.days,S.scQ);}S.weekLoaded=true;dlsCheck();render();},e=>fail(e));}
function fail(e){if(e&&e.code==='revoked')return;console.warn(e);if(window.DLS&&DLS.active&&!S.loaded.staff){DLS.fail('Немає зв’язку з базою','Перевірте інтернет і спробуйте ще раз. Якщо не допомагає, зверніться до Віталія Головньова.');return;}toast('Немає зв’язку з базою. Спробуйте оновити сторінку.');}
async function write(fn,okMsg){try{await fn();if(okMsg){toast(okMsg);devLog(okMsg);}}catch(e){logErr('Запис: '+((e&&(e.code||e.message))||e),okMsg||'');
  if(e&&e.code==='unavailable'){await new Promise(r=>setTimeout(r,600+Math.random()*600));try{await fn();if(okMsg)toast(okMsg);return;}catch(e2){}}
  console.warn('write failed',e);
  toast(e&&e.code==='quota_exceeded'?'База заповнена: видаліть старі задачі.':(e&&(e.code==='invalid_argument'||e.code==='not_granted')?'У вас доступ лише для перегляду. Попросіть власника змінити ваш доступ.':'Не вдалося зберегти. Спробуйте ще раз.'));}}

function renderNoDb(){
  document.getElementById('app').replaceChildren(el('div',{class:'card empty'},
    el('h2',{text:'Немає доступу до бази'}),
    el('p',{class:'muted',text:'Відкрийте застосунок за посиланням, увійшовши у свій обліковий запис Claude. Якщо не допомагає, попросіть керівника надати вам доступ.'})));
}
