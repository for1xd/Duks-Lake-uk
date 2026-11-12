// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Клінінг: закріплення зон прибирання + ревізії (механізм «Обходу будівель»: обробка/стиснення фото inspSrc→inspProcess,

/* CLEAN:BEGIN — Клінінг: закріплення зон прибирання + ревізії (механізм «Обходу будівель»: обробка/стиснення фото inspSrc→inspProcess,
   черга на телефоні IDBX, assets, погодження директором, Dev-очищення фото).
   Колекції: cl_cleaners {name,phone,color,staffId,active,order,v} · cl_objects {loc,name,cleanerId,order,v} · cl_locs {name,group,order} (інші локації)
   · cl_revisions {date,authorId,locs[],items:{oid:{name,loc,cleanerId,ord,grade,comment,ph:{pid:{by,at}}}},status,hist[],generalComment,returnText,returnObj,purged,v}
   · cl_rev_photos {revId,objId,assetId,data,thumb,takenAt,fromGallery,sizeKb,w,h,authorId,addedAt,purged}. */
const CL_EDIT_ROLES=['manager','director','dev'];
const CL_REV_ROLES=['manager','director','dev'];
const CL_COLORS=['#1F6F78','#C2416B','#5B6CD9','#B0742A','#2E8B5E','#7A5AC8','#D2553C','#0E7C66'];
const CL_SUG=['Хол','Сходова','Тех. сходова','Ліфт 1','Ліфт 2','Ліфт вантажний','Хол 2 поверху','Хол 3 поверху','Хол 4 поверху','Хол 5 поверху','Хол 6 поверху','Сходова на паркінг','Усе приміщення'];
const CL_GR={ok:['Чисто','✓'],remark:['Є зауваження','⚠'],bad:['Незадовільно','✕']};
const CL_ST={draft:['чернетка','draft'],submitted:['на погодженні','sub'],returned:['повернено із зауваженнями','ret'],approved:['погоджено','ok']};
function clCanEdit(){const m=myStaff();if(m&&m.perms&&m.perms.cleanEdit===false)return false;if(m&&m.perms&&m.perms.cleanEdit===true)return true;return hasAny(CL_EDIT_ROLES);}
function clCanRev(){return hasAny(CL_REV_ROLES);}
function clCanApprove(){return inspCanReview();}
function clMe(){return inspMe()||myStaff();}
function clLocs(){return ARCH.map(b=>({id:b.id,name:'Буд. '+b.fac,full:'Буд. '+b.fac+' · '+b.name,ord:arFacKey(b)}))
  .concat(Object.values(S.clLoc||{}).sort((a,b)=>(a.order||0)-(b.order||0)).map((l,i)=>({id:l.id,name:l.name,full:l.name,other:true,ord:1000+i})));}
function clLoc(id){return clLocs().find(l=>l.id===id)||{id,name:id,full:id,ord:9999};}
function clCleaners(all){return Object.values(S.clC||{}).filter(c=>all||c.active!==false).sort((a,b)=>(a.order||0)-(b.order||0)||String(a.name).localeCompare(b.name,'uk'));}
function clObjs(){const L=Object.fromEntries(clLocs().map(l=>[l.id,l.ord]));return Object.values(S.clO||{}).sort((a,b)=>((L[a.loc]??9999)-(L[b.loc]??9999))||(a.order||0)-(b.order||0)||String(a.name).localeCompare(b.name,'uk'));}
function clCleanerOf(o){const c=o&&o.cleanerId&&(S.clC||{})[o.cleanerId];return c&&c.active!==false?c:null;}
function clInit(n){return String(n||'?').trim().split(/\s+/).map(w=>w[0]||'').join('').slice(0,2).toUpperCase();}
function clDot(c){return el('span',{class:'cl-dot',style:'--c:'+(c?c.color||CL_COLORS[0]:'transparent'),'aria-hidden':'true'});}
function clAv(c,big){const st=c&&c.staffId&&staffById(c.staffId);return st&&st.photo?avatar(st,big?'':'xs'):el('span',{class:'cl-av'+(big?' big':''),style:'--c:'+((c&&c.color)||CL_COLORS[0]),text:clInit(c&&c.name),'aria-hidden':'true'});}
function clRevs(){return Object.values(S.clRev||{}).sort((a,b)=>(b.date||'').localeCompare(a.date||'')||(b.createdAt||0)-(a.createdAt||0));}
function clPending(){return clRevs().filter(r=>r.status==='submitted').length;}
function clBadge(){let n=clCanApprove()?clPending():0;const m=clMe();if(m)n+=clRevs().filter(r=>r.authorId===m.id&&r.status==='returned').length;return n;}
/* останній результат ревізії по об'єкту (не чернетки) */
function clLast(oid){let best=null;for(const r of clRevs()){if(r.status==='draft')continue;const it=(r.items||{})[oid];if(it&&it.grade){const t=r.submittedAt||r.createdAt||0;if(!best||t>best.t)best={r,it,t};}}return best;}
function clGradeTag(g,small){const x=CL_GR[g];if(!x)return null;return el('span',{class:'cl-g '+g+(small?' sm':''),title:x[0]},x[1]);}
function clStPill(st){const s=CL_ST[st]||CL_ST.draft;return el('span',{class:'ip-st ip-'+s[1]},el('i'),s[0]);}
function clId(p){return p+Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
/* запис із перевіркою версії (паралельні зміни не затирають одна одну) */
async function clPut(col,id,patch,expV,msg){try{const ref=S.db.doc(col+'/'+id);const sn=await ref.get();const cur=sn.exists?(sn.data()||{}):null;
    if(expV!=null&&cur&&(cur.v||0)!==expV){toast('Запис щойно змінив хтось інший — дані оновлено, повторіть дію.');return false;}
    if(expV!=null&&!cur){toast('Запис уже видалено.');return false;}
    const p=typeof patch==='function'?patch(cur||{}):patch;if(!p)return false;const now=Date.now();const body=Object.assign({},p,{v:((cur&&cur.v)||0)+1,updatedAt:now,updatedBy:S.myId||''});
    if(cur)await ref.update(body);else await ref.set(Object.assign({createdAt:now},body));if(msg)devLog(msg);return true;}
  catch(e){logErr('Клінінг: '+((e&&(e.code||e.message))||e),msg||'');toast(e&&(e.code==='invalid_argument'||e.code==='not_granted')?'У вас доступ лише для перегляду.':'Не вдалося зберегти. Спробуйте ще раз.');return false;}}
/* ---------- початкові дані: один раз, якщо колекції порожні ---------- */
const CL_SEED=[['Світлана',/^світлан/i,[['1.3',['Хол','Сходова','Тех. сходова','Ліфт 1','Ліфт 2','Хол 3 поверху','Хол 4 поверху','Хол 5 поверху','Хол 6 поверху']],['2',['Хол','Сходова','Тех. сходова','Сходова на паркінг','Ліфт 1','Ліфт 2']],['x_uk',['Хол']]]],
  ['Люба',/^люб/i,[['1.2',['Хол','Сходова','Тех. сходова','Ліфт вантажний','Ліфт 1','Ліфт 2','Хол 4 поверху','Хол 6 поверху']],['4',['Сходова на паркінг 1','Сходова на паркінг 2']]]],
  ['Наталія',/^натал/i,[['1.1',['Хол','Сходова','Тех. сходова','Ліфт вантажний','Ліфт 1','Ліфт 2','Хол 2 поверху']],['4',['Хол','Сходова','Ліфт 1','Ліфт 2']],['x_kult',['Усе приміщення']]]]];
async function clSeed(){if(clSeed.busy||!S.db||!canW())return;clSeed.busy=true;try{const ref=S.db.doc('cl_locs/x_uk');if((await ref.get()).exists)return;
  if(typeof ref.acquire==='function'){try{const l=await ref.acquire({ttlMs:8000});if(l&&l.acquired===false)return;}catch(e){}}
  const [a,b]=await Promise.all([S.db.collection('cl_cleaners').get(),S.db.collection('cl_objects').get()]);if(a.docs.length||b.docs.length)return;const now=Date.now(),by=S.myId||'';
  await ref.set({name:'Офіс УК',group:'Інші локації',order:10,createdAt:now});await S.db.doc('cl_locs/x_kult').set({name:'Культ (приміщення резидента)',group:'Інші локації',order:20,createdAt:now});
  const locId=f=>f.startsWith('x_')?f:(ARCH.find(x=>x.fac===f)||{}).id;let n=0;
  for(let i=0;i<CL_SEED.length;i++){const [name,re,groups]=CL_SEED[i];const st=S.staff.find(s=>re.test(String(s.name||'').trim())&&(s.role==='cleaner'||s.extraRole==='cleaner'))||S.staff.find(s=>re.test(String(s.name||'').trim()));
    const cid='c_seed'+(i+1);await S.db.doc('cl_cleaners/'+cid).set({name:st?st.name:name,phone:'',color:CL_COLORS[i],staffId:st?st.id:null,active:true,order:(i+1)*10,v:1,createdAt:now,updatedAt:now,updatedBy:by});
    let o=0;for(const [f,objs] of groups){const loc=locId(f);if(!loc)continue;for(const on of objs){o+=10;n++;await S.db.doc('cl_objects/o_seed'+(i+1)+'_'+o).set({loc,name:on,cleanerId:cid,order:o,v:1,createdAt:now,updatedAt:now,updatedBy:by});}}}
  devLog('Клінінг: створено початкове закріплення зон ('+CL_SEED.length+' прибиральниці, '+n+' об’єктів)');}catch(e){console.warn('cl seed',e);}finally{clSeed.busy=false;}}
/* ---------- вигляд розділу ---------- */
function clView(){const g=FG.find(x=>x.id==='clean');
  if(S.clW)return clWizard();if(S.clR)return clReport(S.clR);
  const out=[fgHead(g)];const tab=S.clTab||'zones';const pend=clPending();
  out.push(el('div',{class:'sg full cl-tabs',role:'tablist'},[['zones','Закріплення зон','Зони'],['sched','Графік прибирання','Графік'],['revs','Ревізії','Ревізії']].map(([k,l,sh])=>el('button',{type:'button',role:'tab','aria-selected':String(tab===k),'aria-pressed':String(tab===k),'aria-label':l,onclick:()=>{S.clTab=k;S.clSel=null;clPopOff();render();}},el('span',{class:'cl-lg',text:l}),el('span',{class:'cl-sh',text:sh}),k==='revs'&&pend&&clCanApprove()?el('span',{class:'badge',text:String(pend)}):null))));
  if(!S.clLoaded)return out.concat(el('div',{class:'card cl-sk','aria-hidden':'true'}));
  return out.concat(tab==='revs'?clRevsView():tab==='sched'?clSchedView():clZonesView());}
/* ---------- графік прибирання: дні тижня (0=Пн … 6=Нд), за замовчуванням Пн–Пт; разові винятки cl_exc ---------- */
const CL_WD=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];const CL_DEF_DAYS=[0,1,2,3,4];
const CL_EXT={off:'Вихідний',sick:'Лікарняний',sub:'Заміна'};
function clWd(ds){return (parseYmd(ds).getDay()+6)%7;}
function clDays(c){return c&&Array.isArray(c.days)&&c.days.length?c.days:CL_DEF_DAYS;}
function clObjDays(o){return Array.isArray(o.days)?o.days:clDays(clCleanerOf(o));}
function clExc(ds,cid){return (S.clExc||{})[ds+'_'+cid]||null;}
function clDaysTxt(d){const s=[...d].sort();if(s.join()==='0,1,2,3,4')return 'Пн–Пт';if(s.length===7)return 'щодня';if(!s.length)return 'без прибирання';return s.map(i=>CL_WD[i]).join(', ');}
/* план на дату: {cid:{own:[o], in:[{o,from}], exc}} — заміна переносить об'єкти іншій прибиральниці лише на цю дату */
function clPlan(ds){const wd=clWd(ds);const P={};clCleaners().forEach(c=>{P[c.id]={c,own:[],in:[],exc:clExc(ds,c.id)};});
  clObjs().forEach(o=>{const c=clCleanerOf(o);if(!c||!P[c.id]||!clObjDays(o).includes(wd))return;const e=P[c.id].exc;
    if(e&&e.type==='sub'&&e.subId&&P[e.subId])P[e.subId].in.push({o,from:c.id});else if(!e||e.type==='sub')P[c.id].own.push(o);});
  return P;}
