// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: iOS-style date & time pickers for mouse/trackpad

/* ---------- iOS-style date & time pickers for mouse/trackpad ---------- */
const MONTHS=['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];
function dtSet(inp,v){inp.value=v;inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new Event('change',{bubbles:true}));}
function dtClose(){const r=document.getElementById('dtRoot');if(r)r.remove();document.removeEventListener('keydown',dtKey,true);}
function dtKey(e){if(e.key==='Escape'){e.stopPropagation();dtClose();}}
function dtOpen(inp,card){dtClose();const root=el('div',{id:'dtRoot',class:'dt-root'},el('div',{class:'dt-bg',onmousedown:e=>{e.preventDefault();dtClose();}}),card);document.body.append(root);
  const r=inp.getBoundingClientRect();const w=card.offsetWidth,h=card.offsetHeight;let x=Math.max(10,Math.min(innerWidth-10-w,r.left+r.width/2-w/2));let y=r.bottom+8;if(y+h>innerHeight-10)y=Math.max(10,r.top-h-8);
  card.style.left=x+'px';card.style.top=y+'px';card.style.transformOrigin=(y<r.top?'center bottom':'center top');document.addEventListener('keydown',dtKey,true);}
function datePop(inp){const today=ymd(new Date());let sel=inp.value||'';const base=parseYmd(sel||today);let Y=base.getFullYear(),M=base.getMonth();
  const head=el('div',{class:'dt-head'});const grid=el('div',{class:'dt-grid'});
  const draw=()=>{head.replaceChildren(el('b',{text:MONTHS[M]+' '+Y}),el('span',{class:'grow'}),
      el('button',{type:'button',class:'dt-arr','aria-label':'Попередній місяць',onclick:()=>{M--;if(M<0){M=11;Y--;}draw();}},svg('<path d="M15 5l-7 7 7 7"/>')),
      el('button',{type:'button',class:'dt-arr','aria-label':'Наступний місяць',onclick:()=>{M++;if(M>11){M=0;Y++;}draw();}},svg('<path d="m9 5 7 7-7 7"/>')));
    const first=new Date(Y,M,1);const off=(first.getDay()+6)%7;const n=new Date(Y,M+1,0).getDate();
    grid.replaceChildren(...DS.map(d=>el('span',{class:'dt-dn',text:d})),...Array.from({length:off},()=>el('span')),
      ...Array.from({length:n},(_,i)=>{const v=Y+'-'+pad(M+1)+'-'+pad(i+1);return el('button',{type:'button',class:'dt-d'+(v===today?' today':'')+(v===sel?' sel':''),onclick:()=>{sel=v;draw();},ondblclick:()=>{dtSet(inp,v);dtClose();}},String(i+1));}));};
  draw();
  const card=el('div',{class:'dt-card',role:'dialog','aria-label':'Вибір дати'},head,grid,el('div',{class:'dt-foot'},
    el('button',{type:'button',class:'dt-reset',onclick:()=>{dtSet(inp,inp.required?today:'');dtClose();}},'Скинути'),
    el('button',{type:'button',class:'dt-ok','aria-label':'Готово',onclick:()=>{if(sel)dtSet(inp,sel);dtClose();}},svg('<path d="m5 12.5 4.5 4.5L19 7"/>'))));
  dtOpen(inp,card);}
