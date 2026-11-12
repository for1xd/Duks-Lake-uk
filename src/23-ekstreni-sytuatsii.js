// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Екстрені ситуації

/* ---------- Екстрені ситуації ---------- */
const SOS_CAT=[
 {id:'lift',n:'Ліфти',d:'застрягання, зупинка, несправність',c:'#5B6CD9',ic:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M12 3v18"/><path d="m8 9 1.5-2L11 9M13 15l1.5 2 1.5-2"/>'},
 {id:'hvac',n:'Кондиціо\u00adнування',d:'кондиціонери, опалення, чилери',c:'#2BA3C9',ic:'<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/><path d="m9.5 4.5 2.5 2 2.5-2M9.5 19.5l2.5-2 2.5 2"/>'},
 {id:'win',n:'Вікна',d:'розбиті, не зачиняються, протяг',c:'#6FA8DC',ic:'<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M12 3v18M4 12h16"/>'},
 {id:'door',n:'Двері',d:'замки, доводчики, турнікети',c:'#B0742A',ic:'<path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17"/><path d="M3 21h18"/><circle cx="14.5" cy="12" r=".9" fill="currentColor"/>'},
 {id:'roof',n:'Дахи й протікання',d:'протікання, покрівля, водостоки',c:'#7B5CC9',ic:'<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M12 13c-1.2 1.6-2 2.7-2 3.6a2 2 0 0 0 4 0c0-.9-.8-2-2-3.6z"/>'},
 {id:'power',n:'Електро\u00adпостачання',d:'відключення, щитові, розетки',c:'#E0A21A',ic:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'},
 {id:'energy',n:'Енергетика',d:'генератори, ДБЖ, котельня, лічильники',c:'#D9692B',ic:'<rect x="3" y="7" width="15" height="10" rx="2"/><path d="M21 10v4"/><path d="m10 9-2 3h3l-2 3"/>'},
 {id:'water',n:'Водо\u00adпостачання',d:'прориви, тиск, каналізація',c:'#2E86DE',ic:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>'},
 {id:'vent',n:'Вентиляція',d:'припливна й витяжна, димовидалення',c:'#3FA796',ic:'<path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 12h16a3 3 0 1 1-3 3"/><path d="M3 16h8"/>'},
 {id:'fire',n:'Пожежна безпека',d:'сигналізація, спринклери, вогнегасники',c:'#E0452B',ic:'<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.4 1.2-4 2.5-5.2.2 1.8 1 2.7 2 3.2C11 9 11 6 12 3z"/>'},
 {id:'acs',n:'Контроль доступу (СКД)',d:'турнікети, зчитувачі, ключ-карти, домофон',c:'#4B6584',ic:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6"/><circle cx="12" cy="14" r="3"/><path d="M12 13v1.5"/>'},
 {id:'other',n:'Інші ситуації',d:'усе, що не підходить під інші блоки',c:'#7F8C8D',ic:'<circle cx="12" cy="12" r="9"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>'}];
const SOS_SEV={crit:['Критична','#d03b3b','загроза людям або повна зупинка'],high:['Висока','#ec835a','заважає роботі резидентів'],mid:['Середня','#eda100','треба виправити найближчим часом'],low:['Низька','#7f8c8d','планово']};
const SOS_ST={open:['Відкрито','law'],work:['В роботі','warn'],done:['Вирішено','ok']};
const SOS_BLD=['1.1','1.2','1.3','2','3','4'];
function sosCat(id){return SOS_CAT.find(c=>c.id===id)||SOS_CAT[0];}
function sosAgo(ts){const m=Math.round((Date.now()-ts)/60000);if(m<1)return 'щойно';if(m<60)return m+' хв тому';const h=Math.round(m/60);if(h<24)return h+' год тому';return dm(ymd(new Date(ts)))+' о '+hm(ts);}
function sosOpen(x){return x.status!=='done';}
/* Фактична дата події: occurredAt; для старих записів — дата внесення */
function sosT(x){return x&&(x.occurredAt||x.at)||0;}
function sosWhen(ts){const d=new Date(ts);return pad(d.getDate())+'.'+pad(d.getMonth()+1)+' о '+hm(ts);}
function dtLocal(ts){const d=new Date(ts);return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+'T'+pad(d.getHours())+':'+pad(d.getMinutes());}
function sosCard(x){const c=sosCat(x.cat);const sv=SOS_SEV[x.sev]||SOS_SEV.mid;const st=SOS_ST[x.status||'open'];const who=staffById(x.sid);
  return el('button',{type:'button',class:'sos-c'+(x.status==='done'?' done':''),style:'--sc:'+sv[1]+';--cc:'+c.c,onclick:()=>sosDetail(x.id)},
    el('span',{class:'sos-ci'},svg(c.ic)),
    el('span',{class:'sos-cm'},el('b',{text:x.title}),el('small',{text:[c.n,x.bld?'Буд. '+x.bld:'',x.place].filter(Boolean).join(' · ')}),
      el('span',{class:'sos-ct'},el('span',{class:'pill t-'+st[1]},el('i'),st[0]),el('span',{class:'sos-sev'},el('i'),sv[0]),(x.photos||[]).length?el('span',{class:'muted small',text:'📷 '+x.photos.length}):null,(x.log||[]).length?el('span',{class:'muted small',text:'💬 '+x.log.length}):null,sosMailBadge(x))),
    el('span',{class:'sos-cr'},el('small',{text:sosWhen(sosT(x)),title:'Сталося · внесено '+sosWhen(x.at)}),who?avatar(who):null));}
/* бейдж «Екстрених ситуацій»: нові з моменту, коли ви востаннє відкривали розділ (крім ваших власних), відкриті на вас, і всі невирішені критичні */
function sosSeenAt(){try{return +localStorage.getItem('dl.sosSeen')||0;}catch(e){return 0;}}
function sosBadgeList(){if(!isUK())return [];const me=myStaff();const seen=sosSeenAt();
  return (S.sos||[]).filter(x=>x.status!=='done'&&(x.sev==='crit'||(me&&x.resp===me.id&&x.status==='open')||((x.at||0)>seen&&x.by!==S.myId)));}
function sosBadge(){return sosBadgeList().length;}
function viewSos(){if(S.tab==='sos'){const t=Date.now();setTimeout(()=>{try{localStorage.setItem('dl.sosSeen',String(t));}catch(e){}if(typeof renderTabs==='function')renderTabs();},1500);}if(!isUK())return [el('div',{class:'card empty'},el('p',{class:'muted',text:'Розділ доступний менеджерам, старшому менеджеру, головному інженеру, директору та Dev.'}))];
  const L=(S.sos||[]).slice().sort((a,b)=>sosT(b)-sosT(a));const op=L.filter(sosOpen);const crit=op.filter(x=>x.sev==='crit');const mo=L.filter(x=>sosT(x)>=new Date(new Date().getFullYear(),new Date().getMonth(),1).getTime());
  const curP=ymd(new Date()).slice(0,7);const per=S.sosPer||curP;const inP=ts=>per==='all'||(ts&&ymd(new Date(ts)).slice(0,7)===per);
  const pers=[...new Set([curP,...L.map(x=>ymd(new Date(sosT(x))).slice(0,7)),...L.filter(x=>x.doneAt).map(x=>ymd(new Date(x.doneAt)).slice(0,7))])].sort().reverse();
  const pL=L.filter(x=>inP(sosT(x)));const solved=L.filter(x=>x.status==='done'&&x.doneAt&&inP(x.doneAt));const pLbl=per==='all'?'за весь час':'за '+perLabel(per).toLowerCase();const out=[];
  out.push(el('section',{class:'sos-hero'+(crit.length?' alarm':'')},el('div',{class:'sos-hl'},el('span',{class:'eyebrow',text:'Facility · реагування'}),el('h2',{text:crit.length?crit.length+' '+plural(crit.length,'критична ситуація','критичні ситуації','критичних ситуацій')+' зараз':op.length?op.length+' '+plural(op.length,'відкрита ситуація','відкриті ситуації','відкритих ситуацій'):'Усе спокійно'}),
      el('p',{text:op.length?'Опишіть, що сталося, — колеги одразу побачать і зможуть відреагувати.':'Відкритих аварійних ситуацій немає.'})),
    el('button',{class:'btn sos-new',type:'button',onclick:()=>sosEdit(null,S.sosCat||null)},svg('<path d="M12 5v14M5 12h14"/>'),' Повідомити про ситуацію')));
  out.push(el('div',{class:'dz-kpi sos-kpi'},
    el('div',{class:'card dz-k'},el('span',{class:'muted small',text:'Відкриті'}),el('b',{class:op.length?'crit':'',text:String(op.length)}),el('small',{class:'muted',text:op.filter(x=>x.status==='work').length+' в роботі'})),
    el('div',{class:'card dz-k'},el('span',{class:'muted small',text:'Критичні'}),el('b',{class:crit.length?'crit':'',text:String(crit.length)}),el('small',{class:'muted',text:'потребують негайної реакції'})),
    el('div',{class:'card dz-k'},el('span',{class:'muted small',text:'Зафіксовано '+pLbl}),el('b',{text:String(pL.length)}),el('small',{class:'muted',text:pL.filter(x=>x.sev==='crit').length+' критичних · '+pL.filter(sosOpen).length+' ще відкрито'})),
    el('div',{class:'card dz-k sos-solved'},el('span',{class:'muted small',text:'Вирішено '+pLbl}),el('b',{class:'ok',text:String(solved.length)}),el('small',{class:'muted',text:solved.length?'закрито успішно':'поки жодної'}))));
  out.push(el('div',{class:'sos-per'},el('span',{class:'flabel',text:'Період звіту'}),el('div',{class:'sos-perl'},
    el('button',{type:'button',class:'dz-chip','aria-pressed':String(per==='all'),onclick:()=>{S.sosPer='all';render();}},'Усі за весь час'),
    pers.map(k=>el('button',{type:'button',class:'dz-chip','aria-pressed':String(per===k),onclick:()=>{S.sosPer=k;render();}},perLabel(k)+(k===curP?' · поточний':''))))));
  const sel=S.sosCat||'';
  out.push(el('div',{class:'sos-grid'},SOS_CAT.map(c=>{const n=op.filter(x=>x.cat===c.id).length;const all=L.filter(x=>x.cat===c.id).length;const cr=op.some(x=>x.cat===c.id&&x.sev==='crit');
    return el('button',{type:'button',class:'sos-t'+(sel===c.id?' on':'')+(cr?' cr':''),style:'--cc:'+c.c,onclick:()=>{S.sosCat=sel===c.id?'':c.id;render();setTimeout(()=>{const t=document.querySelector('.sos-list-h');if(t)t.scrollIntoView({behavior:'smooth',block:'start'});},50);}},
      el('span',{class:'sos-ti'},svg(c.ic)),n?el('span',{class:'sos-tb',text:String(n)}):null,el('b',{text:c.n}),el('small',{text:c.d}),el('em',{text:n?n+' '+plural(n,'відкрита','відкриті','відкритих'):all?'усе вирішено · '+all:'ситуацій не було'}));})));
  const f=S.sosF||'open';const vis=L.filter(x=>(!sel||x.cat===sel)&&(f==='open'?sosOpen(x):f==='done'?(x.status==='done'&&inP(x.doneAt)):inP(sosT(x))));
  out.push(el('div',{class:'row between sos-list-h'},el('h2',{text:(sel?sosCat(sel).n:'Ситуації')+(f==='open'?'':' · '+pLbl)}),el('div',{class:'row',style:'gap:6px'},sel?el('button',{class:'btn ghost sm',type:'button',onclick:()=>{S.sosCat='';render();}},'✕ Усі блоки'):null,
    el('div',{class:'sg sm'},[['open','Відкриті'],['done','Вирішені'],['all','Усі']].map(([k,l])=>el('button',{type:'button','aria-pressed':String(f===k),onclick:()=>{S.sosF=k;render();}},l))))));
  out.push(vis.length?el('div',{class:'sos-list'},vis.map(sosCard)):el('div',{class:'card empty'},el('p',{class:'muted',text:f==='open'?'Відкритих ситуацій немає 👍':'Записів поки немає.'}),el('button',{class:'btn ghost',type:'button',onclick:()=>sosEdit(null,sel||null)},'+ Повідомити про ситуацію')));
  return out;}
function sosEdit(x,cat){const isNew=!x;x=x||{cat:cat||'',sev:'mid',status:'open'};let photos=(x.photos||[]).slice();
  const UKR=['manager','senior','engineer','director','dev'];const uk=S.staff.filter(s=>UKR.includes(s.role)||UKR.includes(s.extraRole));
  const catBox=el('div',{class:'sos-pick'},SOS_CAT.map(c=>el('button',{type:'button',class:'sos-pc','aria-pressed':String(x.cat===c.id),style:'--cc:'+c.c,onclick:e=>{x.cat=c.id;catBox.querySelectorAll('.sos-pc').forEach(b=>b.setAttribute('aria-pressed',String(b===e.currentTarget)));}},el('span',{class:'sos-ti sm'},svg(c.ic)),el('span',{text:c.n}))));
  const sevBox=el('div',{class:'sos-sevs'},Object.entries(SOS_SEV).map(([k,v])=>el('button',{type:'button',class:'sos-sb','aria-pressed':String(x.sev===k),style:'--sc:'+v[1],onclick:e=>{x.sev=k;sevBox.querySelectorAll('.sos-sb').forEach(b=>b.setAttribute('aria-pressed',String(b===e.currentTarget)));}},el('b',{},el('i'),v[0]),el('small',{text:v[2]}))));
  const ti=el('input',{id:'sosT',value:x.title||'',placeholder:'Напр.: Застряг ліфт у Буд. 4, 3 поверх',maxlength:'120'});
  const bl=el('select',{id:'sosB'},el('option',{value:'',text:'— не вказано —'}),SOS_BLD.map(b=>el('option',{value:b,text:/^\d/.test(b)?'Будинок '+b:b})));bl.value=x.bld||'';
  const pl=el('input',{id:'sosP',value:x.place||'',placeholder:'Поверх, приміщення'});
  const occ=el('input',{id:'sosW',type:'datetime-local',value:dtLocal(isNew?Date.now():sosT(x)),max:dtLocal(Date.now())});
  const setDay=k=>{const cur=occ.value?new Date(occ.value):new Date();const d=new Date();d.setDate(d.getDate()-k);d.setHours(cur.getHours(),cur.getMinutes(),0,0);if(d.getTime()>Date.now())d.setTime(Date.now());occ.value=dtLocal(d.getTime());markW();};
  const wBtns=[['Сьогодні',()=>setDay(0)],['Вчора',()=>setDay(1)],['Інша дата',()=>{occ.max=dtLocal(Date.now());try{occ.showPicker();}catch(e){occ.focus();}}]].map(([l,f])=>el('button',{type:'button',class:'sos-wq',onclick:f},l));
  const markW=()=>{const v=occ.value?new Date(occ.value):null;const t=new Date();const y=new Date();y.setDate(y.getDate()-1);const same=(a,b)=>a&&a.toDateString()===b.toDateString();
    wBtns[0].setAttribute('aria-pressed',String(same(v,t)));wBtns[1].setAttribute('aria-pressed',String(same(v,y)));wBtns[2].setAttribute('aria-pressed',String(!!v&&!same(v,t)&&!same(v,y)));};
  occ.addEventListener('input',markW);markW();
  const de=el('textarea',{id:'sosD',rows:'4',placeholder:'Що сталося, коли помітили, що вже зробили…'});de.value=x.desc||'';
  const rs=el('select',{id:'sosR'},el('option',{value:'',text:'— не призначено —'}),uk.map(s=>el('option',{value:s.id,text:s.name})));rs.value=x.resp||'';
  const ph=el('div',{class:'sos-phs'});const drawPh=()=>ph.replaceChildren(...photos.map((p,i)=>el('span',{class:'sos-ph'},el('img',{src:p.thumb,alt:''}),el('button',{type:'button','aria-label':'Прибрати',onclick:()=>{photos.splice(i,1);drawPh();}},'×'))),
    photos.length<6?el('button',{type:'button',class:'sos-phadd',onclick:async()=>{const f=await pickPhoto();if(!f)return;try{const img=await loadImg(f);const r=await S.db.collection('photos').add({img:shrinkFit(img),by:S.myId,at:Date.now(),sos:true});photos.push({id:r.id,thumb:shrink(img,220,.6)});drawPh();}catch(e){toast('Не вдалося додати фото');}}},svg(I_CAM),el('span',{text:'Фото'})):null);drawPh();
  openSheet(el('h2',{text:isNew?'Нова екстрена ситуація':'Редагувати ситуацію'}),el('span',{class:'flabel',text:'Що постраждало'}),catBox,el('label',{for:'sosT'},'Коротко: що сталося',ti),
    el('div',{class:'grid2'},el('label',{for:'sosB'},'Будинок / зона',bl),el('label',{for:'sosP'},'Точне місце',pl)),
    el('div',{class:'sos-when'},el('label',{for:'sosW'},'Коли сталося',occ),el('div',{class:'sos-wqs'},wBtns),!isNew?el('small',{class:'muted',text:'Внесено в систему: '+dm(ymd(new Date(x.at)))+' о '+hm(x.at)+(staffById(x.sid)?' · '+staffById(x.sid).name:'')}):null),
    el('span',{class:'flabel',text:'Наскільки терміново'}),sevBox,el('label',{for:'sosD'},'Опис',de),
    el('label',{for:'sosR'},'Відповідальний',rs),el('span',{class:'flabel',text:'Фото (до 6)'}),ph,
    el('div',{class:'row'},el('button',{class:'btn',type:'button',style:'flex:1',onclick:()=>{const t=ti.value.trim();if(!x.cat){toast('Оберіть, що постраждало');return;}if(!t){toast('Напишіть коротко, що сталося');ti.focus();return;}
      const oc=occ.value?new Date(occ.value).getTime():NaN;if(isNaN(oc)){toast('Вкажіть, коли сталося');occ.focus();return;}if(oc>Date.now()+60000){toast('Дата не може бути в майбутньому');occ.focus();return;}
      const m=myStaff();const d={cat:x.cat,title:t,bld:bl.value,place:pl.value.trim(),desc:de.value.trim(),sev:x.sev,resp:rs.value||null,photos,occurredAt:Math.min(oc,Date.now())};closeSheet();
      if(isNew)write(async()=>{const full={...d,status:'open',at:Date.now(),by:S.myId,sid:m?m.id:null,log:[]};const ref=await S.db.collection('incidents').add(full);if(d.resp)sosNotify({id:ref.id,...full},'new');},'Ситуацію зафіксовано');
      else write(async()=>{await S.db.doc('incidents/'+x.id).update({...d,editedAt:Date.now()});if(d.resp&&d.resp!==x.resp)sosNotify({...x,...d},'assign');},'Збережено');}},isNew?'Зафіксувати':'Зберегти'),
      !isNew&&(isDev()||x.by===S.myId)?el('button',{class:'btn danger',type:'button',onclick:()=>confirmSheet('Видалити запис «'+x.title+'»?','Видалити',()=>write(()=>S.db.doc('incidents/'+x.id).delete(),'Видалено'))},'Видалити'):null),
    el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'));}
function sosDetail(id){const x=(S.sos||[]).find(i=>i.id===id);if(!x)return;const c=sosCat(x.cat);const sv=SOS_SEV[x.sev]||SOS_SEV.mid;const st=SOS_ST[x.status||'open'];const who=staffById(x.sid);const resp=x.resp&&staffById(x.resp);
  const note=el('textarea',{rows:'2',placeholder:'Що зроблено / оновлення…'});const m=myStaff();
  const addLog=(status)=>{const t=note.value.trim();if(!t&&!status){toast('Напишіть оновлення');return;}const e={at:Date.now(),sid:m?m.id:null,text:t||'',status:status||null};const upd={log:[...(x.log||[]),e]};if(status){upd.status=status;if(status==='done'){upd.doneAt=Date.now();upd.doneBy=m?m.id:null;}}closeSheet();write(()=>S.db.doc('incidents/'+x.id).update(upd),status==='done'?'Ситуацію вирішено':status==='work'?'Взято в роботу':'Оновлення додано');};
  openSheet(el('div',{class:'sos-dh',style:'--cc:'+c.c+';--sc:'+sv[1]},el('span',{class:'sos-ti big'},svg(c.ic)),el('div',{class:'grow'},el('span',{class:'muted small',text:c.n+(x.bld?' · Буд. '+x.bld:'')+(x.place?' · '+x.place:'')}),el('h2',{style:'margin:2px 0 6px',text:x.title}),
      el('div',{class:'row',style:'gap:6px;flex-wrap:wrap'},el('span',{class:'pill t-'+st[1]},el('i'),st[0]),el('span',{class:'sos-sev'},el('i'),sv[0]+' терміновість')))),
    x.desc?el('p',{class:'sos-desc',text:x.desc}):null,
    (x.photos||[]).length?el('div',{class:'sos-phs'},x.photos.map(p=>el('button',{type:'button',class:'sos-ph',onclick:()=>viewPhoto(p.id)},el('img',{src:p.thumb,alt:'Фото'})))):null,
    el('div',{class:'dz-info'},[['Коли сталося',dm(ymd(new Date(sosT(x))))+' о '+hm(sosT(x))+(x.occurredAt?'':' (дата внесення)')],['Повідомив',(who?who.name:'—')+' · '+sosAgo(x.at)],['Відповідальний',resp?resp.name:'не призначено'],x.doneAt?['Вирішено',dm(ymd(new Date(x.doneAt)))+' о '+hm(x.doneAt)]:null].filter(Boolean).map(([a,b])=>el('div',{},el('small',{text:a}),el('b',{text:b})))),
    el('div',{class:'sos-tl'},el('span',{class:'flabel',text:'Хронологія'}),el('div',{class:'sos-ti-r'},el('i'),el('span',{},el('b',{text:'Зафіксовано'}),el('small',{text:(who?who.name+' · ':'')+dm(ymd(new Date(x.at)))+' '+hm(x.at)}))),
      (x.log||[]).map(e=>{const w=staffById(e.sid);return el('div',{class:'sos-ti-r'+(e.status?' s-'+e.status:'')},el('i'),el('span',{},el('b',{text:e.status?SOS_ST[e.status][0]+(e.text?': ':''):''},e.text?el('span',{style:'font-weight:500',text:e.text}):null),el('small',{text:(w?w.name+' · ':'')+dm(ymd(new Date(e.at)))+' '+hm(e.at)})));})),
    note,
    el('div',{class:'row',style:'flex-wrap:wrap'},el('button',{class:'btn ghost',type:'button',onclick:()=>addLog(null)},'Додати оновлення'),
      x.status==='open'?el('button',{class:'btn ghost',type:'button',onclick:()=>addLog('work')},'Взяти в роботу'):null,
      x.status!=='done'?el('button',{class:'btn',type:'button',style:'flex:1',onclick:()=>addLog('done')},'✓ Вирішено'):el('button',{class:'btn ghost',type:'button',onclick:()=>addLog('open')},'Відкрити знову')),
    sosMailLog(x),
    el('div',{class:'row'},el('button',{class:'btn ghost',type:'button',style:'flex:1',onclick:()=>{closeSheet();setTimeout(()=>sosEdit(x),220);}},'Редагувати'),el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Закрити')));}
