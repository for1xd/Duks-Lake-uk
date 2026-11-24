// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: support

/* ---------- support ---------- */
const TK_TYPES={bug:{n:'Помилка',c:'bug'},idea:{n:'Пропозиція',c:'idea'},note:{n:'Зауваження',c:'note'}};
const TK_ST={new:'Новий',progress:'В роботі',done:'Вирішено'};
function isDev(){const r=myRoles();return r?r.includes('dev'):S.isOwner;}
function myTickets(){const m=myStaff();return S.tickets.filter(t=>t.by===S.myId||(m&&t.staffId===m.id));}
function tkUnreadForMe(t){if(isDev()&&t.by!==S.myId){const last=(t.replies||[]).filter(r=>!r.dev).map(r=>r.at).concat([t.at]);return Math.max(...last)>(t.seenByDev||0);}
  return (t.replies||[]).some(r=>r.dev&&r.at>(t.seenByAuthor||0));}
function tkBadge(){if(isDev())return S.tickets.filter(t=>t.status!=='done'&&tkUnreadForMe(t)).length;return myTickets().filter(tkUnreadForMe).length;}
function fmtWhen(ts){const d=new Date(ts);const t=pad(d.getHours())+':'+pad(d.getMinutes());const day=ymd(d);
  return day===ymd(new Date())?'сьогодні о '+t:day===ymd(new Date(Date.now()-864e5))?'вчора о '+t:pad(d.getDate())+'.'+pad(d.getMonth()+1)+' о '+t;}
function tkCard(t){const ty=TK_TYPES[t.type]||TK_TYPES.note;const who=staffById(t.staffId);const n=(t.replies||[]).length;const un=tkUnreadForMe(t);
  return el('button',{class:'card tk'+(un?' unread':''),type:'button','aria-label':'Відкрити запит: '+t.title,onclick:()=>openTicket(t.id)},
    el('div',{class:'row between',style:'gap:8px'},el('span',{class:'tktype '+ty.c,text:ty.n}),el('span',{class:'tkst '+(t.status||'new'),text:TK_ST[t.status||'new']})),
    el('b',{class:'tktitle',text:t.title}),
    t.text?el('span',{class:'muted tkprev',text:t.text}):null,
    el('div',{class:'row',style:'gap:8px'},isDev()&&who?el('span',{class:'row',style:'gap:6px'},avatarP(who,'xs'),el('span',{class:'small',style:'font-weight:700',text:who.name})):null,
      el('span',{class:'muted small',text:fmtWhen(t.at)}),n?el('span',{class:'muted small',text:'· відповідей: '+n}):null,un?el('span',{class:'newdot','aria-label':'Нове'}):null));}
