// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Dev-журнал

/* ---------- Dev-журнал ---------- */
let _logQ=[],_logT=null,_errSeen={};
function devLog(act,kind,extra){try{if(!S.db)return;const m=myStaff();const e={at:Date.now(),by:S.myId||'',sid:m?m.id:'',name:m?m.name:'—',tab:S.tab+(S.ukSec?'/'+S.ukSec:'')+(S.fg&&!S.ukSec?'/'+S.fg:''),act:String(act).slice(0,300),kind:kind||'ok',ver:(NOTES[0]||{}).v||'',dev:(IS_TOUCH?'touch':'desktop')+' '+innerWidth+'×'+innerHeight};if(extra)e.x=String(extra).slice(0,500);
  _logQ.push(e);clearTimeout(_logT);_logT=setTimeout(()=>{const q=_logQ.splice(0);q.forEach(x=>S.db.collection('log').add(x).catch(()=>{}));},800);}catch(_){}}
function logErr(msg,src){const k=String(msg).slice(0,120);if(_errSeen[k]&&Date.now()-_errSeen[k]<60000)return;_errSeen[k]=Date.now();devLog(k,'err',src);}
addEventListener('error',e=>{if(e&&e.message&&!/ResizeObserver/.test(e.message))logErr(e.message,(e.filename||'').split('/').pop()+':'+(e.lineno||''));});
addEventListener('unhandledrejection',e=>{const r=e&&e.reason;logErr('Promise: '+(r&&(r.message||r.code)||r),r&&r.stack&&String(r.stack).split('\n')[1]);});
function devView(){if(!isDev())return [el('div',{class:'card empty'},el('p',{class:'muted',text:'Розділ лише для ролі Dev.'}))];
  const out=[...inspDevCards(),el('div',{class:'card row between'},el('div',{class:'stack',style:'gap:2px'},el('b',{text:'ПІБ керівника УК'}),el('span',{class:'muted small',text:dirName()+' · у шапці й підписах звіту для інвестора'})),el('button',{class:'btn sm ghost',type:'button',onclick:dirEdit},'Змінити')),el('div',{class:'card row between'},el('div',{class:'stack',style:'gap:2px'},el('b',{text:'Новий дизайн (тест)'}),el('span',{class:'muted small',text:'Вмикається лише у вашому браузері — інші бачать поточний дизайн.'})),el('button',{type:'button',class:'btn sm',onclick:toggleV2},v2On()?'Вимкнути':'Увімкнути'))];const L=S.log||[];const now=Date.now();const d1=L.filter(x=>now-x.at<864e5);const errs=L.filter(x=>x.kind==='err');const e1=d1.filter(x=>x.kind==='err');
  const ppl=[...new Set(d1.map(x=>x.name))];const onl=S.staff.filter(x=>x.userId&&isOnline(x.id));
  out.push(el('div',{class:'card',style:'padding:16px;margin-bottom:12px'},el('h3',{style:'margin:0 0 4px;font-size:16px',text:'👁 Перегляд як роль'}),el('p',{class:'muted small',style:'margin:0 0 12px',text:'Побачте застосунок очима іншої ролі: меню, розділи, «Що нового», доступи. Дії виконуються від вашого імені — для перевірки, не для роботи.'}),
    el('div',{class:'dv-as'},ROLES.filter(r=>r.id!=='dev').map(r=>el('button',{type:'button',class:'btn ghost sm',onclick:()=>setAsRole(r.id)},r.name)))));
  out.push(el('div',{class:'dz-kpi dv-kpi'},
    el('div',{class:'card dz-k hero'},el('span',{text:'Дій за 24 год'}),el('b',{text:String(d1.length)}),el('small',{text:ppl.length+' '+plural(ppl.length,'людина','людини','людей')+' · версія '+((NOTES[0]||{}).v||'')})),
    el('div',{class:'card dz-k'},el('span',{class:'muted small',text:'Помилки за 24 год'}),el('b',{class:e1.length?'crit':'',text:String(e1.length)}),el('small',{class:'muted',text:errs.length+' у журналі'})),
    el('div',{class:'card dz-k'},el('span',{class:'muted small',text:'У мережі зараз'}),el('b',{text:String(onl.length)}),el('small',{class:'muted',text:onl.map(x=>x.name.split(' ')[0]).join(', ')||'нікого'})),
    el('div',{class:'card dz-k'},el('span',{class:'muted small',text:'Ваш пристрій'}),el('b',{style:'font-size:17px',text:(IS_TOUCH?'Сенсорний':'ПК')+' · '+innerWidth+'×'+innerHeight}),el('small',{class:'muted',text:(navigator.userAgent.match(/(Safari|Chrome|Firefox|Edg)\/[\d.]+/)||[''])[0]}))));
  // db stats
  const cnt=o=>Object.keys(o||{}).length;const dzRowsN=Object.values(S.dz||{}).reduce((a,d)=>a+cnt(d.rows),0);
  const stats=[['Колектив',S.staff.length],['Задачі',S.tasks.length],['Повідомлення (останні)',S.chat.length],['Відмітки змін',S.shifts.length],['Лічильники води',S.wMet.length],['Рядки дебіторки',dzRowsN],['Паркомісця',cnt((S.pk.main||{}).rows)],['Інвентар',cnt((S.inv.main||{}).rows)],['Записів журналу',L.length]];
  out.push(el('div',{class:'dz-grid'},
    el('div',{class:'card dz-card'},el('div',{class:'dz-ch'},el('b',{text:'Стан бази'}),el('span',{class:'muted small',text:'з того, що завантажено'})),el('div',{class:'dv-st'},stats.map(([a,b])=>el('div',{},el('span',{text:a}),el('b',{text:String(b)})))),
      el('div',{class:'row',style:'gap:6px;flex-wrap:wrap'},el('button',{class:'btn ghost sm',type:'button',onclick:devExport},svg(IC_DL),' Експорт бази (JSON)'),el('button',{class:'btn ghost sm',type:'button',onclick:()=>location.reload()},'↻ Перезавантажити'))),
    el('div',{class:'card dz-card'},el('div',{class:'dz-ch'},el('b',{text:'Активність людей'}),el('span',{class:'muted small',text:'останній вхід'})),
      el('div',{class:'dv-ppl'},S.staff.filter(x=>x.userId).sort((a,b)=>((S.pres[b.id]||{}).at||0)-((S.pres[a.id]||{}).at||0)).map(x=>{const n=d1.filter(l=>l.sid===x.id).length;return el('div',{class:'dv-p'},avatarP(x),el('span',{class:'grow'},el('b',{text:x.name}),el('small',{class:isOnline(x.id)?'online':'muted',text:seenText(x.id)})),el('em',{text:n?n+' дій':''}));})))));
  // log
  const f=S.logF||'all';const q=lc(S.logQ);const who=S.logWho||'';
  const vis=L.filter(x=>(f==='all'||x.kind===f)&&(!who||x.sid===who)&&(!q||lc([x.act,x.name,x.tab,x.x].join(' ')).includes(q))).slice(0,200);
  const qi=el('input',{type:'search',placeholder:'Пошук у журналі…',value:S.logQ||''});qi.addEventListener('input',()=>{S.logQ=qi.value;const p=qi.selectionStart;render();const n=document.querySelector('.dv-tools input');if(n){n.focus();n.setSelectionRange(p,p);}});
  const ws=el('select',{class:'dz-bsel'},el('option',{value:'',text:'Усі люди'}),S.staff.map(x=>el('option',{value:x.id,text:x.name})));ws.value=who;ws.addEventListener('change',()=>{S.logWho=ws.value;render();});
  out.push(el('div',{class:'dz-tbl-wrap'},el('div',{class:'row between'},el('h2',{text:'Журнал дій'}),el('span',{class:'muted small',text:vis.length+' з '+L.length})),
    el('div',{class:'dz-tools dv-tools'},qi,el('div',{class:'sg sm'},[['all','Усе'],['ok','Дії'],['err','Помилки']].map(([k,l])=>el('button',{type:'button','aria-pressed':String(f===k),onclick:()=>{S.logF=k;render();}},l))),ws,
      el('button',{class:'btn ghost sm',type:'button',onclick:devPurge},'Очистити старше 30 днів')),
    el('div',{class:'card dv-log'},vis.length?vis.map(x=>el('div',{class:'dv-r'+(x.kind==='err'?' err':'')},el('span',{class:'dv-t'},el('b',{text:hm(x.at)}),el('small',{text:dm(ymd(new Date(x.at)))})),
      el('span',{class:'dv-a'},el('b',{text:x.act}),el('small',{text:[x.name,x.tab,x.dev,x.ver?'v'+x.ver:''].filter(Boolean).join(' · ')}),x.x?el('code',{text:x.x}):null),el('span',{class:'pill t-'+(x.kind==='err'?'law':'ok')},el('i'),x.kind==='err'?'помилка':'дія'))):el('p',{class:'muted',style:'margin:0;padding:14px',text:'Записів ще немає. Журнал заповнюється, коли люди щось зберігають.'}))));
  out.push(el('div',{class:'card dz-card'},el('div',{class:'dz-ch'},el('b',{text:'Що ще тут є для розробника'})),el('ul',{class:'dv-ul'},
    ['Журнал усіх збережень: хто, що, на якій сторінці, з якого пристрою','Автоматичний запис помилок JavaScript у користувачів (з файлом і рядком)','Експорт усієї бази в JSON — резервна копія одним кліком','Стан бази та активність людей — видно, хто реально користується'].map(t=>el('li',{text:t})))));
  return out;}
async function devExport(){const data={exportedAt:new Date().toISOString(),staff:S.staff,tasks:S.tasks,chat:S.chat,shifts:S.shifts,dz:S.dz,waste:S.ws,inv:S.inv,parking:S.pk,maint:S.pm,incidents:S.sos,wObjects:S.wObj,wMeters:S.wMet,wPeriods:S.wPerD,log:S.log};
  const dl=await claude.use('downloads').catch(()=>null);if(!dl){toast('Завантаження файлів тут недоступне');return;}
  try{await dl.save({filename:'ducks-lake-backup-'+ymd(new Date())+'.json',data:new Blob([JSON.stringify(data,null,1)],{type:'application/json'})});devLog('Експорт бази');}catch(e){if(e&&e.code!=='declined')toast('Не вдалося зберегти файл');}}
function devPurge(){const old=(S.log||[]).filter(x=>Date.now()-x.at>30*864e5);if(!old.length){toast('Старих записів немає');return;}
  confirmSheet('Видалити '+old.length+' записів журналу, старших за 30 днів?','Видалити',()=>write(async()=>{for(const x of old)await S.db.doc('log/'+x.id).delete();},'Журнал очищено'));}
