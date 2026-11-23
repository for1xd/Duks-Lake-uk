// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Облік роботи за день (Facility): кожен веде свій журнал, нагадування о 16:00, Word-звіт за місяць

/* ---------- Облік роботи за день (Facility): кожен веде свій журнал, нагадування о 16:00, Word-звіт за місяць ---------- */
const WL_SRC=['Моніторинг локації','Чек-лист регламенту','Плановий обхід','Вказівка керівництва','Заявка резидента','Запит підрядника','Планові будівельні роботи','Внутрішній контроль','Бухгалтерія / фінанси','Інше'];
const WL_CAT=[['clean','Клінінг та обслуговування','#2E8B5E'],['eng','Інженерія та технічний контроль','#3E5F8A'],['adm','Адміністративна робота','#6B7A80'],['reg','Регламент','#0E7C66'],['law','Договірна та юридична робота','#8A5A12'],['fin','Фінанси та розрахунки','#B0742A'],['oth','Інше','#53686F']];
const WL_LOC=['Вся локація','Сектор 1','Сектор 2','Буд. 1.1','Буд. 1.2','Буд. 1.3','Буд. 2','Буд. 3','Буд. 4','Підземний паркінг'];
const WL_SLA=[['A','Терміново'],['B','Планово'],['C','Не терміново']];
const WL_ST=[['done','Виконано'],['prog','В процесі'],['moved','Перенесено']];
const WL_REG='За регламентом';
const WL_DOCX='<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M8.5 12l1.2 6 1.8-4.5 1.8 4.5 1.2-6"/>';
/* запасні типові роботи (з таблиці УК, інженерний профіль) — поки в людини мало власної історії */
const WL_PRESET=[
  {text:'Обхід локації, візуальний огляд та визначення фактичного технічного стану будівель та інженерних мереж',src:'Плановий обхід',cat:'eng',loc:'Вся локація'},
  {text:'Контроль за монтажем ліфтів, релокація ліфтового обладнання',src:'Планові будівельні роботи',cat:'eng',loc:'Буд. 4'},
  {text:'Проведення ТО ліфтів з підрядником',src:'Чек-лист регламенту',cat:'eng',loc:'Вся локація'},
  {text:'Пусконалагоджувальні роботи з пожежної сигналізації',src:'Планові будівельні роботи',cat:'eng',loc:'Вся локація'},
  {text:'Робота з резидентами: розгляд і вирішення звернень',src:'Заявка резидента',cat:'adm',loc:'Вся локація'},
  {text:'Узгодження робіт і обстеження разом з підрядником',src:'Запит підрядника',cat:'eng',loc:'Вся локація'}];
const WL_ROLES=['manager','senior','engineer','director','ceo','dev','test'];
/* shortcut: облік ведуть лише ці працівники (Ігор Г., Богдан К., Роман Мацібох, Віктор Шепітько); винести в налаштування, якщо склад зміниться */
const WL_IDS=['s-igor','s-bohdan','f393bj1s3p4c1a0s48fq','s-viktor'];
function wlStaff(){return sortedStaff().filter(s=>WL_IDS.includes(s.id));}
function wlTeam(){return sortedStaff().filter(s=>WL_ROLES.includes(s.role)||WL_ROLES.includes(s.extraRole));}
function wlCat(id){return WL_CAT.find(c=>c[0]===id)||WL_CAT[WL_CAT.length-1];}
function wlStN(k){return (WL_ST.find(s=>s[0]===k)||WL_ST[0])[1];}
function wlOf(sid,from,to){to=to||from;return (S.wl||[]).filter(x=>(x.sid===sid||(x.with||[]).includes(sid))&&x.date>=from&&x.date<=to).sort((a,b)=>a.date.localeCompare(b.date)||(a.at||0)-(b.at||0));}
/* людина є в графіку, але на цей день нічого не заплановано — вихідний; немає в графіку або тиждень не завантажено — нагадуємо */
function wlOff(sid,date){const v=planOf(sid,date);return v!=null&&!String(v).trim()&&!!(S.week&&S.week.days&&S.week.days[sid]);}
function wlDue(sid){const t=ymd(new Date());return new Date().getHours()>=16&&!wlOf(sid,t).length&&!wlOff(sid,t);}
function wlCanEdit(x){const m=myStaff();return !!m&&(x.sid===m.id||x.author===S.myId||canAdmin());}
function wlTileStat(){if(!S.wlLoaded)return null;const t=ymd(new Date());const ppl=wlStaff();const done=ppl.filter(s=>wlOf(s.id,t).length).length;
  return [done+' з '+ppl.length,'заповнили облік сьогодні'];}