function clPlanObjs(ds){const P=clPlan(ds);return Object.values(P).flatMap(p=>[...p.own,...p.in.map(x=>x.o)]);}
function clStateTxt(c,ds){const P=clPlan(ds)[c.id];if(!P)return '';const e=P.exc;const n=P.own.length+P.in.length;
  if(e&&e.type!=='sub')return CL_EXT[e.type];if(e&&e.type==='sub')return 'Її замінює: '+(((S.clC||{})[e.subId]||{}).name||'—');return n?'Сьогодні працює':'Вихідний';}
function clLocsTxt(objs){const by={};objs.forEach(o=>{by[o.loc]=(by[o.loc]||0)+1;});return clLocs().filter(l=>by[l.id]).map(l=>l.name+' · '+by[l.id]).join(', ');}
function clMonday(ds){const d=parseYmd(ds);d.setDate(d.getDate()-((d.getDay()+6)%7));return ymd(d);}
function clSchedView(){const ed=clCanEdit();const today=ymd(new Date());const wk=S.clWk||clMonday(today);const days=[0,1,2,3,4,5,6].map(i=>addDays(wk,i));const out=[];
  const P0=clPlan(today);const tot=Object.values(P0).reduce((a,p)=>a+p.own.length+p.in.length,0);
  out.push(el('section',{class:'card cl-today'},el('div',{class:'cl-th'},el('b',{text:'Сьогодні · '+CL_WD[clWd(today)]+', '+dm(today)}),el('small',{class:'muted',text:tot?tot+' '+plural(tot,'об’єкт','об’єкти','об’єктів')+' у плані':''})),
    tot?el('div',{class:'cl-tl'},Object.values(P0).map(p=>{const n=p.own.length+p.in.length;const st=p.exc&&p.exc.type!=='sub'?CL_EXT[p.exc.type]:p.exc&&p.exc.type==='sub'?'передано: '+(((S.clC||{})[p.exc.subId]||{}).name||'—'):'';
      return el('div',{class:'cl-tr'+(n?'':' off')},clAv(p.c),el('span',{class:'cl-trn'},el('b',{text:p.c.name}),el('small',{class:'muted',text:n?clLocsTxt([...p.own,...p.in.map(x=>x.o)])+(p.in.length?' · заміна +'+p.in.length:''):(st||'вихідний')})),el('span',{class:'cl-trc',text:n?String(n):'—'}));}))
      :el('p',{class:'muted',style:'margin:0',text:'Сьогодні планового прибирання немає.'})));
  out.push(el('div',{class:'cl-wkbar'},el('div',{class:'row',style:'gap:6px'},el('button',{type:'button',class:'iconbtn sm','aria-label':'Попередній тиждень',onclick:()=>{S.clWk=addDays(wk,-7);render();}},svg('<path d="m15 5-7 7 7 7"/>')),
      el('b',{class:'cl-wkt',text:dm(days[0])+' – '+dm(days[6])}),el('button',{type:'button',class:'iconbtn sm','aria-label':'Наступний тиждень',onclick:()=>{S.clWk=addDays(wk,7);render();}},svg('<path d="m9 5 7 7-7 7"/>'))),
    wk!==clMonday(today)?el('button',{type:'button',class:'btn ghost sm',onclick:()=>{S.clWk=null;render();}},'Сьогодні'):null,
    el('small',{class:'muted',text:ed?'Клік по клітинці — разовий виняток; по імені — дні прибирання.':'Плановe прибирання: усі закріплені об’єкти Пн–Пт.'})));
  const plans=days.map(d=>clPlan(d));S.clOpenRow=S.clOpenRow||{};
  const head=el('div',{class:'cl-gr cl-gh'},el('span',{class:'cl-gn',text:'Прибиральниця'}),days.map((d,i)=>el('span',{class:'cl-gd'+(d===today?' now':'')+(i>4?' we':'')},el('b',{text:CL_WD[i]}),el('small',{text:dm(d)}))));
  const rows=[];clCleaners().forEach(c=>{const open=!!S.clOpenRow[c.id];
    rows.push(el('div',{class:'cl-gr'},el('div',{class:'cl-gn'},el('button',{type:'button',class:'cl-gtg','aria-expanded':String(open),'aria-label':(open?'Згорнути ':'Розгорнути ')+c.name,onclick:()=>{S.clOpenRow[c.id]=!open;render();}},svg(open?'<path d="m6 15 6-6 6 6"/>':'<path d="m6 9 6 6 6-6"/>')),clAv(c),
        ed?el('button',{type:'button',class:'cl-gname',title:'Дні прибирання',onclick:()=>clDaysSheet(c,null)},el('b',{text:c.name}),el('small',{class:'muted',text:clDaysTxt(clDays(c))})):el('span',{class:'cl-gname'},el('b',{text:c.name}),el('small',{class:'muted',text:clDaysTxt(clDays(c))}))),
      days.map((d,i)=>{const p=plans[i][c.id];const n=p.own.length+p.in.length;const e=p.exc;
        const lab=e&&e.type!=='sub'?el('span',{class:'cl-ex '+e.type,text:CL_EXT[e.type]}):e&&e.type==='sub'?el('span',{class:'cl-ex sub',text:'→ '+(((S.clC||{})[e.subId]||{}).name||'—')}):null;
        const body=[n?el('span',{},el('b',{text:'Щоденне'}),el('small',{text:n+' об’єкт.'})):(lab?null:el('span',{class:'cl-dash',text:'—'})),lab,p.in.length?el('span',{class:'cl-ex in',text:'+'+p.in.length+' заміна'}):null];
        const cls='cl-gc'+(d===today?' now':'')+(!n&&!e?' we':'');
        return ed?el('button',{type:'button',class:cls,'aria-label':c.name+', '+CL_WD[i]+' '+dm(d)+': '+(n?n+' об’єктів':'вихідний')+(e?', '+CL_EXT[e.type]:''),onclick:()=>clExcSheet(c,d)},body):el('span',{class:cls},body);})));
    if(open){const objs=clObjs().filter(o=>o.cleanerId===c.id);const by={};objs.forEach(o=>{(by[o.loc]=by[o.loc]||[]).push(o);});
      clLocs().filter(l=>by[l.id]).forEach(l=>rows.push(el('div',{class:'cl-gr sub'},el('span',{class:'cl-gn'},clLocHead(l.id,by[l.id].length,{color:c.color,cls:'sm'})),
        days.map((d,i)=>{const wd=i;const k=by[l.id].filter(o=>clObjDays(o).includes(wd)).length;const e=plans[i][c.id].exc;return el('span',{class:'cl-gc mini'+(d===today?' now':'')+(!k?' we':'')},k?(e&&e.type!=='sub'?'—':String(k)):'—');}))));}});
  out.push(el('div',{class:'card cl-grid7'},el('div',{class:'cl-gscroll'},head,rows)));
  return out;}
function clDaysSheet(c,o){const cur=o?(Array.isArray(o.days)?o.days:null):clDays(c);let sel=new Set(cur||clDays(clCleanerOf(o)));let inherit=o?!Array.isArray(o.days):false;
  const box=el('div',{class:'stack',style:'gap:10px'});const draw=()=>{box.replaceChildren(el('div',{class:'dz-chips cl-chips',role:'group','aria-label':'Дні прибирання'},CL_WD.map((w,i)=>el('button',{type:'button',class:'dz-chip cl-pick-c','aria-pressed':String(!inherit&&sel.has(i)||inherit&&clDays(clCleanerOf(o)).includes(i)),disabled:inherit?true:null,onclick:()=>{sel.has(i)?sel.delete(i):sel.add(i);draw();}},w))),
    o?el('label',{class:'ck-row',for:'clDI'},(()=>{const k=el('input',{type:'checkbox',class:'ck',id:'clDI',checked:inherit?true:null});k.addEventListener('change',()=>{inherit=k.checked;if(!inherit)sel=new Set(clDays(clCleanerOf(o)));draw();});return k;})(),el('span',{text:'Як у прибиральниці ('+clDaysTxt(clDays(clCleanerOf(o)))+')'})):null);};draw();
  openSheet(el('h2',{text:'Дні прибирання'}),el('p',{class:'muted',style:'margin:0',text:o?'Об’єкт «'+o.name+'» · '+clLoc(o.loc).name:c.name+' — для всіх її об’єктів (крім тих, де дні задано окремо).'}),box,
    el('div',{class:'btn-pair'},el('button',{type:'button',class:'btn ghost',onclick:()=>closeSheet()},'Скасувати'),el('button',{type:'button',class:'btn',onclick:async()=>{const d=[...sel].sort();let ok;
      if(o)ok=await clPut('cl_objects',o.id,{days:inherit?null:d},o.v||0,'Клінінг: графік «'+o.name+'» · '+clLoc(o.loc).name+' — '+(inherit?'як у прибиральниці':clDaysTxt(d)));
      else ok=await clPut('cl_cleaners',c.id,{days:d},c.v||0,'Клінінг: графік прибиральниці «'+c.name+'» — '+clDaysTxt(d));if(ok){closeSheet();toast('Графік збережено');}}},'Зберегти')));}
function clExcSheet(c,ds){const e=clExc(ds,c.id);let type=e?e.type:'';const others=clCleaners().filter(x=>x.id!==c.id);
  const sub=el('select',{id:'clES',class:'dz-bsel'},others.map(x=>el('option',{value:x.id,text:x.name})));if(e&&e.subId)sub.value=e.subId;
  const box=el('div',{class:'stack',style:'gap:10px'});const draw=()=>{box.replaceChildren(el('div',{class:'dz-chips cl-chips',role:'radiogroup','aria-label':'Тип'},[['','За графіком'],['off','Вихідний'],['sick','Лікарняний'],['sub','Заміна іншою']].map(([k,l])=>el('button',{type:'button',role:'radio',class:'dz-chip cl-pick-c','aria-pressed':String(type===k),'aria-checked':String(type===k),onclick:()=>{type=k;draw();}},l))),
    type==='sub'?el('label',{for:'clES'},'Хто замінює (об’єкти перейдуть до неї лише на '+dm(ds)+')',sub):null);fancySel(box);};draw();
  const n=clPlan(ds)[c.id];const cnt=n?n.own.length:0;
  openSheet(el('h2',{text:c.name+' · '+CL_WD[clWd(ds)]+', '+dm(ds)}),el('p',{class:'muted',style:'margin:0',text:'Разовий виняток лише на цю дату. За графіком: '+(clObjs().filter(o=>o.cleanerId===c.id&&clObjDays(o).includes(clWd(ds))).length||cnt)+' об’єкт.'}),box,
    el('div',{class:'btn-pair'},el('button',{type:'button',class:'btn ghost',onclick:()=>closeSheet()},'Скасувати'),el('button',{type:'button',class:'btn',onclick:async()=>{const id=ds+'_'+c.id;
      if(!type){if(e){try{await S.db.doc('cl_exc/'+id).delete();devLog('Клінінг: графік · '+c.name+' · '+dm(ds)+' — виняток скасовано ('+CL_EXT[e.type]+')');}catch(_){toast('Не вдалося зберегти');return;}}closeSheet();return;}
      if(type==='sub'&&!sub.value){toast('Оберіть, хто замінює');return;}
      const ok=await clPut('cl_exc',id,{date:ds,cleanerId:c.id,type,subId:type==='sub'?sub.value:null},e?(e.v||0):null,'Клінінг: графік · '+c.name+' · '+dm(ds)+' — '+CL_EXT[type]+(type==='sub'?' → '+S.clC[sub.value].name:''));if(ok){closeSheet();toast('Збережено');}}},'Зберегти')));}