function timePop(inp){const st=Math.max(1,Math.round((+inp.step||60)/60));const now=new Date();const cur=(inp.value||pad(now.getHours())+':'+pad(Math.round(now.getMinutes()/st)*st%60)).split(':').map(Number);
  const IH=38;const col=(n,step,val)=>{const c=el('div',{class:'dt-col'},el('div',{class:'dt-pad'}),...Array.from({length:Math.ceil(n/step)},(_,i)=>el('div',{class:'dt-it','data-v':String(i*step),text:pad(i*step)})),el('div',{class:'dt-pad'}));
    let t;c.addEventListener('scroll',()=>{clearTimeout(t);t=setTimeout(()=>{const i=Math.round(c.scrollTop/IH);c.scrollTo({top:i*IH,behavior:'smooth'});mark(c);},90);mark(c);},{passive:true});
    c.addEventListener('click',e=>{const it=e.target.closest('.dt-it');if(it)c.scrollTo({top:[...c.querySelectorAll('.dt-it')].indexOf(it)*IH,behavior:'smooth'});});
    c._init=()=>{c.scrollTop=Math.round(val/step)*IH;mark(c);};return c;};
  const mark=c=>{const i=Math.round(c.scrollTop/IH);c.querySelectorAll('.dt-it').forEach((e,k)=>{const d=Math.abs(k-i);e.style.opacity=String(Math.max(.18,1-d*.28));e.style.transform='scale('+(1-Math.min(d,3)*.06)+')';e.classList.toggle('on',d===0);});};
  const ch=col(24,1,cur[0]),cm=col(60,st,cur[1]||0);
  const val=c=>{const its=c.querySelectorAll('.dt-it');return its[Math.max(0,Math.min(its.length-1,Math.round(c.scrollTop/IH)))].dataset.v;};
  const card=el('div',{class:'dt-card dt-time',role:'dialog','aria-label':'Вибір часу'},el('div',{class:'dt-wheel'},el('div',{class:'dt-band'}),ch,el('span',{class:'dt-colon',text:':'}),cm),
    el('div',{class:'dt-foot'},el('button',{type:'button',class:'dt-reset',onclick:()=>{dtSet(inp,'');dtClose();}},'Скинути'),
      el('button',{type:'button',class:'dt-ok','aria-label':'Готово',onclick:()=>{dtSet(inp,pad(+val(ch))+':'+pad(+val(cm)));dtClose();}},svg('<path d="m5 12.5 4.5 4.5L19 7"/>'))));
  dtOpen(inp,card);ch._init();cm._init();}
if(!IS_TOUCH){
  document.addEventListener('mousedown',e=>{const t=e.target;if(t&&t.tagName==='INPUT'&&(t.type==='date'||t.type==='time')&&!t.disabled){e.preventDefault();if(document.activeElement===t)t.blur();(t.type==='date'?datePop:timePop)(t);}},true);
  document.addEventListener('keydown',e=>{const t=e.target;if(t&&t.tagName==='INPUT'&&(t.type==='date'||t.type==='time')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();(t.type==='date'?datePop:timePop)(t);}},true);}

const MON_G=['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня'];
const REM_MIN={'15m':15,'1h':60,'3h':180,'1d':1440};
function whenPicker(d,tm,rm){const today=ymd(new Date());
  const fire=x=>{x.dispatchEvent(new Event('input',{bubbles:true}));x.dispatchEvent(new Event('change',{bubbles:true}));};
  const dOpts=[[today,'Сьогодні'],[addDays(today,1),'Завтра']].concat([2,3,4].map(k=>{const v=addDays(today,k);return [v,DS[(parseYmd(v).getDay()+6)%7]+' '+dm(v)];}));
  const tOpts=[['','Без часу'],['08:00'],['10:00'],['12:00'],['14:00'],['17:00'],['19:00']];
  const chip=(v,l,inp)=>el('button',{type:'button',class:'qc','data-v':v,onclick:()=>{inp.value=v;fire(inp);sync();}},l||v);
  const dCust=el('span',{class:'qc pick'},el('span',{class:'pk-t'}),d);const tCust=el('span',{class:'qc pick'},el('span',{class:'pk-t'}),tm);
  const dc=el('div',{class:'qchips'},dOpts.map(([v,l])=>chip(v,l,d)),dCust);const tc=el('div',{class:'qchips'},tOpts.map(([v,l])=>chip(v,l,tm)),tCust);
  const sum=el('div',{class:'when-sum'});
  function sync(){dc.querySelectorAll('.qc').forEach(b=>b.classList.toggle('on',b.dataset.v===d.value));tc.querySelectorAll('.qc').forEach(b=>b.classList.toggle('on',b.dataset.v===(tm.value||'')));
    const dPre=dOpts.some(([v])=>v===d.value);const tPre=tOpts.some(([v])=>v===(tm.value||''));
    dCust.classList.toggle('on',!dPre&&!!d.value);dCust.firstChild.textContent=!dPre&&d.value?'📅 '+dm(d.value):'📅 Інша дата';
    tCust.classList.toggle('on',!tPre&&!!tm.value);tCust.firstChild.textContent=!tPre&&tm.value?'🕑 '+tm.value:'🕑 Свій час';
    rm.disabled=!tm.value;if(!tm.value)rm.value='';
    const dd=d.value?parseYmd(d.value):null;
    const parts=[];if(dd)parts.push(el('span',{},svg('<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/>'),el('b',{text:(d.value===today?'Сьогодні, ':d.value===addDays(today,1)?'Завтра, ':DAYS[(dd.getDay()+6)%7]+', ')+dd.getDate()+' '+MON_G[dd.getMonth()]})));
    parts.push(el('span',{},svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),el('b',{text:tm.value?'до '+tm.value:'без часу'})));
    if(rm.value&&tm.value&&dd){const [h,mi]=tm.value.split(':').map(Number);const t=new Date(dd);t.setHours(h,mi,0,0);t.setMinutes(t.getMinutes()-REM_MIN[rm.value]);
      parts.push(el('span',{},svg('<path d="M6 9a6 6 0 1 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9"/><path d="M10 19a2 2 0 0 0 4 0"/>'),el('b',{text:'нагадаємо '+(ymd(t)===d.value?'о ':dm(ymd(t))+' о ')+pad(t.getHours())+':'+pad(t.getMinutes())})));}
    sum.replaceChildren(...parts);}
  [d,tm,rm].forEach(x=>{x.addEventListener('input',sync);x.addEventListener('change',sync);});
  const node=el('div',{class:'when card-in'},
    el('span',{class:'flabel',text:'Коли виконати'}),dc,
    el('span',{class:'flabel',text:'До котрої години'}),tc,
    el('label',{for:'tRem'},el('span',{class:'row',style:'gap:6px'},svg('<path d="M6 9a6 6 0 1 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9"/><path d="M10 19a2 2 0 0 0 4 0"/>'),'Нагадування',el('span',{class:'soon',text:'скоро'})),rm,
      el('span',{class:'muted small rm-hint',text:'Щоб поставити нагадування, оберіть час'})),
    sum);
  setTimeout(sync,0);return node;}