/* типові роботи людини: її найчастіші записи за всю історію (без різниці в пунктуації), доповнені запасними шаблонами */
function wlTypical(sid){const cnt=new Map();const norm=t=>t.toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim().slice(0,70);
  wlOf(sid,'0000-00-00',ymd(new Date())).forEach(x=>{const k=norm(x.text)+'|'+x.loc;const c=cnt.get(k)||{n:0,t:{text:x.text.trim(),loc:x.loc,src:x.src,cat:x.cat,by:x.by,sla:x.sla}};c.n++;cnt.set(k,c);});
  const L=[...cnt.values()].filter(c=>c.n>1).sort((a,b)=>b.n-a.n).slice(0,8).map(c=>c.t);
  WL_PRESET.forEach(p=>{if(L.length<6&&!L.some(t=>norm(t.text).slice(0,24)===norm(p.text).slice(0,24)&&t.loc===p.loc))L.push(p);});
  return L;}
function wlPick(list,val,on,label,mode){const box=el('div',{class:'wl-grid'+(mode==='g3'?' wl-g3':mode==='row'?' wl-row3':''),role:'group','aria-label':label,lang:'uk'});
  const draw=v=>box.replaceChildren(...list.map(([k,l,c])=>el('button',{type:'button',class:'dz-chip','aria-pressed':String(k===v),onclick:()=>{on(k);draw(k);}},c?el('span',{class:'wl-dot',style:'--cc:'+c,'aria-hidden':'true'}):null,l)));draw(val);return box;}