/* ---------- закріплення зон: зведення + колонки з чипсами ---------- */
function clShort(n){return String(n).replace(/\s+поверху$/,' пов.');}
function clChip(o,opt){const c=clCleanerOf(o);const last=clLast(o.id);const sel=S.clSel;const on=sel&&sel.has(o.id);const ed=clCanEdit();
  const b=el('button',{type:'button',class:'cl-chip2'+(c?'':' un')+(on?' on':''),style:c?'--c:'+(c.color||CL_COLORS[0]):null,'aria-pressed':sel?String(!!on):null,title:opt&&opt.showCl?(c?c.name:'не закріплено')+' · '+o.name:o.name,
      draggable:ed&&!sel&&!IS_TOUCH?'true':null,onclick:e=>{if(sel){on?sel.delete(o.id):sel.add(o.id);render();return;}clPop(e.currentTarget,o);}},
    opt&&opt.showCl&&c?clDot(c):null,el('span',{text:clShort(o.name)}),last?el('i',{class:'cl-mk '+last.it.grade,'aria-label':'Остання ревізія: '+CL_GR[last.it.grade][0],text:CL_GR[last.it.grade][1]}):null);
  if(ed&&!sel&&!IS_TOUCH){b.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/cl-obj',o.id);e.dataTransfer.effectAllowed='move';b.classList.add('drag');document.body.classList.add('cl-dragging');});
    b.addEventListener('dragend',()=>{b.classList.remove('drag');document.body.classList.remove('cl-dragging');document.querySelectorAll('.cl-col.over').forEach(x=>x.classList.remove('over'));});}
  return b;}
/* однаковий заголовок групи будинку в усіх вкладках клінінгу: іконка в кольорі, повна назва, лічильник, стрілка */
const CL_BLD_IC='<path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/>';
function clLocTitle(id){const b=ARCH.find(x=>x.id===id);if(b)return 'Будинок '+b.fac;return String(clLoc(id).name).replace(/\s*\(.*\)\s*$/,'');}
function clLocHead(id,n,o){o=o||{};const kids=[o.lead||null,el('span',{class:'cl-bhi','aria-hidden':'true'},svg(CL_BLD_IC)),el('span',{class:'cl-bhn',text:clLocTitle(id)}),el('span',{class:'cl-bhc',title:n+' '+plural(n,'об’єкт','об’єкти','об’єктів'),text:o.cls==='sm'?String(n):n+' '+plural(n,'об’єкт','об’єкти','об’єктів')}),o.extra||null,
    o.toggle?el('span',{class:'cl-bhv','aria-hidden':'true'},svg(o.collapsed?'<path d="m9 6 6 6-6 6"/>':'<path d="m6 9 6 6 6-6"/>')):null];
  const st=o.color?'--c:'+o.color:null;
  if(o.toggle)return el('button',{type:'button',class:'cl-bh',style:st,'aria-expanded':String(!o.collapsed),id:o.id||null,onclick:o.toggle},kids);
  return el(o.tag||'div',Object.assign({class:'cl-bh'+(o.cls?' '+o.cls:''),style:st,id:o.id||null},o.attrs||{}),kids);}
function clChipGroups(objs,key,opt){const by={};objs.forEach(o=>{(by[o.loc]=by[o.loc]||[]).push(o);});S.clColl=S.clColl||{};
  return clLocs().filter(l=>by[l.id]).map(l=>{const k=key+'|'+l.id;const cl=!!S.clColl[k];
    const col=(S.clC||{})[key]&&S.clC[key].color;
    return el('div',{class:'cl-cg'},clLocHead(l.id,by[l.id].length,{color:col||null,collapsed:cl,id:'clg_'+key+'_'+l.id,toggle:()=>{S.clColl[k]=!cl;render();}}),
      cl?null:el('div',{class:'cl-chips2 cl-under',style:col?'--c:'+col:null},by[l.id].map(o=>clChip(o,opt))));});}
function clDropZone(col,cid){if(!clCanEdit()||IS_TOUCH)return col;col.addEventListener('dragover',e=>{if(![...e.dataTransfer.types].includes('text/cl-obj'))return;e.preventDefault();e.dataTransfer.dropEffect='move';col.classList.add('over');});
  col.addEventListener('dragleave',e=>{if(!col.contains(e.relatedTarget))col.classList.remove('over');});
  col.addEventListener('drop',async e=>{e.preventDefault();col.classList.remove('over');const id=e.dataTransfer.getData('text/cl-obj');const o=(S.clO||{})[id];if(!o)return;const old=clCleanerOf(o);if((old&&old.id||null)===(cid||null))return;
    const to=cid?S.clC[cid].name:'не закріплено';if(await clPut('cl_objects',o.id,{cleanerId:cid||null},o.v||0,'Клінінг: передано «'+o.name+'» · '+clLoc(o.loc).name+' · '+(old?old.name:'не закріплено')+' → '+to+' (перетягування)'))toast('«'+o.name+'» → '+to);});return col;}
function clZonesView(){const ed=clCanEdit();const mode=S.clMode||'cl';const sel=S.clSel;const out=[];const objs=clObjs();const today=ymd(new Date());const cls=clCleaners();
  const me=myStaff();const mine=me&&cls.find(c=>c.staffId===me.id);
  if(mine&&!ed){const mo=objs.filter(o=>o.cleanerId===mine.id);out.push(el('section',{class:'card cl-col',style:'--c:'+(mine.color||CL_COLORS[0])},el('div',{class:'cl-colh'},clAv(mine,true),el('div',{class:'cl-ct'},el('b',{text:'Мої зони'}),el('small',{class:'muted',text:mo.length+' об’єкт. · '+clStateTxt(mine,today)}))),clChipGroups(mo,'me',{})));}
  /* зведення: плитки прибиральниць */
  const un=objs.filter(o=>!clCleanerOf(o));
  out.push(el('div',{class:'cl-sum'},cls.map(c=>{const os=objs.filter(o=>o.cleanerId===c.id);const nb=new Set(os.map(o=>o.loc)).size;const st=clStateTxt(c,today);
    const locIds=[...new Set(os.map(o=>o.loc))];const bchips=el('span',{class:'cl-stb'},clLocs().filter(l=>locIds.includes(l.id)).map(l=>el('button',{type:'button',class:'cl-stc',onclick:e=>{e.stopPropagation();S.clMode='cl';S.clColl=S.clColl||{};delete S.clColl[c.id+'|'+l.id];render();setTimeout(()=>{const x=document.getElementById('clg_'+c.id+'_'+l.id);if(x){x.scrollIntoView({behavior:'smooth',block:'center'});x.classList.add('flash');setTimeout(()=>x.classList.remove('flash'),1600);}},40);}},l.name.replace(/\s*\(.*\)\s*$/,''))));
  return el('div',{role:'button',tabindex:'0',class:'cl-st'+(S.clHi===c.id?' hi':''),style:'--c:'+(c.color||CL_COLORS[0]),onkeydown:e=>{if((e.key==='Enter'||e.key===' ')&&e.target===e.currentTarget){e.preventDefault();e.currentTarget.click();}},onclick:()=>{S.clHi=c.id;S.clMode='cl';render();setTimeout(()=>{const x=document.getElementById('clcol_'+c.id);if(x)x.scrollIntoView({behavior:'smooth',block:'nearest'});},30);setTimeout(()=>{S.clHi=null;const x=document.getElementById('clcol_'+c.id);if(x)x.classList.remove('hi');},2200);}},
      clAv(c,true),el('span',{class:'cl-stt'},el('b',{text:c.name}),el('small',{class:'muted',text:os.length+' об’єкт. · '+nb+' '+plural(nb,'будинок','будинки','будинків')}),el('small',{class:'cl-sst'+(st==='Сьогодні працює'?' ok':''),text:st}),bchips));}),
    un.length?el('button',{type:'button',class:'cl-st un',onclick:()=>{const x=document.getElementById('clcol_un');if(x)x.scrollIntoView({behavior:'smooth',block:'nearest'});}},el('span',{class:'cl-av big un',text:'?'}),el('span',{class:'cl-stt'},el('b',{text:'Не закріплено'}),el('small',{class:'cl-unl',text:un.length+' об’єкт.'}))):null));
  out.push(el('div',{class:'cl-bar'},el('div',{class:'sg',role:'tablist','aria-label':'Режим перегляду'},[['cl','За прибиральницями'],['loc','За будинками']].map(([k,l])=>el('button',{type:'button',role:'tab','aria-pressed':String(mode===k),'aria-selected':String(mode===k),onclick:()=>{S.clMode=k;render();}},l))),
    ed?el('div',{class:'cl-acts'},el('button',{type:'button',class:'btn ghost sm',onclick:()=>clObjSheet(null)},'+ Об’єкт'),el('button',{type:'button',class:'btn sm',onclick:()=>clCleanerSheet(null)},'+ Прибиральниця'),
      el('button',{type:'button',class:'btn ghost sm'+(sel?' on':''),'aria-pressed':String(!!sel),onclick:()=>{S.clSel=sel?null:new Set();clPopOff();render();}},sel?'Скасувати вибір':'Вибрати кілька')):null));
  if(!objs.length&&!clCleaners(true).length){out.push(el('div',{class:'card empty'},el('h2',{text:'Закріплень ще немає'}),el('p',{class:'muted',text:ed?'Додайте прибиральницю і об’єкти кнопками вгорі.':'Закріплення з’явиться, коли його заповнить менеджер.'})));return out;}
  if(mode==='cl'){const grid=el('div',{class:'cl-cols'});
    cls.forEach(c=>{const os=objs.filter(o=>o.cleanerId===c.id);const st=c.staffId&&staffById(c.staffId);
      grid.append(clDropZone(el('section',{class:'card cl-col'+(S.clHi===c.id?' hi':''),id:'clcol_'+c.id,style:'--c:'+(c.color||CL_COLORS[0])},
        el('div',{class:'cl-colh'},clAv(c,true),el('div',{class:'cl-ct'},el('b',{text:c.name}),el('small',{class:'muted',text:os.length+' об’єкт.'+(c.phone?' · '+c.phone:'')+(!st?' · без акаунта':'')})),
          ed?el('button',{type:'button',class:'iconbtn sm','aria-label':'Змінити прибиральницю '+c.name,onclick:()=>clCleanerSheet(c)},svg('<path d="M4 20h4L19 9l-4-4L4 16z"/>')):null),
        os.length?clChipGroups(os,c.id,{}):el('p',{class:'muted small',style:'margin:0',text:ed?'Перетягніть сюди об’єкти або додайте новий.':'Об’єктів немає'}),
        ed&&!sel?el('button',{type:'button',class:'btn ghost sm cl-addo',onclick:()=>clObjSheet(null,c.id)},'+ Об’єкт'):null),c.id));});
    if(un.length||ed&&!IS_TOUCH)grid.append(clDropZone(el('section',{class:'card cl-col un',id:'clcol_un'},el('div',{class:'cl-colh'},el('span',{class:'cl-av big un',text:'?','aria-hidden':'true'}),el('div',{class:'cl-ct'},el('b',{text:'Не закріплено'}),el('small',{class:un.length?'cl-unl':'muted',text:un.length?un.length+' об’єкт.':'Перетягніть сюди, щоб зняти закріплення'}))),un.length?clChipGroups(un,'un',{}):null),null));
    out.push(grid);const ina=clCleaners(true).filter(c=>c.active===false);
    if(ina.length)out.push(el('div',{class:'cl-ina'},el('span',{class:'flabel',text:'Неактивні'}),ina.map(c=>el('button',{type:'button',class:'cl-chip',disabled:ed?null:true,onclick:()=>clCleanerSheet(c)},clAv(c),el('span',{text:c.name}),el('small',{class:'muted',text:'неактивна'})))));}
  else{out.push(el('div',{class:'cl-legend'},cls.map(c=>el('span',{class:'cl-tag'},clDot(c),c.name)),el('span',{class:'cl-tag un'},el('span',{class:'cl-dot un'}),'не закріплено')));
    const grid=el('div',{class:'cl-cols'});clLocs().forEach(l=>{const os=objs.filter(o=>o.loc===l.id);if(!os.length)return;const n=os.filter(o=>!clCleanerOf(o)).length;
      const kk='loc|'+l.id;S.clColl=S.clColl||{};const cc=!!S.clColl[kk];grid.append(el('section',{class:'card cl-col loc'},clLocHead(l.id,os.length,{collapsed:cc,toggle:()=>{S.clColl[kk]=!cc;render();},extra:n?el('span',{class:'cl-bhc un',text:'не закріплено: '+n}):null}),cc?null:
        el('div',{class:'cl-chips2'},os.map(o=>clChip(o,{showCl:true})))));});out.push(grid);}
  if(sel)out.push(el('div',{class:'cl-selbar',role:'region','aria-label':'Масова дія'},el('b',{text:'Вибрано: '+sel.size}),el('button',{type:'button',class:'btn',disabled:sel.size?null:true,onclick:()=>clTransferSheet([...sel])},'Передати вибрані ('+sel.size+') →'),el('button',{type:'button',class:'btn ghost',onclick:()=>{S.clSel=null;render();}},'Скасувати')));
  return out;}
