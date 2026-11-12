// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: «Зміни колективу» для керівника: облік з дати початку (settings/main.trackingStartDate),

/* SHX:BEGIN — «Зміни колективу» для керівника: облік з дати початку (settings/main.trackingStartDate),
   відхилення лише по змінах, що вже минули; зведення дня, шкала дня, групи за станом, дії; таблиця тиждень/місяць */
function trackStart(){const v=S.cfg&&S.cfg.trackingStartDate;return v&&/^\d{4}-\d{2}-\d{2}$/.test(v)?v:null;}
function canTrackCfg(){return isDev()||hasAny(['director']);}
function fmtHM(m){return pad(Math.floor(m/60))+':'+pad(m%60);}
function fmtPart(p){const r=partRange(p);return r?fmtHM(r[0])+'–'+fmtHM(r[1]):p;}
/* план на будь-який тиждень: поточний S.week або підписка на weeks/<пн> */
function planAny(sid,date){const ws=mondayOf(parseYmd(date));const i=(parseYmd(date).getDay()+6)%7;
  if(S.week&&S.weekStart===ws){return dayValue(sid,i);}S.wkC=S.wkC||{};
  if(!(ws in S.wkC)){S.wkC[ws]=null;try{S.db.doc('weeks/'+ws).onSnapshot(d=>{S.wkC[ws]=d.exists?(d.data()||{}):{};if(S.tab==='shift')render();},()=>{});}catch(e){}return null;}
  const c=S.wkC[ws];if(!c)return null;const d=c.days&&c.days[sid];return d?(d[i]||''):'';}
/* показники одного дня: due — план, що вже мав бути відпрацьований (хв), rest — ще заплановано (хв) */
function shDay(w,date){const z={due:0,all:0,rest:0,fact:0,lateN:0,lateM:0,miss:0,v:null,xs:[]};const ts=trackStart();if(ts&&date<ts)return z;
  const today=ymd(new Date());const v=planAny(w.id,date);const rs=planMins(v);const xs=S.shifts.filter(x=>x.staffId===w.id&&x.date===date).sort((a,b)=>a.startAt-b.startAt);
  const now=new Date();const nm=now.getHours()*60+now.getMinutes();const all=rs.reduce((a,r)=>a+r[1]-r[0],0);
  let due=date<today?all:date>today?0:rs.reduce((a,r)=>a+Math.max(0,Math.min(r[1],nm)-r[0]),0);
  const fact=xs.reduce((a,x)=>a+shiftHours(x),0);let lateN=0,lateM=0;xs.forEach(x=>{const l=lateMin(x,v);if(l!=null&&l>5){lateN++;lateM+=l;}});
  const ended=date<today||(date===today&&rs.length&&nm>=rs[rs.length-1][1]);const miss=rs.length&&isWorking(v)&&ended&&!xs.length?1:0;
  return {due,all,rest:all-due,fact,lateN,lateM,miss,v,xs};}
function shRange(w,from,to){const t={due:0,all:0,rest:0,fact:0,lateN:0,lateM:0,miss:0,days:[]};for(let d=from;d<=to;d=addDays(d,1)){const x=shDay(w,d);['due','all','rest','fact','lateN','lateM','miss'].forEach(k=>t[k]+=x[k]);t.days.push([d,x]);}return t;}
/* зведення дня */
function shGroups(D){const sts=sortedStaff().filter(earns).map(w=>[w,dayStatus(w,D)]);const g={late:[],on:[],later:[],done:[],off:[],plan:[]};
  sts.forEach(([w,s])=>{const k=s.k==='nochk'||s.k==='miss'?'late':s.k==='on'?'on':s.k==='wait'||(s.k==='done'&&s.part)?'later':s.k==='done'?'done':s.k==='plan'?'plan':'off';g[k].push([w,s]);});return g;}
function shLateTxt(st,D){const rs=planMins(st.v);const today=ymd(new Date());if(st.k==='miss'||D<today)return 'Не вийшов на зміну';const now=new Date();const nm=now.getHours()*60+now.getMinutes();
  const nx=st.xs.length;const r=rs[Math.min(nx,rs.length-1)]||rs[0];if(nm>=r[1]){const nxt=rs.find(q=>q[0]>nm);return 'Пропустив зміну '+fmtHM(r[0])+'–'+fmtHM(r[1])+(nxt?' · далі о '+fmtHM(nxt[0]):'');}const m=Math.max(0,nm-r[0]);return 'Запізнюється на '+fmtH(m/60)+' · зміна з '+fmtHM(r[0]);}
function shNextTxt(st){const rs=planMins(st.v);const nx=st.xs.length;const r=rs[Math.min(nx,rs.length-1)]||rs[0];return r?'Зміна о '+fmtHM(r[0]):'Пізніше сьогодні';}
function shRemind(w,st){const m=myStaff();if(!m)return;const rs=planMins(st.v);const r=rs[Math.min(st.xs.length,rs.length-1)]||rs[0];
  const text='@'+w.name+' нагадування: ваша зміна '+(r?'з '+fmtHM(r[0]):'')+' — відмітьтесь у розділі «Моя зміна», будь ласка.';
  confirmSheet('Надіслати нагадування в чат для '+w.name+'?','Надіслати нагадування',()=>write(()=>S.db.collection('chat').add({by:S.myId,staffId:m.id,text,mentions:[w.id],at:Date.now(),photoId:null,thumb:null,att:null,replyTo:null}),'Нагадування надіслано · '+w.name));}