function wlView(){const ppl=wlStaff();const m=myStaff();const today=ymd(new Date());
  if(!S.wlSid||!ppl.some(s=>s.id===S.wlSid))S.wlSid=(m&&ppl.some(s=>s.id===m.id))?m.id:(ppl[0]||{}).id;
  if(!S.wlDay||S.wlDay>today)S.wlDay=today;const day=S.wlDay,sid=S.wlSid,p=staffById(sid),mine=!!m&&m.id===sid,canAdd=mine||canAdmin();
  const out=[el('section',{class:'uk-head',style:'--c1:#3E5F8A;--c2:#7A9CC6'},el('span',{class:'uk-ic big'},svg(WL_ICON)),el('div',{},el('span',{class:'eyebrow',text:'Facility відділ'}),el('h2',{text:'Облік роботи за день'}),el('p',{text:'Оберіть себе й наприкінці дня запишіть, що зроблено. Типові роботи додаються в один дотик, о 16:00 приходить нагадування.'}),el('button',{type:'button',class:'btn ghost sm wl-word',onclick:wlReportSheet},svg(WL_DOCX),' Звіт Word за місяць')))];
  if(!S.wlLoaded)return out.concat(el('div',{class:'card empty'},el('p',{class:'muted',text:'Завантаження…'})));
  if(!p)return out.concat(el('div',{class:'card empty'},el('p',{class:'muted',text:'У команді Facility ще немає працівників.'})));
  out.push(el('div',{class:'wl-ppl',role:'group','aria-label':'Чий облік'},ppl.map(s=>{const n=wlOf(s.id,today).length;const due=wlDue(s.id);
    return el('button',{type:'button',class:'wl-p','aria-pressed':String(s.id===sid),onclick:()=>{S.wlSid=s.id;render();}},avatarP(s),
      el('span',{class:'wl-pt'},el('b',{text:s.name+(m&&m.id===s.id?' (ви)':'')}),el('small',{class:n?'online':due?'wl-due':'muted',text:n?'сьогодні '+n+' '+plural(n,'запис','записи','записів'):due?'ще не заповнено':'сьогодні без записів'})));})));
  const go=k=>{const d=parseYmd(day);d.setDate(d.getDate()+k);const v=ymd(d);if(v>today)return;S.wlDay=v;render();};
  out.push(el('div',{class:'wl-day'},
    el('button',{type:'button',class:'iconbtn sm','aria-label':'Попередній день',onclick:()=>go(-1)},svg('<path d="m15 6-6 6 6 6"/>')),
    el('label',{class:'wl-dt'},el('b',{text:DS[(parseYmd(day).getDay()+6)%7]+(day===today?' · сьогодні':'')}),el('input',{type:'date',max:today,value:day,'aria-label':'Обрати день',onchange:e=>{const v=e.target.value;if(v){S.wlDay=v>today?today:v;render();}}})),
    el('button',{type:'button',class:'iconbtn sm','aria-label':'Наступний день',disabled:day>=today,onclick:()=>go(1)},svg('<path d="m9 6 6 6-6 6"/>'))));
  const L=wlOf(sid,day);
  if(canAdd){const prev=(S.wl||[]).filter(x=>x.sid===sid&&x.date<day).reduce((a,x)=>x.date>a?x.date:a,'');
    out.push(el('section',{class:'card stack wl-quick'},el('div',{class:'row between'},el('b',{text:'Типові роботи'}),el('span',{class:'muted small',text:'дотик — і запис майже готовий'})),
      el('div',{class:'dz-chips wl-chips'},wlTypical(sid).map(t=>el('button',{type:'button',class:'dz-chip',title:t.text,onclick:()=>wlEdit(null,Object.assign({},t,{date:day,sid}))},el('span',{class:'wl-dot',style:'--cc:'+wlCat(t.cat)[2],'aria-hidden':'true'}),el('span',{class:'wl-ct'},(t.loc&&t.loc!=='Вся локація'?t.loc+' · ':'')+t.text)))),
      el('div',{class:'wl-acts'},el('button',{class:'btn',type:'button',onclick:()=>wlEdit(null,{date:day,sid})},'+ Новий запис'),
        prev?el('button',{class:'btn ghost',type:'button',onclick:()=>wlRepeat(sid,prev,day)},'Повтор '+dm(prev)):null)));}
  out.push(el('h2',{text:(mine?'Мої записи':'Записи · '+p.name)+' · '+L.length}));
  out.push(L.length?el('div',{class:'stack wl-list'},L.map(x=>wlRow(x,sid))):el('div',{class:'card empty'},el('p',{class:'muted',text:day!==today?'За цей день записів немає.':canAdd?'Сьогодні ще немає записів. Оберіть типову роботу вище або додайте новий запис.':'Сьогодні ще немає записів.'})));
  return out;}
function wlRow(x,sid){const c=wlCat(x.cat);const w=[x.sid,...(x.with||[])].filter(i=>i!==sid).map(staffById).filter(Boolean);const ed=wlCanEdit(x);
  return el(ed?'button':'div',{type:ed?'button':null,class:'card wl-row',title:ed?'Редагувати запис':null,onclick:ed?()=>wlEdit(x):null},el('span',{class:'wl-bar',style:'--cc:'+c[2],'aria-hidden':'true'}),
    el('div',{class:'wl-tx'},el('b',{text:x.text}),el('div',{class:'wl-meta'},
      el('span',{class:'wl-tag cat',style:'--cc:'+c[2]},el('span',{class:'wl-dot','aria-hidden':'true'}),c[1]),el('span',{class:'wl-tag',text:x.loc}),el('span',{class:'wl-tag',text:x.src}),
      x.by&&x.by!==WL_REG?el('span',{class:'wl-tag',text:'Призначив: '+x.by}):null,
      x.sla==='A'?el('span',{class:'wl-tag hi',text:'А · терміново'}):null,
      x.st&&x.st!=='done'?el('span',{class:'wl-tag st',text:wlStN(x.st)}):null,
      w.length?el('span',{class:'wl-tag',text:'Разом: '+w.map(s=>s.name).join(', ')}):null)));}
