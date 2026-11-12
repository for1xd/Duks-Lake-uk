// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: PNG-звіт «Графік змін»: тиждень-таблиця 2400×1350 (1200×675 × 2), тиждень для телефону 1080×N, один день 1080×1350.

/* SCX:BEGIN — PNG-звіт «Графік змін»: тиждень-таблиця 2400×1350 (1200×675 × 2), тиждень для телефону 1080×N, один день 1080×1350.
   Окремий прихований DOM фіксованого розміру (не залежить від екрана), кольори — токени CRM для світлої й темної теми. Дані графіка не змінюються. */
const SCX_PAL={
 light:{bg:'#FFFFFF',soft:'#F4F8F7',fg:'#0F2A33',mut:'#53686F',line:'#D3DFDD',acc:'#1F6F78',accS:'#DCEEEC',accInk:'#0F4A51',head:'#1F6F78',headFg:'#FFFFFF',headMut:'#CFE7E5',we:'#FBF5EC',warnBg:'#F6E3C4',warnFg:'#6B4210',
  sh:{am:['#DCF3E9','#0E6B4A'],pm:['#FCE6DA','#9A3A12'],full:['#DDE9FA','#1D4F96'],mg:['#EAE3F9','#4E348F']}},
 dark:{bg:'#0C1A1F',soft:'#13262D',fg:'#E6F0EF',mut:'#9DB3B8',line:'#25404A',acc:'#4FB3BC',accS:'#173F45',accInk:'#A7E1E5',head:'#173F45',headFg:'#E6F0EF',headMut:'#9DB3B8',we:'#14272D',warnBg:'#3D2E15',warnFg:'#F3CF92',
  sh:{am:['#173A2E','#7FE0B6'],pm:['#3D2418','#F6A982'],full:['#172E4A','#9CC6F5'],mg:['#2A2147','#C7B5F5']}}};
const SCX_TYPE={am:'Ранкова до 13:00',pm:'Вечірня після 13:00',full:'Повний день',mg:'Менеджер 8:30–17:30'};
const SCX_GROUPS=[['manager','Менеджери'],['cleaner','Клінери'],['gardener','Садівники']];
const SCX_DAYF=['Понеділок','Вівторок','Середа','Четвер','П’ятниця','Субота','Неділя'];
function scxParse(p){if(p==='Д')return {t:'mg',a:8.5,b:17.5,txt:'8:30–17:30',h:9};const m=String(p).match(/(\d{1,2})(?::(\d{2}))?\s*[–-]\s*(\d{1,2})(?::(\d{2}))?/);
  if(!m)return {t:'note',txt:String(p),h:0};const a=+m[1]+(+m[2]||0)/60,b=+m[3]+(+m[4]||0)/60;const f=x=>Math.floor(x)+':'+pad(Math.round((x%1)*60));const h=Math.max(0,b-a);
  return {t:h>=7?'full':a<13?'am':'pm',a,b,txt:f(a)+'–'+f(b),h};}
function scxH(h){return (Math.round(h*10)/10+'').replace('.',',');}
function scxData(ws,o){const w=S.week||{};let list=schedStaff();
  const rows=list.map(s=>{const days=DS.map((_,i)=>shiftParts(dayValue(s.id,i)).map(scxParse));const all=days.flat();
    return {s,days,hrs:all.reduce((a,x)=>a+x.h,0),empty:days.every(d=>!d.length)};});
  const staffOn=i=>rows.filter(r=>r.days[i].some(x=>x.t==='am'||x.t==='pm'||x.t==='full')).length;
  const allOn=i=>rows.filter(r=>r.days[i].some(x=>x.t!=='note')).length;
  const used=['am','pm','full','mg'].filter(t=>rows.some(r=>r.days.some(d=>d.some(x=>x.t===t))));
  let minI=0;DS.forEach((_,i)=>{if(staffOn(i)<staffOn(minI))minI=i;});
  const groups=[];if(o.grp){const seen=new Set();SCX_GROUPS.forEach(([r,n])=>{const g=rows.filter(x=>x.s.role===r);g.forEach(x=>seen.add(x));if(g.length)groups.push({n,rows:g});});const rest=rows.filter(x=>!seen.has(x));if(rest.length)groups.push({n:'Інші',rows:rest});}
  else groups.push({n:null,rows});
  const main=w.responsibleId&&staffById(w.responsibleId);const rd=w.respDays||{};const hasDays=[0,1,2,3,4,5,6].some(i=>rd[i]||rd[String(i)]);
  const we=addDays(ws,6);const tIdx=isThisWeekStart(ws)?todayIdx():-1;
  return {ws,we,rows,groups,staffOn,allOn,used,minI,main,hasDays,hours:w.responsibleHours||'8:00–20:00',tIdx,
    shifts:rows.reduce((a,r)=>a+r.days.filter(d=>d.some(x=>x.t!=='note')).length,0),total:rows.reduce((a,r)=>a+r.hrs,0),week:(inspIsoWeek(parseYmd(ws)).split('W')[1]|0)};}