function shActs(w,st,D){if(!canPlan())return null;const tel=normPhone(w.phone||'');const b=(lbl,ic,fn,href)=>href?el('a',{class:'iconbtn sm sh-a',href,'aria-label':lbl,title:lbl},svg(ic)):el('button',{type:'button',class:'iconbtn sm sh-a','aria-label':lbl,title:lbl,onclick:e=>{e.stopPropagation();fn();}},svg(ic));
  return el('div',{class:'sh-acts'},tel?b('Подзвонити '+w.name,'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',null,'tel:'+tel):null,
    (st.k==='nochk'||st.k==='wait'||(st.k==='done'&&st.part))?b('Нагадати в чаті','<path d="M4 5h16v11H9l-5 4z"/><path d="M12 8v3M12 13h.01"/>',()=>shRemind(w,st)):null,
    b('Відмітити вручну','<path d="M4 20h4L19 9l-4-4L4 16z"/>',()=>shiftEdit(null,{staffId:w.id,date:D,manualReason:true})),
    b('Відкрити графік','<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/>',()=>go('schedule')));}
function shCard(w,st,D,grp){const parts=st.v&&isWorking(st.v)?shiftParts(st.v):[];const first=st.xs[0],last=st.xs[st.xs.length-1];
  const status=grp==='late'?el('span',{class:'sh-st late',text:shLateTxt(st,D)}):grp==='on'?el('span',{class:'sh-st on'},'На зміні з '+hm(st.xs.find(x=>!x.endAt).startAt)+' · ',liveH(st.xs.find(x=>!x.endAt).startAt)):
    grp==='later'?el('span',{class:'sh-st',text:shNextTxt(st)}):grp==='done'?el('span',{class:'sh-st done',text:'Відпрацював '+fmtH(st.xs.reduce((a,x)=>a+shiftHours(x),0))}):el('span',{class:'sh-st',text:st.t});
  return el('div',{class:'sh-card',role:'button',tabindex:'0','aria-label':w.name+': '+st.t,onclick:()=>workerWeek(w,mondayOf(parseYmd(D))),onkeydown:e=>{if(e.key==='Enter')workerWeek(w,mondayOf(parseYmd(D)));}},
    avatarP(w),el('div',{class:'sh-who'},el('b',{text:w.name}),el('small',{class:'muted',text:roleName(w.role)||''})),
    el('div',{class:'sh-parts'},parts.length?parts.map(p=>el('span',{class:'sh-pt',text:fmtPart(p)})):el('span',{class:'muted small',text:'без зміни'})),
    el('div',{class:'sh-stw'},status,first?el('div',{class:'sh-ths'},thumbBtn(first.startPhoto,'Фото початку'),thumbBtn(last.endPhoto,'Фото завершення')):null),shActs(w,st,D));}
/* шкала дня 07:00–21:00 */
function shTimeline(D,rows){const H0=7*60,H1=21*60,span=H1-H0;const pct=m=>Math.max(0,Math.min(100,(m-H0)/span*100));const today=ymd(new Date());const now=new Date();const nm=now.getHours()*60+now.getMinutes();
  const showNow=D===today&&nm>=H0&&nm<=H1;const nowI=lbl=>showNow?el('i',{class:'tl-now',style:'left:'+pct(nm)+'%','aria-hidden':'true'},lbl?el('span',{text:'зараз '+fmtHM(nm)}):null):null;
  const axis=el('div',{class:'tl-row ax'},el('span',{class:'tl-n'}),el('div',{class:'tl-tr ax'},[7,9,11,13,15,17,19,21].map(h=>el('span',{class:'tl-t',style:'left:'+pct(h*60)+'%',text:pad(h)+':00'})),nowI(true)));
  const body=rows.map(([w,st])=>{const rs=planMins(st.v);const tr=el('div',{class:'tl-tr'});
    rs.forEach(r=>tr.append(el('i',{class:'tl-plan',style:'left:'+pct(r[0])+'%;width:'+(pct(r[1])-pct(r[0]))+'%',title:'План '+fmtHM(r[0])+'–'+fmtHM(r[1])})));
    st.xs.forEach(x=>{const a=new Date(x.startAt);const am=a.getHours()*60+a.getMinutes();let bm;if(x.endAt){const b=new Date(x.endAt);bm=b.getHours()*60+b.getMinutes();if(bm<am)bm=H1;}else bm=D===today?nm:am;
      tr.append(el('i',{class:'tl-fact'+(x.endAt?'':' live'),style:'left:'+pct(am)+'%;width:'+Math.max(.8,pct(bm)-pct(am))+'%',title:'Факт '+hm(x.startAt)+'–'+(x.endAt?hm(x.endAt):'зараз')}));});
    const ni=nowI(false);if(ni)tr.append(ni);
    return el('div',{class:'tl-row'},el('span',{class:'tl-n',text:w.name}),tr);});
  return el('div',{class:'card tl'},el('div',{class:'row between'},el('b',{text:'Шкала дня'}),el('span',{class:'tl-lg'},el('i',{class:'tl-plan'}),'план',el('i',{class:'tl-fact'}),'факт')),axis,...body);}