function wlEdit(x,pre){const isNew=!x;const v=Object.assign({src:'Моніторинг локації',cat:'clean',loc:'Вся локація',by:WL_REG,sla:'B',st:'done',with:[],text:''},pre||{},x||{});const today=ymd(new Date());
  const tx=el('textarea',{id:'wlT',rows:'3',maxlength:'600',placeholder:'Що зроблено і який результат'});tx.value=v.text||'';
  const dt=el('input',{id:'wlD',type:'date',max:today,value:v.date||today});
  const byOpts=[WL_REG,...wlTeam().map(s=>s.name),'Резидент','Підрядник','Asgard'];if(v.by&&!byOpts.includes(v.by))byOpts.push(v.by);
  const by=el('select',{id:'wlB'},byOpts.map(o=>el('option',{value:o,text:o})));by.value=v.by||WL_REG;
  const withSet=new Set(v.with||[]);const others=[...new Set([...wlStaff().map(s=>s.id),...(v.with||[])])].filter(id=>id!==v.sid).map(staffById).filter(Boolean);
  const withBox=el('div',{class:'pick'},others.map(s=>{const b=el('button',{type:'button',class:'pk','aria-pressed':String(withSet.has(s.id)),onclick:()=>{withSet.has(s.id)?withSet.delete(s.id):withSet.add(s.id);b.setAttribute('aria-pressed',String(withSet.has(s.id)));}},avatar(s),el('span',{text:s.name}));return b;}));
  const save=()=>{const t=tx.value.trim();if(!t){toast('Опишіть, що зроблено');tx.focus();return;}if(!dt.value||dt.value>today){toast('Перевірте дату: не пізніше сьогодні');return;}
    const d={sid:v.sid,with:[...withSet],date:dt.value,src:v.src,cat:v.cat,loc:v.loc,by:by.value,sla:v.sla,st:v.st,text:t};closeSheet();
    if(isNew)write(()=>S.db.collection('wlog').add(Object.assign(d,{at:Date.now(),author:S.myId})),'Записано');
    else write(()=>S.db.doc('wlog/'+x.id).update(Object.assign(d,{editedAt:Date.now()})),'Збережено');};
  const who=staffById(v.sid);
  openSheet(el('h2',{text:isNew?'Новий запис':'Редагувати запис'}),who?el('p',{class:'muted',style:'margin:0',text:'Облік: '+who.name}):null,
    el('label',{for:'wlT'},'Опис роботи та результат',tx),
    el('span',{class:'flabel',text:'Категорія'}),wlPick(WL_CAT,v.cat,k=>{v.cat=k;},'Категорія'),
    el('span',{class:'flabel',text:'Де'}),wlPick(WL_LOC.map(l=>[l,l]),v.loc,k=>{v.loc=k;},'Де','g3'),
    el('span',{class:'flabel',text:'Джерело'}),wlPick(WL_SRC.map(s=>[s,s]),v.src,k=>{v.src=k;if(k==='Вказівка керівництва'&&by.value===WL_REG)by.focus();},'Джерело'),
    el('div',{class:'grid2'},el('label',{for:'wlB'},'Хто призначив',by),el('label',{for:'wlD'},'Дата',dt)),
    el('span',{class:'flabel',text:'Пріоритет'}),wlPick(WL_SLA,v.sla,k=>{v.sla=k;},'Пріоритет','row'),
    el('span',{class:'flabel',text:'Статус'}),wlPick(WL_ST,v.st,k=>{v.st=k;},'Статус','row'),
    others.length?el('span',{class:'flabel',text:'Разом із (запис з’явиться і в їхньому обліку)'}):null,others.length?withBox:null,
    el('div',{class:'row'},el('button',{class:'btn',type:'button',style:'flex:1',onclick:save},isNew?'Записати':'Зберегти'),
      !isNew?el('button',{class:'btn danger',type:'button',onclick:()=>confirmSheet('Видалити запис «'+x.text.slice(0,60)+'»?','Видалити',()=>write(()=>S.db.doc('wlog/'+x.id).delete(),'Видалено'))},'Видалити'):null),
    el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'));
  if(isNew&&!v.text)setTimeout(()=>tx.focus(),250);}
/* повторити вибрані записи з останнього заповненого дня на обраний день */
function wlRepeat(sid,from,to){const L=wlOf(sid,from).filter(x=>x.sid===sid);if(!L.length){toast('Немає власних записів за '+dm(from));return;}const pick=new Set(L.map(x=>x.id));
  openSheet(el('h2',{text:'Повторити записи з '+dm(from)}),el('p',{class:'muted',style:'margin:0',text:'Оберіть, що сьогодні повторилося. Записи додадуться на '+dm(to)+'.'}),
    el('div',{class:'stack',style:'gap:6px'},L.map(x=>{const b=el('button',{type:'button',class:'pk wl-rep','aria-pressed':'true',onclick:()=>{pick.has(x.id)?pick.delete(x.id):pick.add(x.id);b.setAttribute('aria-pressed',String(pick.has(x.id)));}},el('span',{class:'wl-dot',style:'--cc:'+wlCat(x.cat)[2],'aria-hidden':'true'}),el('span',{text:x.text+' · '+x.loc}));return b;})),
    el('div',{class:'row'},el('button',{class:'btn',type:'button',style:'flex:1',onclick:()=>{const has=new Set(wlOf(sid,to).map(x=>x.text+'|'+x.loc));const xs=L.filter(x=>pick.has(x.id)&&!has.has(x.text+'|'+x.loc));if(!xs.length){toast(pick.size?'Ці записи вже є на '+dm(to):'Нічого не вибрано');return;}closeSheet();const now=Date.now();
      write(()=>Promise.all(xs.map((x,i)=>S.db.collection('wlog').add({sid,with:[],date:to,src:x.src,cat:x.cat,loc:x.loc,by:x.by,sla:x.sla,st:'done',text:x.text,at:now+i,author:S.myId}))),'Додано: '+xs.length);}},'Додати вибрані'),
      el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати')));}

/* нагадування о 16:00: перший відкритий застосунок команди Facility після 16:00 надсилає листи тим, хто ще не заповнив */
async function wlRemCheck(){if(S._wlBusy||!S.db||!S.wlLoaded||!isUK()||!S.myId||new Date().getHours()<16)return;
  const t=ymd(new Date());if(S._wlRemDay===t)return;const due=wlStaff().filter(s=>s.email&&wlDue(s.id));if(!due.length)return;
  S._wlBusy=true;try{const ref=S.db.doc('wl_rem/'+t);const d=await ref.get();if(d.exists){S._wlRemDay=t;return;}
    // shortcut: два застосунки, відкриті в ту саму секунду, можуть надіслати лист двічі; прибрати, коли з'явиться сервер
    await ref.set({at:Date.now(),by:S.myId,to:due.map(s=>s.id)});S._wlRemDay=t;
    const mcp=await claude.use('mcp').catch(()=>null);if(!mcp){await ref.delete().catch(()=>{});S._wlRemDay=null;return;}
    let sent=0;for(const s of due){const first=s.name.split(' ')[0];
      const body=first+', нагадування: заповніть облік роботи за сьогодні ('+dmy(new Date())+').\n\nFacility → Облік роботи → оберіть себе → додайте записи. Типові роботи додаються в один дотик.\n\nВідкрити застосунок: '+APP_URL;
      const html='<div style="font-family:Arial,sans-serif;font-size:15px;color:#0F2A33"><p style="color:#3E5F8A;font-weight:bold;letter-spacing:1px;margin:0 0 8px">DUCK’S LAKE · ОБЛІК РОБОТИ</p><h2 style="margin:8px 0">'+escH(first)+', заповніть облік за сьогодні</h2><p style="margin:0 0 12px;color:#53686F">'+dmy(new Date())+' · Facility → Облік роботи → оберіть себе. Типові роботи додаються в один дотик.</p><p><a href="'+APP_URL+'" style="display:inline-block;background:#3E5F8A;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:bold">Відкрити облік</a></p></div>';
      try{await mcp.callTool('Gmail','send_message',{to:[s.email.trim()],subject:'Облік роботи за '+dm(t)+': ще не заповнено',body,htmlBody:html});sent++;devLog('Нагадування обліку: '+s.name);}catch(e){logErr('Нагадування обліку: '+((e&&e.message)||e));}}
    if(!sent){await ref.delete().catch(()=>{});S._wlRemDay=null;}}
  catch(e){}finally{S._wlBusy=false;}}