/* меню чипса (popover) */
function clPopOff(){const p=document.getElementById('clPop');if(p)p.remove();document.removeEventListener('pointerdown',clPopOut,true);document.removeEventListener('keydown',clPopKey);}
function clPopOut(e){const p=document.getElementById('clPop');if(p&&!p.contains(e.target))clPopOff();}
function clPopKey(e){if(e.key==='Escape')clPopOff();}
function clPop(anchor,o){clPopOff();const ed=clCanEdit();const c=clCleanerOf(o);const last=clLast(o.id);
  const act=(l,fn,cls)=>el('button',{type:'button',class:'cl-pa'+(cls?' '+cls:''),onclick:()=>{clPopOff();fn();}},l);
  const p=el('div',{class:'cl-pop',id:'clPop',role:'menu'},el('div',{class:'cl-ph'},el('b',{text:o.name}),el('small',{class:'muted',text:clLoc(o.loc).name+' · '+(c?c.name:'не закріплено')+' · '+clDaysTxt(clObjDays(o))})),
    ed?act('Перейменувати',()=>clObjSheet(o)):null,ed?act('Передати іншій…',()=>clTransferSheet([o.id])):null,ed?act('Дні прибирання…',()=>clDaysSheet(null,o)):null,
    last?act('Відкрити останню ревізію ('+CL_GR[last.it.grade][1]+' '+dm(last.r.date)+')',()=>clOpenRev(last.r.id)):el('span',{class:'cl-pa dis',text:'Ревізій ще не було'}),
    ed?act('Видалити',()=>confirmSheet('Видалити об’єкт «'+o.name+'» ('+clLoc(o.loc).name+')? Ревізії, де він був, не зміняться.','Видалити об’єкт',async()=>{try{await S.db.doc('cl_objects/'+o.id).delete();devLog('Клінінг: видалено об’єкт «'+o.name+'» · '+clLoc(o.loc).name+(c?' (був за '+c.name+')':''));toast('Об’єкт видалено');}catch(e){toast('Не вдалося видалити');}}),'danger'):null);
  document.body.append(p);const r=anchor.getBoundingClientRect();const w=p.offsetWidth,h=p.offsetHeight;let x=Math.min(Math.max(8,r.left),innerWidth-w-8),y=r.bottom+6;if(y+h>innerHeight-8)y=Math.max(8,r.top-h-6);
  p.style.left=x+'px';p.style.top=y+'px';const f=p.querySelector('button');if(f)f.focus({preventScroll:true});setTimeout(()=>{document.addEventListener('pointerdown',clPopOut,true);document.addEventListener('keydown',clPopKey);},0);}
function clCleanerSelect(id,cur,withNone){const s=el('select',{id},(withNone?[el('option',{value:'',text:'Не закріплено'})]:[]).concat(clCleaners().map(c=>el('option',{value:c.id,text:c.name}))));s.value=cur||'';return s;}
function clObjSheet(o,preCid){const locs=clLocs();const loc=el('select',{id:'clL'},[...locs.filter(l=>!l.other).map(l=>el('option',{value:l.id,text:l.full})),el('optgroup',{label:'Інші локації'},locs.filter(l=>l.other).map(l=>el('option',{value:l.id,text:l.name})))]);loc.value=o?o.loc:(S.clLastLoc||locs[0].id);
  const nm=el('input',{id:'clN',type:'text',maxlength:'80',list:'clSug',value:o?o.name:'',autocomplete:'off',placeholder:'напр. Хол 3 поверху'});const dl=el('datalist',{id:'clSug'},CL_SUG.map(t=>el('option',{value:t})));
  const cs=clCleanerSelect('clC',o?(clCleanerOf(o)||{}).id:(preCid||''),true);const er=el('p',{class:'iw-err',role:'alert',hidden:true});nm.addEventListener('input',()=>{er.hidden=true;nm.classList.remove('bad');});
  const save=el('button',{type:'button',class:'btn',onclick:async()=>{const n=nm.value.trim();if(!n){er.textContent='Вкажіть назву об’єкта';er.hidden=false;nm.classList.add('bad');nm.focus();return;}
    const dup=clObjs().find(x=>x.loc===loc.value&&x.id!==(o&&o.id)&&x.name.trim().toLowerCase()===n.toLowerCase());if(dup&&save.dataset.ack!=='1'){save.dataset.ack='1';er.textContent='У '+clLoc(loc.value).name+' вже є «'+dup.name+'». Натисніть ще раз, щоб зберегти все одно.';er.hidden=false;return;}
    save.disabled=true;S.clLastLoc=loc.value;const cid=cs.value||null;const lc=clLoc(loc.value).name;let ok;
    if(o){const old=clCleanerOf(o);ok=await clPut('cl_objects',o.id,{loc:loc.value,name:n,cleanerId:cid},o.v||0,'Клінінг: змінено об’єкт «'+n+'» · '+lc+(o.name!==n?' (був «'+o.name+'»)':'')+((old&&old.id)!==cid?' · '+(old?old.name:'не закріплено')+' → '+(cid?S.clC[cid].name:'не закріплено'):''));}
    else{const last=clObjs().filter(x=>x.loc===loc.value);ok=await clPut('cl_objects',clId('o_'),{loc:loc.value,name:n,cleanerId:cid,order:(last.length?Math.max(...last.map(x=>x.order||0)):0)+10},null,'Клінінг: додано об’єкт «'+n+'» · '+lc+' → '+(cid?S.clC[cid].name:'не закріплено'));}
    save.disabled=false;if(ok){closeSheet();toast(o?'Збережено':'Об’єкт додано');}}},'Зберегти');
  openSheet(el('h2',{text:o?'Змінити об’єкт':'Новий об’єкт'}),el('label',{for:'clL'},'Будинок / локація',loc),el('label',{for:'clN'},'Назва об’єкта',nm,dl),
    el('div',{class:'dz-chips cl-sug'},CL_SUG.slice(0,8).map(t=>el('button',{type:'button',class:'dz-chip',onclick:()=>{nm.value=t;nm.dispatchEvent(new Event('input'));nm.focus();}},t))),
    el('label',{for:'clC'},'Прибиральниця',cs),er,el('div',{class:'btn-pair'},el('button',{type:'button',class:'btn ghost',onclick:()=>closeSheet()},'Скасувати'),save));
  fancySel(document.getElementById('sheetRoot'));setTimeout(()=>nm.focus(),80);}
function clTransferSheet(ids){const os=ids.map(id=>(S.clO||{})[id]).filter(Boolean);if(!os.length)return;const cs=clCleanerSelect('clT','',true);
  const froms=[...new Set(os.map(o=>{const c=clCleanerOf(o);return c?c.name:'не закріплено';}))];
  openSheet(el('h2',{text:os.length>1?'Передати '+os.length+' '+plural(os.length,'об’єкт','об’єкти','об’єктів'):'Передати «'+os[0].name+'»'}),el('p',{class:'muted',style:'margin:0',text:'Зараз: '+froms.join(', ')+'. Напр. на час відпустки чи лікарняного.'}),
    el('label',{for:'clT'},'Кому передати',cs),el('div',{class:'btn-pair'},el('button',{type:'button',class:'btn ghost',onclick:()=>closeSheet()},'Скасувати'),
      el('button',{type:'button',class:'btn',onclick:async e=>{const cid=cs.value||null;e.currentTarget.disabled=true;let n=0;const to=cid?S.clC[cid].name:'не закріплено';
        for(const o of os){const old=clCleanerOf(o);if((old&&old.id)===cid)continue;if(await clPut('cl_objects',o.id,{cleanerId:cid},o.v||0,'Клінінг: передано «'+o.name+'» · '+clLoc(o.loc).name+' · '+(old?old.name:'не закріплено')+' → '+to))n++;}
        closeSheet();S.clSel=null;toast(n?'Передано: '+n:'Нічого не змінилось');render();}},'Передати')));fancySel(document.getElementById('sheetRoot'));}