function isThisWeekStart(ws){return ws===mondayOf(new Date());}
function scxVars(th){const P=SCX_PAL[th];const v={'--x-bg':P.bg,'--x-soft':P.soft,'--x-fg':P.fg,'--x-mut':P.mut,'--x-line':P.line,'--x-acc':P.acc,'--x-accS':P.accS,'--x-accInk':P.accInk,'--x-head':P.head,'--x-headFg':P.headFg,'--x-headMut':P.headMut,'--x-we':P.we,'--x-warnBg':P.warnBg,'--x-warnFg':P.warnFg};
  Object.entries(P.sh).forEach(([k,[b,f]])=>{v['--x-'+k]=b;v['--x-'+k+'Fg']=f;});return Object.entries(v).map(([k,x])=>k+':'+x).join(';');}
function scxAv(s,cls){const i=S.staff.findIndex(x=>x.id===s.id);const cols=['#1F6F78','#B0742A','#5B6CD9','#2E8B5E','#C2416B','#7B5CC9','#2a78d6','#B4232A'];
  if(s.photo)return el('img',{class:'scx-av '+(cls||''),src:s.photo,alt:''});return el('span',{class:'scx-av '+(cls||''),style:'background:'+cols[(i<0?0:i)%cols.length]},(s.name||'?').trim()[0].toUpperCase());}
function scxPlate(x,big){return el('span',{class:'scx-pl t-'+x.t+(big?' tall':'')},el('b',{text:x.txt}),x.h?el('small',{text:scxH(x.h)+' год'}):null);}
function scxRoleTag(s){return el('span',{class:'scx-role r-'+(s.role||'')},roleName(s.role)||'—');}
function scxHead(D,o,compact){const resp=D.main?el('div',{class:'scx-resp'},el('small',{text:'Відповідальний за об’єкт'}),el('b',{text:D.main.name}),el('span',{text:D.hours})):D.hasDays?el('div',{class:'scx-resp'},el('small',{text:'Відповідальні за об’єкт'}),el('b',{text:'по днях — див. таблицю'}),el('span',{text:D.hours})):null;
  return el('div',{class:'scx-top'},el('div',{class:'scx-tt'},el('div',{class:'scx-eb',text:'DUCK’S LAKE · FACILITY'}),el('h1',{text:'Графік змін'}),el('div',{class:'scx-per'},el('span',{text:dm(D.ws)+' – '+dm(D.we)+'.'+D.we.slice(0,4)}),el('span',{class:'scx-wk',text:'Тиждень '+D.week}))),resp);}
function scxMetrics(D,o){const m=[['Людей у графіку',String(D.rows.length)],['Виходів на зміну',String(D.shifts)]];if(o.hrs)m.push(['Годин усього',scxH(D.total)]);
  m.push(['Найменше персоналу',DS[D.minI]+' — '+D.staffOn(D.minI),'без менеджерів']);
  return el('div',{class:'scx-ms'},m.map(([l,v,s])=>el('div',{class:'scx-m'},el('span',{text:l}),el('b',{text:v}),s?el('small',{text:s}):null)));}
function scxFoot(D){const me=myStaff();const d=new Date();
  return el('div',{class:'scx-ft'},el('div',{class:'scx-lg'},D.used.map(t=>el('span',{},el('i',{class:'t-'+t}),SCX_TYPE[t]))),el('div',{class:'scx-gen',text:'Сформовано '+dmy(d)+' о '+pad(d.getHours())+':'+pad(d.getMinutes())+' · CRM Duck’s Lake'+(me?' · '+me.name:'')}));}
