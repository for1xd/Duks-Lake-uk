// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Планове технічне обслуговування

/* ---------- Планове технічне обслуговування ---------- */
const PM_CAT=[
 {id:'door',n:'Двері',d:'замки, доводчики, автоматичні двері, ворота',c:'#B0742A',ic:'<path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17"/><path d="M3 21h18"/><circle cx="14.5" cy="12" r=".9" fill="currentColor"/>'},
 {id:'lift',n:'Ліфти',d:'ліфти, підйомники, ескалатори',c:'#5B6CD9',ic:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M12 3v18"/><path d="m8 9 1.5-2L11 9M13 15l1.5 2 1.5-2"/>'},
 {id:'hvac',n:'Кондиціо­нування',d:'кондиціонери, чилери, фанкойли, опалення',c:'#2BA3C9',ic:'<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/><path d="m9.5 4.5 2.5 2 2.5-2M9.5 19.5l2.5-2 2.5 2"/>'},
 {id:'energy',n:'Енергетика',d:'щитові, генератори, ДБЖ, котельня',c:'#D9692B',ic:'<rect x="3" y="7" width="15" height="10" rx="2"/><path d="M21 10v4"/><path d="m10 9-2 3h3l-2 3"/>'},
 {id:'water',n:'Водопостачання та водовідведення',d:'насоси, бойлери, фільтри, каналізація',c:'#2E86DE',ic:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>'},
 {id:'vent',n:'Вентиляція',d:'припливна й витяжна, фільтри, димовидалення',c:'#3FA796',ic:'<path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 12h16a3 3 0 1 1-3 3"/><path d="M3 16h8"/>'},
 {id:'fire',n:'Пожежна безпека',d:'сигналізація, спринклери, вогнегасники',c:'#E0452B',ic:'<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.4 1.2-4 2.5-5.2.2 1.8 1 2.7 2 3.2C11 9 11 6 12 3z"/>'},
 {id:'acs',n:'Контроль доступу та СКД',d:'турнікети, зчитувачі, домофони, відео',c:'#4B6584',ic:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6"/><circle cx="12" cy="14" r="3"/><path d="M12 13v1.5"/>'},
 {id:'tech',n:'Техніка УК',d:'прибиральна техніка, авто, інструмент',c:'#8E6BBF',ic:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>'},
 {id:'other',n:'Інше',d:'усе, що не підходить під інші системи',c:'#7F8C8D',ic:'<circle cx="12" cy="12" r="9"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>'}];
const PM_REM=[10,5,3,0];
const PM_PER=[[1,'Щомісяця'],[3,'Щокварталу'],[6,'Раз на пів року'],[12,'Щороку'],[0,'Інша / разово']];
const PM_BLD=['1.1','1.2','1.3','2','3','4','Паркінг','Територія'];
/* Доступ: директор, менеджери (вкл. старшого), головний інженер; Dev — для підтримки */
function pmCan(){return hasAny(['director','manager','senior','engineer','dev']);}
function pmCat(id){return PM_CAT.find(c=>c.id===id)||PM_CAT[PM_CAT.length-1];}
function pmCN(id){return pmCat(id).n.replace(/­/g,'');}
function pmPerN(p){const f=PM_PER.find(x=>x[0]===+p);return f&&f[0]?f[1]:'';}
function pmDays(s){if(!s)return null;return Math.round((parseYmd(s)-parseYmd(ymd(new Date())))/864e5);}
function pmFull(s){return s?dm(s)+'.'+s.slice(0,4):'—';}
function pmAddM(s,n){const d=parseYmd(s);const day=d.getDate();d.setDate(1);d.setMonth(d.getMonth()+n);const last=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();d.setDate(Math.min(day,last));return ymd(d);}
function pmLast(x){const h=x.hist||[];return h.length?h[h.length-1]:null;}
function pmStatus(x){const d=pmDays(x.next);if(d==null)return ['без дати','muted','#7f8c8d','без дати'];
  const dd=Math.abs(d)+' '+plural(Math.abs(d),'день','дні','днів');
  if(d<0)return ['прострочено на '+dd,'law','#d03b3b','прострочено'];
  if(d===0)return ['сьогодні','law','#d03b3b','сьогодні'];
  if(d<=3)return ['через '+dd,'warn','#ec835a','незабаром'];
  if(d<=10)return ['через '+dd,'warn','#eda100','незабаром'];
  return ['через '+dd,'ok','#1baf7a','за графіком'];}
function pmUrgent(){return (S.pm||[]).filter(x=>{const d=pmDays(x.next);return d!=null&&d<=3;});}
function pmSoon(){return (S.pm||[]).filter(x=>{const d=pmDays(x.next);return d!=null&&d<=10;});}
function pmMine(sid){return (S.pm||[]).filter(x=>x.resp===sid&&x.next).sort((a,b)=>a.next.localeCompare(b.next));}
function pmWhere(x){return [x.bld?(/^\d/.test(x.bld)?'Буд. '+x.bld:x.bld):'',x.place].filter(Boolean).join(' · ');}
function pmCard(x){const c=pmCat(x.cat);const st=pmStatus(x);const l=pmLast(x);const r=x.resp&&staffById(x.resp);
  return el('button',{type:'button',class:'sos-c pm-c',style:'--sc:'+st[2]+';--cc:'+c.c,onclick:()=>pmDetail(x.id)},
    el('span',{class:'sos-ci'},svg(c.ic)),
    el('span',{class:'sos-cm'},el('b',{text:x.title}),el('small',{text:[pmCN(x.cat),pmWhere(x),x.org].filter(Boolean).join(' · ')}),
      el('span',{class:'sos-ct'},el('span',{class:'pill t-'+st[1]},el('i'),x.next?'Наступне '+dm(x.next)+' · '+st[0]:'Наступне не призначено'),
        l?el('span',{class:'pm-res '+(l.ok===false?'bad':'good'),text:(l.ok===false?'✕ неуспішно ':'✓ ')+dm(l.date)}):null)),
    el('span',{class:'pm-cr'},r?avatar(r):el('span',{class:'pm-noav',text:'?'}),
      el('span',{class:'pm-crt'},el('b',{text:r?r.name:'Без відповідального'}),el('small',{},pmPerN(x.per)?el('span',{text:pmPerN(x.per)+' · '}):null,el('span',{class:'pm-st',style:'color:'+st[2],text:st[3]})))));}
function pmFiltered(){const L=(S.pm||[]).slice().sort((a,b)=>(a.next||'9999').localeCompare(b.next||'9999'));const f=S.pmF||'all';
  return L.filter(x=>(!S.pmCat||x.cat===S.pmCat)&&(!S.pmB||x.bld===S.pmB)&&(!S.pmR||x.resp===S.pmR)&&
    (f==='all'||(f==='soon'?(pmDays(x.next)!=null&&pmDays(x.next)<=10):f==='fail'?(pmLast(x)||{}).ok===false:true)));}
function pmFilters(){const L=S.pm||[];const resp=[...new Set(L.map(x=>x.resp).filter(Boolean))].map(staffById).filter(Boolean).sort((a,b)=>a.name.localeCompare(b.name));
  const blds=PM_BLD.filter(b=>L.some(x=>x.bld===b)||b===S.pmB);
  const mk=(id,lbl,cur,opts,set)=>{const s=el('select',{id,'aria-label':lbl},el('option',{value:'',text:lbl}),opts.map(([v,t])=>el('option',{value:v,text:t})));s.value=cur||'';s.addEventListener('change',()=>{set(s.value);render();});return s;};
  const any=S.pmCat||S.pmB||S.pmR;
  return el('div',{class:'pm-flt'},
    mk('pmFB','Усі будинки',S.pmB,blds.map(b=>[b,/^\d/.test(b)?'Будинок '+b:b]),v=>S.pmB=v),
    mk('pmFC','Усі системи',S.pmCat,PM_CAT.map(c=>[c.id,pmCN(c.id)]),v=>S.pmCat=v),
    mk('pmFR','Усі відповідальні',S.pmR,resp.map(s=>[s.id,s.name]),v=>S.pmR=v),
    any?el('button',{class:'btn ghost sm',type:'button',onclick:()=>{S.pmCat='';S.pmB='';S.pmR='';render();}},'✕ Скинути'):null);}
function viewPm(){if(!pmCan())return [el('div',{class:'card empty'},el('p',{class:'muted',text:'Розділ доступний директору, менеджерам і головному інженеру.'}))];
  const L=(S.pm||[]).slice();const out=[];
  const over=L.filter(x=>{const d=pmDays(x.next);return d!=null&&d<0;});const today=L.filter(x=>pmDays(x.next)===0);const soon=L.filter(x=>{const d=pmDays(x.next);return d!=null&&d>0&&d<=10;});
  const mo=ymd(new Date()).slice(0,7);const doneMo=L.reduce((a,x)=>a+(x.hist||[]).filter(h=>(h.date||'').slice(0,7)===mo).length,0);
  const fails=L.filter(x=>{const l=pmLast(x);return l&&l.ok===false;});
  out.push(el('section',{class:'sos-hero pm-hero'+(over.length||today.length?' alarm':'')},el('div',{class:'sos-hl'},el('span',{class:'eyebrow',text:'Facility · планове ТО'}),
      el('h2',{text:over.length?over.length+' '+plural(over.length,'прострочене ТО','прострочені ТО','прострочених ТО'):today.length?today.length+' ТО на сьогодні':soon.length?soon.length+' ТО найближчі 10 днів':L.length?'Графік ТО під контролем':'Плануйте обслуговування систем'}),
      el('p',{text:'Записуйте проведене обслуговування й наступну дату — застосунок нагадає за 10, 5, 3 дні та в день ТО.'})),
    el('div',{class:'pm-hb'},el('button',{class:'btn sos-new',type:'button',onclick:()=>pmEdit(null,S.pmCat||null)},svg('<path d="M12 5v14M5 12h14"/>'),' Записати ТО'),
      el('button',{class:'btn pm-rep',type:'button',onclick:()=>pmReport()},svg('<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/>'),' Звіт по ТО'))));
  out.push(el('div',{class:'dz-kpi sos-kpi'},
    el('div',{class:'card dz-k'},el('span',{class:'muted small',text:'Прострочено'}),el('b',{class:over.length?'crit':'',text:String(over.length)}),el('small',{class:'muted',text:'дата ТО вже минула'})),
    el('div',{class:'card dz-k'},el('span',{class:'muted small',text:'Найближчі 10 днів'}),el('b',{text:String(today.length+soon.length)}),el('small',{class:'muted',text:today.length?today.length+' сьогодні':'включно з сьогодні'})),
    el('div',{class:'card dz-k'},el('span',{class:'muted small',text:'Проведено цього місяця'}),el('b',{text:String(doneMo)}),el('small',{class:'muted',text:'записів про ТО'})),
    el('div',{class:'card dz-k'},el('span',{class:'muted small',text:'Останнє ТО неуспішне'}),el('b',{class:fails.length?'crit':'',text:String(fails.length)}),el('small',{class:'muted',text:'потребують повторного ТО'}))));
  const sel=S.pmCat||'';
  out.push(el('div',{class:'sos-grid'},PM_CAT.map(c=>{const its=L.filter(x=>x.cat===c.id).sort((a,b)=>(a.next||'9999').localeCompare(b.next||'9999'));const u=its.filter(x=>{const d=pmDays(x.next);return d!=null&&d<=3;}).length;const nx=its.find(x=>x.next);
    return el('button',{type:'button',class:'sos-t'+(sel===c.id?' on':'')+(its.some(x=>{const d=pmDays(x.next);return d!=null&&d<0;})?' cr':''),style:'--cc:'+c.c,onclick:()=>{S.pmCat=sel===c.id?'':c.id;render();setTimeout(()=>{const t=document.querySelector('.sos-list-h');if(t)t.scrollIntoView({behavior:'smooth',block:'start'});},50);}},
      el('span',{class:'sos-ti'},svg(c.ic)),u?el('span',{class:'sos-tb',text:String(u)}):null,el('b',{text:c.n}),el('small',{text:c.d}),
      el('em',{text:its.length?its.length+' '+plural(its.length,'об’єкт','об’єкти','об’єктів')+(nx?' · наступне '+dm(nx.next):''):'ТО ще не записано'}));})));
  const f=S.pmF||'all';const vis=pmFiltered();
  out.push(el('div',{class:'row between sos-list-h'},el('h2',{text:'Графік обслуговування'}),
    el('div',{class:'sg sm'},[['all','Усі'],['soon','≤ 10 днів'],['fail','Неуспішні']].map(([k,l])=>el('button',{type:'button','aria-pressed':String(f===k),onclick:()=>{S.pmF=k;render();}},l)))));
  out.push(pmFilters());
  out.push(vis.length?el('div',{class:'sos-list'},vis.map(pmCard)):el('div',{class:'card empty'},el('p',{class:'muted',text:L.length?'За цими фільтрами нічого не знайдено.':'Записів про ТО поки немає.'}),L.length?null:el('button',{class:'btn ghost',type:'button',onclick:()=>pmEdit(null,sel||null)},'+ Записати ТО')));
  return out;}
function pmUkStaff(){const UKR=['manager','senior','engineer','director','dev'];return S.staff.filter(s=>UKR.includes(s.role)||UKR.includes(s.extraRole));}
function pmRespSel(id,cur){const uk=pmUkStaff();const rest=sortedStaff().filter(s=>!uk.includes(s));
  const s=el('select',{id},el('option',{value:'',text:'— не призначено —'}),el('optgroup',{label:'Facility'},uk.map(x=>el('option',{value:x.id,text:x.name}))),rest.length?el('optgroup',{label:'Інші працівники'},rest.map(x=>el('option',{value:x.id,text:x.name+' · '+(ROLE_NAME[x.role]||'')}))):null);s.value=cur||'';return s;}
function pmRemBox(rem){return el('div',{class:'pm-rems'},PM_REM.map(d=>el('button',{type:'button',class:'pm-rem','aria-pressed':String(rem.includes(d)),onclick:e=>{const i=rem.indexOf(d);if(i>=0)rem.splice(i,1);else rem.push(d);e.currentTarget.setAttribute('aria-pressed',String(i<0));}},d?'за '+d+' '+plural(d,'день','дні','днів'):'у день ТО')));}
function pmWhoBox(ids){return el('div',{class:'pm-who'},pmUkStaff().map(s=>el('button',{type:'button',class:'pm-wb','aria-pressed':String(ids.includes(s.id)),title:s.email?s.email:'пошту не вказано — тільки в застосунку',onclick:e=>{const i=ids.indexOf(s.id);if(i>=0)ids.splice(i,1);else ids.push(s.id);e.currentTarget.setAttribute('aria-pressed',String(i<0));}},avatar(s),el('span',{text:s.name.split(' ')[0]}),s.email?null:el('small',{text:'без пошти'}))));}
function pmResBox(state){const box=el('div',{class:'sos-sevs'},[[true,'Успішно','#1baf7a','обладнання працює штатно'],[false,'Неуспішно','#d03b3b','виявлено несправність / не завершено']].map(([v,l,c,s])=>el('button',{type:'button',class:'sos-sb','aria-pressed':String(state.ok===v),style:'--sc:'+c,onclick:e=>{state.ok=v;box.querySelectorAll('.sos-sb').forEach(b=>b.setAttribute('aria-pressed',String(b===e.currentTarget)));}},el('b',{},el('i'),l),el('small',{text:s}))));return box;}
/* Періодичність: при виборі сама рахує наступну дату від дати ТО */
function pmPerBox(state,onPick){const box=el('div',{class:'pm-rems'},PM_PER.map(([n,l])=>el('button',{type:'button',class:'pm-rem','aria-pressed':String(state.per===n),onclick:e=>{state.per=n;box.querySelectorAll('.pm-rem').forEach(b=>b.setAttribute('aria-pressed',String(b===e.currentTarget)));onPick(n);}},l)));return box;}
/* Нове ТО або редагування картки */
function pmEdit(x,cat){if(!pmCan())return;const isNew=!x;const m=myStaff();x=x||{cat:cat||'',rem:PM_REM.slice(),notify:m?[m.id]:[],per:null};const rem=(x.rem||PM_REM).slice();const who=(x.notify||[]).slice();const st={ok:true,per:x.per==null?null:+x.per};
  const catBox=el('div',{class:'sos-pick'},PM_CAT.map(c=>el('button',{type:'button',class:'sos-pc','aria-pressed':String(x.cat===c.id),style:'--cc:'+c.c,onclick:e=>{x.cat=c.id;catBox.querySelectorAll('.sos-pc').forEach(b=>b.setAttribute('aria-pressed',String(b===e.currentTarget)));otherHint.hidden=c.id!=='other';}},el('span',{class:'sos-ti sm'},svg(c.ic)),el('span',{text:c.n}))));
  const otherHint=el('p',{class:'muted small',style:'margin:-4px 0 0',text:'Для «Інше» обов’язково вкажіть, що саме обслуговували, і за потреби — критерії в коментарі.'});otherHint.hidden=x.cat!=='other';
  const ti=el('input',{id:'pmT',value:x.title||'',placeholder:'Напр.: Ліфт №2, Буд. 3 / Чилер на даху / Вогнегасники 2 поверх',maxlength:'120'});
  const bl=el('select',{id:'pmB'},el('option',{value:'',text:'— не вказано —'}),PM_BLD.map(b=>el('option',{value:b,text:/^\d/.test(b)?'Будинок '+b:b})));bl.value=x.bld||'';
  const pl=el('input',{id:'pmP',value:x.place||'',placeholder:'Поверх, приміщення'});
  const orgs=[...new Set((S.pm||[]).flatMap(i=>[i.org,...(i.hist||[]).map(h=>h.org)]).filter(Boolean))];
  const og=el('input',{id:'pmO',value:x.org||'',placeholder:'Підрядник або «власними силами»',list:'pmOrgs'});const ogl=el('datalist',{id:'pmOrgs'},orgs.map(o=>el('option',{value:o})));
  const rs=pmRespSel('pmR',x.resp);
  const today=ymd(new Date());
  const dd=el('input',{id:'pmD',type:'date',max:today});dd.value=isNew?today:'';
  const nt=el('textarea',{id:'pmN',rows:'3',placeholder:'Що зроблено, замінені деталі, показники, інші критерії…'});
  const nx=el('input',{id:'pmX',type:'date'});nx.value=x.next||'';
  const perBox=pmPerBox(st,n=>{if(n)nx.value=pmAddM(dd.value||today,n);});
  const doneBlock=isNew?[el('span',{class:'flabel',text:'Проведене обслуговування'}),el('label',{for:'pmD'},'Дата ТО (порожньо — лише запланувати)',dd),el('span',{class:'flabel',text:'Результат'}),pmResBox(st),el('label',{for:'pmN'},'Коментар',nt)]:[];
  openSheet(el('h2',{text:isNew?'Записати ТО':'Редагувати картку ТО'}),el('span',{class:'flabel',text:'Інженерна система'}),catBox,otherHint,
    el('label',{for:'pmT'},'Що обслуговували',ti),
    el('div',{class:'grid2'},el('label',{for:'pmB'},'Будинок / зона',bl),el('label',{for:'pmP'},'Точне місце',pl)),
    el('div',{class:'grid2'},el('label',{for:'pmR'},'Відповідальний',rs),el('label',{for:'pmO'},'Організація',og,ogl)),
    ...doneBlock,
    el('span',{class:'flabel',text:'Як часто проводиться ТО'}),perBox,
    el('label',{for:'pmX'},'Наступне ТО',nx),
    el('span',{class:'flabel',text:'Нагадування'}),pmRemBox(rem),
    el('span',{class:'flabel',text:'Кому нагадати (у застосунку та на пошту)'}),pmWhoBox(who),
    el('div',{class:'row'},el('button',{class:'btn',type:'button',style:'flex:1',onclick:()=>{const t=ti.value.trim();
      if(!x.cat){toast('Оберіть інженерну систему');return;}if(!t){toast(x.cat==='other'?'Вкажіть, що саме обслуговували':'Вкажіть, що обслуговували');ti.focus();return;}
      if(isNew&&!dd.value&&!nx.value){toast('Вкажіть дату проведеного або наступного ТО');return;}
      if(isNew&&dd.value&&dd.value>today){toast('Дата проведеного ТО не може бути в майбутньому');return;}
      if(rs.value&&!who.includes(rs.value))who.push(rs.value);
      const d={cat:x.cat,title:t,bld:bl.value,place:pl.value.trim(),org:og.value.trim(),resp:rs.value||null,per:st.per,next:nx.value||'',rem:rem.slice().sort((a,b)=>b-a),notify:who};closeSheet();
      if(isNew){const hist=dd.value?[{date:dd.value,ok:st.ok,note:nt.value.trim(),resp:d.resp,org:d.org,by:m?m.id:null,at:Date.now(),prevNext:'',nextSet:d.next}]:[];
        write(()=>S.db.collection('maint').add({...d,hist,sent:[],at:Date.now(),by:S.myId,sid:m?m.id:null}),dd.value?'ТО записано':'ТО заплановано');}
      else write(()=>S.db.doc('maint/'+x.id).update({...d,sent:d.next===x.next?(x.sent||[]):[],editedAt:Date.now()}),'Збережено');}},isNew?'Зберегти':'Зберегти зміни'),
      !isNew?el('button',{class:'btn danger',type:'button',onclick:()=>confirmSheet('Видалити картку «'+x.title+'» разом з усією історією ТО?','Видалити',()=>write(()=>S.db.doc('maint/'+x.id).delete(),'Видалено'))},'Видалити'):null),
    el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'));}
/* Записати проведене ТО (idx == null) або редагувати запис історії (idx — його номер) */
function pmDone(x,idx){if(!pmCan())return;const m=myStaff();const today=ymd(new Date());const hist=(x.hist||[]).slice();const E=idx!=null?hist[idx]:null;const st={ok:E?E.ok!==false:true,per:x.per==null?null:+x.per};
  const dd=el('input',{id:'pmD2',type:'date',max:today});dd.value=E?E.date:today;
  const rs=pmRespSel('pmR2',E?E.resp:x.resp);
  const og=el('input',{id:'pmO2',value:E?(E.org||''):(x.org||''),placeholder:'Підрядник або «власними силами»'});
  const nt=el('textarea',{id:'pmN2',rows:'3',placeholder:'Що зроблено, замінені деталі, показники, інші критерії…'});nt.value=E?(E.note||''):'';
  const nx=el('input',{id:'pmX2',type:'date'});
  const prevGap=(()=>{if(x.next&&hist.length){const a=parseYmd(hist[hist.length-1].date),b=parseYmd(x.next);return Math.round((b-a)/864e5);}return null;})();
  if(E)nx.value=x.next||'';else if(st.per)nx.value=pmAddM(today,st.per);else if(prevGap&&prevGap>0)nx.value=addDays(today,prevGap);
  dd.addEventListener('change',()=>{if(!E&&st.per)nx.value=pmAddM(dd.value||today,st.per);});
  const perBox=pmPerBox(st,n=>{if(n)nx.value=pmAddM(dd.value||today,n);});
  openSheet(el('h2',{text:E?'Редагувати запис ТО':'Проведене ТО'}),el('p',{class:'muted',style:'margin:-6px 0 4px',text:x.title+(pmWhere(x)?' · '+pmWhere(x):'')}),
    el('div',{class:'grid2'},el('label',{for:'pmD2'},'Дата ТО',dd),el('label',{for:'pmR2'},'Відповідальний',rs)),
    el('label',{for:'pmO2'},'Організація',og),el('span',{class:'flabel',text:'Результат'}),pmResBox(st),el('label',{for:'pmN2'},'Коментар',nt),
    el('span',{class:'flabel',text:'Як часто проводиться ТО'}),perBox,
    el('label',{for:'pmX2'},'Наступне ТО'+(!E&&!st.per&&prevGap?' (підставлено той самий інтервал — '+prevGap+' дн.)':''),nx),
    el('div',{class:'row'},el('button',{class:'btn',type:'button',style:'flex:1',onclick:()=>{if(!dd.value){toast('Вкажіть дату ТО');return;}if(dd.value>today){toast('Дата ТО не може бути в майбутньому');return;}
      const h={...(E||{}),date:dd.value,ok:st.ok,note:nt.value.trim(),resp:rs.value||null,org:og.value.trim()};
      if(E){h.editedAt=Date.now();h.editedBy=m?m.id:null;hist[idx]=h;}else{h.by=m?m.id:null;h.at=Date.now();h.prevNext=x.next||'';h.nextSet=nx.value||'';hist.push(h);}
      hist.sort((a,b)=>a.date.localeCompare(b.date)||(a.at||0)-(b.at||0));
      const notify=(x.notify||[]).slice();if(h.resp&&!notify.includes(h.resp))notify.push(h.resp);
      const upd={hist,per:st.per,next:nx.value||'',notify,editedAt:Date.now()};if(nx.value!==x.next)upd.sent=[];
      if(!E){upd.resp=h.resp||x.resp||null;upd.org=h.org||x.org||'';}
      closeSheet();write(()=>S.db.doc('maint/'+x.id).update(upd),E?'Запис оновлено':(st.ok?'ТО записано':'Записано: ТО неуспішне'));}},'Зберегти'),
      el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати')));}
/* Деталізація одного проведеного ТО */
function pmHistDetail(x,idx){const h=(x.hist||[])[idx];if(!h)return;const c=pmCat(x.cat);const w=staffById(h.resp);const by=staffById(h.by);const eb=h.editedBy&&staffById(h.editedBy);const can=pmCan();
  const ontime=h.prevNext?(h.date<=h.prevNext?'вчасно (план '+pmFull(h.prevNext)+')':'із запізненням на '+Math.round((parseYmd(h.date)-parseYmd(h.prevNext))/864e5)+' дн. (план '+pmFull(h.prevNext)+')'):null;
  openSheet(el('div',{class:'sos-dh',style:'--cc:'+c.c+';--sc:'+(h.ok===false?'#d03b3b':'#1baf7a')},el('span',{class:'sos-ti big'},svg(c.ic)),el('div',{class:'grow'},el('span',{class:'muted small',text:x.title+(pmWhere(x)?' · '+pmWhere(x):'')}),
      el('h2',{style:'margin:2px 0 6px',text:'ТО '+pmFull(h.date)}),el('span',{class:'pill t-'+(h.ok===false?'law':'ok')},el('i'),h.ok===false?'Неуспішно':'Успішно'))),
    el('div',{class:'dz-info'},[['Система',pmCN(x.cat)],['Відповідальний',w?w.name:'не вказано'],['Організація',h.org||'—'],['Місце',pmWhere(x)||'—'],
      ontime?['Строк',ontime]:null,h.nextSet?['Наступне ТО призначено на',pmFull(h.nextSet)]:null,
      (by||h.at>1e12)?['Запис вніс',[by?by.name:'',h.at>1e12?dm(ymd(new Date(h.at)))+' '+hm(h.at):''].filter(Boolean).join(' · ')]:null,eb?['Змінено',eb.name+' · '+dm(ymd(new Date(h.editedAt)))+' '+hm(h.editedAt)]:null].filter(Boolean).map(([a,b])=>el('div',{},el('small',{text:a}),el('b',{text:b})))),
    el('span',{class:'flabel',text:'Коментар'}),h.note?el('p',{class:'sos-desc',text:h.note}):el('p',{class:'muted',style:'margin:0',text:'Коментар не залишили.'}),
    can?el('div',{class:'row'},el('button',{class:'btn ghost',type:'button',style:'flex:1',onclick:()=>{closeSheet();setTimeout(()=>pmDone(x,idx),220);}},'Редагувати запис'),
      el('button',{class:'btn danger',type:'button',onclick:()=>pmHistDel(x,idx)},'Видалити запис')):null,
    el('button',{class:'btn ghost',type:'button',onclick:()=>{closeSheet();setTimeout(()=>pmDetail(x.id),220);}},'← До картки'));}
function pmHistDel(x,idx){const hist=(x.hist||[]).slice();const h=hist[idx];if(!h)return;const last=idx===hist.length-1;const revert=last&&h.nextSet!=null&&h.prevNext!=null&&x.next===h.nextSet&&h.prevNext;
  confirmSheet('Видалити запис ТО від '+pmFull(h.date)+'?'+(revert?' Дата наступного ТО повернеться на '+pmFull(h.prevNext)+'.':''),'Видалити',()=>{hist.splice(idx,1);const upd={hist,editedAt:Date.now()};if(revert){upd.next=h.prevNext;upd.sent=[];}
    write(()=>S.db.doc('maint/'+x.id).update(upd),'Запис ТО видалено');});}
function pmDetail(id){const x=(S.pm||[]).find(i=>i.id===id);if(!x)return;const c=pmCat(x.cat);const st=pmStatus(x);const r=x.resp&&staffById(x.resp);const can=pmCan();
  const hist=(x.hist||[]).map((h,i)=>[h,i]).reverse();
  openSheet(el('div',{class:'sos-dh',style:'--cc:'+c.c+';--sc:'+st[2]},el('span',{class:'sos-ti big'},svg(c.ic)),el('div',{class:'grow'},el('span',{class:'muted small',text:[pmCN(x.cat),pmWhere(x)].filter(Boolean).join(' · ')}),el('h2',{style:'margin:2px 0 6px',text:x.title}),
      el('div',{class:'row',style:'gap:6px;flex-wrap:wrap'},el('span',{class:'pill t-'+st[1]},el('i'),x.next?'Наступне '+pmFull(x.next)+' · '+st[0]:'Наступне не призначено')))),
    el('div',{class:'dz-info'},[['Відповідальний',r?r.name:'не призначено'],['Організація',x.org||'—'],['Періодичність',pmPerN(x.per)||'не вказано'],['Нагадування',(x.rem||[]).length?(x.rem||[]).map(d=>d?d+' дн.':'в день ТО').join(', '):'вимкнено'],['Кому нагадувати',(x.notify||[]).map(i=>(staffById(i)||{}).name).filter(Boolean).join(', ')||'—']].map(([a,b])=>el('div',{},el('small',{text:a}),el('b',{text:b})))),
    el('div',{class:'sos-tl'},el('span',{class:'flabel',text:'Історія обслуговування · '+hist.length}),
      hist.length?hist.map(([h,i])=>{const w=staffById(h.resp);return el('button',{type:'button',class:'sos-ti-r pm-hr '+(h.ok===false?'s-open':'s-done'),onclick:()=>{closeSheet();setTimeout(()=>pmHistDetail(x,i),220);}},el('i'),el('span',{},el('b',{text:pmFull(h.date)+' · '+(h.ok===false?'неуспішно':'успішно')}),
        el('small',{text:[w?w.name:'',h.org].filter(Boolean).join(' · ')||'—'}),h.note?el('span',{class:'pm-note',text:h.note}):null),el('span',{class:'pm-hgo','aria-hidden':'true',text:'›'}));}):el('p',{class:'muted small',style:'margin:4px 0',text:'Проведених ТО ще не записано.'})),
    can?el('div',{class:'row',style:'flex-wrap:wrap'},el('button',{class:'btn',type:'button',style:'flex:1',onclick:()=>{closeSheet();setTimeout(()=>pmDone(x),220);}},'✓ Записати проведене ТО')):null,
    el('div',{class:'row'},can?el('button',{class:'btn ghost',type:'button',style:'flex:1',onclick:()=>{closeSheet();setTimeout(()=>pmEdit(x),220);}},'Редагувати'):null,el('button',{class:'btn ghost',type:'button',style:can?null:'flex:1',onclick:closeSheet},'Закрити')));}
/* ТО конкретного працівника — у профілі та задачах */
function pmPersonCard(sid,title){const L=pmMine(sid);if(!L.length)return null;
  return el('div',{class:'card pf-card pm-mine'},el('div',{class:'pf-ch'},el('b',{text:title||'Планове ТО'}),el('span',{class:'pf-cnt',text:String(L.length)})),
    el('div',{class:'stack',style:'gap:6px'},L.map(x=>{const c=pmCat(x.cat);const st=pmStatus(x);return el('button',{type:'button',class:'pm-mr',style:'--cc:'+c.c+';--sc:'+st[2],onclick:()=>pmDetail(x.id)},
      el('span',{class:'sos-ti sm'},svg(c.ic)),el('span',{class:'pm-mm'},el('b',{text:x.title}),el('small',{text:[pmCN(x.cat),pmWhere(x)].filter(Boolean).join(' · ')})),
      el('span',{class:'pm-md'},el('b',{text:dm(x.next)}),el('small',{style:'color:'+st[2],text:st[0]})));})));}
/* Картка на «Сьогодні» */
function pmTodayCard(){const m=myStaff();if(!pmCan()){return m?pmPersonCard(m.id,'🛠 Моє планове ТО'):null;}
  const L=pmSoon().sort((a,b)=>a.next.localeCompare(b.next));if(!L.length)return null;
  return el('div',{class:'card pm-today'},el('div',{class:'row between'},el('b',{text:'🛠 Планове ТО найближчим часом'}),el('button',{class:'btn ghost sm',type:'button',onclick:()=>go('pm')},'Усі ТО')),
    el('div',{class:'sos-list'},L.slice(0,4).map(pmCard)));}