function clCleanerSheet(c){let color=c?c.color||CL_COLORS[0]:CL_COLORS[clCleaners(true).length%CL_COLORS.length];
  const nm=el('input',{id:'clCN',type:'text',maxlength:'60',value:c?c.name:'',autocomplete:'off'});const ph=el('input',{id:'clCP',type:'tel',inputmode:'tel',maxlength:'20',value:c?c.phone||'':'',placeholder:'+380…',autocomplete:'off'});
  const used=new Set(clCleaners(true).filter(x=>x.staffId&&(!c||x.id!==c.id)).map(x=>x.staffId));
  const pr=el('select',{id:'clCS'},[el('option',{value:'',text:'Без акаунта в застосунку'})].concat(S.staff.filter(s=>!s.archived&&!used.has(s.id)).sort((a,b)=>String(a.name).localeCompare(b.name,'uk')).map(s=>el('option',{value:s.id,text:s.name+(s.role?' · '+(ROLE_NAME[s.role]||s.role):'')}))));pr.value=c&&c.staffId||'';
  pr.addEventListener('change',()=>{if(pr.value&&!nm.value.trim()){const s=staffById(pr.value);if(s)nm.value=s.name;}});
  const act=el('input',{type:'checkbox',class:'ck',id:'clCA',checked:!c||c.active!==false?true:null});
  const cols=el('div',{class:'dk-cols',role:'radiogroup','aria-label':'Колір-мітка'});const draw=()=>cols.replaceChildren(...CL_COLORS.map(x=>el('button',{type:'button',role:'radio','aria-checked':String(x===color),'aria-label':'Колір '+x,class:'dk-cb'+(x===color?' on':''),style:'--c:'+x,onclick:()=>{color=x;draw();}})));draw();
  const er=el('p',{class:'iw-err',role:'alert',hidden:true});
  const save=el('button',{type:'button',class:'btn',onclick:async()=>{const n=nm.value.trim();if(!n){er.textContent='Вкажіть ім’я';er.hidden=false;nm.focus();return;}save.disabled=true;
    const body={name:n,phone:ph.value.trim(),color,staffId:pr.value||null,active:act.checked};let ok;
    if(c){const ch=[];if(c.name!==n)ch.push('ім’я «'+c.name+'» → «'+n+'»');if((c.active!==false)!==act.checked)ch.push(act.checked?'знову активна':'неактивна');if((c.staffId||null)!==(pr.value||null))ch.push('профіль: '+(pr.value?staffById(pr.value).name:'без акаунта'));if((c.phone||'')!==body.phone)ch.push('телефон');if(c.color!==color)ch.push('колір');
      ok=await clPut('cl_cleaners',c.id,body,c.v||0,'Клінінг: змінено прибиральницю «'+n+'»'+(ch.length?' — '+ch.join(', '):''));}
    else{body.order=(Math.max(0,...clCleaners(true).map(x=>x.order||0)))+10;ok=await clPut('cl_cleaners',clId('c_'),body,null,'Клінінг: додано прибиральницю «'+n+'»'+(pr.value?' (профіль у колективі)':' (без акаунта)'));}
    save.disabled=false;if(ok){closeSheet();toast('Збережено');}}},'Зберегти');
  openSheet(el('h2',{text:c?'Прибиральниця':'Нова прибиральниця'}),el('label',{for:'clCS'},'Профіль у «Колективі»',pr),el('label',{for:'clCN'},'Ім’я',nm),el('label',{for:'clCP'},'Телефон (необов’язково)',ph),
    el('div',{class:'stack',style:'gap:6px'},el('span',{class:'flabel',text:'Колір-мітка'}),cols),
    el('label',{class:'ck-row',for:'clCA'},act,el('span',{text:'Активна'}),el('small',{class:'muted',text:' — неактивну не видаляємо: її об’єкти стають «Не закріплено», доки їх не передадуть'})),er,
    el('div',{class:'btn-pair'},el('button',{type:'button',class:'btn ghost',onclick:()=>closeSheet()},'Скасувати'),save));fancySel(document.getElementById('sheetRoot'));}