/* таблиця тиждень / місяць */
function shTable(){const mode=S.shP||'week',off=S.shO||0;const t0=new Date();let from,to;
  if(mode==='month'){const a=new Date(t0.getFullYear(),t0.getMonth()+off,1);from=ymd(a);to=ymd(new Date(a.getFullYear(),a.getMonth()+1,0));}else{from=addDays(mondayOf(t0),off*7);to=addDays(from,6);}
  const ws=sortedStaff().filter(earns);const ts=trackStart();
  const cls=d=>d>=0?'pos':d>=-1?'amber':'neg';
  const head=el('div',{class:'row between shx-h'},el('div',{class:'row',style:'gap:10px'},el('h2',{text:mode==='month'?'Місяць':'Тиждень'}),
      el('div',{class:'seg'},[['week','Тиждень'],['month','Місяць']].map(([k,l])=>el('button',{type:'button','aria-pressed':String(mode===k),onclick:()=>{S.shP=k;S.shO=0;render();}},l)))),
    el('div',{class:'row',style:'gap:6px'},el('button',{class:'iconbtn sm',type:'button','aria-label':'Попередній період',onclick:()=>{S.shO=off-1;render();}},svg('<path d="M15 5l-7 7 7 7"/>')),el('b',{class:'shx-per',text:mode==='month'?perLabel(from.slice(0,7)):dm(from)+'–'+dm(to)}),el('button',{class:'iconbtn sm',type:'button','aria-label':'Наступний період',onclick:()=>{S.shO=off+1;render();}},svg('<path d="m9 5 7 7-7 7"/>'))));
  const note=el('p',{class:'muted small shx-note'},ts?'Облік ведеться з '+dm(ts)+'.'+ts.slice(0,4)+'. Різниця — лише по змінах, що вже минули; майбутні — у «Ще заплановано».':'Дату початку обліку не задано — рахуються всі відмітки.',canTrackCfg()?el('button',{type:'button',class:'linkbtn',onclick:shCfgSheet},' Змінити дату'):null);
  const hdr=el('div',{class:'shx-r hd'},['Працівник','План (на сьогодні)','Факт','Різниця','Запізнень','Пропусків','Ще заплановано'].map(x=>el('span',{text:x})));
  const rows=ws.map(w=>{const r=shRange(w,from,to);const plan=r.due/60,diff=r.fact-plan,all=r.all/60;const open=S.shExp===w.id;
    const row=el('button',{type:'button',class:'shx-r'+(open?' open':''),'aria-expanded':String(open),onclick:()=>{S.shExp=open?null:w.id;render();}},
      el('span',{class:'shx-n'},avatar(w),el('span',{class:'shx-nm'},el('b',{text:w.name}),el('span',{class:'shx-bar',title:'факт / план періоду'},el('i',{style:'width:'+(all?Math.min(100,r.fact/all*100):0)+'%'})))),
      el('span',{'data-l':'План','text':fmtH(plan)}),el('span',{'data-l':'Факт'},el('b',{text:fmtH(r.fact)})),
      el('span',{'data-l':'Різниця',class:'shx-d '+cls(diff),text:(diff>=0?'+':'−')+fmtH(Math.abs(diff))}),
      el('span',{'data-l':'Запізнень',class:r.lateN?'amber':'',text:r.lateN?r.lateN+' / '+r.lateM+' хв':'0'}),el('span',{'data-l':'Пропусків',class:r.miss?'neg':'',text:String(r.miss)}),
      el('span',{'data-l':'Ще заплановано',class:'muted',text:r.rest?fmtH(r.rest/60):'—'}));
    const det=open?el('div',{class:'shx-det'},r.days.filter(([,x])=>x.all||x.fact||x.miss).map(([d,x])=>el('div',{class:'shx-dr'},el('b',{text:DS[(parseYmd(d).getDay()+6)%7]+' '+dm(d)}),
      el('span',{text:'план '+(x.all?fmtH(x.all/60):'—')}),el('span',{text:'факт '+fmtH(x.fact)}),el('span',{class:x.lateN?'amber':'',text:x.lateN?'запізн. '+x.lateM+' хв':''}),el('span',{class:x.miss?'neg':'',text:x.miss?'пропуск':(x.rest?'ще '+fmtH(x.rest/60):'')}))).concat(ts&&from<ts?[el('p',{class:'muted small',style:'margin:0',text:'Дні до '+dm(ts)+' не враховуються.'})]:[])):null;
    return [row,det];});
  return [head,note,el('div',{class:'card shx'},hdr,...rows.flat().filter(Boolean))];}
