// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: tasks

/* ---------- tasks ---------- */
function byDue(a,b){return (a.due||'9999').localeCompare(b.due||'9999')||(a.createdAt||0)-(b.createdAt||0);}
const REMIND={'15m':'за 15 хв','1h':'за 1 год','3h':'за 3 год','1d':'за 1 день'};
const DSF=['Понеділок','Вівторок','Середа','Четвер','П’ятниця','Субота','Неділя'];
function wdI(ds){return (parseYmd(ds).getDay()+6)%7;}
function dueWord(ds){const d0=new Date();const t=ymd(d0),tm=ymd(new Date(d0.getFullYear(),d0.getMonth(),d0.getDate()+1)),y=ymd(new Date(d0.getFullYear(),d0.getMonth(),d0.getDate()-1));const wd=DS[wdI(ds)].toLowerCase();
  if(ds===t)return 'сьогодні, '+wd+' '+dm(ds);if(ds===tm)return 'завтра, '+wd+' '+dm(ds);if(ds===y)return 'вчора, '+wd+' '+dm(ds);return wd+', '+dm(ds);}
function taskGroups(list,key){const d0=new Date();const today=ymd(d0),tmr=ymd(new Date(d0.getFullYear(),d0.getMonth(),d0.getDate()+1));const g=new Map();
  list.forEach(t=>{const k=!t.due?'none':(t.due<today&&!isDone(t)?'late':t.due);if(!g.has(k))g.set(k,[]);g.get(k).push(t);});
  const keys=[...g.keys()].sort((a,b)=>{const r=k=>k==='late'?'0':k==='none'?'9':'1'+k;return r(a).localeCompare(r(b));});
  if(keys.length<=1)return el('div',{class:'stack list'},list.map(taskCard));
  S.tgOpen=S.tgOpen||{};const firstReal=keys.find(k=>k!=='late');
  return el('div',{class:'tgroups'},keys.map(k=>{const ts=g.get(k);const id=key+':'+k;const open=S.tgOpen[id]!=null?S.tgOpen[id]:(k==='late'||k===today||(!g.has(today)&&k===firstReal));
    const late=k==='late',none=k==='none';const pd=!late&&!none?parseYmd(k):null;
    const title=late?'Прострочені':none?'Без дати':k===today?'Сьогодні':k===tmr?'Завтра':DSF[wdI(k)];
    const sub=late?'термін уже минув':none?'без терміну':(k===today||k===tmr?DSF[wdI(k)].toLowerCase()+', ':'')+pd.getDate()+' '+MON_N[pd.getMonth()];
    const cal=el('span',{class:'tg-cal'},late?el('b',{text:'!'}):none?el('b',{text:'—'}):[el('small',{text:DS[wdI(k)]}),el('b',{text:String(pd.getDate())})]);
    const box=el('section',{class:'tg-grp'+(open?' open':'')+(late?' late':k===today?' today':'')});
    const h=el('button',{type:'button',class:'tg-h','aria-expanded':String(open),onclick:()=>{const o=!box.classList.contains('open');box.classList.toggle('open',o);h.setAttribute('aria-expanded',String(o));S.tgOpen[id]=o;}},
      cal,el('span',{class:'tg-t'},el('b',{text:title}),el('small',{text:sub})),el('span',{class:'tg-n',text:ts.length+' '+plural(ts.length,'задача','задачі','задач')}),el('span',{class:'tg-chev'},svg('<path d="m6 9 6 6 6-6"/>')));
    box.append(h,el('div',{class:'tg-body'},el('div',{class:'tg-in'},el('div',{class:'stack list'},ts.map(taskCard)))));return box;}));}
function dueTag(t){if(!t.due)return null;const today=ymd(new Date());const dn=isDone(t);const cls=dn?'':(t.due<today?' late':(t.due===today?' today':''));
  return el('span',{class:'due'+cls},svg('<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/>'),el('span',{text:(t.due<today&&!dn?'прострочено · ':'')+dueWord(t.due)+(t.dueTime?' · '+t.dueTime:'')}));}