/* ---------- ревізії: список ---------- */
function clRevsView(){const out=[];const can=clCanRev();const m=clMe();const g=FG.find(x=>x.id==='clean');
  const f=S.clF=S.clF||{per:'30'};const all=clRevs().filter(r=>r.status!=='draft');const lim=f.per==='all'?'':addDays(ymd(new Date()),-(+f.per));
  const L=all.filter(r=>(!lim||r.date>=lim)&&(!f.loc||(r.locs||[]).includes(f.loc))&&(!f.cl||Object.values(r.items||{}).some(i=>i.cleanerId===f.cl))&&(!f.st||r.status===f.st)&&(!f.by||r.authorId===f.by));
  const sel=(id,label,opts,key,noAll)=>{const s=el('select',{id,class:'dz-bsel'+(f[key]&&!noAll?' on':''),'aria-label':label},(noAll?[]:[el('option',{value:'',text:label})]).concat(opts.map(([v,t])=>el('option',{value:v,text:t}))));s.value=f[key]||'';s.addEventListener('change',()=>{f[key]=s.value;render();});return s;};
  const authors=[...new Set(all.map(r=>r.authorId))].map(staffById).filter(Boolean);
  const start=()=>el('button',{type:'button',class:'btn cl-fab',onclick:()=>clStartSheet()},svg('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),' Провести ревізію');
  /* один ряд дропдаун-чипсів, як у дебіторці; кнопка праворуч */
  out.push(el('div',{class:'cl-rhead'},el('div',{class:'dz-fsel cl-fsel'},sel('clFP','Період',[['7','7 днів'],['30','30 днів'],['90','90 днів'],['all','Увесь час']],'per',true),
      sel('clFL','Усі будинки',clLocs().map(l=>[l.id,l.name]),'loc'),sel('clFC','Усі прибиральниці',clCleaners(true).map(c=>[c.id,c.name]),'cl'),
      sel('clFS','Усі статуси',[['submitted','На погодженні'],['returned','Повернено'],['approved','Погоджено']],'st'),sel('clFB','Усі перевіряючі',authors.map(s=>[s.id,s.name]),'by'),
      (f.loc||f.cl||f.st||f.by)?el('button',{class:'btn ghost sm',type:'button',onclick:()=>{f.loc='';f.cl='';f.st='';f.by='';render();}},'✕ Скинути фільтри'):null),
    can?el('div',{class:'cl-rh-btn'},start()):null));
  const mine=m?clRevs().filter(r=>r.authorId===m.id&&(r.status==='draft'||r.status==='returned')):[];
  if(mine.length)out.push(el('section',{class:'stack',style:'gap:8px'},el('span',{class:'flabel',text:'Мої незавершені ревізії'}),el('div',{class:'ip-feed'},mine.map(r=>clRevCard(r,true)))));
  if(!L.length)out.push(el('div',{class:'card empty cl-empty'},el('span',{class:'uk-ic big',style:'--c1:'+g.c1+';--c2:'+g.c2},svg(g.ic)),
    el('h2',{text:all.length?'Нічого не знайдено':'Ревізій ще не було'}),el('p',{class:'muted',text:all.length?'За цими фільтрами ревізій немає. Змініть період або скиньте фільтри.':'Перевірте об’єкти, сфотографуйте результат і відправте на погодження директору.'}),
    all.length?el('button',{class:'btn ghost',type:'button',onclick:()=>{S.clF={per:'all'};render();}},'Показати всі'):(can?el('div',{class:'cl-rh-btn'},start()):null)));
  else out.push(el('div',{class:'ip-feed'},L.map(r=>clRevCard(r))));
  if(can)out.push(el('div',{class:'cl-fabw'},start()));
  return out;}
/* картка ревізії — у стилі стрічки «Обходу будівель» */
function clRevCard(r,mine){const a=staffById(r.authorId);const s=clSum(r);const t=r.submittedAt||r.createdAt||0;const mi=(r.minis||[]).filter(Boolean);
  const cls=[...new Set(Object.values(r.items||{}).map(i=>i.cleanerId).filter(Boolean))].map(id=>(S.clC||{})[id]).filter(Boolean);
  return el('button',{type:'button',class:'card ip-fi cl-rc',onclick:()=>mine?clContinue(r):clOpenRev(r.id)},
    el('div',{class:'row between',style:'gap:8px;flex-wrap:nowrap'},el('span',{class:'ip-bn'},el('b',{text:(r.locs||[]).map(id=>clLoc(id).name).join(', ')||'—'}),el('small',{class:'muted',text:dm(r.date)+'.'+r.date.slice(0,4)+(t?' · '+hm(t):'')+' · '+(a?a.name:'—')})),clStPill(r.status)),
    el('div',{class:'cl-rcs'},el('span',{class:'cl-g ok sm',title:'Чисто'},'✓ '+s.ok),el('span',{class:'cl-g remark sm'+(s.remark?'':' z'),title:'Є зауваження'},'⚠ '+s.remark),el('span',{class:'cl-g bad sm'+(s.bad?'':' z'),title:'Незадовільно'},'✕ '+s.bad),
      el('small',{class:'muted',text:s.n+' об’єкт.'+(cls.length?' · '+cls.map(c=>c.name).join(', '):'')})),
    mi.length&&!r.purged?el('div',{class:'ip-mi'},mi.slice(0,4).map(u=>el('img',{src:u,alt:''}))):null);}
function clSum(r){const s={n:0,ok:0,remark:0,bad:0};Object.values(r.items||{}).forEach(i=>{s.n++;if(i.grade)s[i.grade]++;});return s;}
function clOpenRev(id){S.hist.push(snap());S.tab='uk';S.ukSec=null;S.fg='clean';S.clW=null;S.clR=id;SC().scrollTop=0;clLiveOn(id);render();}
function clContinue(r){S.hist.push(snap());S.clR=null;S.clW={id:r.id,step:1,i:0};clLiveOn(r.id);const its=clItems(r);const k=its.findIndex(i=>!clItemOk(r,i).ok);S.clW.i=k<0?0:k;if(k<0)S.clW.step=2;render();}
/* ---------- старт: що перевіряємо ---------- */
const CL_STEPS=['Що перевіряємо','Фото й оцінки','Підсумок'];
function clStepper(cur){return el('div',{class:'iw-steps cl-steps','aria-label':'Кроки ревізії'},CL_STEPS.map((t,i)=>el('span',{class:'iw-s'+(i===cur?' on':i<cur?' done':''),'aria-current':i===cur?'step':null},el('span',{class:'iw-si',text:i<cur?'✓':String(i+1)}),t)));}
function clStartSheet(){const locs=clLocs().filter(l=>clObjs().some(o=>o.loc===l.id));if(!locs.length){toast('Спершу додайте об’єкти в «Закріпленні зон»');return;}
  const st={locs:new Set([locs[0].id]),cl:'',off:new Set()};const body=el('div',{class:'cl-shb'});const go=el('button',{type:'button',class:'btn'},'Далі →');
  const objsNow=()=>clObjs().filter(o=>st.locs.has(o.loc)&&(!st.cl||(clCleanerOf(o)||{}).id===st.cl));
  const draw=()=>{const objs=objsNow();const on=objs.filter(o=>!st.off.has(o.id));const all=st.locs.size===locs.length;
    const chips=el('div',{class:'dz-chips cl-chips',role:'group','aria-label':'Будинки / локації'},
      el('button',{type:'button',class:'dz-chip cl-pick-c','aria-pressed':String(all),onclick:()=>{if(all)st.locs=new Set([locs[0].id]);else st.locs=new Set(locs.map(l=>l.id));draw();}},all?'✓ Усі':'Усі'),
      locs.map(l=>{const sel=st.locs.has(l.id);return el('button',{type:'button',class:'dz-chip cl-pick-c','aria-pressed':String(sel),onclick:()=>{sel?st.locs.delete(l.id):st.locs.add(l.id);draw();}},sel?'✓ '+l.name:l.name);}));
    const plan=clPlanObjs(ymd(new Date()));const pids=new Set(plan.map(o=>o.id));
    const planChip=plan.length?el('button',{type:'button',class:'dz-chip cl-pick-c','aria-pressed':String(!!st.plan),onclick:()=>{st.plan=!st.plan;if(st.plan){st.locs=new Set(plan.map(o=>o.loc));st.cl='';st.off=new Set(clObjs().filter(o=>!pids.has(o.id)).map(o=>o.id));}else st.off=new Set();draw();}},(st.plan?'✓ ':'')+'Об’єкти за сьогоднішнім графіком · '+plan.length):el('span',{class:'muted small',text:'Сьогодні планового прибирання немає'});
    const cs=el('select',{class:'dz-bsel'+(st.cl?' on':''),'aria-label':'Фільтр за прибиральницею'},[el('option',{value:'',text:'Усі прибиральниці'})].concat(clCleaners().map(c=>el('option',{value:c.id,text:c.name}))));cs.value=st.cl;cs.addEventListener('change',()=>{st.cl=cs.value;draw();});
    const groups=clLocs().filter(l=>objs.some(o=>o.loc===l.id)).map(l=>{const os=objs.filter(o=>o.loc===l.id);const n=os.filter(o=>!st.off.has(o.id)).length;const gid='clg_'+l.id;
      const gc=el('input',{type:'checkbox',class:'ck',id:gid,checked:n===os.length?true:null,'aria-label':'Вибрати всі в «'+l.name+'»'});gc.indeterminate=n>0&&n<os.length;gc.addEventListener('change',()=>{os.forEach(o=>gc.checked?st.off.delete(o.id):st.off.add(o.id));draw();});
      return el('div',{class:'cl-pg'},clLocHead(l.id,os.length,{tag:'label',cls:'cl-pgh',attrs:{for:gid},lead:gc}),
        el('div',{class:'cl-pl'},os.map(o=>{const id='clp_'+o.id;const c=el('input',{type:'checkbox',class:'ck',id,checked:st.off.has(o.id)?null:true});c.addEventListener('change',()=>{c.checked?st.off.delete(o.id):st.off.add(o.id);draw();});const cl=clCleanerOf(o);
          return el('label',{class:'ck-row cl-pr',for:id},c,el('span',{class:'cl-prn',text:o.name}),el('span',{class:'cl-tag'+(cl?'':' un')},cl?[clDot(cl),cl.name]:'не закріплено'));})));});
    body.replaceChildren(el('div',{class:'cl-shrow'},planChip),el('div',{class:'stack',style:'gap:8px'},el('span',{class:'flabel',text:'Будинок / локація'}),chips),
      el('div',{class:'cl-shrow'},cs),
      el('div',{class:'cl-cnt'},el('span',{},'Вибрано ',el('b',{text:String(on.length)}),' з '+objs.length),objs.length?el('button',{type:'button',class:'linkbtn',onclick:()=>{if(on.length)objs.forEach(o=>st.off.add(o.id));else objs.forEach(o=>st.off.delete(o.id));draw();}},on.length?'Зняти всі':'Вибрати всі'):null),
      objs.length?el('div',{class:'cl-plist'},groups):el('p',{class:'muted',style:'margin:0',text:'Оберіть будинок або локацію'}));
    go.disabled=on.length?null:true;fancySel(body);};
  go.addEventListener('click',async()=>{const sel=objsNow().filter(o=>!st.off.has(o.id));if(!sel.length){toast('Оберіть хоча б один об’єкт');return;}go.disabled=true;await clCreate(sel);go.disabled=false;});
  openSheet(el('div',{class:'cl-shh'},el('h2',{text:'Провести ревізію'}),clStepper(0),el('p',{class:'muted small',style:'margin:0',text:'Оберіть будинки й об’єкти. Прибиральниця підтягується із закріплення.'})),
    body,el('div',{class:'cl-shf btn-pair'},el('button',{type:'button',class:'btn ghost',onclick:()=>closeSheet()},'Скасувати'),go));
  const sh=document.querySelector('#sheetRoot .sheet');if(sh)sh.classList.add('cl-sheet');draw();}
async function clCreate(objs){const m=clMe();if(!m){toast('Спершу оберіть себе в колективі');return;}const id=clId('r_');const now=Date.now();const items={};
  objs.forEach((o,i)=>{const c=clCleanerOf(o);items[o.id]={name:o.name,loc:o.loc,cleanerId:c?c.id:null,ord:i,grade:null,comment:'',ph:{}};});
  const locs=[...new Set(objs.map(o=>o.loc))];
  const ok=await clPut('cl_revisions',id,{date:ymd(new Date()),authorId:m.id,authorUid:S.myId||'',locs,items,status:'draft',hist:[{st:'draft',at:now,by:m.id}],generalComment:'',returnText:'',returnObj:null,purged:false},null,'Клінінг: розпочато ревізію · '+locs.map(l=>clLoc(l).name).join(', ')+' · '+objs.length+' об’єктів');
  if(!ok)return;closeSheet();S.clR=null;S.clW={id,step:1,i:0};clLiveOn(id);render();}
/* ---------- фото: та сама обробка, черга й сховище, що в обходах ---------- */
function clItems(r){return Object.entries((r&&r.items)||{}).map(([oid,i])=>Object.assign({oid},i)).sort((a,b)=>(a.ord||0)-(b.ord||0));}
function clQOf(rid,oid){return Object.values(S.clQ||{}).filter(q=>q.revId===rid&&(!oid||q.oid===oid));}
function clPhN(r,oid){return Object.values(((r.items||{})[oid]||{}).ph||{}).filter(Boolean).length;}
function clItemOk(r,i){const n=clPhN(r,i.oid)+clQOf(r.id,i.oid).filter(q=>q.blob&&!q.err).length;if(!n)return {ok:false,why:'Додайте хоча б одне фото'};if(!i.grade)return {ok:false,why:'Оберіть оцінку'};
  if(i.grade!=='ok'&&!String(i.comment||'').trim())return {ok:false,why:'Опишіть зауваження в коментарі'};return {ok:true};}
function clLocked(r){return !r||r.status==='approved'||r.status==='submitted';}
function clCanEditRev(r){const m=clMe();return !!r&&!clLocked(r)&&((m&&r.authorId===m.id)||realDev());}
function clLiveOn(id){if(S.clLive&&S.clLive.id===id)return;clLiveOff();const L=S.clLive={id,list:[],ok:false,unsub:null};
  try{L.unsub=S.db.collection('cl_rev_photos').where('revId','==',id).onSnapshot(q=>{L.list=q.docs.map(d=>({id:d.id,...d.data()}));L.ok=true;if(S.fg==='clean')render();},()=>{L.ok=true;});}catch(e){L.ok=true;}}
function clLiveOff(){if(S.clLive&&S.clLive.unsub)try{S.clLive.unsub();}catch(e){}S.clLive=null;}
function clPhotos(r,oid){const ph=((r.items||{})[oid]||{}).ph||{};const by=Object.fromEntries(((S.clLive&&S.clLive.id===r.id&&S.clLive.list)||[]).map(p=>[p.id,p]));
  return Object.entries(ph).filter(([,v])=>v).sort((a,b)=>(a[1].at||0)-(b[1].at||0)).map(([pid,v])=>by[pid]||{id:pid,_stub:true,authorId:v.by,addedAt:v.at});}
async function clLoadQ(){try{const a=await IDBX.all();S.clQ={};a.forEach(d=>{if(d.kind==='clph')S.clQ[d.id]=d;});if(Object.keys(S.clQ).length)clSync();}catch(e){}}
async function clAddPhotos(r,i,files,gallery,pre){const m=clMe();if(!m||!clCanEditRev(r)){toast('Цю ревізію змінювати не можна');return;}
  for(let k=0;k<files.length;k++){const f=files[k];if(clPhN(r,i.oid)+clQOf(r.id,i.oid).length>=6){toast('До 6 фото на об’єкт');break;}
    const lid=Date.now().toString(36)+Math.random().toString(36).slice(2,6);const q={id:'clph:'+lid,kind:'clph',revId:r.id,oid:i.oid,authorId:m.id,lid,at:Date.now(),meta:{fromGallery:!!gallery,name:f.name||'',type:f.type||'',size:f.size||0}};
    S.clBusy=(S.clBusy||0)+1;render();
    try{const pr=pre&&pre[k];if(pr&&pr.e)throw pr.e;const src=pr&&pr.s?pr.s:await inspSrc(f);const tk=src.hd.exifAt||(gallery?(f.lastModified||Date.now()):Date.now());
      const res=await inspProcess(f,{takenAt:tk,bid:i.loc,point:'Клінінг · '+i.name,who:m.name,gallery},src);Object.assign(q.meta,{thumb:res.thumb,mini:res.mini,sizeKb:res.sizeKb,w:res.w,h:res.h,takenAt:tk,exifAt:src.hd.exifAt||null});q.blob=res.blob;
      S.clQ=S.clQ||{};S.clQ[q.id]=q;await IDBX.put(q);}
    catch(e){toast(inspErrText(e));devLog('Клінінг: помилка фото · '+i.name+' · етап: '+((e&&e.stage)||'?'),'err',[m.name,(f.type||'?')+' · '+Math.round((f.size||0)/1024)+' КБ',(e&&e.code||'')+' '+(e&&e.message||''),inspUA()].join(' | '));}
    finally{S.clBusy=Math.max(0,(S.clBusy||1)-1);}}
  render();await clSync();}
async function clUploadPhoto(q){const A=await inspAssetsNs();let assetId=q.assetId||null,data=null;
  if(!assetId&&A){try{const up=await A.upload(q.blob,{type:'image/jpeg'});assetId=up.id;q.assetId=assetId;await IDBX.put(q);}catch(e){if(e&&['not_granted','unsupported_type','quota_or_state','resource_exhausted'].includes(e.code))assetId=null;else throw inspErr('upload',(e&&e.code)||'network',e&&e.message);}}
  if(!assetId){const small=q.blob.size>170*1024?await inspFit(inspCanvas(await inspDecode(q.blob),1280),170*1024):q.blob;data=await inspB2U(small);}
  const pid=q.revId+'_'+q.lid;const now=Date.now();
  await S.db.doc('cl_rev_photos/'+pid).set({revId:q.revId,objId:q.oid,assetId,data,thumb:q.meta.thumb,takenAt:q.meta.takenAt,exifAt:q.meta.exifAt||null,fromGallery:!!q.meta.fromGallery,sizeKb:q.meta.sizeKb,w:q.meta.w||null,h:q.meta.h||null,authorId:q.authorId,addedAt:q.at||now,purged:false});
  const rv=(S.clRev||{})[q.revId];const mis=((rv&&rv.minis)||[]).filter(Boolean);
  await S.db.doc('cl_revisions/'+q.revId).update(Object.assign({items:{[q.oid]:{ph:{[pid]:{by:q.authorId,at:q.at||now}}}},lastChangeAt:now},q.meta.mini&&mis.length<4?{minis:[...mis,q.meta.mini]}:{}));}
async function clSync(){if(clSync.busy||!S.db)return;const Q=Object.values(S.clQ||{}).filter(q=>q.blob);if(!Q.length)return;clSync.busy=true;
  try{for(const q of Q.sort((a,b)=>a.at-b.at)){const r=(S.clRev||{})[q.revId];if(r&&r.status==='approved'){q.err='locked';continue;}
      try{await clUploadPhoto(q);delete S.clQ[q.id];await IDBX.del(q.id);q.err=null;}catch(e){q.err=(e&&(e.code||e.message))||'network';q.tries=(q.tries||0)+1;try{await IDBX.put(q);}catch(_){}}}}
  finally{clSync.busy=false;}if(S.fg==='clean')render();}
addEventListener('online',()=>clSync());setInterval(()=>{if(Object.keys(S.clQ||{}).length&&navigator.onLine!==false)clSync();},20000);
async function clDelPhoto(r,i,p){confirmSheet('Видалити це фото з ревізії?','Видалити фото',()=>write(async()=>{await S.db.doc('cl_revisions/'+r.id).update({items:{[i.oid]:{ph:{[p.id]:null}}},lastChangeAt:Date.now()});
  const A=await inspAssetsNs();if(p.assetId&&A){try{await A.delete(p.assetId);}catch(e){}}try{await S.db.doc('cl_rev_photos/'+p.id).delete();}catch(e){}},'Клінінг: видалено фото · '+i.name));}
function clPhView(p,title){if(!p||p._stub)return;openSheet(el('h2',{text:title}),p.purged?el('p',{class:'muted',text:'Фото видалено (очищення сховища)'}):el('img',{src:inspPhUrl(p,true),alt:title,class:'cl-big'}),
  el('p',{class:'muted small',style:'margin:0',text:dmy(new Date(p.takenAt||p.addedAt))+' '+inspKyivHM(p.takenAt||p.addedAt)+(p.fromGallery?' · з галереї':'')+(staffById(p.authorId)?' · '+staffById(p.authorId).name:'')}),el('button',{type:'button',class:'btn ghost',onclick:()=>closeSheet()},'Закрити'));}
function clPhGrid(r,i,edit){const purged=r.purged;const ps=clPhotos(r,i.oid);const qs=clQOf(r.id,i.oid);
  if(purged&&ps.length)return el('p',{class:'muted small cl-purged',text:'Фото видалено (очищення сховища) · '+ps.length+' шт.'});
  return el('div',{class:'iw-ph'},ps.map(p=>{const t=el('span',{class:'thumb iw-t',role:'button',tabindex:'0','aria-label':'Відкрити фото «'+i.name+'»',onclick:e=>{if(e.target.closest('.x'))return;clPhView(p,i.name);},onkeydown:e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();clPhView(p,i.name);}}},p.thumb?el('img',{src:p.thumb,alt:i.name}):el('span',{class:'iw-qph'},'…'),
      edit&&!p._stub?el('button',{type:'button',class:'x','aria-label':'Видалити фото','data-tip':'Видалити фото',onclick:()=>clDelPhoto(r,i,p)},'×'):null);return el('span',{class:'iw-t2'},t);}),
    qs.map(q=>el('span',{class:'iw-t2 q'+(q.err?' err':'')},el('span',{class:'thumb iw-t'},q.meta.thumb?el('img',{src:q.meta.thumb,alt:''}):null),el('small',{class:'iw-by',text:q.err?'Не надіслано — повторимо автоматично':'Надсилається…'}),
      q.err?el('button',{type:'button',class:'btn sm ghost',onclick:async()=>{q.err=null;await clSync();}},'Спробувати ще раз'):null)),
    S.clBusy?el('span',{class:'thumb iw-sk','aria-label':'Обробляємо фото'}):null);}