function shCfgSheet(){const i=el('input',{id:'tsD',type:'date',value:trackStart()||ymd(new Date())});
  openSheet(el('h2',{text:'Дата початку обліку'}),el('p',{class:'muted',style:'margin:0',text:'Відмітки, план і пропуски до цієї дати не рахуються в статистиці. Самі дані не видаляються.'}),el('label',{for:'tsD'},'Облік з',i),
    el('div',{class:'btn-pair end'},el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'),el('button',{class:'btn',type:'button',onclick:()=>{if(!i.value){toast('Оберіть дату');return;}closeSheet();
      write(()=>S.db.doc('settings/main').set({...(S.cfg||{}),trackingStartDate:i.value,updatedAt:Date.now(),updatedBy:S.myId||''}),'Облік змін ведеться з '+dm(i.value));}},'Зберегти')));}
function shManagerView(){const out=[];const today=ymd(new Date());const D=S.shDay||today;const setDay=d=>{S.shDay=d;S.shF=null;render();};const dl=parseYmd(D);const lbl=DAYS[(dl.getDay()+6)%7]+', '+dm(D);
  out.push(el('div',{class:'sh-nav card'},el('button',{class:'iconbtn',type:'button','aria-label':'Попередній день',onclick:()=>setDay(addDays(D,-1))},svg('<path d="M15 5l-7 7 7 7"/>')),
    el('div',{class:'sh-nav-c'},el('b',{text:lbl}),el('span',{class:'muted small',text:D===today?'сьогодні':(D<today?'минулий день':'майбутній день')})),
    D!==today?el('button',{class:'btn ghost sm',type:'button',onclick:()=>setDay(today)},'Сьогодні'):null,
    el('button',{class:'iconbtn',type:'button','aria-label':'Наступний день',onclick:()=>setDay(addDays(D,1))},svg('<path d="m9 5 7 7-7 7"/>'))));
  const g=shGroups(D);const F=S.shF||null;
  const card=(k,lbl,n,cls)=>el('button',{type:'button',class:'card sh-sum'+(cls?' '+cls:''),'aria-pressed':String(F===k),onclick:()=>{S.shF=F===k?null:k;render();}},el('span',{class:'muted small',text:lbl}),el('b',{text:String(n)}));
  out.push(el('div',{class:'sh-stats four'},card('on','На зміні зараз',g.on.length,'ok'),card('late','Запізнюються',g.late.length,g.late.length?'warn':''),card('later',D>today?'Заплановано':'Пізніше сьогодні',(D>today?g.plan:g.later).length,''),card('off','Вихідні',g.off.length,'')));
  out.push(el('div',{class:'sh-tools'},canPlan()?el('button',{class:'btn ghost sm',type:'button',onclick:()=>shiftEdit(null,{date:D,manualReason:true})},'+ Додати відмітку'):null,
    el('button',{class:'btn ghost sm',type:'button',onclick:()=>pickWorker('Чий екран показати?',previewAs)},svg(IC.eye),' Як бачить працівник')));
  const stale=S.shifts.filter(x=>!x.endAt&&Date.now()-x.startAt>=20*3600e3);
  if(stale.length)out.push(el('div',{class:'card stack sh-list'},el('span',{class:'t-lbl',style:'padding-top:8px;color:var(--warn)',text:'Не завершені вчасно · '+stale.length}),stale.map(x=>shiftRow(x,true))));
  const tlRows=[...g.late,...g.on,...g.later,...g.done,...g.plan].filter(([,s])=>planMins(s.v).length||s.xs.length);if(tlRows.length)out.push(shTimeline(D,tlRows));
  const G=[['late','Запізнюються / не відмітились'],['on','На зміні зараз'],['later','Пізніше сьогодні'],['plan','Заплановано'],['done','Відпрацювали']];
  G.forEach(([k,lbl])=>{if(F&&F!==k)return;const L=g[k];if(!L.length)return;out.push(el('section',{class:'sh-grp g-'+k},el('h3',{},el('span',{text:lbl}),el('em',{text:String(L.length)})),el('div',{class:'sh-cards'},L.map(([w,st])=>shCard(w,st,D,k)))));});
  if((!F||F==='off')&&g.off.length)out.push(el('details',{class:'card sh-off',open:F==='off'?true:null},el('summary',{},'Вихідні · '+g.off.length),el('p',{style:'margin:8px 0 0',text:g.off.map(([w])=>w.name).join(', ')})));
  if(!G.some(([k])=>g[k].length)&&!g.off.length)out.push(el('div',{class:'card empty'},el('p',{class:'muted',text:'На цей день у графіку нікого немає.'}),el('button',{class:'btn ghost',type:'button',onclick:()=>go('schedule')},'Відкрити графік')));
  out.push(...shTable());
  return out;}
/* SHX:END */