/* --- 1. Тиждень, таблиця 1200×675 (×2) --- */
function scxWeekTable(D,o){
  const cell=(r,i)=>{const ps=r.days[i];if(!ps.length)return el('td',{class:'scx-c off'+(i>=5?' we':'')+(i===D.tIdx?' now':'')},el('span',{class:'scx-off',text:'вихідний'}));
    const tall=ps.find(x=>x.t==='mg'||x.t==='full');const top=ps.filter(x=>x.t==='am'||x.t==='note'),bot=ps.filter(x=>x.t==='pm');
    const box=el('div',{class:'scx-slots'});if(tall&&!top.length&&!bot.length)box.append(scxPlate(tall,true));
    else{box.append(el('div',{class:'scx-slot'},top[0]?scxPlate(top[0]):(tall?scxPlate(tall):'')),el('div',{class:'scx-slot'},bot[0]?scxPlate(bot[0]):(top[1]?scxPlate(top[1]):'')));}
    return el('td',{class:'scx-c'+(i>=5?' we':'')+(i===D.tIdx?' now':'')},box);};
  const ncol=8+(o.hrs?1:0);
  const body=[];D.groups.forEach(g=>{if(g.n)body.push(el('tr',{class:'scx-g'},el('td',{colspan:String(ncol),text:g.n.toUpperCase()+' · '+g.rows.length})));
    g.rows.forEach(r=>body.push(el('tr',{},el('td',{class:'scx-nm'},el('div',{class:'scx-who'},scxAv(r.s),el('div',{},el('b',{text:r.s.name}),scxRoleTag(r.s)))),
      ...(r.empty?[el('td',{class:'scx-c scx-none',colspan:'7'},el('span',{text:'Немає змін цього тижня'}))]:DS.map((_,i)=>cell(r,i))),o.hrs?el('td',{class:'scx-hr'},el('b',{text:scxH(r.hrs)}),el('small',{text:'год'})):null)));});
  const sumRow=(lbl,fn,warn)=>el('tr',{class:'scx-s'},el('td',{class:'scx-nm'},el('b',{text:lbl})),DS.map((_,i)=>{const n=fn(i);return el('td',{class:(i>=5?'we':'')+(i===D.tIdx?' now':'')},el('span',{class:'scx-n'+(warn&&n<2?' warn':''),text:String(n)}));}),o.hrs?el('td',{}):null);
  const resp=D.hasDays?el('tr',{class:'scx-s rs'},el('td',{class:'scx-nm'},el('b',{text:'Відповідальний'})),DS.map((_,i)=>{const s=staffById(respOn(S.week,i));return el('td',{class:(i>=5?'we':'')},el('span',{class:'scx-rn',text:s?s.name:'—'}));}),o.hrs?el('td',{}):null):null;
  const tb=el('table',{class:'scx-t'},el('colgroup',{},el('col',{style:'width:'+(o.hrs?178:188)+'px'}),DS.map(()=>el('col')),o.hrs?el('col',{style:'width:54px'}):null),
    el('thead',{},el('tr',{},el('th',{class:'scx-nm',text:'Працівник'}),DS.map((d,i)=>el('th',{class:i===D.tIdx?'now':''},el('b',{text:d}),el('span',{text:dm(addDays(D.ws,i))}))),o.hrs?el('th',{text:'Годин'}):null)),
    el('tbody',{},body,sumRow('Персонал на змінах',D.staffOn,true),sumRow('Усього на об’єкті',D.allOn,false),resp));
  return el('div',{class:'scx scx-tbl',style:scxVars(o.th)},scxHead(D,o),scxMetrics(D,o),tb,el('p',{class:'scx-note',text:'«Персонал на змінах» — клінери й садівники, без менеджерів. Менше 2 людей підсвічено.'}),scxFoot(D));}
/* --- 2. Тиждень для телефону 1080×N --- */
function scxWeekPhone(D,o){const blocks=DS.map((_,i)=>{const on=D.rows.filter(r=>r.days[i].length),off=D.rows.filter(r=>!r.days[i].length);
  return el('section',{class:'scx-day'+(i===D.tIdx?' now':'')},el('h2',{},el('span',{text:SCX_DAYF[i]+', '+dm(addDays(D.ws,i))}),i===D.tIdx?el('em',{text:'сьогодні'}):null),
    on.length?el('div',{class:'scx-ppl'},on.map(r=>el('div',{class:'scx-p'},scxAv(r.s,'big'),el('div',{class:'scx-pt'},el('b',{text:r.s.name}),el('span',{class:'scx-pr',text:roleName(r.s.role)||''})),el('div',{class:'scx-pp'},r.days[i].map(x=>scxPlate(x)))))):el('p',{class:'scx-empty',text:'Ніхто не працює'}),
    off.length?el('p',{class:'scx-offl'},el('b',{text:'Вихідні: '}),off.map(r=>r.s.name).join(', ')):null,
    el('p',{class:'scx-cnt'},'На змінах: ',el('b',{class:D.staffOn(i)<2?'warn':'',text:String(D.staffOn(i))}),' · з менеджерами: ',el('b',{text:String(D.allOn(i))})),
    D.hasDays?el('p',{class:'scx-offl'},el('b',{text:'Відповідальний: '}),(staffById(respOn(S.week,i))||{name:'—'}).name):null);});
  return el('div',{class:'scx scx-ph',style:scxVars(o.th)},scxHead(D,o,true),blocks,scxFoot(D));}