/* ---------- майстер ревізії: крок 2 (по об'єктах) і крок 3 (підсумок) ---------- */
function clExit(){S.clW=null;clLiveOff();render();}
function clWizard(){const w=S.clW;const r=(S.clRev||{})[w.id];if(!r)return [el('div',{class:'card empty'},el('p',{class:'muted',text:'Ревізію не знайдено або її видалено.'}),el('button',{type:'button',class:'btn',onclick:clExit},'До списку'))];
  const its=clItems(r);const edit=clCanEditRev(r);const done=its.filter(i=>clItemOk(r,i).ok).length;
  const head=el('div',{class:'cl-wh'},el('button',{type:'button',class:'btn ghost sm',onclick:clExit},'← Вийти'),el('div',{class:'cl-wt'},el('b',{text:'Ревізія · '+(r.locs||[]).map(l=>clLoc(l).name).join(', ')}),el('small',{class:'muted',text:dm(r.date)+' · готово '+done+' з '+its.length})),clStPill(r.status));
  const prog=el('div',{class:'cl-dots',role:'tablist','aria-label':'Об’єкти'},its.map((i,k)=>{const ok=clItemOk(r,i).ok;return el('button',{type:'button',role:'tab','aria-selected':String(w.step===1&&w.i===k),'aria-label':i.name+(ok?' — готово':''),class:'cl-d'+(ok?' ok':'')+(i.grade&&i.grade!=='ok'?' '+i.grade:'')+(w.step===1&&w.i===k?' cur':''),onclick:()=>{w.step=1;w.i=k;render();}},String(k+1));}),
    el('button',{type:'button',class:'cl-d sum'+(w.step===2?' cur':''),'aria-label':'Підсумок',onclick:()=>{w.step=2;render();}},'Σ'));
  const out=[head,clStepper(w.step===2?2:1),el('div',{class:'w-prog'},el('i',{style:'width:'+Math.round(done/Math.max(1,its.length)*100)+'%'})),prog];
  if(r.status==='returned'&&r.returnText)out.push(el('p',{class:'iw-lock ret',role:'note',text:'Повернено із зауваженнями'+(r.returnObj&&(r.items||{})[r.returnObj]?' («'+r.items[r.returnObj].name+'»)':'')+': '+r.returnText}));
  if(!edit&&r.status==='submitted')out.push(el('p',{class:'iw-lock',role:'note',text:'Ревізію відправлено на погодження — змінювати не можна.'}));
  out.push(w.step===2?clSummary(r,its,edit):clObjStep(r,its,w.i,edit));return out;}
function clObjStep(r,its,k,edit){const i=its[Math.max(0,Math.min(k,its.length-1))];if(!i)return el('p',{class:'muted',text:'Об’єктів немає'});const c=i.cleanerId&&(S.clC||{})[i.cleanerId];
  const err=el('p',{class:'iw-err',role:'alert',hidden:true});const upd=patch=>write(()=>S.db.doc('cl_revisions/'+r.id).update({items:{[i.oid]:patch},lastChangeAt:Date.now()}));
  const cam=el('input',{type:'file',accept:'image/*',capture:'environment',class:'iw-file','aria-label':'Зробити фото: '+i.name});cam.addEventListener('change',async()=>{const f=[...cam.files];const pre=await inspPreRead(f);cam.value='';clAddPhotos(r,i,f,false,pre);});
  const gal=el('input',{type:'file',accept:'image/*',multiple:true,class:'iw-file','aria-label':'Додати з галереї: '+i.name});gal.addEventListener('change',async()=>{const f=[...gal.files];const pre=await inspPreRead(f);gal.value='';clAddPhotos(r,i,f,true,pre);});
  const cm=el('textarea',{id:'clCm',maxlength:'600',disabled:edit?null:true,placeholder:i.grade==='ok'?'Коментар (необов’язково)':'Що саме не так: напр. «Сліди на дзеркалі ліфта»'});cm.value=i.comment||'';
  cm.addEventListener('input',()=>{if(cm.value.trim())err.hidden=true;});cm.addEventListener('change',()=>upd({comment:cm.value}));
  const seg=el('div',{class:'cl-gseg',role:'radiogroup','aria-label':'Оцінка'},Object.entries(CL_GR).map(([g,[l,ic]])=>el('button',{type:'button',role:'radio',disabled:edit?null:true,class:'iw-sb cl-sb '+g,'aria-checked':String(i.grade===g),onclick:async()=>{await upd({grade:g});if(g!=='ok')setTimeout(()=>{const t=document.getElementById('clCm');if(t&&!IS_TOUCH)t.focus();},60);}},el('span',{class:'iw-si','aria-hidden':'true',text:ic}),l)));
  const n=clPhN(r,i.oid)+clQOf(r.id,i.oid).length;const last=k>=its.length-1;
  const next=el('button',{type:'button',class:'btn cl-next',onclick:async()=>{if(edit&&cm.value!==(i.comment||'')){await upd({comment:cm.value});i.comment=cm.value;}const st=clItemOk(r,Object.assign({},i,{comment:cm.value}));
    if(edit&&!st.ok){err.textContent=st.why;err.hidden=false;return;}S.clW.i=k+1;if(last)S.clW.step=2;SC().scrollTop=0;render();}},last?'До підсумку →':'Наступний об’єкт →');
  const box=el('section',{class:'card iw-card cl-card'},el('div',{class:'stack',style:'gap:4px'},el('span',{class:'muted small',text:'Об’єкт '+(k+1)+' з '+its.length+' · '+clLoc(i.loc).full}),el('h2',{id:'clH',text:i.name}),
      el('span',{class:'small'},c?[clDot(c),' '+c.name]:el('span',{class:'cl-unl',text:'Не закріплено'}))),
    r.returnObj===i.oid&&r.status==='returned'?el('p',{class:'iw-info',text:'Зауваження директора до цього об’єкта: '+r.returnText}):null,
    edit?el('div',{class:'iw-cam'},el('label',{class:'btn filebtn iw-camb'},svg('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),' Зробити фото',cam),el('label',{class:'btn ghost filebtn iw-camb'},svg('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>'),' З галереї',gal)):null,
    n||S.clBusy?clPhGrid(r,i,edit):el('span',{class:'muted small',text:'Фото обов’язкове — мінімум одне.'}),
    el('div',{class:'stack',style:'gap:6px'},el('span',{class:'flabel',text:'Оцінка'}),seg),
    el('label',{for:'clCm'},i.grade&&i.grade!=='ok'?'Коментар (обов’язково)':'Коментар',cm),err,
    el('div',{class:'btn-pair'},el('button',{type:'button',class:'btn ghost',disabled:k===0?true:null,onclick:()=>{S.clW.i=k-1;render();}},'← Назад'),next));
  /* свайп вліво/вправо — наступний/попередній об'єкт */
  let sx=null;box.addEventListener('touchstart',e=>{if(e.target.closest('textarea,input,button,label'))return;sx=e.touches[0].clientX;},{passive:true});
  box.addEventListener('touchend',e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)<70)return;if(dx<0)next.click();else if(k>0){S.clW.i=k-1;render();}},{passive:true});
  return box;}
function clSummary(r,its,edit){const s=clSum(r);const bad=its.filter(i=>!clItemOk(r,i).ok);const qn=clQOf(r.id).length;const a=staffById(r.authorId);
  const byCl={};its.forEach(i=>{const k=i.cleanerId||'';const x=byCl[k]=byCl[k]||{n:0,ok:0,remark:0,bad:0};x.n++;if(i.grade)x[i.grade]++;});
  const gc=el('textarea',{id:'clGc',maxlength:'800',disabled:edit?null:true,placeholder:'Загальний коментар (необов’язково)'});gc.value=r.generalComment||'';gc.addEventListener('change',()=>write(()=>S.db.doc('cl_revisions/'+r.id).update({generalComment:gc.value,lastChangeAt:Date.now()})));
  const err=el('p',{class:'iw-err',role:'alert',hidden:true});
  return el('section',{class:'card iw-card'},el('h2',{text:'Підсумок ревізії'}),
    el('p',{class:'muted small',style:'margin:0',text:dmy(new Date(r.createdAt||Date.now()))+' '+inspKyivHM(r.createdAt||Date.now())+' · проводить: '+(a?a.name:'—')}),
    el('div',{class:'cl-kpi'},[['Усього',s.n,''],['Чисто',s.ok,'ok'],['Із зауваженнями',s.remark,'remark'],['Незадовільно',s.bad,'bad']].map(([l,v,c])=>el('div',{class:'cl-k '+c},el('b',{text:String(v)}),el('small',{text:l})))),
    el('div',{class:'stack',style:'gap:6px'},el('span',{class:'flabel',text:'По прибиральницях'}),Object.entries(byCl).map(([cid,x])=>{const c=(S.clC||{})[cid];return el('div',{class:'cl-bcl'},c?clDot(c):null,el('span',{text:c?c.name:'Не закріплено'}),el('span',{class:'muted small',text:x.n+' об’єкт.'}),el('span',{class:'cl-g ok sm'},'✓ '+x.ok),x.remark?el('span',{class:'cl-g remark sm'},'⚠ '+x.remark):null,x.bad?el('span',{class:'cl-g bad sm'},'✕ '+x.bad):null);})),
    bad.length?el('div',{class:'iw-info'},el('b',{text:'Не завершено: '+bad.length}),el('ul',{style:'margin:6px 0 0;padding-left:18px'},bad.map(i=>el('li',{},el('button',{type:'button',class:'linkbtn',onclick:()=>{S.clW.step=1;S.clW.i=its.indexOf(i);render();}},i.name),' — '+clItemOk(r,i).why)))):null,
    el('label',{for:'clGc'},'Загальний коментар',gc),err,
    edit?el('div',{class:'btn-pair'},el('button',{type:'button',class:'btn ghost',onclick:()=>{toast('Чернетку збережено — продовжите в «Ревізіях»');clExit();}},'Зберегти чернетку'),
      el('button',{type:'button',class:'btn',onclick:async e=>{if(bad.length){err.textContent='Спершу завершіть усі об’єкти: фото, оцінка, коментар до зауважень.';err.hidden=false;return;}if(qn){err.textContent='Зачекайте — ще надсилається фото ('+qn+').';err.hidden=false;clSync();return;}
        if(gc.value!==(r.generalComment||''))await S.db.doc('cl_revisions/'+r.id).update({generalComment:gc.value});e.currentTarget.disabled=true;const m=clMe();const again=r.status==='returned';
        const ok=await clPut('cl_revisions',r.id,cur=>({status:'submitted',submittedAt:Date.now(),hist:[...(cur.hist||[]),{st:'submitted',at:Date.now(),by:m?m.id:'',text:again?'повторно':''}]}),r.v||0,'Клінінг: ревізію '+(again?'повторно ':'')+'відправлено на погодження · '+(r.locs||[]).map(l=>clLoc(l).name).join(', ')+' · ✓'+s.ok+' ⚠'+s.remark+' ✕'+s.bad);
        if(ok){toast('Відправлено на погодження');S.clW=null;S.clR=r.id;render();}else e.currentTarget.disabled=false;}},r.status==='returned'?'Відправити повторно':'Відправити на погодження')):null);}