function viewSupport(){
  const out=[];const dev=isDev();
  out.push(el('div',{class:'card sup-hero'},
    el('div',{class:'sup-ic'},svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m5.6 5.6 3.6 3.6M14.8 14.8l3.6 3.6M14.8 9.2l3.6-3.6M5.6 18.4l3.6-3.6"/>')),
    el('div',{class:'stack',style:'gap:4px;flex:1;min-width:0'},el('h2',{text:dev?'Запити від колективу':'Щось не працює чи є ідея?'}),
      el('p',{class:'muted',style:'margin:0',text:dev?'Тут усі помилки, пропозиції й зауваження. Бачите їх лише ви та інші Dev.':'Напишіть нам. Запит побачать лише розробники (Dev), і відповідь прийде сюди ж.'})),
    el('button',{class:'btn',type:'button',onclick:newTicket},'+ Новий запит')));
  out.push(pwaCard());
  if(dev){
    const F=[['open','Відкриті'],['new','Нові'],['progress','В роботі'],['done','Вирішені'],['all','Усі']];
    out.push(el('div',{class:'seg full',role:'group','aria-label':'Фільтр'},F.map(([id,n])=>{const c=id==='all'?S.tickets.length:S.tickets.filter(t=>id==='open'?t.status!=='done':(t.status||'new')===id).length;
      return el('button',{type:'button','aria-pressed':String(S.tkFilter===id),onclick:()=>{S.tkFilter=id;render();}},n,el('small',{text:String(c)}));})));
    let list=S.tickets.filter(t=>S.tkFilter==='all'?true:S.tkFilter==='open'?t.status!=='done':(t.status||'new')===S.tkFilter);
    list=[...list].sort((a,b)=>(tkUnreadForMe(b)-tkUnreadForMe(a))||((b.updatedAt||b.at)-(a.updatedAt||a.at)));
    out.push(list.length?el('div',{class:'stack list'},list.map(tkCard)):el('div',{class:'card empty'},el('p',{class:'muted',text:'Запитів тут немає.'})));
  }else{
    const mine=[...myTickets()].sort((a,b)=>(b.updatedAt||b.at)-(a.updatedAt||a.at));
    out.push(el('h2',{text:'Мої запити'}));
    out.push(mine.length?el('div',{class:'stack list'},mine.map(tkCard)):el('div',{class:'card empty'},el('p',{class:'muted',text:'Ви ще нічого не надсилали.'})));
  }
  return out;
}
function newTicket(){
  const m=myStaff();if(!m){toast('Спершу підтвердіть своє ім’я на вкладці «Сьогодні»');return;}
  let type='bug';
  const chips=el('div',{class:'tkchips',role:'radiogroup','aria-label':'Тип запиту'});
  const drawChips=()=>chips.replaceChildren(...Object.entries(TK_TYPES).map(([k,v])=>el('button',{type:'button',role:'radio','aria-checked':String(type===k),class:'tkchip '+v.c,onclick:()=>{type=k;drawChips();}},v.n)));drawChips();
  const ti=el('input',{id:'tkTitle',maxlength:'120',placeholder:'Коротко: що сталося або що покращити'});
  const tx=el('textarea',{id:'tkText',maxlength:'3000',placeholder:'Опишіть детальніше: де саме, що ви робили, що очікували побачити',style:'min-height:120px'});
  const files=[];const prev=el('div',{class:'thumbs'});
  const fin=el('input',{type:'file',accept:'image/*',multiple:true,'aria-label':'Додати скріншот'});
  const drawPrev=()=>prev.replaceChildren(...files.map((f,i)=>el('span',{class:'thumb rm'},el('img',{src:URL.createObjectURL(f),alt:''}),el('button',{type:'button',class:'x','aria-label':'Прибрати',onclick:()=>{files.splice(i,1);drawPrev();}},'×'))));
  fin.addEventListener('change',()=>{for(const f of fin.files){if(files.length>=3)break;files.push(f);}fin.value='';drawPrev();});
  const go2=el('button',{class:'btn',type:'button',style:'flex:1'},'Надіслати запит');
  go2.addEventListener('click',async()=>{const title=ti.value.trim();if(!title){toast('Напишіть коротку назву');return;}
    go2.disabled=true;go2.textContent=files.length?'Завантаження скріншотів…':'Надсилаємо…';
    try{const ph=[];for(const f of files){const img=await loadImg(f);const r=await S.db.collection('photos').add({taskId:null,img:shrinkFit(img),by:S.myId,at:Date.now()});ph.push({id:r.id,thumb:shrink(img,220,0.6)});}
      await S.db.collection('tickets').add({by:S.myId,staffId:m.id,type,title,text:tx.value.trim(),photos:ph,status:'new',at:Date.now(),updatedAt:Date.now(),replies:[],seenByAuthor:Date.now(),seenByDev:0});
      closeSheet();toast('Запит надіслано. Дякуємо!');}
    catch(e){go2.disabled=false;go2.textContent='Надіслати запит';toast('Не вдалося надіслати. Спробуйте ще раз.');}});
  openSheet(el('h2',{text:'Новий запит'}),el('div',{class:'stack',style:'gap:6px'},el('span',{class:'flabel',text:'Тип'}),chips),
    el('label',{for:'tkTitle'},'Тема',ti),el('label',{for:'tkText'},'Опис',tx),
    el('div',{class:'stack',style:'gap:8px'},el('span',{class:'flabel',text:'Скріншоти (до 3)'}),prev,el('span',{class:'btn ghost sm filebtn',style:'align-self:flex-start'},svg('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),' Додати скріншот',fin)),
    el('div',{class:'row'},go2,el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати')));
}
function openTicket(id){S.hist.push(snap());S.viewTicket=id;S.tab='ticket';SC().scrollTop=0;render();animIn(1);}
function viewTicket(){
  const t=S.tickets.find(x=>x.id===S.viewTicket);
  const back=null;
  if(!t)return [el('div',{class:'card empty'},el('p',{class:'muted',text:'Запит не знайдено або видалено.'}))];
  const dev=isDev();const mineT=t.by===S.myId;
  if(!dev&&!mineT)return [el('div',{class:'card empty'},el('p',{class:'muted',text:'Цей запит вам недоступний.'}))];
  const now=Date.now();
  if(dev&&!mineT&&tkUnreadForMe(t))S.db.doc('tickets/'+t.id).update({seenByDev:now}).catch(()=>{});
  if(mineT&&(t.replies||[]).some(r=>r.dev&&r.at>(t.seenByAuthor||0)))S.db.doc('tickets/'+t.id).update({seenByAuthor:now}).catch(()=>{});
  const ty=TK_TYPES[t.type]||TK_TYPES.note;const who=staffById(t.staffId);
  const head=el('div',{class:'card stack'},el('div',{class:'row between'},el('span',{class:'tktype '+ty.c,text:ty.n}),el('span',{class:'tkst '+(t.status||'new'),text:TK_ST[t.status||'new']})),
    el('h2',{style:'font-size:20px',text:t.title}),
    el('div',{class:'row',style:'gap:8px'},who?plink(who,[avatarP(who,'xs'),el('span',{class:'small',style:'font-weight:700',text:who.name})],'inl'):el('span',{text:'—'}),el('span',{class:'muted small',text:fmtWhen(t.at)})),
    t.text?el('p',{style:'margin:0;white-space:pre-wrap;overflow-wrap:anywhere',text:t.text}):null,
    (t.photos&&t.photos.length)?el('div',{class:'thumbs'},t.photos.map(p=>el('button',{type:'button',class:'thumb','aria-label':'Відкрити скріншот',onclick:()=>viewPhoto(p.id)},el('img',{src:p.thumb,alt:'Скріншот'})))):null);
  const out=[head];
  if(dev){out.push(el('div',{class:'seg full',role:'group','aria-label':'Статус'},Object.entries(TK_ST).map(([k,n])=>el('button',{type:'button','aria-pressed':String((t.status||'new')===k),
    onclick:()=>write(()=>S.db.doc('tickets/'+t.id).update({status:k,updatedAt:Date.now()}),'Статус: '+n)},n))));}
  const th=el('div',{class:'chat'});
  (t.replies||[]).forEach(r=>{const w=staffById(r.staffId);const me=r.by===S.myId;
    th.append(el('div',{class:'msg'+(me?' mine':'')},!me?(w?avatarP(w):null):null,el('div',{class:'bubble'},
      el('span',{class:'who',text:(w?w.name:'—')+(r.dev?' · підтримка':'')}),el('span',{class:'txt',text:r.text}),el('span',{class:'tm'},el('span',{text:fmtWhen(r.at)}),me?(sn=>el('span',{class:'ticks'+(sn?' seen':''),'aria-label':sn?'Переглянуто':'Надіслано'},svg(sn?TICK2:TICK1)))((r.dev?(t.seenByAuthor||0):(t.seenByDev||0))>=r.at):null))));});
  out.push(el('h2',{text:'Листування'}));
  out.push((t.replies||[]).length?th:el('p',{class:'muted',style:'margin:0',text:dev?'Ще немає відповідей. Напишіть першим.':'Розробники ще не відповіли. Відповідь з’явиться тут.'}));
  const ta=el('textarea',{id:'tkReply',maxlength:'3000',placeholder:dev?'Відповідь для '+(who?who.name:'автора')+'…':'Доповнити запит…',style:'min-height:80px'});
  if(S.tkDraftId===t.id)ta.value=S.tkDraft||'';ta.addEventListener('input',()=>{S.tkDraft=ta.value;S.tkDraftId=t.id;});
  const send=el('button',{class:'btn',type:'button'},'Надіслати');
  send.addEventListener('click',()=>{const txt=ta.value.trim();if(!txt)return;const m=myStaff();
    const rep={by:S.myId,staffId:m?m.id:null,text:txt,at:Date.now(),dev:dev&&!mineT};
    const patch={replies:[...(t.replies||[]),rep],updatedAt:Date.now()};
    if(dev&&!mineT){patch.seenByDev=Date.now();if((t.status||'new')==='new')patch.status='progress';}else patch.seenByAuthor=Date.now();
    S.tkDraft='';
    write(()=>S.db.doc('tickets/'+t.id).update(patch),'Надіслано');});
  out.push(el('div',{class:'card stack'},el('label',{for:'tkReply'},dev?'Ваша відповідь':'Повідомлення розробникам',ta),el('div',{class:'row'},send,
    (dev||mineT)?el('button',{class:'btn ghost',type:'button',onclick:()=>confirmSheet('Видалити запит «'+t.title+'»?','Видалити',()=>{write(async()=>{await S.db.doc('tickets/'+t.id).delete();for(const p of t.photos||[])await S.db.doc('photos/'+p.id).delete();},'Запит видалено');go('support');})},'Видалити запит'):null)));
  return out;
}
async function approve(r,role){
  if(S.staff.some(x=>x.userId===r.id)){toast('Цей обліковий запис уже прив’язаний');return;}
  if(r.staffId)await write(()=>S.db.doc('staff/'+r.staffId).update({userId:r.id}));
  else await write(()=>S.db.collection('staff').add({name:r.newName,role,userId:r.id,order:S.staff.length+1}));
  write(()=>S.db.doc('requests/'+r.id).delete(),'Підтверджено');
}
function editPerson(s){
  const nm=el('input',{id:'pName',value:s?s.name:'',placeholder:'Ім’я та ініціал',maxlength:'60'});
  const em=el('input',{id:'pEmail',type:'email',value:(s&&s.email)||'',placeholder:'name@gmail.com',autocomplete:'off',maxlength:'120'});
  const ex=el('select',{id:'pExtra'},el('option',{value:'',text:'Немає'}),ROLES.map(r=>el('option',{value:r.id,text:r.name,selected:!!(s&&s.extraRole===r.id)})));
  const rl=el('select',{id:'pRole'},ROLES.map(r=>el('option',{value:r.id,text:r.name,selected:s?s.role===r.id:r.id==='cleaner'})));
  const inS=el('input',{id:'pSched',type:'checkbox',checked:!s||s.inSchedule!==false,style:'width:24px;height:24px;min-height:0;flex:none'});
  const wk=el('input',{id:'pWalks',type:'checkbox',class:'ck',checked:s&&s.walks?true:null});const wkRow=el('label',{class:'ck-row',for:'pWalks'},wk,el('span',{},'Також проводить обхід будівель',el('small',{class:'muted',style:'display:block;font-weight:600',text:'Для керівника Facility чи CEO Asgard: з’явиться серед тих, кого можна закріпити за будівлею'})));
  const wkUpd=()=>{wkRow.hidden=![rl.value,ex.value].some(r=>r==='director'||r==='ceo');};rl.addEventListener('change',wkUpd);ex.addEventListener('change',wkUpd);wkUpd();
  const kids=[el('h2',{text:s?s.name:'Новий працівник'}),el('label',{for:'pName'},'Ім’я',nm),el('label',{for:'pEmail'},'Пошта для сповіщень про задачі',em),el('label',{for:'pRole'},'Основна роль',rl),el('label',{for:'pExtra'},'Додаткова роль',ex),el('label',{for:'pSched',style:'flex-direction:row;align-items:center;gap:10px;font-size:15px;color:var(--fg)'},inS,'Показувати в графіку'),wkRow,
    el('div',{class:'row'},el('button',{class:'btn',type:'button',style:'flex:1',onclick:()=>{const name=nm.value.trim();if(!name){toast('Вкажіть ім’я');return;}
      closeSheet();
      if(s)write(()=>S.db.doc('staff/'+s.id).update({name,email:em.value.trim()||null,role:rl.value,extraRole:ex.value||null,inSchedule:inS.checked,walks:!wkRow.hidden&&wk.checked}),'Збережено');
      else write(()=>S.db.collection('staff').add({name,email:em.value.trim()||null,role:rl.value,extraRole:ex.value||null,inSchedule:inS.checked,userId:null,order:S.staff.length+1}),'Працівника додано');}},s?'Зберегти':'Додати'),
      el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'))];
  if(s){
    if(s.userId)kids.push(el('button',{class:'btn ghost',type:'button',onclick:()=>{closeSheet();write(()=>S.db.doc('staff/'+s.id).update({userId:null}),'Обліковий запис відв’язано');}},'Відв’язати обліковий запис'));
    kids.push(el('button',{class:'btn danger',type:'button',onclick:()=>confirmSheet('Видалити '+s.name+' з колективу? Зміни в графіках залишаться без імені.','Видалити',()=>write(()=>S.db.doc('staff/'+s.id).delete(),'Працівника видалено'))},'Видалити з колективу'));
  }
  openSheet(...kids);if(!IS_TOUCH)nm.focus();
}
