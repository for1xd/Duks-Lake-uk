// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: shifts (check-in with photo)

/* ---------- shifts (check-in with photo) ---------- */
const I_CAM='<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>';
function myOpenShift(m){return m?S.shifts.find(x=>x.staffId===m.id&&!x.endAt&&Date.now()-x.startAt<20*3600e3):null;}
function shiftHours(x){if(!x.endAt&&Date.now()-x.startAt>=20*3600e3)return 0;return Math.max(0,((x.endAt||Date.now())-x.startAt)/3600e3);}
function fmtH(h){const t=Math.round(h*60);const H=Math.floor(t/60),M=t%60;return H?(H+' год'+(M?' '+M+' хв':'')):M+' хв';}
function liveH(since){return el('span',{'data-since':String(since),text:fmtH((Date.now()-since)/3600e3)});}
setInterval(()=>document.querySelectorAll('[data-since]').forEach(e=>{e.textContent=fmtH((Date.now()-(+e.dataset.since))/3600e3);}),20000);
function shiftsIn(sid,from,to){return S.shifts.filter(x=>x.staffId===sid&&x.date>=from&&x.date<=to).sort((a,b)=>a.startAt-b.startAt);}
function pickPhoto(){return new Promise(res=>{const i=el('input',{type:'file',accept:'image/*',capture:'environment',style:'position:fixed;left:-999px'});i.addEventListener('change',()=>{res(i.files&&i.files[0]||null);i.remove();});document.body.append(i);i.click();});}
function thumbBtn(ph,label){return ph?el('button',{type:'button',class:'sh-th','aria-label':label,onclick:e=>{e.stopPropagation();viewPhoto(ph.id);}},el('img',{src:ph.thumb,alt:''})):null;}
function shiftSheet(kind){const m=myStaff();if(!m)return;let img=null;
  const prev=el('button',{type:'button',class:'sh-prev'},svg(I_CAM),el('span',{text:'Натисніть, щоб зробити фото'}));
  const ok=el('button',{class:'btn',type:'button',disabled:true},kind==='start'?'Почати зміну':'Завершити зміну');
  const shoot=async()=>{const f=await pickPhoto();if(!f)return;try{img=await loadImg(f);}catch(e){toast('Не вдалося відкрити фото');return;}
    prev.classList.add('has');prev.replaceChildren(el('img',{src:shrink(img,700,0.72),alt:'Фото з об’єкта'}),el('span',{class:'sh-re',text:'Перезняти'}));ok.disabled=false;};
  prev.onclick=shoot;
  ok.onclick=async()=>{if(!img)return;ok.disabled=true;ok.textContent='Збереження…';
    await write(async()=>{const now=Date.now();const r=await S.db.collection('photos').add({taskId:null,shift:true,img:shrinkFit(img),by:S.myId,at:now});const ph={id:r.id,thumb:shrink(img,240,0.6)};
      if(kind==='start')await S.db.collection('shifts').add({staffId:m.id,by:S.myId,date:ymd(new Date()),startAt:now,startPhoto:ph,endAt:null,endPhoto:null});
      else{const o=myOpenShift(m);if(o)await S.db.doc('shifts/'+o.id).update({endAt:now,endPhoto:ph});}},kind==='start'?'Зміну розпочато. Гарної роботи!':'Зміну завершено. Дякуємо!');
    closeSheet();};
  const o=kind==='end'?myOpenShift(m):null;
  openSheet(el('h2',{text:kind==='start'?'Почати зміну':'Завершити зміну'}),
    el('p',{class:'muted',style:'margin:0',text:kind==='start'?'Сфотографуйте об’єкт, де ви зараз. Менеджер побачить фото й час початку.':'Сфотографуйте результат або об’єкт перед виходом. Години порахуються автоматично.'}),
    o?el('div',{class:'sh-sum'},el('span',{text:'Початок '+hm(o.startAt)}),el('b',{},liveH(o.startAt))):null,
    prev,ok,el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'));
  if(IS_TOUCH)setTimeout(shoot,250);}

function tsOf(date,hhmm){const [h,mi]=hhmm.split(':').map(Number);const d=parseYmd(date);d.setHours(h,mi,0,0);return d.getTime();}
function shiftEdit(x,preset){const isNew=!x;const plan=canPlan();preset=preset||{};
  const ws=sortedStaff().filter(earns);
  const who=el('select',{id:'shWho'},ws.map(w=>el('option',{value:w.id,text:w.name})));if(x)who.value=x.staffId;else if(preset.staffId)who.value=preset.staffId;
  const dt=el('input',{id:'shDate',type:'date',value:x?x.date:(preset.date||ymd(new Date()))});
  const st=el('input',{id:'shSt',type:'time',value:x?hm(x.startAt):'08:00'});
  const en=el('input',{id:'shEn',type:'time',value:x&&x.endAt?hm(x.endAt):(x?'':'13:00')});
  const sum=el('span',{class:'muted small'});const needRsn=isNew&&plan;const rsn=el('textarea',{id:'shRsn',placeholder:'напр. «забув телефон, підтвердив по дзвінку»',maxlength:'300'});
  const calc=()=>{if(!st.value||!en.value){sum.textContent=en.value?'':'Без часу завершення зміна вважатиметься відкритою';return;}let a=tsOf(dt.value,st.value),b=tsOf(dt.value,en.value);if(b<=a)b+=864e5;sum.textContent='Разом: '+fmtH((b-a)/3600e3)+(b-a>864e5/2?' (через північ)':'');};
  [dt,st,en].forEach(i=>i.addEventListener('input',calc));calc();
  const save=el('button',{class:'btn',type:'button',style:'flex:1',onclick:()=>{if(!dt.value||!st.value){toast('Вкажіть дату й час початку');return;}if(needRsn&&!rsn.value.trim()){toast('Вкажіть причину ручної відмітки');rsn.focus();return;}
    const a=tsOf(dt.value,st.value);let b=en.value?tsOf(dt.value,en.value):null;if(b!=null&&b<=a)b+=864e5;
    if(b!=null&&b-a>20*3600e3){toast('Зміна довша за 20 годин — перевірте час');return;}
    const data={date:dt.value,startAt:a,endAt:b,edited:true,editedBy:S.myId,editedAt:Date.now()};
    closeSheet();
    if(isNew)write(()=>S.db.collection('shifts').add({...data,staffId:who.value,by:S.myId,manual:true,reason:rsn.value.trim()||null,startPhoto:null,endPhoto:null}),'Відмітку додано вручну');
    else write(()=>S.db.doc('shifts/'+x.id).update(data),'Відмітку змінено');}},isNew?'Додати':'Зберегти');
  const w=x&&staffById(x.staffId);
  openSheet(el('h2',{text:isNew?'Додати відмітку':'Редагувати відмітку'}),
    isNew?el('label',{for:'shWho'},'Працівник',who):el('p',{class:'muted',style:'margin:0',text:(w?w.name+' · ':'')+(x.manual?'додано вручну':'відмітка з фото')+(x.edited?' · уже змінювалась':'')}),
    x?el('div',{class:'sh-ths'},thumbBtn(x.startPhoto,'Фото початку'),thumbBtn(x.endPhoto,'Фото завершення')):null,
    el('label',{for:'shDate'},'Дата',dt),
    needRsn?el('label',{for:'shRsn'},'Причина ручної відмітки (обов’язково)',rsn):null,
    el('div',{class:'row',style:'gap:10px;flex-wrap:nowrap'},el('label',{for:'shSt',style:'flex:1'},'Початок',st),el('label',{for:'shEn',style:'flex:1'},'Кінець',en)),
    sum,
    el('div',{class:'row'},save,!isNew&&(plan||x.by===S.myId)?el('button',{class:'btn danger',type:'button',onclick:()=>confirmSheet('Видалити цю відмітку зміни?','Видалити',()=>write(async()=>{await S.db.doc('shifts/'+x.id).delete();for(const ph of [x.startPhoto,x.endPhoto])if(ph)await S.db.doc('photos/'+ph.id).delete().catch(()=>{});},'Відмітку видалено'))},'Видалити'):null),
    el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'));}
function staleCard(x){return el('div',{class:'card sh-warn'},el('span',{class:'sh-wi',text:'!'}),el('div',{class:'grow'},el('b',{text:'Ви не завершили зміну '+dm(x.date)}),el('span',{class:'muted small',text:'Почали о '+hm(x.startAt)+'. Вкажіть, коли закінчили.'})),el('button',{class:'btn sm',type:'button',onclick:()=>shiftEdit(x)},'Вказати'));}
function staleShift(m){return m?S.shifts.find(x=>x.staffId===m.id&&!x.endAt&&Date.now()-x.startAt>=20*3600e3):null;}
function shiftMini(m){const o=myOpenShift(m);
  if(o)return el('div',{class:'card sh-mini on'},el('span',{class:'sh-dot'}),el('div',{class:'grow'},el('b',{text:'Ви на зміні'}),el('span',{class:'muted small'},'з '+hm(o.startAt)+' · ',liveH(o.startAt))),
    el('button',{class:'btn sm danger',type:'button',onclick:()=>shiftSheet('end')},'Завершити'));
  const t=ymd(new Date());const done=shiftsIn(m.id,t,t).filter(x=>x.endAt);
  return el('div',{class:'card sh-mini'},el('span',{class:'sh-ic'},svg(I_CAM)),el('div',{class:'grow'},el('b',{text:done.length?'Зміну завершено':'Зміна не розпочата'}),
    el('span',{class:'muted small',text:done.length?'Сьогодні: '+fmtH(done.reduce((a,x)=>a+shiftHours(x),0)):'Відмітьтеся фото з об’єкта'})),
    el('button',{class:'btn sm',type:'button',onclick:()=>shiftSheet('start')},done.length?'Ще зміна':'Почати'));}
function canEditShift(x){return canPlan()||(x&&x.by===S.myId);}
function shiftRow(x,showName){const w=staffById(x.staffId);const open=!x.endAt;const stale=open&&Date.now()-x.startAt>=20*3600e3;const ed=canEditShift(x);
  return el('div',{class:'sh-row'+(ed?' ed':'')+(stale?' stale':''),role:ed?'button':null,tabindex:ed?'0':null,'aria-label':ed?'Редагувати відмітку':null,onclick:ed?()=>shiftEdit(x):null,onkeydown:ed?(e=>{if(e.key==='Enter')shiftEdit(x);}):null},showName&&w?plink(w,[avatarP(w)]):null,
    el('div',{class:'grow'},showName&&w?el('b',{text:w.name}):el('b',{text:DS[(parseYmd(x.date).getDay()+6)%7]+', '+dm(x.date)}),
      el('span',{class:'muted small'},hm(x.startAt)+' – '+(open?(stale?'не завершено':'зараз'):hm(x.endAt)),x.edited?' · змінено':'')),
    el('div',{class:'sh-ths'},thumbBtn(x.startPhoto,'Фото початку'),thumbBtn(x.endPhoto,'Фото завершення')),
    el('span',{class:'sh-h'+(open&&!stale?' live':'')},open&&!stale?liveH(x.startAt):(stale?'—':fmtH(shiftHours(x)))));}
function planOf(sid,date){if(!S.week||S.weekStart!==mondayOf(parseYmd(date)))return null;return dayValue(sid,(parseYmd(date).getDay()+6)%7);}
function planMins(v){return shiftParts(v||'').map(partRange).filter(Boolean);}
function lateMin(x,v){const rs=planMins(v);if(!rs.length)return null;const d=new Date(x.startAt);const m=d.getHours()*60+d.getMinutes();const r=rs.reduce((b,r)=>Math.abs(r[0]-m)<Math.abs(b[0]-m)?r:b,rs[0]);const df=m-r[0];return Math.abs(df)>180?null:df;}
function dayStatus(w,date){const today=ymd(new Date());const xs=S.shifts.filter(x=>x.staffId===w.id&&x.date===date).sort((a,b)=>a.startAt-b.startAt);const v=planOf(w.id,date);
  const open=xs.find(x=>!x.endAt&&Date.now()-x.startAt<20*3600e3);const rs=planMins(v);const now=new Date();const mins=now.getHours()*60+now.getMinutes();
  let late=null;if(xs.length&&rs.length){late=lateMin(xs[0],v);}
  if(xs.length>1){const ls=xs.map(x=>lateMin(x,v)).filter(x=>x!=null);if(ls.length)late=Math.max(...ls);}
  const np=rs.length,nx=xs.length,part=np>1?' · зміна '+Math.min(nx,np)+' з '+np:'';
  if(open)return {k:'on',t:'На зміні'+(np>1?' · '+Math.min(nx,np)+' з '+np:''),xs,v,late};
  if(xs.length){if(np>nx&&date===today){const nxt=rs[nx];if(mins<nxt[0])return {k:'done',t:'Завершив '+nx+' з '+np+' · далі з '+Math.floor(nxt[0]/60)+':'+pad(nxt[0]%60),xs,v,late,part:1};
      return {k:'nochk',t:'Без відмітки на зміну '+(nx+1)+'/'+np+' · '+fmtH((mins-nxt[0])/60),xs,v,late};}
    if(np>nx&&date<today)return {k:'done',t:'Відмітився '+nx+' з '+np,xs,v,late};
    return {k:'done',t:'Завершив'+(np>1?' · '+nx+' з '+np:''),xs,v,late};}
  if(rs.length&&isWorking(v)){if(date<today)return {k:'miss',t:'Не вийшов',xs,v};if(date>today)return {k:'plan',t:'Заплановано',xs,v};
    if(mins<rs[0][0])return {k:'wait',t:'Ще не час · з '+Math.floor(rs[0][0]/60)+':'+pad(rs[0][0]%60),xs,v};return {k:'nochk',t:'Не відмітився · '+fmtH((mins-rs[0][0])/60),xs,v};}
  return {k:'off',t:'Вихідний',xs,v};}
function stChip(st){const late=st.late;return el('span',{class:'stc '+st.k},st.t,(st.k==='on'||st.k==='done')&&late!=null?(late>5?' · запізн. '+fmtH(late/60):' · вчасно'):'');}
function earnerView(m,preview){const out=[];const today=ymd(new Date());const wk0=mondayOf(new Date()),wk1=addDays(wk0,6);const mo0=today.slice(0,8)+'01';
  const act=fn=>preview?(()=>toast('Це попередній перегляд')):fn;
  const o=myOpenShift(m);const plan=S.weekStart===wk0&&S.week?dayValue(m.id,todayIdx()):'';const sl=staleShift(m);
  if(sl)out.push(preview?el('div',{class:'card sh-warn'},el('span',{class:'sh-wi',text:'!'}),el('div',{class:'grow'},el('b',{text:'Не завершена зміна '+dm(sl.date)}),el('span',{class:'muted small',text:'Працівник бачить прохання вказати час завершення'}))):staleCard(sl));
  out.push(el('section',{class:'sh-hero'+(o?' on':'')},
    el('span',{class:'eyebrow',text:(()=>{const np=planMins(plan).length,nx=S.shifts.filter(x=>x.staffId===m.id&&x.date===today).length;return o?'На зміні з '+hm(o.startAt)+(np>1?' · зміна '+Math.min(nx,np)+' з '+np:''):(plan?(np>1&&nx?'Зміна '+(nx+1)+' з '+np+' за графіком':'За графіком сьогодні'+(np>1?' · '+np+' зміни — відмітьтеся на кожну':'')):'Сьогодні за графіком вихідний');})()}),
    o?el('div',{class:'sh-big'},liveH(o.startAt)):el('div',{class:'row'},plan?shiftPills(plan):[el('span',{class:'sh-big',style:'font-size:22px',text:'Вихідний'})]),
    o?el('div',{class:'sh-ths'},thumbBtn(o.startPhoto,'Фото початку')):null,
    el('button',{class:'btn sh-cta'+(o?' end':''),type:'button',onclick:act(()=>shiftSheet(o?'end':'start'))},svg(I_CAM),o?'Завершити зміну':'Почати зміну')));
  const wk=shiftsIn(m.id,wk0,wk1);const mo=S.shifts.filter(x=>x.staffId===m.id&&x.date>=mo0);
  out.push(el('div',{class:'sh-stats'},el('div',{class:'card'},el('span',{class:'muted small',text:'Цей тиждень'}),el('b',{text:fmtH(wk.reduce((a,x)=>a+shiftHours(x),0))})),
    el('div',{class:'card'},el('span',{class:'muted small',text:'Цей місяць'}),el('b',{text:fmtH(mo.reduce((a,x)=>a+shiftHours(x),0))}))));
  out.push(el('h2',{text:preview?'Відмітки за тиждень':'Мої відмітки за тиждень'}));
  out.push(wk.length?el('div',{class:'card stack sh-list'},[...wk].reverse().map(x=>shiftRow(x,false))):el('div',{class:'card empty'},el('p',{class:'muted',text:'Цього тижня відміток ще немає.'})));
  return out;}
function previewAs(w){const nodes=earnerView(w,true);openSheet(el('div',{class:'row between'},el('h2',{text:'Так бачить «Моя зміна»'}),el('span',{class:'muted small',text:w.name})),
  el('div',{class:'prev-frame'},el('div',{class:'prev-bar'},el('span',{text:'Екран працівника'}),el('b',{text:w.name})),el('div',{class:'stack prev-body'},nodes)),
  el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Закрити'));}
function pickWorker(title,fn){const ws=sortedStaff().filter(earns);openSheet(el('h2',{text:title}),el('div',{class:'stack',style:'gap:6px'},ws.map(w=>el('button',{type:'button',class:'person',onclick:()=>{closeSheet();setTimeout(()=>fn(w),60);}},avatarP(w),el('span',{class:'nm'},el('b',{text:w.name}),roleTags(w))))),el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'));}
function weekPlanH(w,wk0){if(!S.week||S.weekStart!==wk0)return null;let t=0;for(let i=0;i<7;i++){planMins(dayValue(w.id,i)).forEach(r=>{t+=r[1]-r[0];});}return t/60;}
function workerWeek(w,wk0){const days=Array.from({length:7},(_,i)=>addDays(wk0,i));
  const rows=days.map(d=>{const st=dayStatus(w,d);const h=st.xs.reduce((a,x)=>a+shiftHours(x),0);
    return el('div',{class:'ww-day'+(d===ymd(new Date())?' now':'')},el('div',{class:'ww-h'},el('b',{text:DS[(parseYmd(d).getDay()+6)%7]+', '+dm(d)}),stChip(st),el('span',{class:'sh-h',text:h?fmtH(h):''})),
      st.v&&isWorking(st.v)?el('div',{class:'ww-plan'},el('span',{class:'muted small',text:'План:'}),shiftParts(st.v).map(miniShift)):null,
      st.xs.length?el('div',{class:'sh-list'},st.xs.map(x=>shiftRow(x,false))):(canPlan()&&st.k!=='plan'&&st.k!=='off'&&st.k!=='wait'?el('button',{class:'btn ghost sm',type:'button',style:'align-self:flex-start',onclick:()=>{closeSheet();shiftEdit(null,{staffId:w.id,date:d});}},'+ Внести відмітку'):null));});
  const fact=days.reduce((a,d)=>a+S.shifts.filter(x=>x.staffId===w.id&&x.date===d).reduce((b,x)=>b+shiftHours(x),0),0);const ph=weekPlanH(w,wk0);
  openSheet(el('div',{class:'row',style:'gap:12px'},avatarP(w),el('div',{class:'grow'},el('h2',{style:'margin:0',text:w.name}),el('span',{class:'muted small',text:dm(wk0)+' – '+dm(addDays(wk0,6))}))),
    el('div',{class:'sh-stats'},el('div',{class:'card'},el('span',{class:'muted small',text:'Факт'}),el('b',{text:fmtH(fact)})),el('div',{class:'card'},el('span',{class:'muted small',text:'За графіком'}),el('b',{text:ph==null?'—':fmtH(ph)}))),
    el('div',{class:'stack',style:'gap:8px'},rows),
    el('div',{class:'row'},el('button',{class:'btn ghost',type:'button',style:'flex:1',onclick:()=>{closeSheet();setTimeout(()=>previewAs(w),60);}},svg(IC.eye),' Як бачить працівник'),el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Закрити')));}