function viewShift(){const m=myStaff();const out=[];
  if(!m){out.push(claimCard());return out;}
  if(earns(m))return earnerView(m,false);
  if(!S.shOld)return shManagerView();
  const today=ymd(new Date());const D=S.shDay||today;const wk0=mondayOf(parseYmd(D));const wk1=addDays(wk0,6);
  const earners=sortedStaff().filter(earns);const sts=earners.map(w=>[w,dayStatus(w,D)]);
  const setDay=d=>{S.shDay=d;render();};
  const dl=parseYmd(D);const lbl=DAYS[(dl.getDay()+6)%7]+', '+dm(D);
  out.push(el('div',{class:'sh-nav card'},el('button',{class:'iconbtn',type:'button','aria-label':'Попередній день',onclick:()=>setDay(addDays(D,-1))},svg('<path d="M15 5l-7 7 7 7"/>')),
    el('div',{class:'sh-nav-c'},el('b',{text:lbl}),el('span',{class:'muted small',text:D===today?'сьогодні':(D<today?'минулий день':'майбутній день')})),
    D!==today?el('button',{class:'btn ghost sm',type:'button',onclick:()=>setDay(today)},'Сьогодні'):null,
    el('button',{class:'iconbtn',type:'button','aria-label':'Наступний день',onclick:()=>setDay(addDays(D,1))},svg('<path d="m9 5 7 7-7 7"/>'))));
  const cnt=k=>sts.filter(([,s])=>k.includes(s.k)).length;const lateN=sts.filter(([,s])=>s.late!=null&&s.late>5).length;
  out.push(el('div',{class:'sh-stats four'},
    el('div',{class:'card'},el('span',{class:'muted small',text:'На зміні'}),el('b',{class:'ok',text:String(cnt(['on']))})),
    el('div',{class:'card'},el('span',{class:'muted small',text:'Завершили'}),el('b',{text:String(cnt(['done']))})),
    el('div',{class:'card'},el('span',{class:'muted small',text:'Запізнились'}),el('b',{class:lateN?'amber':'',text:String(lateN)})),
    el('div',{class:'card'},el('span',{class:'muted small',text:'Не відмітились'}),el('b',{class:cnt(['nochk','miss'])?'warn':'',text:String(cnt(['nochk','miss']))}))));
  out.push(el('div',{class:'sh-tools'},canPlan()?el('button',{class:'btn ghost sm',type:'button',onclick:()=>shiftEdit(null,{date:D})},'+ Додати відмітку'):null,
    el('button',{class:'btn ghost sm',type:'button',onclick:()=>pickWorker('Чий екран показати?',previewAs)},svg(IC.eye),' Як бачить працівник')));
  const stale=S.shifts.filter(x=>!x.endAt&&Date.now()-x.startAt>=20*3600e3);
  if(stale.length)out.push(el('div',{class:'card stack sh-list'},el('span',{class:'t-lbl',style:'padding-top:8px;color:var(--warn)',text:'Не завершені вчасно · '+stale.length}),stale.map(x=>shiftRow(x,true))));
  const order={on:0,nochk:1,late:1,wait:2,done:3,miss:1,plan:4,off:9};
  const vis=sts.filter(([,s])=>s.k!=='off').sort((a,b)=>order[a[1].k]-order[b[1].k]);const offs=sts.filter(([,s])=>s.k==='off');
  out.push(el('h2',{text:D===today?'Сьогодні':lbl}));
  out.push(vis.length?el('div',{class:'card stack sh-list'},vis.map(([w,st])=>{const h=st.xs.reduce((a,x)=>a+shiftHours(x),0);const first=st.xs[0],last=st.xs[st.xs.length-1];
      return el('div',{class:'sh-row ed',role:'button',tabindex:'0',onclick:()=>workerWeek(w,wk0)},avatarP(w),
        el('div',{class:'grow'},el('b',{text:w.name}),stChip(st),first?el('span',{class:'muted small',text:st.xs.map(x=>hm(x.startAt)+' – '+(x.endAt?hm(x.endAt):'зараз')).join('  ·  ')}):null),
        st.v&&isWorking(st.v)?el('div',{class:'sh-plan'},shiftParts(st.v).map(miniShift)):null,
        first?el('div',{class:'sh-ths'},thumbBtn(first.startPhoto,'Фото початку'),thumbBtn(last.endPhoto,'Фото завершення')):null,
        el('span',{class:'sh-h'+(st.k==='on'?' live':'')},st.k==='on'&&st.xs.length===1?liveH(first.startAt):(h?fmtH(h):'')));})):el('div',{class:'card empty'},el('p',{class:'muted',text:S.week&&S.weekStart===wk0?'На цей день нікого не заплановано і відміток немає.':'Графік на цей тиждень не завантажено — показую лише відмітки.'})));
  if(offs.length)out.push(el('p',{class:'muted small',style:'margin:-4px 4px 0',text:'Вихідні: '+offs.map(([w])=>w.name).join(', ')}));
  out.push(el('div',{class:'row between split'},el('h2',{text:'Тиждень'}),el('span',{class:'muted small',text:dm(wk0)+' – '+dm(wk1)})));
  out.push(el('div',{class:'card sh-table'},el('div',{class:'sht-h'},el('span',{text:'Працівник'}),el('span',{text:'План'}),el('span',{text:'Факт'}),el('span',{text:'Запізн.'})),
    earners.map(w=>{const xs=shiftsIn(w.id,wk0,wk1);const f=xs.reduce((a,x)=>a+shiftHours(x),0);const ph=weekPlanH(w,wk0);
      const lates=Array.from({length:7},(_,i)=>addDays(wk0,i)).filter(d=>{const st=dayStatus(w,d);return st.late!=null&&st.late>5;}).length;
      const diff=ph==null?null:f-ph;
      return el('button',{type:'button',class:'sht-r',onclick:()=>workerWeek(w,wk0)},el('span',{class:'sht-n'},avatar(w),el('b',{text:w.name})),
        el('span',{text:ph==null?'—':fmtH(ph)}),el('span',{class:'sht-f'},el('b',{text:fmtH(f)}),diff!=null&&Math.abs(diff)>=0.25&&D>=wk0?el('small',{class:diff<0?'neg':'pos',text:(diff>0?'+':'−')+fmtH(Math.abs(diff))}):null),
        el('span',{class:lates?'sht-l on':'sht-l',text:String(lates)}));})));
  return out;}