function newTask(pre){pre=pre||{};const zl=(pre.zones||(pre.zone?[pre.zone]:[])).filter(Boolean);const zq=zl.length===1&&mzById(zl[0]);const isZ=zl.length>0;
  const t=el('input',{id:'tTitle',placeholder:isZ?'напр. «Покосити газон»':'Напр.: Замінити пакети в урнах біля входу',maxlength:'140'});if(pre.title)t.value=pre.title;
  const picked=new Set();const z0=isZ&&mzGet(zl[0]);if(isZ&&z0&&z0.defaultAssigneeId)picked.add(z0.defaultAssigneeId);
  let who;const prio={v:'normal'},rep={v:'none',days:new Set()};
  const TPL=['Покосити газон','Прибрати листя','Полити','Обрізати кущі','Прибрати сміття','Помити плитку','Розчистити сніг','Посипати проти ожеледиці'];
  const tpl=isZ?el('div',{class:'mz-tpl',role:'group','aria-label':'Шаблони'},TPL.map(x=>el('button',{type:'button',class:'mz-chip','aria-pressed':'false',onclick:e=>{t.value=x;e.currentTarget.parentNode.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===e.currentTarget)));}},x))):null;
  const zPick=()=>{const box=el('div',{class:'mz-who',role:'group','aria-label':'Виконавець'});const draw=()=>{const date=(document.getElementById('tDue')||{}).value||ymd(new Date());
      const ws=sortedStaff().filter(x=>['cleaner','gardener'].some(r=>[x.role,x.extraRole].includes(r))).map(x=>{const v=planAny(x.id,date);return {x,on:!!(v&&isWorking(v)),known:v!=null};}).sort((a,b)=>(b.on-a.on));
      box.replaceChildren(...ws.map(({x,on,known})=>{const off=known&&!on;const b=el('button',{type:'button',class:'pk'+(off?' off':''),'aria-pressed':String(picked.has(x.id)),onclick:()=>{picked.has(x.id)?picked.delete(x.id):picked.add(x.id);b.setAttribute('aria-pressed',String(picked.has(x.id)));}},avatar(x),el('span',{},x.name,el('small',{class:on?'mz-on':'muted',text:on?' · на зміні':off?' · вихідний':''})));return b;}));};box._draw=draw;return box;};
  who=isZ?zPick():assignPicker(picked);
  const d=el('input',{id:'tDue',type:'date',value:ymd(new Date())});if(isZ)d.addEventListener('change',()=>who._draw&&who._draw());
  const tm=el('input',{id:'tTime',type:'time',step:'300'});
  const rm=el('select',{id:'tRem'},el('option',{value:'',text:'Без нагадування'}),Object.entries(REMIND).map(([k,v])=>el('option',{value:k,text:'Нагадати '+v})));
  const n=el('textarea',{id:'tNote',placeholder:'Деталі (необов’язково)',maxlength:'1000'});if(pre.note)n.value=pre.note;
  const files=[];const prev=el('div',{class:'thumbs'});
  const fin=el('input',{type:'file',accept:'image/*',multiple:true,'aria-label':'Додати фото до задачі'});
  const drawPrev=()=>prev.replaceChildren(...files.map((f,i)=>el('span',{class:'thumb rm'},el('img',{src:URL.createObjectURL(f),alt:''}),el('button',{type:'button',class:'x','aria-label':'Прибрати фото',onclick:()=>{files.splice(i,1);drawPrev();}},'×'))));
  fin.addEventListener('change',()=>{for(const f of fin.files){if(files.length>=4)break;files.push(f);}fin.value='';drawPrev();});
  const picBtn=el('span',{class:'btn ghost sm filebtn',style:'align-self:flex-start'},svg('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),' Додати фото (до 4)',fin);
  const prSeg=isZ?el('div',{class:'iw-seg',role:'radiogroup','aria-label':'Пріоритет'},[['normal','Звичайний'],['high','Терміновий']].map(([k,l])=>{const b=el('button',{type:'button',role:'radio',class:'iw-sb'+(k==='high'?' pr-high':''),'aria-checked':String(prio.v===k),onclick:()=>{prio.v=k;prSeg.querySelectorAll('button').forEach(x=>x.setAttribute('aria-checked',String(x===b)));}},l);return b;})):null;
  const rpSel=isZ?el('select',{id:'tRep'},[['none','Не повторювати'],['daily','Щодня'],['weekly','Щотижня'],['days','По днях тижня']].map(([k,l])=>el('option',{value:k,text:l}))):null;
  const rpDays=isZ?el('div',{class:'iw-seg seven',role:'group','aria-label':'Дні тижня',hidden:true},DS.map((x,i)=>{const b=el('button',{type:'button',class:'iw-sb','aria-checked':'false',onclick:()=>{rep.days.has(i)?rep.days.delete(i):rep.days.add(i);b.setAttribute('aria-checked',String(rep.days.has(i)));}},x);return b;})):null;
  if(rpSel)rpSel.addEventListener('change',()=>{rep.v=rpSel.value;rpDays.hidden=rep.v!=='days';});
  openSheet(el('h2',{text:isZ?'Задача на карті':'Нова задача'}),isZ?el('div',{class:'mz-chipsel'},zl.map(id=>{const z=mzGet(id);return z?el('span',{class:'zone-tag big t-'+z.type},el('i'),(z.number?z.number+' · ':'')+z.name):null;})):null,tpl?el('div',{class:'stack',style:'gap:6px'},el('span',{class:'flabel',text:'Шаблони'}),tpl):null,el('label',{for:'tTitle'},'Що зробити',t),el('div',{class:'stack',style:'gap:6px'},el('span',{class:'flabel',text:isZ?'Виконавець (клінери й садівники)':'Кому (можна кількох)'}),who),whenPicker(d,tm,rm),prSeg?el('fieldset',{class:'iw-fs'},el('legend',{class:'flabel',text:'Пріоритет'}),prSeg):null,rpSel?el('label',{for:'tRep'},'Повторювати',rpSel):null,rpDays,el('label',{for:'tNote'},'Коментар',n),el('div',{class:'stack',style:'gap:8px'},el('span',{class:'flabel',text:isZ?'Фото «до» (необов’язково)':'Фото: де і що зробити'}),prev,picBtn),
    el('div',{class:'row'},el('button',{class:'btn',type:'button',style:'flex:1',onclick:async(ev)=>{const title=t.value.trim();if(!title){toast('Напишіть, що треба зробити');t.focus();return;}
      if(!picked.size){toast('Оберіть, кому призначити');return;}
      const ids=sortedStaff().map(x=>x.id).filter(id=>picked.has(id));
      const btn=ev.currentTarget;btn.disabled=true;btn.textContent=files.length?'Завантаження фото…':'Призначаємо…';
      const ref=[];await write(async()=>{ref.length=0;
        for(const th of (pre.refThumbs||[])){const r=await S.db.collection('photos').add({taskId:null,img:th,by:S.myId,at:Date.now()});ref.push({id:r.id,thumb:th});}
        for(const f of files){const img=await loadImg(f);const r=await S.db.collection('photos').add({taskId:null,img:shrinkFit(img),by:S.myId,at:Date.now()});ref.push({id:r.id,thumb:shrink(img,220,0.6)});}
        await S.db.collection('tasks').add({title,insp:pre.insp||null,zone:zl[0]||null,zones:zl.length?zl:null,priority:isZ?prio.v:null,repeat:isZ&&rep.v!=='none'?rep.v:null,repeatDays:isZ&&rep.v==='days'?[...rep.days]:null,note:n.value.trim(),refPhotos:ref,assignees:ids,assignee:ids[0],doneMap:{},due:d.value||null,dueTime:tm.value||null,remind:rm.value||null,done:false,doneAt:null,createdBy:S.myId,createdAt:Date.now()});},'Задачу призначено');
      closeSheet();notifyTask({title,note:n.value.trim(),due:d.value||null,photos:ref.length},ids);}},'Призначити'),
      el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати')));
  if(isZ&&who._draw)who._draw();
  if(!IS_TOUCH)t.focus();
}

/* Редагування задачі: автор задачі або Dev */
function canEditTask(t){return !!t&&(isDev()||(!!S.myId&&t.createdBy===S.myId));}
function editTask(t){if(!canEditTask(t)){toast('Редагувати може лише автор задачі або Dev');return;}
  const ti=el('input',{id:'tTitle',value:t.title||'',maxlength:'140'});
  const was=asg(t);const picked=new Set(was);const who=assignPicker(picked);
  const today=ymd(new Date());const late=t.due&&t.due<today;
  const d=el('input',{id:'tDue',type:'date',value:t.due||''});const tm=el('input',{id:'tTime',type:'time',step:'300',value:t.dueTime||''});
  const rm=el('select',{id:'tRem'},el('option',{value:'',text:'Без нагадування'}),Object.entries(REMIND).map(([k,v])=>el('option',{value:k,text:'Нагадати '+v,selected:t.remind===k?true:null})));
  const n=el('textarea',{id:'tNote',maxlength:'1000',placeholder:'Деталі (необов’язково)'});n.value=t.note||'';
  openSheet(el('h2',{text:'Редагувати задачу'}),late?el('div',{class:'te-late'},svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),el('span',{text:'Прострочено: термін був '+dm(t.due)+'. Оберіть нову дату нижче.'})):null,
    el('label',{for:'tTitle'},'Що зробити',ti),el('div',{class:'stack',style:'gap:6px'},el('span',{class:'flabel',text:'Кому (можна кількох)'}),who),whenPicker(d,tm,rm),el('label',{for:'tNote'},'Коментар',n),
    el('p',{class:'muted small',style:'margin:0',text:'Фото, відмітки виконавців і хід задачі збережуться.'}),
    el('div',{class:'row'},el('button',{class:'btn',type:'button',style:'flex:1',onclick:async()=>{const title=ti.value.trim();if(!title){toast('Напишіть, що треба зробити');ti.focus();return;}
      if(!picked.size){toast('Оберіть, кому призначити');return;}
      const ids=sortedStaff().map(x=>x.id).filter(id=>picked.has(id));const added=ids.filter(id=>!was.includes(id));
      const dm0=t.doneMap||{};const doneMap=Object.fromEntries(Object.entries(dm0).filter(([k])=>ids.includes(k)));
      const upd={title,note:n.value.trim(),assignees:ids,assignee:ids[0],doneMap,due:d.value||null,dueTime:tm.value||null,remind:rm.value||null,editedAt:Date.now(),editedBy:S.myId||''};
      const moved=(t.due||'')!==(d.value||'')||(t.dueTime||'')!==(tm.value||'');
      if(moved)upd.dueLog=[...(t.dueLog||[]),{from:t.due||null,fromTime:t.dueTime||null,to:d.value||null,toTime:tm.value||null,at:Date.now(),by:S.myId||''}].slice(-20);
      closeSheet();await write(()=>S.db.doc('tasks/'+t.id).update(upd),moved?'Задачу перенесено на '+(d.value?dm(d.value):'без дати')+(tm.value?' · '+tm.value:''):'Задачу збережено');
      if(added.length)notifyTask({title,note:upd.note,due:upd.due,photos:(t.refPhotos||[]).length},added);}},'Зберегти'),
      el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати')));
  if(!IS_TOUCH)ti.focus();}