/* ---------- перегляд ревізії + погодження ---------- */
function clReport(id){const r=(S.clRev||{})[id];if(!r)return [el('div',{class:'card empty'},el('p',{class:'muted',text:'Ревізію не знайдено.'}),el('button',{type:'button',class:'btn',onclick:()=>{S.clR=null;clLiveOff();render();}},'До списку'))];
  clLiveOn(id);const a=staffById(r.authorId);const s=clSum(r);const its=clItems(r);const m=clMe();const mine=m&&r.authorId===m.id;
  const out=[el('div',{class:'cl-wh'},el('button',{type:'button',class:'btn ghost sm',onclick:()=>{S.clR=null;clLiveOff();render();}},'← Ревізії'),el('div',{class:'cl-wt'},el('b',{text:'Ревізія · '+(r.locs||[]).map(l=>clLoc(l).name).join(', ')}),el('small',{class:'muted',text:dmy(parseYmd(r.date))+' · '+(a?a.name:'—')})),clStPill(r.status))];
  out.push(el('div',{class:'cl-kpi'},[['Усього',s.n,''],['Чисто',s.ok,'ok'],['Із зауваженнями',s.remark,'remark'],['Незадовільно',s.bad,'bad']].map(([l,v,c])=>el('div',{class:'cl-k '+c},el('b',{text:String(v)}),el('small',{text:l})))));
  if(r.status==='returned'&&r.returnText)out.push(el('p',{class:'iw-lock ret',role:'note',text:'Зауваження'+(r.returnObj&&(r.items||{})[r.returnObj]?' до «'+r.items[r.returnObj].name+'»':' до всієї ревізії')+': '+r.returnText}));
  if(r.generalComment)out.push(el('p',{class:'card',style:'margin:0'},el('b',{text:'Загальний коментар: '}),r.generalComment));
  const acts=[];if(clCanApprove()&&r.status==='submitted'){acts.push(el('button',{type:'button',class:'btn',onclick:()=>clApprove(r)},'Погодити'),el('button',{type:'button',class:'btn ghost',onclick:()=>clReturnSheet(r)},'Зауваження'));}
  if(mine&&(r.status==='returned'||r.status==='draft'))acts.push(el('button',{type:'button',class:'btn',onclick:()=>clContinue(r)},r.status==='returned'?'Доповнити й відправити повторно':'Продовжити ревізію'));
  if(mine&&r.status==='draft')acts.push(el('button',{type:'button',class:'btn ghost danger',onclick:()=>confirmSheet('Видалити чернетку ревізії разом із фото?','Видалити чернетку',()=>clDeleteRev(r))},'Видалити чернетку'));
  if(acts.length)out.push(el('div',{class:'cl-acts2'},acts));
  out.push(el('div',{class:'stack cl-items'},its.map(i=>{const c=i.cleanerId&&(S.clC||{})[i.cleanerId];return el('section',{class:'card cl-ri'+(r.returnObj===i.oid&&r.status==='returned'?' hit':'')},
    el('div',{class:'cl-rih'},clGradeTag(i.grade)||el('span',{class:'cl-g none'},'—'),el('div',{class:'cl-wt'},el('b',{text:i.name}),el('small',{class:'muted'},clLoc(i.loc).name+' · ',c?[clDot(c),' '+c.name]:'не закріплено'))),
    clPhGrid(r,i,false),i.comment?el('p',{class:'small',style:'margin:0'},el('b',{text:'Коментар: '}),i.comment):null);})));
  out.push(el('section',{class:'card stack',style:'gap:6px'},el('b',{text:'Історія статусів'}),el('ol',{class:'cl-hist'},(r.hist||[]).map(h=>{const p=staffById(h.by);return el('li',{},clStPill(h.st),el('span',{class:'small',text:' '+dmy(new Date(h.at))+' '+inspKyivHM(h.at)+' · '+(p?p.name:'—')+(h.text?' · «'+h.text+'»':'')}));}))));
  if(r.purged)out.push(el('p',{class:'muted small',style:'margin:0;text-align:center',text:'Фото цієї ревізії видалено під час очищення сховища. Оцінки, коментарі й статуси збережено.'}));
  return out;}
async function clApprove(r){const m=clMe();const ok=await clPut('cl_revisions',r.id,cur=>cur.status!=='submitted'?(toast('Статус уже змінено'),null):({status:'approved',reviewerId:m?m.id:'',reviewedAt:Date.now(),hist:[...(cur.hist||[]),{st:'approved',at:Date.now(),by:m?m.id:''}]}),r.v||0,'Клінінг: ревізію погоджено · '+(r.locs||[]).map(l=>clLoc(l).name).join(', ')+' · '+dm(r.date));if(ok)toast('Погоджено');}
function clReturnSheet(r){const t=el('textarea',{id:'clRet',maxlength:'600',placeholder:'Що доповнити: напр. «Перезніміть хол — фото розмите»'});const er=el('p',{class:'iw-err',role:'alert',hidden:true,text:'Без тексту автор не знатиме, що виправити.'});
  const ob=el('select',{id:'clRetO'},[el('option',{value:'',text:'До всієї ревізії'})].concat(clItems(r).map(i=>el('option',{value:i.oid,text:i.name+' · '+clLoc(i.loc).name}))));t.addEventListener('input',()=>{if(t.value.trim())er.hidden=true;});
  openSheet(el('h2',{text:'Повернути із зауваженнями'}),el('label',{for:'clRetO'},'До чого зауваження',ob),el('label',{for:'clRet'},'Зауваження (обов’язково)',t),er,
    el('div',{class:'btn-pair'},el('button',{type:'button',class:'btn ghost',onclick:()=>closeSheet()},'Скасувати'),el('button',{type:'button',class:'btn',onclick:async()=>{const txt=t.value.trim();if(!txt){er.hidden=false;t.focus();return;}const m=clMe();
      const ok=await clPut('cl_revisions',r.id,cur=>cur.status!=='submitted'?(toast('Статус уже змінено'),null):({status:'returned',returnText:txt,returnObj:ob.value||null,reviewerId:m?m.id:'',reviewedAt:Date.now(),hist:[...(cur.hist||[]),{st:'returned',at:Date.now(),by:m?m.id:'',text:txt}]}),r.v||0,'Клінінг: ревізію повернено із зауваженнями · '+(r.locs||[]).map(l=>clLoc(l).name).join(', ')+' — '+txt.slice(0,120));
      if(ok){closeSheet();toast('Повернено автору');}}},'Повернути')));fancySel(document.getElementById('sheetRoot'));setTimeout(()=>t.focus(),80);}
async function clDeleteRev(r){try{const A=await inspAssetsNs();const q=await S.db.collection('cl_rev_photos').where('revId','==',r.id).get();for(const d of q.docs){const p=d.data()||{};if(p.assetId&&A){try{await A.delete(p.assetId);}catch(e){}}await S.db.doc('cl_rev_photos/'+d.id).delete();}
  await S.db.doc('cl_revisions/'+r.id).delete();clQOf(r.id).forEach(x=>{delete S.clQ[x.id];IDBX.del(x.id);});devLog('Клінінг: видалено чернетку ревізії · '+dm(r.date));S.clR=null;clLiveOff();render();toast('Чернетку видалено');}catch(e){toast('Не вдалося видалити');}}
/* ---------- очищення фото ревізій (той самий Dev-механізм, що й для обходів) ---------- */
async function clPurge(list){const A=await inspAssetsNs();let n=0,fail=0;
  for(const r of list){let q;try{q=await S.db.collection('cl_rev_photos').where('revId','==',r.id).get();}catch(_){fail++;continue;}
    for(const d of q.docs){const p=d.data();if(p.purged)continue;try{if(p.assetId){if(!A)throw {code:'not_granted'};await A.delete(p.assetId);}await S.db.doc('cl_rev_photos/'+d.id).update({purged:true,data:null,thumb:null});n++;}catch(err){fail++;}}
    try{await S.db.doc('cl_revisions/'+r.id).update({purged:true,purgedAt:Date.now()});}catch(_){}}
  return {n,fail};}
function clDevCard(){const old=clRevs().filter(r=>r.status!=='draft'&&!r.purged&&r.date<addDays(ymd(new Date()),-30));const all=clRevs().filter(r=>!r.purged&&r.status==='approved');
  const run=(L,label)=>confirmSheet('Очистити фото '+L.length+' '+plural(L.length,'ревізії','ревізій','ревізій')+' ('+label+')? Оцінки, коментарі й статуси лишаться.','Очистити фото',async()=>{toast('Очищаю…');const {n,fail}=await clPurge(L);devLog('Клінінг: очищено фото ревізій ('+label+') · '+n+' фото'+(fail?' · не вдалося '+fail:''));toast('Очищено фото: '+n+(fail?' · помилок '+fail:''));});
  return el('div',{class:'card stack',style:'gap:8px;margin-bottom:12px'},el('b',{text:'Фото ревізій клінінгу'}),el('span',{class:'muted small',text:'Ті самі правила, що для фото обходів: місячне очищення оригіналів (після Word-звіту) теж прибирає фото ревізій за той період. Тексти ревізій лишаються.'}),
    el('div',{class:'row',style:'gap:8px;flex-wrap:wrap'},el('button',{type:'button',class:'btn ghost sm',disabled:old.length?null:true,onclick:()=>run(old,'старші 30 днів')},'Очистити старші 30 днів ('+old.length+')'),
      el('button',{type:'button',class:'btn ghost sm',disabled:all.length?null:true,onclick:()=>run(all,'усі погоджені')},'Очистити всі погоджені ('+all.length+')')));}
/* ---------- «Мої зони» на «Сьогодні» для прибиральниці з акаунтом ---------- */
function clTodayCard(){const me=myStaff();if(!me)return null;const c=clCleaners().find(x=>x.staffId===me.id);if(!c)return null;const objs=clObjs().filter(o=>o.cleanerId===c.id);if(!objs.length)return null;
  return el('section',{class:'card cl-cc',style:'--c:'+(c.color||CL_COLORS[0])},el('div',{class:'cl-ch'},clAv(c,true),el('div',{class:'cl-ct'},el('b',{text:'Мої зони прибирання'}),el('small',{class:'muted',text:objs.length+' '+plural(objs.length,'об’єкт','об’єкти','об’єктів')}))),clChipGroups(objs,'today',{}));}
function clTileStat(){if(!S.clLoaded)return null;const n=clObjs().length;if(!n)return null;const p=clPending();const un=clObjs().filter(o=>!clCleanerOf(o)).length;
  return [n+' '+plural(n,'об’єкт','об’єкти','об’єктів'),clCleaners().length+' прибир. · '+(p?p+' на погодженні':(un?un+' не закріплено':'усе закріплено'))];}
/* CLEAN:END */