/* --- 3. Один день 1080×1350 --- */
function scxDay(D,o,i){const on=D.rows.filter(r=>r.days[i].length);const sec=(t,f)=>{const ppl=on.filter(r=>r.days[i].some(f));return ppl.length?el('section',{class:'scx-ds'},el('h2',{text:t}),
    el('div',{class:'scx-dl'},ppl.map(r=>el('div',{class:'scx-dp'},scxAv(r.s,'big'),el('div',{class:'scx-pt'},el('b',{text:r.s.name}),el('span',{class:'scx-pr',text:roleName(r.s.role)||''})),el('div',{class:'scx-pp'},r.days[i].filter(f).map(x=>scxPlate(x))))))):null;};
  const resp=staffById(respOn(S.week,i));const d=addDays(D.ws,i);
  return el('div',{class:'scx scx-dy',style:scxVars(o.th)},el('div',{class:'scx-top'},el('div',{class:'scx-tt'},el('div',{class:'scx-eb',text:'DUCK’S LAKE · FACILITY'}),el('h1',{},el('span',{text:i===D.tIdx?'Сьогодні на зміні':'На зміні'}),el('br'),el('span',{class:'scx-dd',text:DS[i]+' '+dm(d)})))),
    on.length?[sec('Ранок · до 13:00',x=>x.t==='am'||x.t==='note'),sec('Увесь день',x=>x.t==='mg'||x.t==='full'),sec('Вечір · після 13:00',x=>x.t==='pm')].filter(Boolean):el('p',{class:'scx-empty',text:'У цей день ніхто не працює'}),
    el('div',{class:'scx-db'},el('div',{},el('small',{text:'Відповідальний за об’єкт'}),el('b',{text:resp?resp.name:'—'}),el('span',{text:D.hours})),el('div',{class:'scx-dn'},el('b',{class:D.staffOn(i)<2?'warn':'',text:String(D.staffOn(i))}),el('span',{text:'персонал'}),el('b',{text:String(D.allOn(i))}),el('span',{text:'усього'}))));}
const SCX_VAR={table:{n:'Тиждень — таблиця',d:'2400×1350 · ПК, друк',W:1200,H:675,sc:2,sfx:''},phone:{n:'Тиждень — для телефону',d:'1080 px · Telegram, Viber',W:1080,H:0,sc:1,sfx:'_телефон'},day:{n:'Один день',d:'1080×1350 · хто сьогодні на зміні',W:1080,H:1350,sc:1,sfx:''}};
function scxBuild(ws,o){const D=scxData(ws,o);return o.v==='phone'?scxWeekPhone(D,o):o.v==='day'?scxDay(D,o,o.day):scxWeekTable(D,o);}
function scxName(ws,o){const we=addDays(ws,6);if(o.v==='day')return 'Графік_DucksLake_'+DS[o.day]+'_'+dm(addDays(ws,o.day))+'.png';return 'Графік_DucksLake_'+dm(ws)+'–'+dm(we)+'.'+we.slice(0,4)+SCX_VAR[o.v].sfx+'.png';}
async function scxRender(ws,o){const V=SCX_VAR[o.v];await loadPdfLibs();if(document.fonts&&document.fonts.ready)await document.fonts.ready;
  const host=el('div',{class:'rp-host scx-host','aria-hidden':'true'});const node=scxBuild(ws,o);host.append(node);document.body.append(host);
  try{node.style.width=V.W+'px';if(V.H)node.style.height=V.H+'px';
    await Promise.all([...node.querySelectorAll('img')].map(im=>im.decode?im.decode().catch(()=>{im.replaceWith(el('span',{class:'scx-av',text:'?'}));}):null));
    let tall=false;if(V.H&&node.scrollHeight>V.H+1){node.classList.add('tight');if(node.scrollHeight>V.H+1){node.style.height='auto';tall=true;}}
    const h=V.H&&!tall?V.H:Math.ceil(node.scrollHeight);node.style.height=h+'px';
    const cv=await html2canvas(node,{scale:V.sc,backgroundColor:SCX_PAL[o.th].bg,useCORS:true,logging:false,width:V.W,height:h,windowWidth:Math.max(1300,V.W+100)});
    if(cv.width!==V.W*V.sc||cv.height!==h*V.sc)throw {code:'size',msg:'Розмір картинки '+cv.width+'×'+cv.height+' замість '+V.W*V.sc+'×'+h*V.sc};
    const blob=await new Promise(r=>cv.toBlob(r,'image/png'));if(!blob)throw {code:'encode'};return {blob,w:cv.width,h:cv.height,tall};}
  finally{if(!window.__keepScx)host.remove();}}