function remindTag(t){if(!t.remind||!REMIND[t.remind])return null;return el('span',{class:'remind',title:'Нагадування '+REMIND[t.remind]+' (скоро запрацює)'},svg('<path d="M6 9a6 6 0 1 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9"/><path d="M10 19a2 2 0 0 0 4 0"/>'),el('span',{text:REMIND[t.remind]}));}
function asg(t){return t.assignees&&t.assignees.length?t.assignees:(t.assignee?[t.assignee]:[]);}
function partDone(t,sid){return !!((t.doneMap&&t.doneMap[sid])||(t.done&&!t.assignees));}
function isDone(t){const a=asg(t);return a.length?a.every(id=>partDone(t,id)):!!t.done;}
function myOpen(t,m){return m&&asg(t).includes(m.id)&&!partDone(t,m.id)&&!isDone(t);}
function reworkSheet(t){
  const ta=el('textarea',{id:'rwText',maxlength:'1000',placeholder:'Що саме треба переробити? Напр.: на 2 поверсі залишились сліди клею біля дверей',style:'min-height:110px'});
  const go3=el('button',{class:'btn danger',type:'button',style:'flex:1'},'Повернути');
  go3.addEventListener('click',()=>{const txt=ta.value.trim();if(!txt){toast('Напишіть коментар, що переробити');ta.focus();return;}
    const m=myStaff();const entry={by:S.myId,staffId:m?m.id:null,text:txt,at:Date.now(),prevPhotos:t.photos||[],prevReport:t.report||null};
    closeSheet();
    write(()=>S.db.doc('tasks/'+t.id).update({done:false,doneAt:null,doneMap:null,rating:null,ratedBy:null,reworkActive:true,photos:[],report:null,rework:[...(t.rework||[]),entry]}),'Задачу повернуто на доопрацювання');
    notifyRework(t,txt);});
  openSheet(el('h2',{text:'Повернути на доопрацювання'}),el('p',{class:'muted',style:'margin:0',text:t.title}),
    el('label',{for:'rwText'},'Коментар для виконавців',ta),
    el('p',{class:'muted small',style:'margin:0',text:'Відмітки виконавців і оцінка скинуться, задача знову з’явиться у них відкритою.'}),
    el('div',{class:'row'},go3,el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати')));
  if(!IS_TOUCH)ta.focus();
}
async function notifyRework(t,txt){const me=myStaff();const ids=asg(t);
  const to=[...new Set(ids.filter(id=>!me||id!==me.id).map(id=>staffById(id)).filter(x=>x&&x.email).map(x=>x.email.trim()))];if(!to.length)return;
  const mcp=await claude.use('mcp').catch(()=>null);if(!mcp)return;const from=me?me.name:'Керівник';
  try{await mcp.callTool('Gmail','send_message',{to,subject:'Доопрацювати: '+t.title,body:from+' повернув задачу на доопрацювання.\n\n'+t.title+'\n\nКоментар: '+txt+'\n\nВідкрити застосунок: '+APP_URL,
    htmlBody:'<div style="font-family:Arial,sans-serif;font-size:15px;color:#0F2A33"><p style="color:#1F6F78;font-weight:bold;letter-spacing:1px;margin:0 0 8px">DUCK’S LAKE</p><p style="margin:0 0 4px"><b>'+escH(from)+'</b> повернув задачу на доопрацювання</p><h2 style="margin:8px 0">'+escH(t.title)+'</h2><p style="white-space:pre-wrap;background:#FBEAEA;border-left:4px solid #B4232A;padding:10px 12px;border-radius:8px;margin:0 0 12px">'+escH(txt)+'</p><p><a href="'+APP_URL+'" style="background:#1F6F78;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none;font-weight:bold">Відкрити задачу</a></p></div>'});}
  catch(e){console.warn('gmail rework',e);}
}
function plink(x,kids,cls){return el('button',{type:'button',class:'plink'+(cls?' '+cls:''),'aria-label':'Профіль: '+x.name,onclick:e=>{e.stopPropagation();closeSheet();openPerson(x.id);}},kids);}
function tsec(label,...kids){return el('div',{class:'t-sec'},el('span',{class:'t-lbl',text:label}),...kids);}
const _seenSent=new Set();
function accTag(t,ids){const a=ids.filter(id=>(t.acceptMap||{})[id]||partDone(t,id)).length,sn=ids.filter(id=>(t.seenMap||{})[id]).length;
  if(a===ids.length&&a)return el('span',{class:'acctag on',text:'✓ прийнято'});if(a)return el('span',{class:'acctag on',text:'прийняли '+a+' з '+ids.length});
  if(sn)return el('span',{class:'acctag seen',text:'👁 переглянуто'});return el('span',{class:'acctag',text:'не переглянуто'});}
function taskCard(t){
  const ids=asg(t);const mine=myStaff();const amIn=!!(mine&&ids.includes(mine.id));const myDone=amIn&&partDone(t,mine.id);
  const done=isDone(t);const dev=isDev();const canTick=canTask()||amIn||dev;const nDone=ids.filter(id=>partDone(t,id)).length;
  const by=t.createdBy&&S.staff.find(s=>s.userId===t.createdBy);
  const tick=()=>{
    if(amIn&&!myDone)return reportSheet(t,true);
    if(amIn&&myDone)return write(()=>S.db.doc('tasks/'+t.id).update({doneMap:{[mine.id]:null},done:false,doneAt:null}),'Вашу відмітку знято');
    if(done)return write(()=>S.db.doc('tasks/'+t.id).update({doneMap:null,done:false,doneAt:null}),'Повернуто в роботу');
    if(dev)return confirmSheet('Позначити «'+t.title+'» виконаною за всіх виконавців?','Позначити виконаною',()=>{const now=Date.now();
      write(()=>S.db.doc('tasks/'+t.id).update({doneMap:Object.fromEntries(ids.map(id=>[id,{at:now,byDev:S.myId}])),done:true,doneAt:now,doneBy:S.myId,reworkActive:false}),'Задачу позначено виконаною');});
    toast('Задачу позначають виконавці');};
  const ck=myDone||done;
  const thumbs=(arr,lbl,cls)=>el('div',{class:'tgrid'+(cls?' '+cls:'')},arr.map(p=>el('button',{type:'button',class:'thumb','aria-label':lbl,onclick:()=>viewPhoto(p.id)},el('img',{src:p.thumb,alt:lbl}))));
  const people=el('div',{class:'assn'},ids.map(id=>{const x=staffById(id);const ok=partDone(t,id);
    const acc=(t.acceptMap||{})[id],sn=(t.seenMap||{})[id];
    const inner=[x?avatarP(x,'xs'):null,el('span',{class:'an',text:x?x.name:'—'}),ok?svg('<path d="m5 12 5 5 9-10"/>'):acc?el('span',{class:'wait acc',title:'Прийнято '+fmtWhen(acc),text:'в роботі'}):sn?el('span',{class:'wait seen',title:'Переглянуто '+fmtWhen(sn),text:'переглянув'}):el('span',{class:'wait',text:'ще не бачив'})];
    return x?plink(x,inner,'asn'+(ok?' ok':'')):el('span',{class:'asn'},inner);}));
  if(amIn&&!(t.seenMap||{})[mine.id]&&!_seenSent.has(t.id)){_seenSent.add(t.id);setTimeout(()=>S.db.doc('tasks/'+t.id).update({seenMap:{[mine.id]:Date.now()}}).catch(()=>{}),300);}
  const myAcc=amIn&&(t.acceptMap||{})[mine.id];
  const prog=ids.length>1?el('div',{class:'prog'},el('div',{class:'bar'},el('span',{style:'width:'+Math.round(nDone/ids.length*100)+'%'})),el('span',{class:'muted small',text:nDone+' з '+ids.length})):null;
  const secs=[];
  if(t.note)secs.push(tsec('Опис',el('p',{class:'t-note',text:t.note})));
  if(t.refPhotos&&t.refPhotos.length)secs.push(tsec('Фото до задачі',thumbs(t.refPhotos,'Фото до задачі','ref')));
  if(t.insp&&(S.insp||{})[t.insp]&&inspCan())secs.push(tsec('Обхід будівель',el('button',{class:'btn ghost sm',type:'button',style:'align-self:flex-start',onclick:()=>inspGoto(t.insp)},'Відкрити звіт обходу →')));
  secs.push(tsec(ids.length>1?'Виконавці':'Виконавець',people,prog));
  const lastRw=t.rework&&t.rework.length?t.rework[t.rework.length-1]:null;
  if(t.report||(t.photos&&t.photos.length))secs.push(tsec(lastRw?'Звіт після доопрацювання':'Звіт',t.report?el('div',{class:'report',text:t.report}):null,(t.photos&&t.photos.length)?thumbs(t.photos,'Фото-звіт'):null));
  if(t.reworkActive&&t.rework&&t.rework.length){const r=t.rework[t.rework.length-1];const rb=staffById(r.staffId);
    secs.unshift(el('div',{class:'rework'},el('div',{class:'rw-h'},svg('<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 6 6v4"/>'),el('b',{text:'На доопрацюванні'}),el('span',{class:'muted small',text:fmtWhen(r.at)})),
      el('p',{class:'rw-t',text:r.text}),rb?el('span',{class:'small'},'Повернув ',plink(rb,[el('span',{text:rb.name})],'inl')):null));}
  if(lastRw&&((lastRw.prevPhotos&&lastRw.prevPhotos.length)||lastRw.prevReport))secs.push(tsec('До доопрацювання',
    lastRw.prevReport?el('p',{class:'t-note muted',style:'margin:0',text:lastRw.prevReport}):null,
    (lastRw.prevPhotos&&lastRw.prevPhotos.length)?thumbs(lastRw.prevPhotos,'Фото до доопрацювання','old'):null));
  if(amIn&&!myDone&&!done){secs.unshift(myAcc?el('div',{class:'acc-bar on'},svg('<path d="m5 12 5 5 9-10"/>'),el('span',{},el('b',{text:'Ви прийняли в роботу'}),el('small',{text:fmtWhen(myAcc)})))
    :el('div',{class:'acc-bar'},el('span',{},el('b',{text:'Нова задача для вас'}),el('small',{text:'Підтвердіть, що взяли її в роботу'})),el('button',{class:'btn sm acc-btn',type:'button',onclick:()=>write(()=>S.db.doc('tasks/'+t.id).update({acceptMap:{[mine.id]:Date.now()},seenMap:{[mine.id]:(t.seenMap||{})[mine.id]||Date.now()}}),'Прийнято в роботу')},svg('<path d="m5 12 5 5 9-10"/>'),' Прийняти')));}
  if(t.reworkActive&&amIn&&!myDone)secs.push(el('div',{class:'t-sec'},el('button',{class:'btn sm',type:'button',style:'align-self:flex-start',onclick:()=>reportSheet(t,true)},svg('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),' Здати з новими фото')));
  if(dev&&!done&&ids.length)secs.push(el('div',{class:'t-sec',style:'flex-direction:row;flex-wrap:wrap;gap:8px'},el('button',{class:'btn ghost sm',type:'button',onclick:()=>confirmSheet('Позначити «'+t.title+'» виконаною за всіх виконавців ('+ids.length+')?','Завершити за всіх',()=>{const now=Date.now();const dm_={};ids.forEach(id=>{dm_[id]=(t.doneMap||{})[id]||{at:now,byDev:S.myId};});write(()=>S.db.doc('tasks/'+t.id).update({doneMap:dm_,done:true,doneAt:now,doneBy:S.myId,reworkActive:false}),'Задачу завершено за всіх');})},svg('<path d="m5 12 5 5 9-10"/>'),' Завершити за всіх'),el('span',{class:'muted small',style:'align-self:center',text:'Dev · потім можна поставити оцінку'})));
  if(done)secs.push(tsec('Оцінка',ducksRow(t)));
  if(done&&dev)secs.push(el('div',{class:'t-sec',style:'flex-direction:row'},el('button',{class:'btn ghost sm rwbtn',type:'button',onclick:()=>reworkSheet(t)},svg('<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 6 6v4"/>'),' Повернути на доопрацювання')));
  if(!done&&t.rework&&t.rework.length>0&&!t.reworkActive)null;
  if(myDone)secs.push(el('div',{class:'t-sec',style:'flex-direction:row'},el('button',{class:'btn ghost sm',type:'button',onclick:()=>reportSheet(t,false)},svg('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),' Додати фото')));
  return el('div',{class:'card task2'+(done?' done':'')},
    el('div',{class:'t-head'},
      el('button',{class:'check'+(ck&&!done?' half':''),type:'button','aria-pressed':String(ck),'aria-label':amIn?(myDone?'Зняти свою відмітку':'Позначити свою частину виконаною'):(done?'Повернути в роботу':(dev?'Позначити виконаною за всіх':'Виконання позначають виконавці')),disabled:canTick?null:true,onclick:tick},ck?svg('<path d="m5 12 5 5 9-10"/>'):null),
      el('div',{class:'t-titlebox'},el('b',{class:'t-title',text:t.title}),
        el('div',{class:'t-meta'},t.reworkActive?el('span',{class:'rwchip',text:'Доопрацювати'}):null,!done&&!t.reworkActive?accTag(t,ids):null,dueTag(t),remindTag(t)),by?el('div',{class:'t-by'},svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>'),el('span',{class:'t-bylbl',text:'Призначив'}),plink(by,[el('span',{text:by.name})],'inl')):null),
      canEditTask(t)&&!done?el('button',{class:'iconbtn sm',type:'button','aria-label':'Редагувати задачу',title:'Редагувати / перенести',onclick:()=>editTask(t)},svg('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>')):null,
      canTask()?el('button',{class:'iconbtn sm',type:'button','aria-label':'Видалити задачу',onclick:()=>confirmSheet('Видалити задачу «'+t.title+'»?','Видалити',()=>write(async()=>{await S.db.doc('tasks/'+t.id).delete();for(const p of [...(t.photos||[]),...(t.refPhotos||[])])await S.db.doc('photos/'+p.id).delete();},'Задачу видалено'))},svg('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>')):null),
    ...secs);
}
const DUCK='<path d="M3.2 14.6 1.4 10.8l4.3 2.3z" fill="var(--dk-b)"/><ellipse cx="11" cy="15.6" rx="8" ry="4.9" fill="var(--dk-b)"/><circle cx="15.4" cy="8" r="3.9" fill="var(--dk-b)"/><path d="M6.6 14.6c1.9-2.4 5.3-2.6 7.4-.6-1.5 2.6-4.9 3.1-7.4.6z" fill="var(--dk-w)"/><path d="m19 7.4 3.4 1-3.3 1.4z" fill="var(--dk-k)"/><circle cx="16.5" cy="7.3" r=".85" fill="var(--dk-e)"/><g class="dk-hat"><path d="M12.6 4.6 15.1.3c.3-.5 1-.4 1.1.2l.9 4.1z" fill="var(--dk-hat)"/><path d="M13.1 3.7h3.8" stroke="var(--dk-band)" stroke-width="1.1"/><ellipse cx="15" cy="4.7" rx="4.3" ry="1" fill="var(--dk-hat)"/></g>';

function duckTheme(){let t='classic';try{t=localStorage.getItem('dl.duck')||'classic';}catch(e){}return t;}
function uiStyle(){let v='strict';try{v=localStorage.getItem('dl.ui2')||'strict';}catch(e){}return v;}
function applyDuckTheme(){const t=duckTheme();const d=new Date();const mmdd=(d.getMonth()+1)*100+d.getDate();const strict=uiStyle()!=='live';const hw=(t==='halloween'||(t==='auto'&&mmdd>=1020&&mmdd<=1102));document.documentElement.classList.toggle('hw',hw);document.documentElement.classList.toggle('strict',strict);document.documentElement.classList.toggle('ios',uiStyle()==='ios');}
applyDuckTheme();
function lookPicker(){const st=uiStyle(),th=duckTheme();
  const seg=(cur,opts,fn)=>el('div',{class:'sg look-sg'},opts.map(([v,l])=>el('button',{type:'button','aria-pressed':String(cur===v),onclick:()=>fn(v)},l)));
  const setS=v=>{try{localStorage.setItem('dl.ui2',v);}catch(e){}applyDuckTheme();render();},setT=v=>{try{localStorage.setItem('dl.duck',v);}catch(e){}applyDuckTheme();render();};
  return el('div',{class:'card look'},el('div',{class:'look-h'},el('b',{text:'Оформлення'}),el('span',{class:'muted small',text:'лише для вас'})),
    el('div',{class:'look-r'},el('span',{},el('b',{text:'Стиль'}),el('small',{text:st==='ios'?'чистий, мінімалістичний':st==='strict'?'попередній діловий вигляд':'яскравий, з каченятами й гарбузами'})),seg(st,[['ios','Мінімал'],['strict','Строгий'],['live','Живий']],setS)),
    el('div',{class:'look-r'},el('span',{},el('b',{text:'Святкова тема'}),el('small',{text:th==='auto'?'Хелловін вмикається 20.10–02.11':th==='halloween'?'Хелловін увімкнено завжди':'без святкової теми'})),seg(th,[['auto','Авто'],['halloween','Хелловін'],['classic','Вимкнено']],setT)));}
function uiStylePicker(){const cur=uiStyle();const opt=(v,l,d)=>el('button',{type:'button',class:'ui-opt','aria-pressed':String(cur===v),onclick:()=>{try{localStorage.setItem('dl.ui2',v);}catch(e){}applyDuckTheme();render();}},el('b',{text:l}),el('small',{text:d}));
  return el('div',{class:'card duck-set'},el('span',{class:'t-lbl',text:'Стиль інтерфейсу'}),el('div',{class:'ui-opts'},opt('ios','Мінімал','чистий вигляд без зайвих ефектів'),opt('strict','Строгий','дорослий вигляд, стримані святкові акценти'),opt('live','Живий','яскраві святкові прикраси, каченята')),
    el('span',{class:'muted small',text:'Налаштування лише для вас.'}));}
function duckThemePicker(){const cur=duckTheme();const opt=(v,l)=>el('button',{type:'button',class:'seg-b','aria-pressed':String(cur===v),onclick:()=>{try{localStorage.setItem('dl.duck',v);}catch(e){}applyDuckTheme();render();}},duck(),el('span',{text:l}));
  return el('div',{class:'card duck-set'},el('span',{class:'t-lbl',text:'Вигляд каченят'}),el('div',{class:'seg full'},opt('classic','Класичні'),opt('halloween','Хелловін'),opt('auto','Авто')),
    el('span',{class:'muted small',text:'«Авто» вмикає хелловінських каченят з 20 жовтня по 2 листопада. Налаштування лише для вас.'}));}
function duck(){const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');s.innerHTML=DUCK;return s;}
function ducksRow(t){
  const r=t.rating||0;const can=canTask();const rater=t.ratedBy&&S.staff.find(s=>s.userId===t.ratedBy);
  if(!can&&!r)return el('span',{class:'muted small',text:'Ще не оцінено'});
  const ducks=[1,2,3,4,5].map(n=>can
    ?el('button',{type:'button',class:'duck'+(n<=r?' on':''),'aria-label':'Оцінка '+n+' з 5','aria-pressed':String(n===r),
        onclick:()=>write(()=>S.db.doc('tasks/'+t.id).update(n===r?{rating:null,ratedBy:null}:{rating:n,ratedBy:S.myId}),n===r?'Оцінку прибрано':'Оцінка: '+n+' з 5')},duck())
    :el('span',{class:'duck'+(n<=r?' on':'')},duck()));
  return el('div',{class:'ducks',role:can?'group':'img','aria-label':r?'Оцінка '+r+' з 5':'Оцінити роботу'},ducks,
    el('span',{class:'muted small',text:r?(r+'/5'+(rater?' · '+rater.name:'')):'оцініть роботу'}));
}
function avgRating(sid){const rs=S.tasks.filter(t=>asg(t).includes(sid)&&t.rating).map(t=>t.rating);return rs.length?{avg:rs.reduce((a,b)=>a+b,0)/rs.length,n:rs.length}:null;}
function loadImg(file){return new Promise((res,rej)=>{const u=URL.createObjectURL(file);const i=new Image();i.onload=()=>{res(i);};i.onerror=()=>rej(new Error('img'));i.src=u;});}
function shrinkFit(img){let max=1280,q=.72,u=shrink(img,max,q);let n=0;while(u.length>260000&&n<8){if(q>.5)q-=.07;else max=Math.round(max*.85);u=shrink(img,max,q);n++;}return u;}
function shrink(img,max,q){const k=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));const c=document.createElement('canvas');c.width=Math.round(img.naturalWidth*k);c.height=Math.round(img.naturalHeight*k);c.getContext('2d').drawImage(img,0,0,c.width,c.height);
  let d=c.toDataURL('image/jpeg',q);while(d.length>230000&&q>0.3){q-=0.1;d=c.toDataURL('image/jpeg',q);}return d;}
function taskRepeatNext(t){const base=t.due||ymd(new Date());let nx=null;if(t.repeat==='daily')nx=addDays(base,1);else if(t.repeat==='weekly')nx=addDays(base,7);
  else if(t.repeat==='days'&&(t.repeatDays||[]).length){for(let i=1;i<=7;i++){const d=addDays(base,i);if(t.repeatDays.includes((parseYmd(d).getDay()+6)%7)){nx=d;break;}}}if(!nx)return Promise.resolve();
  const ids=asg(t);return S.db.collection('tasks').add({title:t.title,zone:t.zone||null,zones:t.zones||null,priority:t.priority||null,repeat:t.repeat,repeatDays:t.repeatDays||null,note:t.note||'',refPhotos:t.refPhotos||[],assignees:ids,assignee:ids[0],doneMap:{},due:nx,dueTime:t.dueTime||null,remind:t.remind||null,done:false,doneAt:null,createdBy:t.createdBy||S.myId,createdAt:Date.now(),repeatOf:t.repeatOf||t.id}).then(()=>devLog('Задача повториться '+dm(nx)+': '+t.title));}
function reportSheet(t,completing){
  const files=[];const prev=el('div',{class:'thumbs'});
  const inp=el('input',{id:'repFiles',type:'file',accept:'image/*',multiple:true,style:'padding:8px'});
  inp.addEventListener('change',()=>{for(const f of inp.files){if(files.length>=4)break;files.push(f);}inp.value='';
    prev.replaceChildren(...files.map(f=>el('span',{class:'thumb'},el('img',{src:URL.createObjectURL(f),alt:''}))));});
  const note=el('textarea',{id:'repNote',placeholder:'Що зроблено (необов’язково)',maxlength:'500'});
  const go=el('button',{class:'btn',type:'button',style:'flex:1'},completing?'Завершити задачу':'Зберегти фото');
  go.addEventListener('click',async()=>{
    if(!completing&&!files.length){toast('Додайте хоча б одне фото');return;}
    if(completing&&tZones(t).length&&!files.length&&!(t.photos||[]).length){toast('Додайте фото «після» — для задач на карті це обов’язково');return;}
    go.disabled=true;go.textContent='Завантаження…';
    try{
      const added=[];
      for(const f of files){const img=await loadImg(f);const full=shrinkFit(img);const thumb=shrink(img,220,0.6);
        const ref=await S.db.collection('photos').add({taskId:t.id,img:full,by:S.myId,at:Date.now()});added.push({id:ref.id,thumb,staffId:(myStaff()||{}).id||null});}
      const patch={photos:[...(t.photos||[]),...added]};
      if(note.value.trim())patch.report=note.value.trim();
      if(completing){const m=myStaff();const ids=asg(t);
        if(m&&ids.includes(m.id)){patch.doneMap={[m.id]:{at:Date.now()}};
          if(ids.every(id=>id===m.id||partDone(t,id))){patch.done=true;patch.doneAt=Date.now();patch.reworkActive=false;}}
        else{patch.done=true;patch.doneAt=Date.now();}
        patch.doneBy=S.myId;}
      await S.db.doc('tasks/'+t.id).update(patch);
      if(patch.done&&t.repeat)await taskRepeatNext(t);
      closeSheet();toast(completing?(isDone(Object.assign({},t,{doneMap:Object.assign({},t.doneMap,patch.doneMap)}))?'Задачу виконано':'Вашу частину позначено. Чекаємо інших'):'Фото додано');
    }catch(e){go.disabled=false;go.textContent=completing?'Завершити задачу':'Зберегти фото';toast(e&&e.code==='quota_exceeded'?'Місце для фото закінчилось: видаліть старі задачі.':'Не вдалося зберегти фото. Спробуйте ще раз.');}
  });
  openSheet(el('h2',{text:completing?'Фото-звіт':'Додати фото'}),el('p',{class:'muted',style:'margin:0',text:t.title}),
    el('label',{for:'repFiles'},'Фото (до 4 штук, можна зняти камерою)',inp),prev,
    el('label',{for:'repNote'},'Коментар',note),
    el('div',{class:'row'},go,el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати')));
}
async function viewPhoto(id){
  openSheet(el('p',{class:'muted',text:'Завантаження фото…'}));
  const d=await S.db.doc('photos/'+id).get().catch(()=>null);
  if(!d||!d.exists){openSheet(el('p',{class:'muted',text:'Фото не знайдено.'}),el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Закрити'));return;}
  const p=d.data();const who=S.staff.find(s=>s.userId===p.by);
  openSheet(el('img',{src:p.img,alt:'Фото-звіт',style:'width:100%;border-radius:14px'}),
    el('p',{class:'muted small',style:'margin:0',text:(who?who.name+' · ':'')+new Date(p.at).toLocaleString('uk-UA',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}),
    el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Закрити'));
}
function viewTasks(){
  const out=[];const mine=myStaff();
  if(canTask())out.push(el('button',{class:'btn',type:'button',onclick:()=>newTask()},'+ Нова задача'));
  const filters=[['mine','Мої'],['open','Усі відкриті'],['done','Виконані']];
  if(!mine&&S.taskFilter==='mine')S.taskFilter='open';
  out.push(el('div',{class:'seg full',role:'group','aria-label':'Фільтр'},filters.filter(f=>f[0]!=='mine'||mine).map(([id,n])=>el('button',{type:'button','aria-pressed':String(S.taskFilter===id),onclick:()=>{S.taskFilter=id;render();}},n))));
  if(S.taskFilter==='mine'&&mine){const pc=pmPersonCard(mine.id,'🛠 Моє планове ТО');if(pc)out.push(pc);}
  let list=S.tasks;
  if(S.taskFilter==='mine')list=list.filter(t=>myOpen(t,mine));
  else if(S.taskFilter==='open')list=list.filter(t=>!isDone(t));
  else list=list.filter(t=>isDone(t));
  list=[...list].sort(S.taskFilter==='done'?(a,b)=>(b.doneAt||0)-(a.doneAt||0):byDue);
  out.push(list.length?(S.taskFilter==='done'?el('div',{class:'stack list'},list.map(taskCard)):taskGroups(list,'t-'+S.taskFilter)):el('div',{class:'card empty'},el('p',{class:'muted',text:S.taskFilter==='done'?'Виконаних задач поки немає.':(canTask()?'Задач немає. Натисніть «Нова задача», щоб призначити першу.':'Задач немає.')})));
  return out;
}
const APP_URL='https://claude.ai/artifact/Dq7QLButhkVMd5Pq3uJhgf';
function escH(t){return String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
async function notifyTask(t,ids){
  const me=myStaff();
  const to=[...new Set(ids.filter(id=>!me||id!==me.id).map(id=>staffById(id)).filter(x=>x&&x.email).map(x=>x.email.trim()))];
  const missing=ids.filter(id=>(!me||id!==me.id)&&!(staffById(id)||{}).email).map(id=>(staffById(id)||{}).name).filter(Boolean);
  if(!to.length){if(missing.length)toast('Лист не надіслано: у '+missing.join(', ')+' не вказано пошти');return;}
  const mcp=await claude.use('mcp').catch(()=>null);
  if(!mcp){toast('Лист не надіслано: сповіщення поштою тут недоступні');return;}
  const from=me?me.name:'Керівник';const due=t.due?dm(t.due):'без терміну';
  const body='Нова задача від '+from+'\n\n'+t.title+'\nДо: '+due+(t.note?'\n\n'+t.note:'')+(t.photos?'\n\nДо задачі додано фото ('+t.photos+'), дивіться в застосунку.':'')+'\n\nВідкрити застосунок: '+APP_URL;
  const html='<div style="font-family:Arial,sans-serif;font-size:15px;color:#0F2A33"><p style="color:#1F6F78;font-weight:bold;letter-spacing:1px;margin:0 0 8px">DUCK’S LAKE</p><p style="margin:0 0 4px">Нова задача від <b>'+escH(from)+'</b></p><h2 style="margin:8px 0">'+escH(t.title)+'</h2><p style="margin:0 0 8px">До: <b>'+escH(due)+'</b></p>'+(t.note?'<p style="white-space:pre-wrap;margin:0 0 8px">'+escH(t.note)+'</p>':'')+(t.photos?'<p style="margin:0 0 8px">До задачі додано фото ('+t.photos+'), дивіться в застосунку.</p>':'')+'<p style="margin:16px 0"><a href="'+APP_URL+'" style="background:#1F6F78;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none;font-weight:bold">Відкрити задачу</a></p></div>';
  try{
    await mcp.callTool('Gmail','send_message',{to,subject:'Нова задача: '+t.title+' (до '+due+')',body,htmlBody:html});
    toast('Лист надіслано: '+to.length+(missing.length?' · без пошти: '+missing.join(', '):''));
  }catch(e){
    const c=e&&e.code;
    const msg=c==='server_not_connected'?'Лист не надіслано: підключіть Gmail у Claude → Налаштування → Конектори'
      :c==='needs_reauth'?'Лист не надіслано: перепідключіть Gmail у Claude → Налаштування → Конектори'
      :c==='not_in_manifest'?'Лист не надіслано: ви не дозволили застосунку доступ до Gmail'
      :c==='selection_required'?'Лист не надіслано: оберіть, який Gmail використовувати, у вікні Claude'
      :c==='blocked_by_policy'||c==='approval_required'?'Лист не надіслано: Gmail заблоковано налаштуваннями організації'
      :c==='tool_error'?'Gmail відхилив лист: '+(e.message||'перевірте адреси')
      :'Не вдалося надіслати лист. Задачу створено, повідомте виконавців іншим способом.';
    toast(msg);console.warn('gmail',e);
  }
}

const PICK_GROUPS=[['Клінери',['cleaner']],['Садівники',['gardener']],['Майстри',['master']],['Менеджери',['manager','senior']],['Керівництво',['engineer','director','dev']]];
function assignPicker(picked){const staff=sortedStaff();const used=new Set();const box=el('div',{class:'pickg',role:'group','aria-label':'Кому'});
  const groups=PICK_GROUPS.map(([lbl,roles])=>{const ppl=staff.filter(x=>!used.has(x.id)&&roles.includes(x.role));ppl.forEach(x=>used.add(x.id));return [lbl,ppl];});
  const rest=staff.filter(x=>!used.has(x.id));if(rest.length)groups.push(['Інші',rest]);
  for(const [lbl,ppl] of groups){if(!ppl.length)continue;const btns=[];
    const all=el('button',{type:'button',class:'pg-all'},'Усі');
    const sync=()=>{btns.forEach(([b,x])=>b.setAttribute('aria-pressed',String(picked.has(x.id))));const on=ppl.every(x=>picked.has(x.id));all.textContent=on?'Зняти':'Усі';all.classList.toggle('on',on);cnt.textContent=ppl.filter(x=>picked.has(x.id)).length?ppl.filter(x=>picked.has(x.id)).length+' з '+ppl.length:String(ppl.length);};
    const cnt=el('span',{class:'pg-n'});
    all.addEventListener('click',()=>{const on=ppl.every(x=>picked.has(x.id));ppl.forEach(x=>on?picked.delete(x.id):picked.add(x.id));sync();});
    const row=el('div',{class:'pick'},ppl.map(x=>{const b=el('button',{type:'button',class:'pk','aria-pressed':'false'},avatar(x),el('span',{text:x.name}));
      b.addEventListener('click',()=>{picked.has(x.id)?picked.delete(x.id):picked.add(x.id);sync();});btns.push([b,x]);return b;}));
    box.append(el('div',{class:'pg'},el('div',{class:'pg-h'},el('span',{class:'pg-l',text:lbl}),cnt,all),row));sync();}
  return box;}