function partRange(p){if(p==='Д')return [510,1050];const r=/(\d{1,2})[:.](\d{2})\s*[–—-]\s*(\d{1,2})[:.](\d{2})/.exec(p);return r?[+r[1]*60+ +r[2],+r[3]*60+ +r[4]]:null;}

let _artN=0;
function artSvg(markup,vb){const n=++_artN;const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox',vb||'0 0 120 120');s.setAttribute('aria-hidden','true');s.innerHTML=markup.replace(/ID_/g,'a'+n+'_');return s;}
function pumpkinArt(){return artSvg(`<defs>
<radialGradient id="ID_pg" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#FFC56B"/><stop offset=".45" stop-color="#F7931E"/><stop offset="1" stop-color="#A9400B"/></radialGradient>
<radialGradient id="ID_pc" cx=".5" cy=".35" r=".75"><stop offset="0" stop-color="#FFB04A"/><stop offset=".6" stop-color="#EE8418"/><stop offset="1" stop-color="#B64A0C"/></radialGradient>
<linearGradient id="ID_st" x1="0" x2="1"><stop offset="0" stop-color="#6E9A3C"/><stop offset="1" stop-color="#2F4D1B"/></linearGradient>
<radialGradient id="ID_gl" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#FFF6B0"/><stop offset=".55" stop-color="#FFD24A"/><stop offset="1" stop-color="#FF8A00"/></radialGradient>
<filter id="ID_bl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter></defs>
<ellipse cx="60" cy="110" rx="44" ry="6" fill="#000" opacity=".3"/>
<g stroke="#8A3008" stroke-opacity=".35" stroke-width="1.2">
<ellipse cx="31" cy="70" rx="25" ry="36" fill="url(#ID_pg)"/><ellipse cx="89" cy="70" rx="25" ry="36" fill="url(#ID_pg)"/>
<ellipse cx="46" cy="69" rx="23" ry="39" fill="url(#ID_pc)"/><ellipse cx="74" cy="69" rx="23" ry="39" fill="url(#ID_pc)"/>
<ellipse cx="60" cy="68" rx="20" ry="40" fill="url(#ID_pg)"/></g>
<path d="M57 31c-1-8 1-15 7-20l5 3c-5 4-6 10-5 17z" fill="url(#ID_st)"/>
<path d="M66 15c8-6 18-4 22 3-7-1-13 1-18 6" fill="none" stroke="#5F8A33" stroke-width="2.4" stroke-linecap="round"/>
<g fill="url(#ID_gl)" filter="url(#ID_bl)" opacity=".85"><path d="M34 58l12-10 6 14z"/><path d="M86 58l-12-10-6 14z"/><path d="M33 80c8 10 46 10 54 0l-6 3-4-4-5 5-6-5-6 5-5-5-4 4z"/></g>
<g fill="url(#ID_gl)" stroke="#5A1E02" stroke-width="1.4" stroke-linejoin="round"><path d="M34 58l12-10 6 14z"/><path d="M86 58l-12-10-6 14z"/><path d="M56 68l4-6 4 6z"/><path d="M33 80c8 10 46 10 54 0l-6 3-4-4-5 5-6-5-6 5-5-5-4 4z"/></g>
<ellipse cx="40" cy="44" rx="7" ry="13" fill="#fff" opacity=".22" transform="rotate(-20 40 44)"/>`);}
function duckArt(hw,o){o=o||{};const wing=o.wing||'mid';const feet=o.feet!==false&&!o.fly;
  const W={mid:'M38 80c8-13 27-15 37-4-6 13-25 17-37 4z',up:'M40 76c0-17 15-33 33-35-1 15-9 30-33 35z',down:'M40 82c9 3 27 13 37 4-4-9-23-14-37-4z'}[wing];
  const F={mid:'M46 80l10-3M50 85l12-3M55 89l11-2',up:'M48 70l12-14M52 74l12-12M57 76l10-9',down:'M48 84l12 4M52 88l12 3M57 90l11 1'}[wing];
  return artSvg(`<defs>
<radialGradient id="ID_db" cx=".35" cy=".28" r=".9"><stop offset="0" stop-color="${hw?'#FFD9A0':'#C9F4F6'}"/><stop offset=".45" stop-color="${hw?'#F7A23C':'#59C6CD'}"/><stop offset="1" stop-color="${hw?'#B04C0B':'#1C7880'}"/></radialGradient>
<linearGradient id="ID_dw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hw?'#E8841C':'#3AA8B1'}"/><stop offset="1" stop-color="${hw?'#9C3F08':'#155F67'}"/></linearGradient>
<linearGradient id="ID_bk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFCB57"/><stop offset="1" stop-color="#EE8424"/></linearGradient>
<radialGradient id="ID_ey" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#3A2A55"/><stop offset="1" stop-color="#120A1C"/></radialGradient>
<linearGradient id="ID_ht" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7552B5"/><stop offset="1" stop-color="#271747"/></linearGradient></defs>
${o.shadow?'<ellipse cx="60" cy="113" rx="30" ry="4" fill="#000" opacity=".18"/>':''}
<path d="M26 79c-10-4-16-14-15-25 4 5 10 9 17 10-2 4-3 9-2 15z" fill="url(#ID_db)"/>
<path d="M14 58c3 4 7 7 12 8M17 66c3 2 6 4 10 4" stroke="${hw?'#9C3F08':'#155F67'}" stroke-opacity=".45" stroke-width="1.4" fill="none" stroke-linecap="round"/>
<ellipse cx="58" cy="84" rx="37" ry="24" fill="url(#ID_db)"/>
<ellipse cx="64" cy="94" rx="25" ry="10" fill="#fff" opacity=".2"/>
<path d="M30 74c10-10 32-12 46-4" stroke="#fff" stroke-opacity=".18" stroke-width="2" fill="none" stroke-linecap="round"/>
<path d="${W}" fill="url(#ID_dw)"/><path d="${F}" stroke="#fff" stroke-opacity=".28" stroke-width="1.5" fill="none" stroke-linecap="round"/>
<circle cx="80" cy="50" r="20" fill="url(#ID_db)"/>
<path d="M96 48c9-2 17 0 20 5-5 3-12 4-20 2z" fill="url(#ID_bk)"/><path d="M96 55c7 1 13 2 18 0-3 4-11 5-18 3z" fill="#E07A1C"/><circle cx="104" cy="49.5" r=".9" fill="#9A4A0E"/>
<ellipse cx="86.5" cy="46" rx="5.4" ry="6.4" fill="#fff"/><circle cx="88" cy="47" r="3.6" fill="url(#ID_ey)"/><circle cx="89.3" cy="45.4" r="1.3" fill="#fff"/><circle cx="87" cy="48.6" r=".6" fill="#fff" opacity=".7"/>
<path d="M81 39.5c3-2 7-2 10 0" stroke="${hw?'#9C3F08':'#155F67'}" stroke-opacity=".5" stroke-width="1.4" fill="none" stroke-linecap="round"/>
<ellipse cx="91" cy="56" rx="4" ry="2.3" fill="#FF7A7A" opacity=".42"/>
<ellipse cx="71" cy="40" rx="6" ry="9" fill="#fff" opacity=".2" transform="rotate(-30 71 40)"/>
${feet?'<path d="M50 106c-2 3-5 5-7 6h13zM66 106c-2 3-5 5-7 6h13z" fill="url(#ID_bk)"/>':''}
${hw?`<g><ellipse cx="80" cy="33" rx="25" ry="5.5" fill="url(#ID_ht)"/><path d="M67 32 82 3c1-2 4-1 4 1l8 28z" fill="url(#ID_ht)"/><path d="M69 27.5c8 2 17 2 24-.5l1 4.5c-8 2-17 2-26 0z" fill="#B98CFF"/><rect x="78" y="26.5" width="6" height="5.5" rx="1" fill="#FFD166"/><rect x="79.6" y="28" width="2.8" height="2.6" fill="#3B2466"/><path d="M84 6c4 2 5 5 3 8" stroke="#fff" stroke-opacity=".2" stroke-width="1.5" fill="none"/></g>`:''}`);}
function pumpkinSvg(){const s=svg('<ellipse cx="12" cy="14" rx="9.5" ry="7.5" fill="#F28A1E"/><ellipse cx="12" cy="14" rx="4.2" ry="7.5" fill="#E07512"/><path d="M12 6.6c0-1.6.6-3 2-3.8" stroke="#3D6B2A" stroke-width="1.8" fill="none"/><path d="m7.6 11.6 2 1.4-2.4.6z M16.4 11.6l-2 1.4 2.4.6z" fill="#3A1D05"/><path d="M7.5 16.2c1.3 1.4 2.8 2 4.5 2s3.2-.6 4.5-2l-1.4.4-.8-.9-.9.9-1.4-.9-1.4.9-.9-.9-.8.9z" fill="#3A1D05"/>');s.setAttribute('stroke','none');return s;}
function heroCard(m,v,has,tIdx){const parts=shiftParts(v);const now=new Date();const mins=now.getHours()*60+now.getMinutes();
  const rs=parts.map(partRange).filter(Boolean);let status=null,prog=null;
  if(rs.length){const cur=rs.find(r=>mins>=r[0]&&mins<r[1]);const next=rs.find(r=>mins<r[0]);
    const fm=x=>Math.floor(x/60)+':'+pad(x%60);
    if(cur){prog=(mins-cur[0])/(cur[1]-cur[0]);status='Зміна йде · до кінця '+fmtH((cur[1]-mins)/60);}
    else if(next){status='Початок о '+fm(next[0])+' · через '+fmtH((next[0]-mins)/60);prog=0;}
    else{status='Зміну на сьогодні завершено';prog=1;}}
  const mine=S.tasks.filter(t=>myOpen(t,m)).length;const onN=has?sortedStaff().filter(s=>isWorking(dayValue(s.id,tIdx))).length:0;const un=unreadChat();
  const chip=(n,l,tab)=>el('button',{type:'button',class:'hchip',onclick:()=>go(tab)},el('b',{text:String(n)}),el('span',{text:l}));
  const hw=document.documentElement.classList.contains('hw');
  if(hw){const now2=new Date();const hd=new Date(now2.getFullYear(),9,31);const left=Math.ceil((hd-new Date(now2.getFullYear(),now2.getMonth(),now2.getDate()))/864e5);
    const bat=(c)=>el('span',{class:'hw-bat '+c,'aria-hidden':'true'},svg('<path d="M12 8c-1.2-1.6-3-1.4-3.6.2-1-1.6-3.5-2-5.4-.8 1.6.7 2.4 2.3 2.2 3.8 1.3-.9 2.9-.7 3.6.5.4-1 1.4-1.4 2.2-1.2l1 1.5 1-1.5c.8-.2 1.8.2 2.2 1.2.7-1.2 2.3-1.4 3.6-.5-.2-1.5.6-3.1 2.2-3.8-1.9-1.2-4.4-.8-5.4.8C15 6.6 13.2 6.4 12 8z" fill="currentColor" stroke="none"/>'));
    return el('section',{class:'hero hero2 hw-hero'},
      el('span',{class:'hw-moon','aria-hidden':'true'}),bat('b1'),bat('b2'),bat('b3'),
      el('span',{class:'hw-stars','aria-hidden':'true'}),el('span',{class:'hw-fog','aria-hidden':'true'}),
      el('span',{class:'hw-pump','aria-hidden':'true'},pumpkinArt()),el('span',{class:'hw-duck','aria-hidden':'true'},duckArt(true)),
      el('div',{class:'hero-top'},el('span',{class:'eyebrow',text:DAYS[tIdx]+', '+dm(addDays(mondayOf(new Date()),tIdx))}),el('span',{class:'hw-tag',text:left>0?'🎃 до Хелловіну '+left+' '+(left===1?'день':left<5?'дні':'днів'):left===0?'🎃 Щасливого Хелловіну!':'🦇 Хелловін-тиждень'})),
      el('h2',{text:'Привіт, '+m.name.split(' ')[0]+'!'+(uiStyle()==='strict'?'':' 🎃')}),
      has?(parts.length?el('div',{class:'hero-shift'},el('div',{class:'hero-tiles'},parts.map(miniShift)),
          el('div',{class:'hero-st'},el('span',{text:status||''}),prog!=null?el('div',{class:'hero-bar'},el('i',{style:'width:'+Math.round(Math.min(1,Math.max(0,prog))*100)+'%'})):null))
        :el('div',{class:'hero-off',text:'Сьогодні вихідний — моторошно гарного відпочинку 👻'})):el('div',{class:'hero-off',text:'Графік на цей тиждень ще не додано'}),
      el('div',{class:'hero-chips'},chip(mine,'мої задачі','tasks'),chip(onN,'на зміні','schedule'),chip(un,'нових у чаті','chat')));}
  return el('section',{class:'hero hero2 has-duck'},
    el('span',{class:'hero-water','aria-hidden':'true'}),el('span',{class:'hero-duck','aria-hidden':'true'},duckArt(false)),
    el('span',{class:'hero-logo','aria-hidden':'true'},svg('<path d="M5 5l14 14M19 3v16M3 19h16"/>')),
    el('div',{class:'hero-top'},el('span',{class:'eyebrow',text:DAYS[tIdx]+', '+dm(addDays(mondayOf(new Date()),tIdx))}),el('span',{class:'hero-brand'},svg('<path d="M5 5l14 14M19 3v16M3 19h16"/>'),'DUCK’S LAKE')),
    el('h2',{text:'Привіт, '+m.name.split(' ')[0]+'!'}),
    has?(parts.length?el('div',{class:'hero-shift'},el('div',{class:'hero-tiles'},parts.map(miniShift)),
        el('div',{class:'hero-st'},el('span',{text:status||''}),prog!=null?el('div',{class:'hero-bar'},el('i',{style:'width:'+Math.round(Math.min(1,Math.max(0,prog))*100)+'%'})):null))
      :el('div',{class:'hero-off',text:'Сьогодні вихідний — гарного відпочинку'})):el('div',{class:'hero-off',text:'Графік на цей тиждень ще не додано'}),
    el('div',{class:'hero-chips'},chip(mine,'мої задачі','tasks'),chip(onN,'на зміні','schedule'),chip(un,'нових у чаті','chat')));}