function scxOpts(){let o={};try{o=JSON.parse(localStorage.getItem('dl.scx')||'{}')||{};}catch(e){}const canH=hasAny(['dev','manager','director']);
  return {v:SCX_VAR[o.v]?o.v:'table',th:o.th==='dark'?'dark':'light',hrs:canH&&o.hrs!==false,grp:o.grp!==false,day:isThisWeekStart(S.weekStart)?todayIdx():0,canH};}
function scExportImg(ws){const o=scxOpts();const save=()=>{try{localStorage.setItem('dl.scx',JSON.stringify({v:o.v,th:o.th,hrs:o.hrs,grp:o.grp}));}catch(e){}};
  const thumb={table:'<rect x="3" y="6" width="26" height="16" rx="2"/><path d="M3 11h26M10 6v16"/>',phone:'<rect x="10" y="2" width="12" height="24" rx="2"/><path d="M13 7h6M13 11h6M13 15h6"/>',day:'<rect x="7" y="3" width="18" height="22" rx="2"/><path d="M11 9h10M11 13h7M11 17h9"/>'};
  const vs=el('div',{class:'scx-vs',role:'radiogroup','aria-label':'Формат'});const opts=el('div',{class:'stack',style:'gap:4px'});const prev=el('div',{class:'scx-prev','aria-label':'Попередній перегляд'});const err=el('p',{class:'iw-err',role:'alert',hidden:true});
  const tog=(id,lbl,key)=>{const c=el('input',{type:'checkbox',class:'ck',id,checked:o[key]?true:null});c.addEventListener('change',()=>{o[key]=c.checked;save();draw();});return el('label',{class:'ck-row',for:id},c,el('span',{text:lbl}));};
  const draw=()=>{vs.replaceChildren(...Object.entries(SCX_VAR).map(([k,v])=>el('button',{type:'button',role:'radio',class:'scx-vc','aria-checked':String(o.v===k),onclick:()=>{o.v=k;save();draw();}},el('span',{class:'scx-vt'},svg(thumb[k])),el('b',{text:v.n}),el('small',{text:v.d}))));
    const th=el('div',{class:'iw-seg',role:'radiogroup','aria-label':'Тема'},[['light','Світла'],['dark','Темна']].map(([k,l])=>el('button',{type:'button',role:'radio',class:'iw-sb','aria-checked':String(o.th===k),onclick:()=>{o.th=k;save();draw();}},l)));
    const day=o.v==='day'?el('div',{class:'iw-seg seven',role:'radiogroup','aria-label':'День'},DS.map((d,i)=>el('button',{type:'button',role:'radio',class:'iw-sb','aria-checked':String(o.day===i),onclick:()=>{o.day=i;draw();}},d))):null;
    opts.replaceChildren(el('fieldset',{class:'iw-fs'},el('legend',{class:'flabel',text:'Тема'}),th),day?el('fieldset',{class:'iw-fs'},el('legend',{class:'flabel',text:'День'}),day):'',o.v==='table'&&o.canH?tog('scxH','Показати години','hrs'):'',o.v==='table'?tog('scxG','Групувати за ролями','grp'):'');
    const V=SCX_VAR[o.v];const node=scxBuild(ws,o);node.style.width=V.W+'px';if(V.H)node.style.height=V.H+'px';const inner=el('div',{class:'scx-pin'},node);prev.replaceChildren(inner);
    requestAnimationFrame(()=>{const k=Math.min(1,(prev.clientWidth-2)/V.W);inner.style.transform='scale('+k+')';inner.style.width=V.W+'px';const h=(V.H||node.scrollHeight);prev.style.height=Math.min(V.H?h*k:Math.min(h*k,420),640)+'px';});};
  const go=el('button',{class:'btn',type:'button',onclick:async()=>{err.hidden=true;go.disabled=true;const t=go.textContent;go.textContent='Готуємо зображення…';
    try{const r=await scxRender(ws,o);window.__lastPng=r.blob;await saveFile(scxName(ws,o),r.blob);devLog('Графік: PNG «'+SCX_VAR[o.v].n+'» '+dm(ws));if(r.tall)toast('Людей багато, тож картинка вийшла вищою за стандарт');closeSheet();}
    catch(e){console.error(e);err.textContent=(e&&e.msg)||'Не вдалося зібрати зображення.';err.hidden=false;go.textContent='Спробувати ще раз';go.disabled=false;return;}go.disabled=false;go.textContent=t;}},'Завантажити PNG');
  openSheet(el('h2',{text:'Графік картинкою'}),el('p',{class:'muted',style:'margin:0',text:'Тиждень '+dm(ws)+' – '+dm(addDays(ws,6))+'. Картинка однакова з телефону й комп’ютера.'}),vs,opts,prev,err,
    el('div',{class:'btn-pair end'},el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'),go));
  const sh=document.querySelector('#sheetRoot .sheet');if(sh)sh.classList.add('wide');draw();}
/* SCX:END */
function viewSchedule(){
  const out=[];const ws=S.weekStart;
  const we=addDays(ws,6);const fmtD=d=>(+dm(d).slice(0,2))+' '+MON_N[+dm(d).slice(3,5)-1];
  out.push(el('div',{class:'w-per card sc-nav'},el('button',{class:'iconbtn',type:'button','aria-label':'Попередній тиждень',onclick:()=>{S.weekStart=addDays(ws,-7);watchWeek();render();}},svg('<path d="M15 5l-7 7 7 7"/>')),
    el('div',{class:'w-per-c'},el('b',{text:fmtD(ws)+' – '+fmtD(we)}),el('span',{class:'muted small'+(isThisWeek()?' sc-now':''),text:isThisWeek()?'● цей тиждень':(ws<mondayOf(new Date())?'минулий тиждень':'наступний тиждень')})),
    el('button',{class:'iconbtn',type:'button','aria-label':'Наступний тиждень',onclick:()=>{S.weekStart=addDays(ws,7);watchWeek();render();}},svg('<path d="m9 5 7 7-7 7"/>'))));
  if(!S.weekLoaded)return out;
  if(!S.weekExists){
    out.push(el('div',{class:'card empty'},el('h2',{text:'Графіка на цей тиждень ще немає'}),
      canPlan()?el('div',{class:'row',style:'justify-content:center'},
        el('button',{class:'btn',type:'button',onclick:copyPrevWeek},'Скопіювати попередній тиждень'),
        el('button',{class:'btn ghost',type:'button',onclick:scPhoto},'З фото таблиці'),
        el('button',{class:'btn ghost',type:'button',onclick:()=>write(()=>S.db.doc('weeks/'+ws).set({start:ws,days:{}}),'Порожній графік створено')},'Почати з нуля'))
      :el('p',{class:'muted',text:'Керівник додасть його найближчим часом.'})));
    return out;
  }
  const edit=canPlan();const showHrs=hasAny(['dev','manager','director']);const list=schedStaff();const tIdx=isThisWeek()?todayIdx():-1;
  const cnt=i=>list.filter(x=>isWorking(dayValue(x.id,i))).length;
  const IC_D='<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/>',IC_W='<path d="M4 6h16M4 12h16M4 18h16"/>';
  out.push(el('div',{class:'sc-bar'},el('div',{class:'sg sc-seg'},
      el('button',{type:'button','aria-pressed':String(S.schedView!=='week'),onclick:()=>{S.schedView='day';render();}},svg(IC_D),'По днях'),
      el('button',{type:'button','aria-pressed':String(S.schedView==='week'),onclick:()=>{S.schedView='week';render();}},svg(IC_W),'Весь тиждень')),
    el('div',{class:'row',style:'gap:8px'},!isThisWeek()?el('button',{class:'btn ghost sm',type:'button',onclick:()=>{S.weekStart=mondayOf(new Date());S.day=todayIdx();watchWeek();render();}},'Сьогодні'):null,
      el('button',{class:'btn ghost sm',type:'button',title:'Графік тижня картинкою: таблиця, для телефону або один день',onclick:()=>scExportImg(ws)},svg('<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="m21 17-5-5-9 9"/>'),' Завантажити PNG'))));
  if(edit)out.push(scToolbar());
  if(S.schedView!=='week'){
    out.push(el('div',{class:'sc-days'},DS.map((d,i)=>{const n=cnt(i);return el('button',{type:'button',class:'sc-day'+(i>=5?' we':'')+(i===tIdx?' now':''),'aria-pressed':String(S.day===i),onclick:()=>{S.day=i;render();}},
      el('small',{text:d}),el('b',{text:String(+dm(addDays(ws,i)).slice(0,2))}),el('span',{class:'sc-dots'},n?Array.from({length:Math.min(n,5)},()=>el('i')):el('em',{text:'—'})));})));
    const n=cnt(S.day);
    out.push(el('div',{class:'row between'},el('span',{style:'font-weight:800;font-size:17px',text:DAYS[S.day]+', '+(+dm(addDays(ws,S.day)).slice(0,2))+' '+MON_N[+dm(addDays(ws,S.day)).slice(3,5)-1]}),el('span',{class:'muted small',text:'на змінах: '+n+(edit?' · торкніться, щоб змінити':'')})));
    out.push(el('div',{class:'stack list'},list.map(s=>personRow(s,S.day,edit))));
  }else{
    const short=p=>p.replace(/:00(?=\D|$)/g,'');const typ=p=>{if(p==='Д')return 'mg';const m=p.match(/(\d{1,2})(?::(\d{2}))?\s*[–-]\s*(\d{1,2})(?::(\d{2}))?/);if(!m)return 'full';const a=+m[1]+(+m[2]||0)/60,b=+m[3]+(+m[4]||0)/60;return b-a>=7?'full':a<12?'am':'pm';};
    const hrs=p=>{if(p==='Д')return 9;const m=p.match(/(\d{1,2})(?::(\d{2}))?\s*[–-]\s*(\d{1,2})(?::(\d{2}))?/);return m?Math.max(0,(+m[3]+(+m[4]||0)/60)-(+m[1]+(+m[2]||0)/60)):0;};
    if(matchMedia('(max-width:700px)').matches){const pr=p=>{const t=p==='Д'?'8:30–17:30':p;const m=t.match(/(\d{1,2})(?::(\d{2}))?\s*[–-]\s*(\d{1,2})(?::(\d{2}))?/);if(!m)return null;return {a:+m[1]+(+m[2]||0)/60,b:+m[3]+(+m[4]||0)/60,ta:m[1]+(m[2]&&m[2]!=='00'?':'+m[2]:''),tb:m[3]+(m[4]&&m[4]!=='00'?':'+m[4]:'')};};
      const H0=7,H1=21;const g=el('div',{class:'scg'});
      g.append(...DS.map((d,i)=>el('span',{class:'scg-h'+(i>=5?' we':'')+(i===tIdx?' now':'')},el('small',{text:d}),el('b',{text:String(+dm(addDays(ws,i)).slice(0,2))}))));
      list.forEach(st=>{let tot=0;
        g.append(el('div',{class:'scg-n'+(S.brush!=null?' paint':''),onclick:S.brush!=null?()=>scPaint(st,[0,1,2,3,4,5,6]):null},avatar(st,'scg-av'),el('b',{text:st.name}),el('small',{class:'scg-t'})));const nEl=g.lastChild.querySelector('.scg-t');
        DS.forEach((_,i)=>{const parts=shiftParts(dayValue(st.id,i));parts.forEach(p=>tot+=hrs(p));const lbl=st.name+', '+DAYS[i]+': '+(parts.length?parts.map(p=>p==='Д'?'8:30–17:30':p).join(', '):'вихідний');
          const kids=[];if(parts.length){const tr=el('span',{class:'scg-tr'});parts.forEach(p=>{const q=pr(p);if(!q)return;tr.append(el('i',{class:'t-'+typ(p),style:'left:'+((q.a-H0)/(H1-H0)*100)+'%;width:'+((q.b-q.a)/(H1-H0)*100)+'%'}));});kids.push(tr);
            kids.push(el('span',{class:'scg-tx'},parts.map(p=>{const q=pr(p);if(!q)return el('span',{class:'t-'+typ(p),text:p});const one=(q.ta+q.tb).length<=4;return el('span',{class:'t-'+typ(p)+(one?'':' two')},one?q.ta+'–'+q.tb:[el('b',{text:q.ta}),el('b',{text:q.tb})]);})));}
          const cls='scg-c'+(i===tIdx?' now':'')+(parts.length?'':' off');g.append(edit?el('button',{class:cls,type:'button','aria-label':lbl,onclick:()=>editShift(st,i)},kids):el('div',{class:cls,'aria-label':lbl},kids));});
        if(showHrs)nEl.textContent=String(Math.round(tot*10)/10).replace('.',',')+' год';});
      g.append(el('span',{class:'scg-n scg-f'},'На зміні'),...DS.map((_,i)=>el('span',{class:'scg-c scg-f'+(i===tIdx?' now':'')},String(cnt(i)))));
      out.push(el('div',{class:'card scg-card'},g,el('div',{class:'sc-leg'},[['am','Ранкова'],['pm','Вечірня'],['full','Повний день'],['mg','Менеджер']].map(([k,l])=>el('span',{class:'t-'+k},el('i'),l)))));
    }else{
    const tb=el('div',{class:'sc-wk'+(showHrs?'':' nosum'),role:'table','aria-label':'Графік на тиждень',style:'--cols:7'});
    tb.append(el('div',{class:'sc-h sc-n',role:'columnheader'},el('span',{text:'Працівник'})));
    DS.forEach((d,i)=>tb.append(el('div',{class:'sc-h'+(i>=5?' we':'')+(i===tIdx?' now':''),role:'columnheader'},el('small',{text:d}),el('b',{text:dm(addDays(ws,i)).slice(0,2)}),el('span',{text:cnt(i)+' на зміні'}))));
    if(showHrs)tb.append(el('div',{class:'sc-h sc-sum',role:'columnheader'},el('small',{text:'За тиждень'})));
    list.forEach((st,r)=>{let tot=0;
      tb.append(el('div',{class:'sc-n sc-row'+(S.brush!=null?' paint':''),role:'rowheader',title:st.name,onclick:S.brush!=null?()=>scPaint(st,[0,1,2,3,4,5,6]):null},avatar(st,'sc-av'),el('span',{class:'sc-nm'},el('b',{text:st.name.split(' ')[0]}),el('small',{text:roleName(st.role)||''}))));
      DS.forEach((_,i)=>{const v=dayValue(st.id,i);const parts=shiftParts(v);parts.forEach(p=>tot+=hrs(p));
        const lbl=st.name+', '+DAYS[i]+': '+(parts.length?parts.map(p=>p==='Д'?'8:30–17:30':p).join(', '):'вихідний');
        const SIC={am:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',pm:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',full:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',mg:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>'};
        const fmt=p=>{const t=p==='Д'?'8:30–17:30':p;const m=t.match(/(\d{1,2}(?::\d{2})?)\s*[–-]\s*(\d{1,2}(?::\d{2})?)/);return m?[m[1].includes(':')?m[1]:m[1]+':00',m[2].includes(':')?m[2]:m[2]+':00']:[t,''];};
        const kids=parts.length?parts.map(p=>{const ty=typ(p);const [a,b]=fmt(p);return el('span',{class:'sc-p t-'+ty},el('span',{class:'sc-pi'},svg(SIC[ty])),el('span',{class:'sc-pt'},el('b',{text:a+(b?'–'+b:'')}),el('em',{text:(Math.round(hrs(p)*10)/10+'').replace('.',',')+' год'})));}):[el('span',{class:'sc-off',text:'—'})];
        const cls='sc-c'+(i===tIdx?' now':'')+(i>=5?' we':'');
        tb.append(edit?el('button',{class:cls,type:'button','aria-label':lbl,onclick:()=>editShift(st,i)},kids):el('div',{class:cls,role:'cell','aria-label':lbl},kids));});
      if(showHrs)tb.append(el('div',{class:'sc-c sc-sum'},el('b',{text:String(Math.round(tot*10)/10).replace('.',',')}),el('small',{text:'год'}),el('span',{class:'sc-hb'},el('i',{style:'width:'+Math.min(100,tot/45*100)+'%'}))));});
    tb.append(el('div',{class:'sc-n sc-foot'},el('b',{text:'На змінах'})));
    DS.forEach((_,i)=>tb.append(el('div',{class:'sc-c sc-foot'+(i===tIdx?' now':'')},el('b',{text:String(cnt(i))}))));if(showHrs)tb.append(el('div',{class:'sc-c sc-foot sc-sum'}));
    const wrap=el('div',{class:'card sc-card'},el('div',{class:'sc-scroll'},tb),
      el('div',{class:'sc-leg'},[['am','Ранкова до 13:00'],['pm','Вечірня після 13:00'],['full','Повний день'],['mg','Менеджер 8:30–17:30']].map(([k,l])=>el('span',{class:'t-'+k},el('i'),l)),edit?el('span',{class:'muted',text:'· торкніться клітинки, щоб змінити'}):null));
    out.push(wrap);
    }
    if(tIdx>=0)setTimeout(()=>{const sc=document.querySelector('.sc-scroll'),c=document.querySelector('.sc-h.now');if(sc&&c&&sc.scrollWidth>sc.clientWidth)sc.scrollLeft=Math.max(0,c.offsetLeft-120);},60);
  }
  {const rc=respCard(ws,canPlan(),isThisWeek()?todayIdx():-1);if(rc)out.push(rc);}
  return out;
}
