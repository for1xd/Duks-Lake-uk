// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Витратні матеріали v2: тільки кількості (без цін і сум).

/* CONS:BEGIN — Витратні матеріали v2: тільки кількості (без цін і сум).
   db: consItems/<id> {name,cat,unit,qty,min,place,note,lastOpAt}
       consOps/<id>   {kind:'issue'|'writeoff'|'receipt'|'adjust'|'inventory'|'storno', lines:[{itemId,name,unit,cat,delta,before,after}],
                       src:{t:'manual'|'table'|'invoice'|'storno',file,doc,docDate,supplier,mode}, byId,toId,toText,bld,purpose,link:{t,id,title},reason,note,
                       date,time,at(час внесення),author,authorSid, storno:{opId,at,by,reason} (на оригіналі), stornoOf (на зворотній)}
       consHist/<id>  {act:'create'|'edit'|'delete',itemId,name,changes:{поле:[було,стало]},at,author,authorSid}
   Право видачі: роль із CONS_ISSUE_ROLES або staff.perms.consIssue===true (false — заборонити). Решта — тільки перегляд. */
const CONS_CATS=[['chem','Хімія для клінінгу','🧴',/хім|миюч|засіб|гель|порош|дезінф|хлор|білизн|domestos|доместос|мило|рідин|шампун|спрей|полірол|антижир|відбілюв|освіжув|пемолюкс|fairy|ferry/i],
  ['salt','Посипні матеріали','🧂',/сіль|пісок|посип|реагент|антиожел|щеб|гравій/i],
  ['bags','Пакети та мішки','🛍️',/пакет|мішк|мешк|плівк/i],
  ['paper','Папір і гігієна','🧻',/папір|паперов|рушник|серветк|туалет/i],
  ['tools','Інструмент і приладдя','🧽',/губк|ганчір|швабр|щітк|віник|совок|рукавиц|перчат|мітл|відр|ганч|скреб|насадк|тряп|мікрофібр/i],
  ['other','Інше','📦',/.^/]];
const CONS_UNITS=['шт','л','кг','м','уп','рулон','пачка','пара','мішок','компл'];
const CONS_ISSUE_ROLES=['manager','director'];
const CONS_STORNO_ROLES=['director'];
const CONS_KIND={issue:['Видача','out'],writeoff:['Списання','off'],receipt:['Надходження','in'],adjust:['Коригування','adj'],inventory:['Інвентаризація','inv'],storno:['Сторно','st']};
const CONS_REASONS=['Інвентаризація','Пересорт','Помилка обліку','Псування / брак','Інше'];
const CONS_PURPOSE=['Прибирання','Ремонт','ТО','Благоустрій','Інше'];
function consPlaces(){return ARCH.map(b=>'Буд. '+b.fac).concat(['Територія','Паркінг','Офіс УК','Озеро / пляж']);}
function consCat(k){return CONS_CATS.find(c=>c[0]===k)||CONS_CATS[CONS_CATS.length-1];}
function consGuessCat(n){const c=CONS_CATS.find(c=>c[3].test(n||''));return c?c[0]:'other';}
function consItems(){return (S.consI||[]).slice().sort((a,b)=>(CONS_CATS.indexOf(consCat(a.cat))-CONS_CATS.indexOf(consCat(b.cat)))||String(a.name).localeCompare(b.name,'uk'));}
function consItem(id){return (S.consI||[]).find(x=>x.id===id);}
function consLow(x){return x.min!=null&&x.min!==''&&+x.qty>0&&+x.qty<=+x.min;}
function consSt(x){return !(+x.qty>0)?'none':consLow(x)?'low':'ok';}
const CONS_ST={ok:['В нормі','ok'],low:['Закінчується','low'],none:['Немає','none']};
const cq=v=>(Math.round((+v||0)*1000)/1000).toLocaleString('uk-UA',{maximumFractionDigits:3});
const cr=v=>Math.round((+v||0)*1000)/1000;
function consNum(t){if(typeof t==='number')return isNaN(t)?null:cr(t);const v=parseFloat(String(t==null?'':t).replace(/\s/g,'').replace(',','.'));return isNaN(v)?null:cr(v);}
function consOps(){return (S.consO||[]).slice().sort((a,b)=>((b.date||'')+(b.time||'')).localeCompare((a.date||'')+(a.time||''))||(b.at||0)-(a.at||0));}
function consOpLive(o){return !o.storno&&o.kind!=='storno';}
function consCanIssue(){const m=myStaff();if(m&&m.perms&&m.perms.consIssue===false)return false;if(m&&m.perms&&m.perms.consIssue===true)return true;return hasAny(CONS_ISSUE_ROLES);}
function consCanStorno(o){return !!o&&(o.author&&o.author===S.myId||hasAny(CONS_STORNO_ROLES));}
function consWho(sid,uid){const s=sid&&staffById(sid);if(s)return s.name;const u=uid&&S.staff.find(x=>x.userId===uid);return u?u.name:'—';}
function consMe(){const m=myStaff();return {author:S.myId||'',authorSid:m?m.id:null};}
function consNowHM(){const d=new Date();return pad(d.getHours())+':'+pad(d.getMinutes());}
function consDT(o){return dm(o.date)+'.'+String(o.date||'').slice(0,4)+(o.time?' '+o.time:'');}
function consLinesTxt(o,n){const L=o.lines||[];n=n||2;return L.slice(0,n).map(l=>l.name+' ×'+cq(Math.abs(l.delta))).join(', ')+(L.length>n?' + ще '+(L.length-n):'');}
function consToLabel(o){return o.toId?consWho(o.toId):(o.toText||'');}
function consInvInfo(){const inv=consOps().find(o=>o.kind==='inventory'&&!o.storno);const last=[...consOps().map(o=>({at:o.at,who:consWho(o.authorSid,o.author)})),...(S.consH||[]).map(h=>({at:h.at,who:consWho(h.authorSid,h.author)}))].sort((a,b)=>b.at-a.at)[0];return {inv,last};}
/* toast із посиланням */
function consToast(msg,opId){const r=document.getElementById('toastRoot');r.replaceChildren(el('div',{class:'toast cs-toast',role:'status'},el('span',{text:msg}),opId?el('button',{type:'button',onclick:()=>{r.replaceChildren();consOpSheet(opId);}},'Відкрити запис'):null));clearTimeout(toast.t);toast.t=setTimeout(()=>r.replaceChildren(),7000);}
/* запис операції: одна транзакційна послідовність — позиції, потім операція */
async function consCommit(op,items){const me=consMe();const now=Date.now();const lines=[];const upd={};
  for(const l of op.lines){const it=items&&items[l.itemId]||consItem(l.itemId);if(!it)continue;const base=upd[it.id]!=null?upd[it.id]:(+it.qty||0);let after=l.set!=null?cr(l.set):cr(base+l.delta);
    if(after<0)throw Object.assign(new Error('neg'),{item:it,base});const delta=cr(after-base);if(!delta&&l.set==null&&op.kind!=='inventory')continue;upd[it.id]=after;lines.push({itemId:it.id,name:it.name,unit:it.unit,cat:it.cat,delta,before:base,after});}
  if(!lines.length)return null;const doc={...op,lines,at:now,...me};delete doc.items;
  const ref=await S.db.collection('consOps').add(doc);
  for(const [id,q] of Object.entries(upd))await S.db.doc('consItems/'+id).update({qty:q,lastOpAt:now,lastOpDate:op.date||ymd(new Date())});
  return {id:ref.id,lines};}
async function consNewItem(d){const me=consMe();const now=Date.now();const doc={name:d.name.trim(),cat:d.cat||consGuessCat(d.name),unit:d.unit||'шт',qty:0,min:d.min==null||d.min===''?null:+d.min,place:d.place||'',note:d.note||'',at:now};
  const r=await S.db.collection('consItems').add(doc);await S.db.collection('consHist').add({act:'create',itemId:r.id,name:doc.name,changes:{},at:now,...me});const it={id:r.id,...doc};S.consI=[...(S.consI||[]),it];return it;}
/* --- головний екран --- */
function consView(){const out=[];const can=consCanIssue();const items=consItems();const ops=consOps();const mon=ymd(new Date()).slice(0,7);
  const live=ops.filter(consOpLive);const outs=live.filter(o=>o.kind==='issue'&&String(o.date).startsWith(mon)),ins=live.filter(o=>o.kind==='receipt'&&String(o.date).startsWith(mon));
  const {inv,last}=consInvInfo();
  out.push(el('div',{class:'cs-bar'},can?el('button',{class:'btn',type:'button',onclick:()=>consIssue()},svg('<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 21h16"/>'),' Видати'):null,
    can?el('button',{class:'btn ghost',type:'button',onclick:()=>consReceipt('manual')},svg(IC_UP),' Надходження витратних матеріалів'):null,
    el('button',{class:'btn ghost sm',type:'button',onclick:consExportStock},svg(IC_DL),' Excel')));
  out.push(el('button',{type:'button',class:'cs-state',onclick:()=>{S.consTab='hist';render();}},el('span',{},'Інвентаризація: ',el('b',{text:inv?dm(inv.date)+'.'+inv.date.slice(0,4):'ще не було'})),
    el('span',{},'Останнє оновлення: ',el('b',{text:last?(()=>{const d=new Date(last.at);return pad(d.getDate())+'.'+pad(d.getMonth()+1)+'.'+d.getFullYear()+' '+pad(d.getHours())+':'+pad(d.getMinutes())+' · '+last.who;})():'—'})),svg('<path d="m9 6 6 6-6 6"/>')));
  const inStock=items.filter(x=>+x.qty>0),low=items.filter(consLow);
  out.push(el('div',{class:'cs-kpi'},
    el('div',{class:'card cs-k'},el('span',{text:'Позицій на складі'}),el('b',{text:String(inStock.length)}),el('small',{text:new Set(inStock.map(x=>x.cat)).size+' '+plural(new Set(inStock.map(x=>x.cat)).size,'категорія','категорії','категорій')})),
    el('button',{type:'button',class:'card cs-k'+(low.length?' bad':''),'aria-pressed':String(S.consStF==='low'),onclick:()=>{S.consTab='stock';S.consStF=S.consStF==='low'?'all':'low';render();}},el('span',{text:'Закінчуються'}),el('b',{text:String(low.length)}),el('small',{text:low.length?'натисніть, щоб показати':'усе в нормі'})),
    el('div',{class:'card cs-k'},el('span',{text:'Видач за '+MON_NOM[new Date().getMonth()].toLowerCase()}),el('b',{text:String(outs.length)}),el('small',{text:new Set(outs.map(o=>o.toId||o.toText)).size+' '+plural(new Set(outs.map(o=>o.toId||o.toText)).size,'працівник','працівники','працівників')})),
    el('div',{class:'card cs-k'},el('span',{text:'Надходжень за місяць'}),el('b',{text:String(ins.length)}),el('small',{text:ins.length?'останнє '+dm(ins[0].date):'—'}))));
  const T=S.consTab||'stock';
  out.push(el('div',{class:'sg cs-tabs',role:'tablist'},[['stock','Наявність'],['log','Журнал операцій'],['rep','Звіт витрат'],['hist','Історія змін']].map(([k,l])=>el('button',{type:'button',role:'tab','aria-pressed':String(T===k),'aria-selected':String(T===k),onclick:()=>{S.consTab=k;render();}},l))));
  if(T==='log')return out.concat(consLogView());if(T==='rep')return out.concat(consRepView());if(T==='hist')return out.concat(consHistView());
  return out.concat(consStockView(can));}
/* --- Наявність --- */
function consStockView(can){const items=consItems();
  if(!items.length)return [el('div',{class:'card empty'},el('h2',{text:'Склад ще порожній'}),el('p',{class:'muted',text:'Проведіть першу інвентаризацію з таблиці Excel або додайте позиції вручну.'}),
    can?el('div',{class:'row',style:'justify-content:center'},el('button',{class:'btn',type:'button',onclick:()=>consReceipt('table',{tmode:'inv'})},'Провести інвентаризацію'),el('button',{class:'btn ghost',type:'button',onclick:()=>consEdit(null)},'+ Позиція')):el('p',{class:'muted small',text:'Додавати матеріали можуть менеджери та Керуючий УК.'}))];
  const q=lc(S.consQ);const cat=S.consCat||'all';const stF=S.consStF||'all';
  const vis=items.filter(x=>(cat==='all'||x.cat===cat)&&(stF==='all'||consSt(x)===stF)&&(!q||lc(x.name).includes(q)));
  const qi=el('input',{type:'search',id:'csQ',placeholder:'Пошук за назвою',value:S.consQ||'','aria-label':'Пошук за назвою'});qi.addEventListener('input',()=>{S.consQ=qi.value;const p=qi.selectionStart;render();const n=document.getElementById('csQ');if(n){n.focus();n.setSelectionRange(p,p);}});
  const cs=el('select',{id:'csCatF','aria-label':'Категорія',onchange:e=>{S.consCat=e.target.value;render();}},el('option',{value:'all',text:'Усі категорії'}),CONS_CATS.map(c=>el('option',{value:c[0],selected:cat===c[0]?true:null,text:c[2]+' '+c[1]})));
  const ss=el('select',{id:'csStF','aria-label':'Статус',onchange:e=>{S.consStF=e.target.value;render();}},el('option',{value:'all',text:'Усі статуси'}),Object.entries(CONS_ST).map(([k,v])=>el('option',{value:k,selected:stF===k?true:null,text:v[0]})));
  const last=x=>x.lastOpDate?dm(x.lastOpDate)+'.'+x.lastOpDate.slice(0,4):'—';
  const rows=vis.map(x=>{const c=consCat(x.cat);const st=CONS_ST[consSt(x)];const open=()=>consItemSheet(x.id);
    return el('tr',{tabindex:'0',onclick:open,onkeydown:e=>{if(e.key==='Enter')open();}},el('td',{},el('b',{text:x.name}),x.place?el('small',{class:'muted',text:x.place}):null),el('td',{text:c[2]+' '+c[1]}),el('td',{text:x.unit}),
      el('td',{class:'num'},el('b',{text:cq(x.qty)})),el('td',{class:'num muted',text:x.min==null||x.min===''?'—':cq(x.min)}),el('td',{},el('span',{class:'cs-st '+st[1],text:st[0]})),el('td',{class:'muted',text:last(x)}));});
  return [el('div',{class:'cs-filt'},qi,cs,ss),
    vis.length?el('div',{class:'card cs-tw'},el('div',{class:'tbl-x'},el('table',{class:'cs-tbl'},el('thead',{},el('tr',{},['Назва','Категорія','Од. виміру','Залишок','Мін. залишок','Статус','Остання операція'].map(h=>el('th',{scope:'col',text:h})))),el('tbody',{},rows))),
      el('div',{class:'cs-cards'},vis.map(x=>{const st=CONS_ST[consSt(x)];return el('button',{type:'button',class:'cs-cr',onclick:()=>consItemSheet(x.id)},el('span',{class:'cs-crn'},el('b',{text:x.name}),el('small',{class:'muted',text:consCat(x.cat)[1]+' · '+last(x)})),el('span',{class:'cs-crq'},el('b',{text:cq(x.qty)+' '+x.unit}),el('span',{class:'cs-st '+st[1],text:st[0]})));})))
    :el('div',{class:'card empty'},el('p',{class:'muted',text:'Нічого не знайдено. Змініть пошук або фільтри.'}),el('button',{class:'btn ghost sm',type:'button',onclick:()=>{S.consQ='';S.consCat='all';S.consStF='all';render();}},'Скинути фільтри'))];}
/* --- картка позиції --- */
function consItemSheet(id){const x=consItem(id);if(!x)return;const can=consCanIssue();const st=CONS_ST[consSt(x)];const c=consCat(x.cat);
  const ops=consOps().filter(o=>(o.lines||[]).some(l=>l.itemId===id));
  openSheet(el('div',{class:'cs-ish'},el('span',{class:'cs-ic',text:c[2]}),el('div',{style:'flex:1;min-width:0'},el('h2',{text:x.name}),el('span',{class:'muted small',text:c[1]+(x.place?' · '+x.place:'')}))),
    el('div',{class:'cs-ibig'},el('b',{text:cq(x.qty)}),el('span',{text:x.unit}),el('span',{class:'cs-st '+st[1],text:st[0]}),x.min!=null&&x.min!==''?el('small',{class:'muted',text:'мін. залишок '+cq(x.min)+' '+x.unit}):null),
    x.note?el('p',{class:'muted small',style:'margin:0',text:x.note}):null,
    can?el('div',{class:'btn-pair'},el('button',{class:'btn',type:'button',disabled:+x.qty>0?null:true,onclick:()=>{closeSheet();consIssue(id);}},'Видати'),el('button',{class:'btn ghost',type:'button',onclick:()=>{closeSheet();consReceipt('adjust',{itemId:id});}},'Коригувати')):null,
    can?el('button',{class:'btn ghost sm',type:'button',onclick:()=>{closeSheet();consEdit(x);}},'Редагувати дані позиції'):null,
    el('h3',{class:'mz-sub',text:'Історія руху · '+ops.length}),
    ops.length?el('div',{class:'cs-mv'},ops.map(o=>{const l=o.lines.find(q=>q.itemId===id);const k=CONS_KIND[o.kind]||['',''];
      return el('button',{type:'button',class:'cs-mvr'+(o.storno?' sto':''),onclick:()=>{closeSheet();consOpSheet(o.id);}},el('span',{class:'cs-jd',text:consDT(o)}),el('span',{class:'cs-b '+k[1],text:k[0]}),el('span',{class:'cs-mvw muted small',text:o.kind==='issue'?('→ '+consToLabel(o)):o.src&&o.src.doc?o.src.doc:(o.reason||o.note||'')}),el('b',{class:'num',text:(l.delta>0?'+':'')+cq(l.delta)+' '+x.unit}));}))
    :el('p',{class:'muted small',style:'margin:0',text:'Операцій з цією позицією ще не було.'}));}
/* --- позиція: створити / редагувати (без зміни кількості — лише через операції) --- */
function consEdit(x,after){const isNew=!x;x=x||{unit:'шт',cat:''};
  const nm=el('input',{id:'csN',value:x.name||'',placeholder:'напр. Пакети 120 л'});const ct=el('select',{id:'csC'},CONS_CATS.map(c=>el('option',{value:c[0],selected:(x.cat||'')===c[0]?true:null,text:c[2]+' '+c[1]})));
  if(isNew)nm.addEventListener('input',()=>{ct.value=consGuessCat(nm.value);});
  const un=el('select',{id:'csU'},[...new Set([...CONS_UNITS,x.unit])].map(u=>el('option',{value:u,selected:x.unit===u?true:null,text:u})));
  const mn=el('input',{id:'csM',inputmode:'decimal',value:x.min==null?'':String(x.min).replace('.',','),placeholder:'необов’язково'});
  const pl=el('input',{id:'csP',value:x.place||'',placeholder:'напр. Склад Буд. 2'});const nt=el('input',{id:'csNt',value:x.note||'',placeholder:'необов’язково'});
  const q0=isNew?el('input',{id:'csQ0',inputmode:'decimal',placeholder:'0'}):null;
  openSheet(el('h2',{text:isNew?'Нова позиція':'Дані позиції'}),el('label',{for:'csN'},'Назва',nm),el('div',{class:'grid2'},el('label',{for:'csC'},'Категорія',ct),el('label',{for:'csU'},'Одиниця виміру',un)),
    el('div',{class:'grid2'},el('label',{for:'csM'},'Мінімальний залишок',mn),el('label',{for:'csP'},'Місце зберігання',pl)),el('label',{for:'csNt'},'Примітка',nt),
    isNew?el('label',{for:'csQ0'},'Початковий залишок (запишеться як надходження)',q0):el('p',{class:'muted small',style:'margin:0',text:'Кількість тут не змінюється — для цього є «Коригування» або «Надходження».'}),
    el('div',{class:'row'},el('button',{class:'btn',type:'button',style:'flex:1',onclick:async()=>{const n=nm.value.trim();if(!n){toast('Вкажіть назву');nm.focus();return;}
      const dup=(S.consI||[]).find(y=>y.id!==x.id&&NM.key(y.name)===NM.key(n));if(dup){toast('Така позиція вже є: '+dup.name);return;}
      const m=mn.value.trim()===''?null:consNum(mn.value);if(mn.value.trim()&&m==null){toast('Мінімальний залишок — число');mn.focus();return;}
      const d={name:n,cat:ct.value,unit:un.value,min:m,place:pl.value.trim(),note:nt.value.trim()};closeSheet();
      await write(async()=>{if(isNew){const it=await consNewItem(d);const q=consNum(q0.value);if(q>0)await consCommit({kind:'receipt',src:{t:'manual'},lines:[{itemId:it.id,delta:q}],date:ymd(new Date()),time:consNowHM(),note:'початковий залишок'},{[it.id]:it});if(after)after(it);}
        else{const ch={};for(const k of ['name','cat','unit','min','place','note']){const a=x[k]==null?'':x[k],b=d[k]==null?'':d[k];if(String(a)!==String(b))ch[k]=[x[k]==null?null:x[k],d[k]];}if(!Object.keys(ch).length)return;
          await S.db.doc('consItems/'+x.id).update(d);await S.db.collection('consHist').add({act:'edit',itemId:x.id,name:n,changes:ch,at:Date.now(),...consMe()});}},isNew?'Позицію додано':'Збережено');}},isNew?'Додати позицію':'Зберегти'),
      !isNew?el('button',{class:'btn danger',type:'button',onclick:()=>{if(+x.qty>0){toast('Спершу спишіть або скоригуйте залишок до 0');return;}confirmSheet('Видалити позицію «'+x.name+'»? Журнал операцій збережеться.','Видалити позицію',()=>write(async()=>{await S.db.doc('consItems/'+x.id).delete();await S.db.collection('consHist').add({act:'delete',itemId:x.id,name:x.name,changes:{},at:Date.now(),...consMe()});},'Позицію видалено'));}},'Видалити'):null),
    el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'));if(!IS_TOUCH)nm.focus();}
/* --- пошук позиції: поле з підказками --- */
function consPicker(id,val,onPick,opts){opts=opts||{};const dl='dl-'+id;const inp=el('input',{id,list:dl,value:val?((consItem(val)||{}).name||''):'',placeholder:opts.ph||'Почніть вводити назву',autocomplete:'off'});
  const list=el('datalist',{id:dl},consItems().filter(x=>!opts.inStock||+x.qty>0).map(x=>el('option',{value:x.name,label:cq(x.qty)+' '+x.unit})));
  const pick=()=>{const v=inp.value.trim();const it=(S.consI||[]).find(x=>lc(x.name)===lc(v));onPick(it?it.id:'',v);};inp.addEventListener('change',pick);inp.addEventListener('input',()=>{const it=(S.consI||[]).find(x=>lc(x.name)===lc(inp.value.trim()));if(it)onPick(it.id,inp.value.trim());else onPick('',inp.value.trim(),true);});
  return [inp,list];}
/* --- Видати / Списати --- */
function consIssue(pre){if(!consCanIssue()){toast('Видавати можуть менеджери та Керуючий УК');return;}const items=consItems();if(!items.some(x=>+x.qty>0)){toast('На складі немає матеріалів');return;}
  const me=myStaff();const st={kind:'issue',lines:[{id:pre||'',qty:''}]};const errs=new Map();
  const box=el('div',{class:'stack',style:'gap:8px'});
  const okBtn=el('button',{class:'btn',type:'button',style:'flex:1'});
  const validate=()=>{let bad=false;st.lines.forEach((l,i)=>{const it=consItem(l.id);const v=consNum(l.qty);const e=errs.get(i);let msg='';if(l.id&&l.qty!==''&&!(v>0))msg='Кількість має бути більшою за 0';else if(it&&v>+it.qty)msg='На складі лише '+cq(it.qty)+' '+it.unit;if(e)e.textContent=msg;if(msg)bad=true;});
    const any=st.lines.some(l=>l.id&&consNum(l.qty)>0);okBtn.disabled=bad||!any?true:null;return !bad&&any;};
  const draw=()=>{errs.clear();box.replaceChildren(...st.lines.map((l,i)=>{const it=consItem(l.id);const [inp,dl]=consPicker('csIt'+i,l.id,(id)=>{l.id=id;const n=document.getElementById('csStk'+i);const u=document.getElementById('csUn'+i);const x=consItem(id);if(n)n.textContent=x?'на складі '+cq(x.qty)+' '+x.unit:'';if(u)u.textContent=x?x.unit:'';validate();},{inStock:true});
      const qi=el('input',{type:'text',inputmode:'decimal',id:'csQt'+i,value:l.qty,placeholder:'0','aria-label':'Кількість',oninput:e=>{l.qty=e.target.value;validate();}});const er=el('small',{class:'cs-err',role:'alert'});errs.set(i,er);
      return el('div',{class:'cs-line'},el('label',{for:'csIt'+i,class:'cs-ll'},'Позиція '+(st.lines.length>1?i+1:''),inp,dl),el('div',{class:'cs-qrow'},el('label',{for:'csQt'+i,class:'sr-only'},'Кількість'),qi,el('span',{id:'csUn'+i,class:'muted',text:it?it.unit:''}),el('small',{id:'csStk'+i,class:'muted',text:it?'на складі '+cq(it.qty)+' '+it.unit:''}),
        st.lines.length>1?el('button',{type:'button',class:'cs-jx','aria-label':'Прибрати рядок',onclick:()=>{st.lines.splice(i,1);draw();}},'×'):null),er);}),
    el('button',{type:'button',class:'btn ghost sm',onclick:()=>{st.lines.push({id:'',qty:''});draw();const n=document.getElementById('csIt'+(st.lines.length-1));if(n)n.focus();}},'+ ще позиція'));validate();};
  const staff=sortedStaff();
  const by=el('select',{id:'csBy'},staff.map(s=>el('option',{value:s.id,selected:me&&me.id===s.id?true:null,text:s.name})));if(!me)by.prepend(el('option',{value:'',text:'— оберіть —',selected:true}));
  const to=el('select',{id:'csTo'},el('option',{value:'',text:'— оберіть отримувача —'}),staff.map(s=>el('option',{value:s.id,text:s.name+(s.role?' · '+(ROLE_NAME[s.role]||''):'')})),el('option',{value:'__other',text:'Інша особа / підрядник'}));
  const toT=el('input',{id:'csToT',placeholder:'ПІБ або назва підрядника',hidden:true});to.addEventListener('change',()=>{toT.hidden=to.value!=='__other';if(!toT.hidden)toT.focus();});
  const today=ymd(new Date());const date=el('input',{type:'date',id:'csDate',value:today,max:today});const time=el('input',{type:'time',id:'csTime',value:consNowHM()});
  const bld=el('select',{id:'csBld'},el('option',{value:'',text:'— не вказано —'}),consPlaces().map(p=>el('option',{value:p,text:p})));
  const pur=el('select',{id:'csPur'},el('option',{value:'',text:'— не вказано —'}),CONS_PURPOSE.map(p=>el('option',{value:p,text:p})));
  const lk=el('select',{id:'csLink'},el('option',{value:'',text:'— не пов’язано —'}),
    el('optgroup',{label:'Задачі'},(S.tasks||[]).filter(t=>!isDone(t)).slice(0,40).map(t=>el('option',{value:'task|'+t.id,text:t.title}))),
    el('optgroup',{label:'Планове ТО'},(S.pm||[]).slice(0,40).map(x=>el('option',{value:'pm|'+x.id,text:x.title||x.name||'ТО'}))),
    el('optgroup',{label:'Екстрені ситуації'},(S.sos||[]).filter(x=>x.status!=='done').slice(0,40).map(x=>el('option',{value:'sos|'+x.id,text:x.title||x.text||x.desc||'Ситуація'}))));
  const note=el('input',{id:'csNote',placeholder:'необов’язково'});
  const kindSeg=el('div',{class:'sg',role:'radiogroup','aria-label':'Тип операції'});
  const toWrap=el('div',{class:'stack',style:'gap:8px'},el('label',{for:'csTo'},'Кому видано (обов’язково)',to),toT);
  const drawKind=()=>{kindSeg.replaceChildren(...[['issue','Видача'],['writeoff','Списання']].map(([k,l])=>el('button',{type:'button',role:'radio','aria-checked':String(st.kind===k),'aria-pressed':String(st.kind===k),onclick:()=>{st.kind=k;drawKind();}},l)));
    toWrap.hidden=st.kind!=='issue';okBtn.textContent=st.kind==='issue'?'Видати':'Списати';hint.textContent=st.kind==='writeoff'?'Списання — брак, псування, прострочення. Без отримувача.':'';};
  const hint=el('p',{class:'muted small',style:'margin:0'});
  okBtn.onclick=async()=>{if(!validate()){toast('Перевірте позиції та кількості');return;}
    if(st.kind==='issue'&&!to.value){toast('Вкажіть, кому видано');to.focus();return;}if(st.kind==='issue'&&to.value==='__other'&&!toT.value.trim()){toast('Вкажіть ім’я отримувача');toT.focus();return;}
    if(date.value>today){toast('Дата не може бути в майбутньому');date.focus();return;}if(!by.value){toast('Вкажіть, ким видано');by.focus();return;}
    const sum={};st.lines.filter(l=>l.id&&consNum(l.qty)>0).forEach(l=>sum[l.id]=cr((sum[l.id]||0)+consNum(l.qty)));
    const over=Object.entries(sum).find(([id,q])=>q>+(consItem(id)||{}).qty);if(over){const it=consItem(over[0]);toast('На складі лише '+cq(it.qty)+' '+it.unit+': '+it.name);return;}
    const lv=lk.value?lk.value.split('|'):null;const lt=lk.selectedOptions[0]?lk.selectedOptions[0].textContent:'';
    const op={kind:st.kind,src:{t:'manual'},lines:Object.entries(sum).map(([id,q])=>({itemId:id,delta:-q})),byId:by.value,toId:st.kind==='issue'&&to.value!=='__other'?to.value:null,toText:st.kind==='issue'&&to.value==='__other'?toT.value.trim():'',
      bld:bld.value||'',purpose:pur.value||'',link:lv?{t:lv[0],id:lv[1],title:lt}:null,note:note.value.trim(),date:date.value||today,time:time.value||consNowHM()};
    closeSheet();let res=null;
    await write(async()=>{res=await consCommit(op);},null);
    if(res){consToast((st.kind==='issue'?'Видано':'Списано')+': '+res.lines.length+' '+plural(res.lines.length,'позиція','позиції','позицій'),res.id);
      const lows=res.lines.map(l=>({l,it:consItem(l.itemId)})).filter(({l,it})=>it&&it.min!=null&&it.min!==''&&l.after<=+it.min);
      if(lows.length)setTimeout(()=>toast(lows.map(({l,it})=>it.name+' закінчується: залишилось '+cq(l.after)+' '+it.unit).join(' · ')),2600);}};
  draw();drawKind();
  openSheet(el('h2',{text:'Видати матеріали'}),kindSeg,hint,box,toWrap,
    el('div',{class:'grid2'},el('label',{for:'csDate'},'Дата видачі',date),el('label',{for:'csTime'},'Час',time)),
    el('label',{for:'csBy'},'Ким видано',by),
    el('div',{class:'grid2'},el('label',{for:'csBld'},'Будинок / локація',bld),el('label',{for:'csPur'},'Призначення',pur)),
    el('label',{for:'csLink'},'Пов’язати з',lk),el('label',{for:'csNote'},'Коментар',note),
    el('p',{class:'muted small',style:'margin:0',text:'Час внесення в систему фіксується автоматично.'}),
    el('div',{class:'row'},okBtn,el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати')));}
/* --- Надходження: ручне внесення / коригування / з таблиці / з накладної --- */
const CONS_RMODES=[['manual','Ручне внесення'],['adjust','Ручне коригування'],['table','З таблиці'],['invoice','З накладної']];
function consReceipt(mode,pre){if(!consCanIssue()){toast('Надходження вносять менеджери та Керуючий УК');return;}pre=pre||{};const seg=el('div',{class:'sg cs-rseg',role:'tablist'});const body=el('div',{class:'stack',style:'gap:12px'});
  const go=m=>{mode=m;seg.replaceChildren(...CONS_RMODES.map(([k,l])=>el('button',{type:'button',role:'tab','aria-pressed':String(mode===k),onclick:()=>go(k)},l)));body.replaceChildren(...[].concat(m==='manual'?consRManual():m==='adjust'?consRAdjust(pre.itemId):m==='table'?consRTable(pre.tmode):consRInvoice()));fancySel(body);};
  openSheet(el('h2',{text:'Надходження витратних матеріалів'}),seg,body);const sh=document.querySelector('#sheetRoot .sheet');if(sh)sh.classList.add('cs-wide');go(mode||'manual');}
function consRManual(){const rows=[{id:'',name:'',qty:'',cat:'',unit:'шт'}];const box=el('div',{class:'stack',style:'gap:8px'});const today=ymd(new Date());
  const draw=()=>{box.replaceChildren(...rows.map((r,i)=>{const it=consItem(r.id);const [inp,dl]=consPicker('crIt'+i,r.id,(id,txt,typing)=>{r.id=id;r.name=txt;if(!typing||id)draw();else{const n=document.getElementById('crNew'+i);if(n)n.hidden=!txt||!!id;}},{});
      if(!r.id&&r.name)inp.value=r.name;
      const qi=el('input',{inputmode:'decimal',id:'crQ'+i,value:r.qty,placeholder:'0',oninput:e=>{r.qty=e.target.value;}});
      const ct=el('select',{id:'crC'+i,'aria-label':'Категорія нової позиції',onchange:e=>{r.cat=e.target.value;}},CONS_CATS.map(c=>el('option',{value:c[0],selected:(r.cat||consGuessCat(r.name))===c[0]?true:null,text:c[2]+' '+c[1]})));
      const un=el('select',{id:'crU'+i,'aria-label':'Одиниця нової позиції',onchange:e=>{r.unit=e.target.value;}},CONS_UNITS.map(u=>el('option',{value:u,selected:r.unit===u?true:null,text:u})));
      return el('div',{class:'cs-line'},el('label',{for:'crIt'+i,class:'cs-ll'},'Позиція',inp,dl),el('div',{class:'cs-qrow'},el('label',{for:'crQ'+i,class:'sr-only'},'Кількість'),qi,el('span',{class:'muted',text:it?it.unit:r.unit}),it?el('small',{class:'muted',text:'зараз '+cq(it.qty)+' '+it.unit}):null,
          rows.length>1?el('button',{type:'button',class:'cs-jx','aria-label':'Прибрати рядок',onclick:()=>{rows.splice(i,1);draw();}},'×'):null),
        el('div',{id:'crNew'+i,class:'cs-new',hidden:!!(it||!r.name)},el('span',{class:'cs-b new',text:'Нова позиція'}),ct,un));}),
    el('button',{type:'button',class:'btn ghost sm',onclick:()=>{rows.push({id:'',name:'',qty:'',cat:'',unit:'шт'});draw();}},'+ ще позиція'));};
  draw();const date=el('input',{type:'date',id:'crD',value:today,max:today});const sup=el('input',{id:'crS',placeholder:'необов’язково'});const note=el('input',{id:'crN',placeholder:'необов’язково'});
  return [el('p',{class:'muted small',style:'margin:0',text:'Прихід без документа. Оберіть наявну позицію або введіть нову назву — її буде створено.'}),box,
    el('div',{class:'grid2'},el('label',{for:'crD'},'Дата',date),el('label',{for:'crS'},'Постачальник',sup)),el('label',{for:'crN'},'Коментар',note),
    el('div',{class:'row'},el('button',{class:'btn',type:'button',style:'flex:1',onclick:async()=>{const ok=rows.filter(r=>(r.id||r.name.trim())&&consNum(r.qty)>0);if(!ok.length){toast('Вкажіть позицію і кількість');return;}
      if(rows.some(r=>(r.id||r.name.trim())&&r.qty!==''&&!(consNum(r.qty)>0))){toast('Кількість має бути більшою за 0');return;}closeSheet();let res=null;
      await write(async()=>{const its={};const lines=[];for(const r of ok){let it=consItem(r.id);if(!it)it=(S.consI||[]).find(x=>lc(x.name)===lc(r.name.trim()))||await consNewItem({name:r.name,cat:r.cat||consGuessCat(r.name),unit:r.unit});its[it.id]=it;lines.push({itemId:it.id,delta:consNum(r.qty)});}
        res=await consCommit({kind:'receipt',src:{t:'manual',supplier:sup.value.trim()},lines,date:date.value||today,time:consNowHM(),note:note.value.trim()},its);},null);
      if(res)consToast('Оновлено '+res.lines.length+' '+plural(res.lines.length,'позицію','позиції','позицій'),res.id);}},'Внести надходження'),el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'))];}
function consRAdjust(pre){let id=pre||'';const was=el('output',{id:'caW',class:'cs-out'});const now=el('input',{id:'caN',inputmode:'decimal',placeholder:'0'});const diff=el('output',{id:'caD',class:'cs-out'});
  const upd=()=>{const it=consItem(id);was.textContent=it?cq(it.qty)+' '+it.unit:'—';const v=consNum(now.value);diff.textContent=it&&v!=null?((v-it.qty>0?'+':'')+cq(v-(+it.qty||0))+' '+it.unit):'—';diff.className='cs-out '+(it&&v!=null?(v>it.qty?'up':v<it.qty?'down':''):'');};
  now.addEventListener('input',upd);const [inp,dl]=consPicker('caIt',id,i=>{id=i;const it=consItem(i);if(it&&now.value==='')now.value=String(it.qty).replace('.',',');upd();});
  const rs=el('select',{id:'caR'},el('option',{value:'',text:'— оберіть причину —'}),CONS_REASONS.map(r=>el('option',{value:r,text:r})));const note=el('input',{id:'caC',placeholder:'що саме сталося'});
  setTimeout(upd,0);if(id){const it=consItem(id);if(it)now.value=String(it.qty).replace('.',',');}
  return [el('p',{class:'muted small',style:'margin:0',text:'Виправлення залишку. «Було» підставляється, вкажіть фактичне «Стало».'}),el('label',{for:'caIt'},'Позиція',inp,dl),
    el('div',{class:'cs-adj'},el('div',{},el('span',{class:'muted small',text:'Було'}),was),el('label',{for:'caN'},'Стало',now),el('div',{},el('span',{class:'muted small',text:'Різниця'}),diff)),
    el('label',{for:'caR'},'Причина (обов’язково)',rs),el('label',{for:'caC'},'Коментар',note),
    el('div',{class:'row'},el('button',{class:'btn',type:'button',style:'flex:1',onclick:async()=>{const it=consItem(id);if(!it){toast('Оберіть позицію');return;}const v=consNum(now.value);if(v==null||v<0){toast('Вкажіть фактичний залишок (0 або більше)');now.focus();return;}
      if(!rs.value){toast('Оберіть причину коригування');rs.focus();return;}if(rs.value==='Інше'&&!note.value.trim()){toast('Для «Інше» опишіть причину в коментарі');note.focus();return;}if(v===cr(it.qty)){toast('Залишок не змінився');return;}
      closeSheet();let res=null;await write(async()=>{res=await consCommit({kind:'adjust',src:{t:'manual'},lines:[{itemId:it.id,set:v,delta:0}],reason:rs.value,note:note.value.trim(),date:ymd(new Date()),time:consNowHM()});},null);
      if(res)consToast('Залишок скориговано: '+it.name,res.id);}},'Скоригувати'),el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'))];}
/* таблиця: розпізнавання колонок; ціни/суми ігноруються */
const CONS_COLS={n:/(найменуван|назва|товар|номенклатур|матеріал|позиці)/i,q:/^(к-?сть|кількість|кіл-?ть|кол-?во|qty|залишок|факт|кількість факт)/i,u:/^(од\.?|одиниц|од\. ?вим|ед|unit)/i,c:/^(категор|група|тип)/i,price:/(ціна|цена|price|сума|сумма|вартість|грн|uah|ндс|пдв)/i};
function consDetect(a){for(let i=0;i<Math.min(a.length,40);i++){const R=(a[i]||[]).map(v=>v==null?'':String(v).trim());const c={};R.forEach((v,j)=>{if(CONS_COLS.price.test(v))return;for(const k of ['n','q','u','c'])if(c[k]==null&&CONS_COLS[k].test(v)){c[k]=j;break;}});if(c.n!=null&&c.q!=null)return {hr:i,c,head:R};}return {hr:-1,c:{},head:(a[0]||[]).map(v=>v==null?'':String(v))};}
function consRTable(tm){let tmode=tm||'inv';const area=el('div',{class:'stack',style:'gap:10px'});
  const modeSeg=el('div',{class:'cs-tm',role:'radiogroup','aria-label':'Режим'});const dm_=()=>{modeSeg.replaceChildren(...[['inv','Інвентаризація — встановити фактичні залишки','Кількість у файлі стане новим залишком'],['add','Прихід — додати до залишків','Кількість у файлі додасться до наявної']].map(([k,l,d])=>el('button',{type:'button',role:'radio','aria-checked':String(tmode===k),class:'cs-tmo','aria-pressed':String(tmode===k),onclick:()=>{tmode=k;dm_();}},el('b',{text:l}),el('small',{class:'muted',text:d}))));};dm_();
  const pickBtn=el('button',{class:'btn',type:'button',onclick:async()=>{const f=await xlsxPick();if(!f)return;const {wb,X}=f;const a=sheetAoa(X,wb.Sheets[wb.SheetNames[0]]);const det=consDetect(a);consMapStep(area,a,det,f.name,()=>tmode);}},svg(IC_UP),' Обрати файл Excel або CSV');
  return [modeSeg,el('p',{class:'muted small',style:'margin:0',text:'Колонки: назва, кількість, одиниця, категорія. Ціни й суми у файлі ігноруються. Нічого не запишеться до «Застосувати».'}),pickBtn,area];}
function consMapStep(area,a,det,fname,getMode){const cols=Math.max(...a.slice(0,50).map(r=>(r||[]).length),1);let hr=det.hr<0?0:det.hr;const C={...det.c};const head=(a[hr]||[]).map((v,j)=>v==null||v===''?'Колонка '+(j+1):String(v));
  const sel=(k,l,req)=>{const s=el('select',{id:'cm'+k},req?null:el('option',{value:'',text:'— немає —'}),Array.from({length:cols},(_,j)=>el('option',{value:String(j),selected:C[k]===j?true:null,disabled:CONS_COLS.price.test(head[j]||'')?true:null,text:head[j]||('Колонка '+(j+1))})));s.addEventListener('change',()=>{C[k]=s.value===''?null:+s.value;});if(C[k]==null&&req)C[k]=+s.value;return el('label',{for:'cm'+k},l,s);};
  const auto=det.hr>=0;
  area.replaceChildren(el('div',{class:'card cs-map'},el('b',{text:'Файл: '+fname}),el('span',{class:'muted small',text:auto?'Колонки визначено автоматично. За потреби змініть.':'Не вдалося визначити колонки. Оберіть їх вручну.'}),
    el('div',{class:'grid2'},sel('n','Назва',true),sel('q','Кількість',true),sel('u','Одиниця',false),sel('c','Категорія',false)),
    el('button',{class:'btn',type:'button',onclick:()=>{if(C.n==null||C.q==null){toast('Оберіть колонки «Назва» і «Кількість»');return;}
      const rows=[];for(let i=hr+1;i<a.length;i++){const R=a[i]||[];const n=R[C.n]==null?'':String(R[C.n]).replace(/\s+/g,' ').trim();if(!n)continue;if(/^(разом|всього|усього|итого)/i.test(n))break;
        rows.push({name:n.replace(/^\d+[.)]\s*/,''),qty:consNum(R[C.q]),unit:C.u!=null&&R[C.u]!=null?String(R[C.u]).trim().replace(/\.$/,''):'',cat:C.c!=null&&R[C.c]!=null?String(R[C.c]).trim():''});}
      if(!rows.length){toast('У файлі немає рядків з назвами');return;}consPreview({rows,mode:getMode(),src:{t:'table',file:fname,mode:getMode()}});}},'Далі: попередній перегляд')));}
function consRInvoice(){const pick=el('button',{class:'btn',type:'button',onclick:consInvoice},svg(IC_UP),' Обрати накладну (Excel)');
  return [el('p',{class:'muted small',style:'margin:0',text:'З накладної беруться лише назви, кількості й одиниці. Ціни та суми ігноруються. Схожі назви зіставляються з наявними позиціями.'}),pick];}
function consParseInvoice(a){const t=v=>v==null?'':String(v instanceof Date?ymd(v):v).replace(/\s+/g,' ').trim();const det=consDetect(a);if(det.hr<0)throw new Error('Не знайдено колонки «Найменування» і «Кількість»');const C=det.c,hr=det.hr;
  const head=a.slice(0,hr).map(R=>(R||[]).map(t).join(' ')).join(' ');const m=head.match(/(?:накладна|№)\s*[№#]?\s*([\w\/-]+).*?від\s*(\d{1,2})\.(\d{1,2})\.(\d{2,4})/i);
  const doc=m?('№'+m[1]+' від '+m[2].padStart(2,'0')+'.'+m[3].padStart(2,'0')+'.'+m[4]):'';const date=m?(m[4].length===2?'20'+m[4]:m[4])+'-'+m[3].padStart(2,'0')+'-'+m[2].padStart(2,'0'):null;
  const rows=[];for(let i=hr+1;i<a.length;i++){const R=a[i]||[];const n=t(R[C.n]);if(/^(разом|всього|усього|итого|сума)/i.test(n))break;const q=consNum(R[C.q]);if(!n)continue;rows.push({name:n.replace(/^\d+[.)]\s*/,''),qty:q,unit:C.u!=null?t(R[C.u]).replace(/\.$/,''):''});}
  return {doc,date,rows};}
async function consInvoice(){const f=await xlsxPick();if(!f)return;const {wb,X}=f;let P=null,err='';
  for(const nm of wb.SheetNames){try{const r=consParseInvoice(sheetAoa(X,wb.Sheets[nm]));if(r.rows.length){P=r;break;}}catch(e){err=e.message;}}
  if(!P){toast(err||'У накладній не знайдено позицій');return;}consPreview({rows:P.rows,mode:'add',src:{t:'invoice',file:f.name,doc:P.doc,docDate:P.date},date:P.date});}
function consMatch(name){const items=S.consI||[];const k=NM.key(name);const ex=items.find(x=>NM.key(x.name)===k);if(ex)return {it:ex,s:1};
  const al=(S.consAl||{})[k];if(al){const it=items.find(x=>x.id===al);if(it)return {it,s:1};}
  const sc=items.map(x=>({it:x,s:NM.score(name,x.name)})).sort((a,b)=>b.s-a.s);return sc[0]&&sc[0].s>=.88?sc[0]:{it:null,s:sc[0]?sc[0].s:0,alt:sc[0]&&sc[0].s>=.7?sc[0].it:null};}
const consUnitKey=u=>{const s=lc(u).replace(/\.$/,'');return ({'штук':'шт','шт.':'шт','літр':'л','літрів':'л','кілограм':'кг','упаковка':'уп','упак':'уп','рул':'рулон','рулони':'рулон','пачок':'пачка','пачки':'пачка','пар':'пара','пари':'пара','мішки':'мішок','мішків':'мішок','метр':'м','м.':'м'})[s]||s;};
/* попередній перегляд перед застосуванням (таблиця / накладна) */
async function consPreview(P){try{const sn=await S.db.doc('resolve/cons').get();S.consAl=sn.exists?(sn.data().map||{}):{};}catch(e){S.consAl={};}
  const inv=P.mode==='inv';const R=P.rows.map(r=>{const m=consMatch(r.name);return {...r,pick:m.it?m.it.id:(m.alt?m.alt.id:'__new'),sug:!m.it&&!!m.alt,on:true};});
  const missing=inv?consItems().filter(x=>!R.some(r=>r.pick===x.id)&&+x.qty!==0).map(x=>({it:x,zero:false})):[];
  const tbl=el('div',{class:'cs-pv'});const sumEl=el('p',{class:'muted small',style:'margin:0'});
  const rowSt=r=>{const it=consItem(r.pick);const bad=!(r.qty!=null&&r.qty>=0&&(inv||r.qty>0));const unitBad=it&&r.unit&&consUnitKey(r.unit)!==consUnitKey(it.unit);return {it,bad,unitBad};};
  const draw=()=>{let nNew=0,nMatch=0,nBad=0;
    tbl.replaceChildren(el('div',{class:'cs-pvh'},['','Позиція у файлі','Зіставлено з','Було','Стане','Різниця'].map(h=>el('span',{text:h}))),...R.map((r,i)=>{const {it,bad,unitBad}=rowSt(r);const isNew=r.pick==='__new';
      const was=it?+it.qty:0;const will=bad?null:(inv?r.qty:cr(was+r.qty));const diff=will==null?null:cr(will-was);
      if(r.on){if(bad||unitBad)nBad++;else if(isNew)nNew++;else nMatch++;}
      const sel=el('select',{'aria-label':'Зіставлення для '+r.name,onchange:e=>{r.pick=e.target.value;r.sug=false;draw();}},el('option',{value:'__new',selected:isNew?true:null,text:'+ Нова позиція'}),consItems().map(x=>el('option',{value:x.id,selected:r.pick===x.id?true:null,text:x.name+' ('+x.unit+')'})));
      const qi=el('input',{inputmode:'decimal','aria-label':'Кількість для '+r.name,value:r.qty==null?'':String(r.qty).replace('.',','),oninput:e=>{r.qty=consNum(e.target.value);},onchange:()=>draw()});
      const chk=el('input',{type:'checkbox','aria-label':'Враховувати рядок '+r.name,checked:r.on?true:null,onchange:e=>{r.on=e.target.checked;draw();}});
      const cls='cs-pvr'+(!r.on?' off':bad||unitBad?' warn':isNew?' new':r.sug?' sug':' ok');
      return el('div',{class:cls},chk,el('span',{class:'cs-pvn'},el('b',{text:r.name}),el('small',{class:'muted',text:(r.unit||'—')+(bad?' · кількість не розпізнано':'')+(unitBad?' · одиниця «'+r.unit+'» ≠ «'+it.unit+'»':'')+(r.sug?' · схоже, перевірте':'')})),
        el('span',{class:'cs-pvs'},sel,isNew?el('span',{class:'cs-b new',text:'нова'}):null),el('span',{class:'num',text:it?cq(was):'0'}),el('span',{class:'cs-pvq'},bad?qi:el('b',{text:cq(will)})),
        el('span',{class:'num '+(diff>0?'up':diff<0?'down':''),text:diff==null?'—':(diff>0?'+':'')+cq(diff)}));}),
      missing.length?el('div',{class:'cs-miss'},el('b',{text:'Є в системі, але немає у файлі: '+missing.length}),el('small',{class:'muted',text:'За замовчуванням залишаються як є. Позначте ті, які треба обнулити.'}),
        missing.map((m,mi)=>el('label',{class:'cs-mz',for:'csMz'+mi},el('input',{type:'checkbox',id:'csMz'+mi,checked:m.zero?true:null,onchange:e=>{m.zero=e.target.checked;draw();}}),m.it.name+' — '+cq(m.it.qty)+' '+m.it.unit+(m.zero?' → 0':' (залишити)')))):null);
    sumEl.textContent='Зіставлено: '+nMatch+' · нових позицій: '+nNew+(nBad?' · потребують уваги: '+nBad+' (виправте кількість або зніміть позначку)':'')+(missing.filter(m=>m.zero).length?' · обнулити: '+missing.filter(m=>m.zero).length:'');
    apply.disabled=nBad?true:null;};
  const apply=el('button',{class:'btn',type:'button',style:'flex:1',onclick:async()=>{const go=R.filter(r=>r.on);if(go.some(r=>{const s=rowSt(r);return s.bad||s.unitBad;})){toast('Є рядки з помилками');return;}if(!go.length&&!missing.some(m=>m.zero)){toast('Немає рядків для застосування');return;}
    closeSheet();let res=null;const al={...(S.consAl||{})};
    await write(async()=>{const its={};const lines=[];for(const r of go){let it=consItem(r.pick);
        if(!it){it=(S.consI||[]).find(x=>NM.key(x.name)===NM.key(r.name))||await consNewItem({name:r.name,cat:r.cat&&CONS_CATS.find(c=>lc(c[1])===lc(r.cat))?CONS_CATS.find(c=>lc(c[1])===lc(r.cat))[0]:consGuessCat(r.name+' '+(r.cat||'')),unit:r.unit?consUnitKey(r.unit):'шт'});}
        else if(NM.key(it.name)!==NM.key(r.name))al[NM.key(r.name)]=it.id;its[it.id]=it;
        const ex=lines.find(l=>l.itemId===it.id);if(inv){if(ex)ex.set=cr(ex.set+r.qty);else lines.push({itemId:it.id,set:r.qty,delta:0});}else{if(ex)ex.delta=cr(ex.delta+r.qty);else lines.push({itemId:it.id,delta:r.qty});}}
      for(const m of missing)if(m.zero)lines.push({itemId:m.it.id,set:0,delta:0});
      res=await consCommit({kind:inv?'inventory':'receipt',src:P.src,lines,date:P.date&&P.date<=ymd(new Date())?P.date:ymd(new Date()),time:consNowHM(),note:''},its);
      if(Object.keys(al).length!==Object.keys(S.consAl||{}).length)await S.db.doc('resolve/cons').set({map:al,at:Date.now()});},null);
    if(res)consToast((inv?'Інвентаризацію проведено. ':'')+'Оновлено '+res.lines.length+' '+plural(res.lines.length,'позицію','позиції','позицій'),res.id);}},'Застосувати');
  draw();
  openSheet(el('h2',{text:'Попередній перегляд'}),el('p',{class:'muted small',style:'margin:0',text:(P.src.t==='invoice'?'Накладна '+(P.src.doc||P.src.file):'Файл '+P.src.file)+' · '+(inv?'Інвентаризація — кількість стане новим залишком':'Прихід — кількість додасться до залишку')}),
    el('div',{class:'cs-leg'},el('span',{class:'cs-b ok',text:'зіставлено'}),el('span',{class:'cs-b new',text:'нова позиція'}),el('span',{class:'cs-b warn',text:'потребує уваги'})),tbl,sumEl,
    el('div',{class:'row'},apply,el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати')));const sh=document.querySelector('#sheetRoot .sheet');if(sh)sh.classList.add('cs-wide');}
/* --- деталі операції + сторно --- */
function consOpSheet(id){const o=(S.consO||[]).find(x=>x.id===id);if(!o){toast('Запис ще синхронізується — спробуйте за мить');return;}const k=CONS_KIND[o.kind]||['',''];
  const st=o.stornoOf&&(S.consO||[]).find(x=>x.id===o.stornoOf);const rev=o.storno&&(S.consO||[]).find(x=>x.id===o.storno.opId);
  const F=(l,v)=>v?el('div',{class:'cs-f'},el('span',{class:'muted small',text:l}),el('b',{text:v})):null;const ent=new Date(o.at);
  const srcT=o.src?(o.src.t==='table'?'таблиця «'+o.src.file+'»'+(o.src.mode==='inv'?' (інвентаризація)':''):o.src.t==='invoice'?'накладна '+(o.src.doc||o.src.file||''):o.src.t==='storno'?'сторно':'вручну'):'вручну';
  openSheet(el('div',{class:'cs-ish'},el('span',{class:'cs-b '+k[1]+' big',text:k[0]}),el('div',{style:'flex:1;min-width:0'},el('h2',{text:consDT(o)}),o.storno?el('span',{class:'cs-b st',text:'сторновано'}):null)),
    el('div',{class:'cs-fs'},F('Джерело',srcT),F('Кому видано',o.kind==='issue'?consToLabel(o):''),F('Ким видано',o.byId?consWho(o.byId):''),F('Будинок / локація',o.bld),F('Призначення',o.purpose),F('Пов’язано з',o.link?({task:'Задача',pm:'Планове ТО',sos:'Екстрена ситуація'}[o.link.t]||'')+': '+o.link.title:''),
      F('Постачальник',o.src&&o.src.supplier),F('Причина',o.reason),F('Коментар',o.note),F('Внесено в систему',pad(ent.getDate())+'.'+pad(ent.getMonth()+1)+'.'+ent.getFullYear()+' '+pad(ent.getHours())+':'+pad(ent.getMinutes())+' · '+consWho(o.authorSid,o.author)),
      o.storno?F('Сторновано',consWho(o.storno.bySid,o.storno.by)+' · '+o.storno.reason):null),
    el('div',{class:'card cs-tw'},el('table',{class:'cs-tbl cs-ol'},el('thead',{},el('tr',{},['Позиція','Було','Зміна','Стало'].map(h=>el('th',{scope:'col',text:h})))),el('tbody',{},(o.lines||[]).map(l=>el('tr',{},el('td',{text:l.name}),el('td',{class:'num',text:cq(l.before)}),el('td',{class:'num '+(l.delta>0?'up':l.delta<0?'down':''),text:(l.delta>0?'+':'')+cq(l.delta)+' '+l.unit}),el('td',{class:'num',text:cq(l.after)})))))),
    st?el('button',{class:'btn ghost sm',type:'button',onclick:()=>consOpSheet(st.id)},'Відкрити оригінал операції'):null,rev?el('button',{class:'btn ghost sm',type:'button',onclick:()=>consOpSheet(rev.id)},'Відкрити операцію сторно'):null,
    !o.storno&&o.kind!=='storno'&&consCanStorno(o)?el('button',{class:'btn danger sm',type:'button',onclick:()=>consStorno(o)},'Сторнувати'):null,
    el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Закрити'));}
function consStorno(o){const rs=el('textarea',{id:'stR',rows:'2',placeholder:'напр. «видали не ту позицію»'});
  openSheet(el('h2',{text:'Сторнувати операцію «'+(CONS_KIND[o.kind]||[''])[0]+' '+consDT(o)+'»?'}),el('p',{class:'muted small',style:'margin:0',text:'Буде створено зворотну операцію, оригінал позначиться «сторновано». Видалення немає — усе лишається в журналі.'}),
    el('label',{for:'stR'},'Причина (обов’язково)',rs),
    el('div',{class:'row'},el('button',{class:'btn danger',type:'button',style:'flex:1',onclick:async()=>{if(!rs.value.trim()){toast('Вкажіть причину сторно');rs.focus();return;}
      const neg=(o.lines||[]).map(l=>({l,it:consItem(l.itemId)})).find(({l,it})=>it&&cr((+it.qty||0)-l.delta)<0);if(neg){toast('Не можна сторнувати: на складі лише '+cq(neg.it.qty)+' '+neg.it.unit+' «'+neg.it.name+'». Спершу скоригуйте залишок.');return;}
      closeSheet();let res=null;
      try{await write(async()=>{res=await consCommit({kind:'storno',stornoOf:o.id,src:{t:'storno'},lines:(o.lines||[]).map(l=>({itemId:l.itemId,delta:-l.delta})),reason:rs.value.trim(),date:ymd(new Date()),time:consNowHM()});
        if(res)await S.db.doc('consOps/'+o.id).update({storno:{opId:res.id,at:Date.now(),by:S.myId||'',bySid:(myStaff()||{}).id||null,reason:rs.value.trim()}});},null);}catch(e){}
      if(res)consToast('Операцію сторновано',res.id);}},'Сторнувати'),el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати')));
  const btn=document.querySelector('#sheetRoot .btn.ghost');if(btn)btn.focus();}
/* --- період --- */
function consPeriod(p,from,to){const d=new Date();const t=ymd(d);if(p==='today')return [t,t];if(p==='week'){const m=new Date(d);m.setDate(d.getDate()-((d.getDay()+6)%7));return [ymd(m),t];}
  if(p==='month')return [t.slice(0,7)+'-01',t];if(p==='prev'){const a=new Date(d.getFullYear(),d.getMonth()-1,1),b=new Date(d.getFullYear(),d.getMonth(),0);return [ymd(a),ymd(b)];}
  if(p==='quarter'){const q=Math.floor(d.getMonth()/3)*3;return [ymd(new Date(d.getFullYear(),q,1)),t];}return [from||'0000-00-00',to||'9999-99-99'];}
function consPerSeg(key,opts){const cur=S[key]||opts[0][0];const f=S[key+'F']||ymd(new Date()).slice(0,7)+'-01',t=S[key+'T']||ymd(new Date());
  return [el('div',{class:'sg',role:'tablist','aria-label':'Період'},opts.map(([k,l])=>el('button',{type:'button','aria-pressed':String(cur===k),onclick:()=>{S[key]=k;render();}},l))),
    cur==='custom'?el('div',{class:'cs-range'},el('label',{for:key+'F'},'з',el('input',{type:'date',id:key+'F',value:f,onchange:e=>{S[key+'F']=e.target.value;render();}})),el('label',{for:key+'T'},'по',el('input',{type:'date',id:key+'T',value:t,onchange:e=>{S[key+'T']=e.target.value;render();}}))):null];}
function consFSel(id,label,key,opts){return el('select',{id,'aria-label':label,onchange:e=>{S[key]=e.target.value;render();}},el('option',{value:'',text:label+': усі'}),opts.map(([v,t])=>el('option',{value:v,selected:S[key]===v?true:null,text:t})));}
/* --- Журнал операцій --- */
function consLogFiltered(){const [a,b]=consPeriod(S.cjP||'month',S.cjPF,S.cjPT);const q=lc(S.cjQ);
  return consOps().filter(o=>o.date>=a&&o.date<=b&&(!S.cjK||o.kind===S.cjK)&&(!S.cjI||(o.lines||[]).some(l=>l.itemId===S.cjI))&&(!S.cjC||(o.lines||[]).some(l=>l.cat===S.cjC))&&(!S.cjTo||(o.toId||('t:'+o.toText))===S.cjTo)&&(!S.cjBy||o.byId===S.cjBy)&&(!S.cjB||o.bld===S.cjB)
    &&(!q||lc([consLinesTxt(o,99),consToLabel(o),o.note,o.reason,o.bld,o.purpose,o.src&&o.src.doc,o.src&&o.src.file].join(' ')).includes(q)));}
function consLogView(){const L=consLogFiltered();const ops=consOps();
  const qi=el('input',{type:'search',id:'cjQ',placeholder:'Пошук у журналі',value:S.cjQ||'','aria-label':'Пошук у журналі'});qi.addEventListener('input',()=>{S.cjQ=qi.value;const p=qi.selectionStart;render();const n=document.getElementById('cjQ');if(n){n.focus();n.setSelectionRange(p,p);}});
  const tos=[...new Map(ops.filter(o=>o.kind==='issue').map(o=>[o.toId||('t:'+o.toText),consToLabel(o)])).entries()];const bys=[...new Set(ops.map(o=>o.byId).filter(Boolean))].map(id=>[id,consWho(id)]);
  const filt=el('div',{class:'cs-filt wrap'},qi,consFSel('cjK','Тип','cjK',Object.entries(CONS_KIND).map(([k,v])=>[k,v[0]])),consFSel('cjI','Позиція','cjI',consItems().map(x=>[x.id,x.name])),consFSel('cjC','Категорія','cjC',CONS_CATS.map(c=>[c[0],c[1]])),
    consFSel('cjTo','Кому','cjTo',tos),consFSel('cjBy','Ким','cjBy',bys),consFSel('cjB','Будинок','cjB',consPlaces().map(p=>[p,p])));
  const any=S.cjK||S.cjI||S.cjC||S.cjTo||S.cjBy||S.cjB||S.cjQ;
  return [el('div',{class:'cs-ph'},...consPerSeg('cjP',[['today','Сьогодні'],['week','Тиждень'],['month','Місяць'],['custom','Свій']]),el('button',{class:'btn ghost sm',type:'button',disabled:L.length?null:true,onclick:()=>consExportLog(L)},svg(IC_DL),' Excel')),filt,
    L.length?el('div',{class:'card cs-j'},el('div',{class:'cs-jl'},L.map(o=>{const k=CONS_KIND[o.kind]||['',''];const open=()=>consOpSheet(o.id);
      return el('button',{type:'button',class:'cs-jr2'+(o.storno?' sto':''),onclick:open},el('span',{class:'cs-jd',text:consDT(o)}),el('span',{class:'cs-b '+k[1],text:k[0]}),
        el('span',{class:'cs-jn'},el('b',{text:consLinesTxt(o)}),el('small',{class:'muted',text:[o.kind==='issue'?'→ '+consToLabel(o):'',o.byId?'видав: '+consWho(o.byId):'',o.bld,o.reason,o.note,o.storno?'сторновано':''].filter(Boolean).join(' · ')})));})))
    :el('div',{class:'card empty'},el('p',{class:'muted',text:any?'За цими фільтрами операцій немає.':'Операцій за цей період немає.'}),any?el('button',{class:'btn ghost sm',type:'button',onclick:()=>{['cjK','cjI','cjC','cjTo','cjBy','cjB','cjQ'].forEach(k=>S[k]='');render();}},'Скинути фільтри'):null)];}
/* --- Звіт витрат --- */
function consRepData(){const [a,b]=consPeriod(S.crP||'month',S.crPF,S.crPT);const withOff=S.crOff!==false;
  const ops=consOps().filter(o=>consOpLive(o)&&o.date>=a&&o.date<=b&&(o.kind==='issue'||(withOff&&o.kind==='writeoff'))&&(!S.crB||o.bld===S.crB)&&(!S.crTo||(o.toId||('t:'+o.toText))===S.crTo)&&(!S.crPu||o.purpose===S.crPu));
  const by={};ops.forEach(o=>(o.lines||[]).forEach(l=>{if(S.crC&&l.cat!==S.crC)return;const it=consItem(l.itemId);const k=l.itemId;const r=by[k]=by[k]||{name:it?it.name:l.name,cat:it?it.cat:l.cat,unit:it?it.unit:l.unit,iss:0,off:0,n:0};
    if(o.kind==='issue')r.iss=cr(r.iss-l.delta);else r.off=cr(r.off-l.delta);r.n++;}));
  const rows=Object.values(by).sort((x,y)=>(CONS_CATS.indexOf(consCat(x.cat))-CONS_CATS.indexOf(consCat(y.cat)))||(y.iss+y.off)-(x.iss+x.off));
  const who={};ops.filter(o=>o.kind==='issue').forEach(o=>{const k=consToLabel(o)||'—';const w=who[k]=who[k]||{n:0,items:{}};w.n++;(o.lines||[]).forEach(l=>{if(S.crC&&l.cat!==S.crC)return;const u=l.unit;w.items[l.name+'|'+u]=cr((w.items[l.name+'|'+u]||0)-l.delta);});});
  const blds={};ops.forEach(o=>{const k=o.bld||'Без локації';blds[k]=(blds[k]||0)+1;});
  return {a,b,ops,rows,who,blds,withOff};}
function consRepView(){const D=consRepData();const tos=[...new Map(consOps().filter(o=>o.kind==='issue').map(o=>[o.toId||('t:'+o.toText),consToLabel(o)])).entries()];
  const tog=el('label',{class:'chk cs-tog'},el('input',{type:'checkbox',id:'crOff',checked:D.withOff?true:null,onchange:e=>{S.crOff=e.target.checked;render();}}),'Враховувати списання');
  const units=rs=>{const m={};rs.forEach(r=>m[r.unit]=cr((m[r.unit]||0)+r.iss+r.off));return Object.entries(m).map(([u,v])=>cq(v)+' '+u).join(' · ');};
  return [el('div',{class:'cs-ph'},...consPerSeg('crP',[['month','Цей місяць'],['prev','Минулий місяць'],['quarter','Квартал'],['custom','Свій період']]),el('button',{class:'btn ghost sm',type:'button',disabled:D.rows.length?null:true,onclick:()=>consExportRep(D)},svg(IC_DL),' Excel')),
    el('div',{class:'cs-filt wrap'},consFSel('crC','Категорія','crC',CONS_CATS.map(c=>[c[0],c[1]])),consFSel('crB','Будинок','crB',consPlaces().map(p=>[p,p])),consFSel('crTo','Кому','crTo',tos),consFSel('crPu','Призначення','crPu',CONS_PURPOSE.map(p=>[p,p])),tog),
    el('p',{class:'muted small',style:'margin:0',text:dm(D.a)+'.'+D.a.slice(0,4)+' — '+dm(D.b)+'.'+D.b.slice(0,4)+' · '+D.ops.length+' '+plural(D.ops.length,'операція','операції','операцій')+' · сторновані не враховуються'+(D.rows.length?' · разом: '+units(D.rows):'')}),
    D.rows.length?el('div',{class:'card cs-tw'},el('div',{class:'tbl-x'},el('table',{class:'cs-tbl'},el('thead',{},el('tr',{},['Позиція','Категорія','Од.','Видано',D.withOff?'Списано':null,'Разом','Операцій'].filter(Boolean).map(h=>el('th',{scope:'col',text:h})))),
      el('tbody',{},D.rows.map(r=>el('tr',{},el('td',{},el('b',{text:r.name})),el('td',{text:consCat(r.cat)[1]}),el('td',{text:r.unit}),el('td',{class:'num',text:cq(r.iss)}),D.withOff?el('td',{class:'num',text:cq(r.off)}):null,el('td',{class:'num'},el('b',{text:cq(r.iss+r.off)})),el('td',{class:'num muted',text:String(r.n)}))))))):el('div',{class:'card empty'},el('p',{class:'muted',text:'За цей період витрат немає.'})),
    D.rows.length?el('div',{class:'dz-grid'},el('div',{class:'card dz-card'},el('div',{class:'dz-ch'},el('b',{text:'Кому видавали'}),el('span',{class:'muted small',text:'видач · що брали'})),
        el('div',{class:'cs-ppl'},Object.entries(D.who).sort((x,y)=>y[1].n-x[1].n).map(([k,w])=>el('div',{class:'cs-pp'},el('span',{class:'cs-pn'},el('b',{text:k}),el('small',{text:Object.entries(w.items).sort((x,y)=>y[1]-x[1]).slice(0,4).map(([nu,v])=>nu.split('|')[0]+' ×'+cq(v)).join(', ')})),el('b',{text:String(w.n)}))))),
      el('div',{class:'card dz-card'},el('div',{class:'dz-ch'},el('b',{text:'За будинками'}),el('span',{class:'muted small',text:'кількість операцій'})),el('div',{class:'dz-resp'},Object.entries(D.blds).sort((x,y)=>y[1]-x[1]).map(([k,v])=>el('span',{class:'dz-rc'},el('b',{text:k}),el('small',{text:v+' '+plural(v,'операція','операції','операцій')})))))):null];}
/* --- Історія змін --- */
function consHistView(){const ops=consOps().map(o=>({at:o.at,who:consWho(o.authorSid,o.author),t:(CONS_KIND[o.kind]||[''])[0],cls:(CONS_KIND[o.kind]||['',''])[1],txt:consLinesTxt(o,3)+(o.storno?' · сторновано':'')+(o.kind==='storno'?' · '+o.reason:''),op:o.id}));
  const FN={name:'назва',cat:'категорія',unit:'одиниця',min:'мін. залишок',place:'місце',note:'примітка'};const fv=(k,v)=>v==null||v===''?'—':k==='cat'?consCat(v)[1]:String(v);
  const hs=(S.consH||[]).map(h=>({at:h.at,who:consWho(h.authorSid,h.author),t:h.act==='create'?'Нова позиція':h.act==='delete'?'Видалено позицію':'Зміна позиції',cls:h.act==='delete'?'off':'adj',
    txt:h.name+(h.act==='edit'?': '+Object.entries(h.changes||{}).map(([k,[a,b]])=>(FN[k]||k)+' '+fv(k,a)+' → '+fv(k,b)).join(', '):''),item:h.itemId}));
  const all=[...ops,...hs].sort((a,b)=>b.at-a.at);const n=S.chAll?all.length:Math.min(60,all.length);
  if(!all.length)return [el('div',{class:'card empty'},el('p',{class:'muted',text:'Змін ще не було.'}))];
  return [el('div',{class:'card cs-j'},el('div',{class:'cs-jl'},all.slice(0,n).map(x=>{const d=new Date(x.at);const open=x.op?()=>consOpSheet(x.op):x.item&&consItem(x.item)?()=>consItemSheet(x.item):null;
      return el(open?'button':'div',{type:open?'button':null,class:'cs-jr2',onclick:open},el('span',{class:'cs-jd',text:pad(d.getDate())+'.'+pad(d.getMonth()+1)+' '+pad(d.getHours())+':'+pad(d.getMinutes())}),el('span',{class:'cs-b '+x.cls,text:x.t}),
        el('span',{class:'cs-jn'},el('b',{text:x.txt}),el('small',{class:'muted',text:x.who})));})),
    all.length>60?el('button',{class:'btn ghost sm',type:'button',onclick:()=>{S.chAll=!S.chAll;render();}},S.chAll?'Згорнути':'Показати всі ('+all.length+')'):null)];}
/* --- Excel (лише кількості) --- */
async function consXlsx(name,sheets){toast('Готую файл…');let X;try{X=await loadXlsx();}catch(e){toast('Не вдалося завантажити модуль Excel');return;}const wb=X.utils.book_new();
  for(const [sn,aoa,cols] of sheets){const ws=X.utils.aoa_to_sheet(aoa);if(cols)ws['!cols']=cols.map(w=>({wch:w}));X.utils.book_append_sheet(wb,ws,sn.slice(0,31));}
  const buf=X.write(wb,{bookType:'xlsx',type:'array'});const dl=await claude.use('downloads').catch(()=>null);if(!dl){toast('Завантаження файлів тут недоступне');return;}
  try{await dl.save({filename:name+'.xlsx',data:new Blob([buf])});}catch(e){if(e&&e.code!=='declined')toast('Не вдалося зберегти файл');}}
function consExportStock(){const t=ymd(new Date());const aoa=[['Витратні матеріали — наявність на '+dm(t)+'.'+t.slice(0,4)],['Назва','Категорія','Од. виміру','Залишок','Мін. залишок','Статус','Місце зберігання','Остання операція','Примітка']];
  consItems().forEach(x=>aoa.push([x.name,consCat(x.cat)[1],x.unit,cr(x.qty),x.min==null||x.min===''?'':+x.min,CONS_ST[consSt(x)][0],x.place||'',x.lastOpDate||'',x.note||'']));
  consXlsx('Витратні матеріали — наявність '+t,[['Наявність',aoa,[40,26,10,10,12,14,20,16,30]]]);}
function consExportLog(L){const aoa=[['Дата','Час','Тип','Позиція','Кількість','Од.','Кому','Ким видано','Будинок','Призначення','Причина','Коментар','Джерело','Статус','Внесено','Хто вніс']];
  L.forEach(o=>(o.lines||[]).forEach(l=>{const d=new Date(o.at);aoa.push([o.date,o.time||'',(CONS_KIND[o.kind]||[''])[0],l.name,cr(l.delta),l.unit,consToLabel(o),o.byId?consWho(o.byId):'',o.bld||'',o.purpose||'',o.reason||'',o.note||'',o.src?(o.src.t==='table'?o.src.file:o.src.t==='invoice'?(o.src.doc||o.src.file):o.src.t==='storno'?'сторно':'вручну'):'вручну',o.storno?'сторновано':'',ymd(d)+' '+pad(d.getHours())+':'+pad(d.getMinutes()),consWho(o.authorSid,o.author)]);}));
  consXlsx('Витратні матеріали — журнал '+ymd(new Date()),[['Журнал',aoa,[11,6,14,36,10,7,22,20,12,14,18,28,22,12,16,20]]]);}
function consExportRep(D){const a1=[['Звіт витрат '+D.a+' — '+D.b+(D.withOff?' (видачі та списання)':' (лише видачі)')],['Позиція','Категорія','Од.','Видано',...(D.withOff?['Списано']:[]),'Разом','Операцій']];
  D.rows.forEach(r=>a1.push([r.name,consCat(r.cat)[1],r.unit,r.iss,...(D.withOff?[r.off]:[]),cr(r.iss+r.off),r.n]));
  const a2=[['Кому видано','Видач','Позиція','Кількість','Од.']];Object.entries(D.who).forEach(([k,w])=>Object.entries(w.items).forEach(([nu,v],i)=>{const [n,u]=nu.split('|');a2.push([i?'':k,i?'':w.n,n,v,u]);}));
  const a3=[['Будинок / локація','Операцій']];Object.entries(D.blds).forEach(([k,v])=>a3.push([k,v]));
  consXlsx('Звіт витрат '+D.a+' — '+D.b,[['Звіт',a1,[40,26,8,10,10,10,10]],['Кому видано',a2,[26,8,36,10,8]],['Будинки',a3,[24,10]]]);}
/* CONS:END */

function resView(){const out=[];
  out.push(el('div',{class:'sg full res-seg',role:'tablist'},[['cons','Витратні матеріали'],['inv','Інвентар та обладнання']].map(([k,l])=>el('button',{type:'button','aria-pressed':String((S.resTab||'cons')===k),onclick:()=>{S.resTab=k;render();}},l,k==='cons'&&(S.consI||[]).some(consLow)?el('span',{class:'badge',text:String((S.consI||[]).filter(consLow).length)}):null))));
  if((S.resTab||'cons')==='cons')return out.concat(consView());
  return out.concat(invView());}
function invView(){const out=[];const can=canW();const d=invDoc();const rows=invRows();
  if(!d){out.push(el('div',{class:'card empty'},el('h2',{text:'Інвентар ще не завантажено'}),el('p',{class:'muted',text:'Завантажте файл інвентаризації — позиції розкладемо за категоріями.'}),can?el('button',{class:'btn',type:'button',onclick:invImport},svg(IC_UP),' Завантажити Excel'):null));return out;}
  out.push(el('div',{class:'dz-filters'},el('div',{class:'inv-date'},el('span',{class:'muted small',text:'Інвентаризація'}),el('b',{text:d.date?dm(d.date)+'.'+d.date.slice(0,4):'—'})),
    el('div',{class:'dz-acts'},...ioBtns(invExport,can?invImport:null),can?el('button',{class:'btn ghost sm',type:'button',onclick:()=>invEdit(null)},'+ Позиція'):null)));
  const use=rows.filter(r=>r.kind!=='store'),sto=rows.filter(r=>r.kind==='store'),fix=rows.filter(r=>r.cond==='fix'),pcs=rows.filter(r=>(r.unit||'шт')==='шт').reduce((a,r)=>a+(+r.qty||0),0);
  out.push(el('div',{class:'dz-kpi inv-kpi'},
    el('div',{class:'card dz-k hero'},el('span',{text:'Позицій інвентарю'}),el('b',{text:String(rows.length)}),el('small',{text:pcs.toLocaleString('uk-UA')+' одиниць · '+new Set(rows.map(r=>r.cat)).size+' категорій'})),
    el('div',{class:'card dz-k'},el('span',{class:'muted small',text:'В експлуатації'}),el('b',{text:String(use.length)}),el('small',{class:'muted',text:'позицій працюють щодня'})),
    el('div',{class:'card dz-k'},el('span',{class:'muted small',text:'На зберіганні'}),el('b',{text:String(sto.length)}),el('small',{class:'muted',text:'склад, запас, сезонне'})),
    el('div',{class:'card dz-k'},el('span',{class:'muted small',text:'Потребує ремонту'}),el('b',{class:fix.length?'crit':'',text:String(fix.length)}),el('small',{class:'muted',text:fix.length?fix.slice(0,2).map(r=>r.name).join(', '):'усе справне'}))));
  // charts
  const cats=INV_CATS.map(c=>({c,u:use.filter(r=>r.cat===c[0]).length,s:sto.filter(r=>r.cat===c[0]).length})).filter(x=>x.u+x.s).sort((a,b)=>(b.u+b.s)-(a.u+a.s));const cMax=Math.max(1,...cats.map(x=>x.u+x.s));
  const cU=dzDark()?'#3aa7a0':'#1F6F78',cS=dzDark()?'#9085e9':'#6250d6';
  const catCard=el('div',{class:'card dz-card'},el('div',{class:'dz-ch'},el('b',{text:'За категоріями'}),el('span',{class:'muted small',text:'позицій'})),
    el('div',{class:'dz-bars'},cats.map(x=>hov(el('button',{type:'button',class:'dz-br inv-br',onclick:()=>{S.invCat=S.invCat===x.c[0]?'all':x.c[0];render();setTimeout(()=>{const t=document.querySelector('.inv-list');if(t)t.scrollIntoView({behavior:'smooth'});},50);}},
      el('span',{class:'dz-bl'},el('em',{class:'inv-e',text:x.c[2]}),x.c[1]),el('div',{class:'dz-bt inv-st'},x.u?el('span',{style:'width:'+(x.u/cMax*100)+'%;background:'+cU}):null,x.s?el('span',{style:'width:'+(x.s/cMax*100)+'%;background:'+cS}):null),el('b',{text:String(x.u+x.s)})),
      ()=>[el('b',{text:x.c[1]}),el('div',{text:'В експлуатації: '+x.u}),el('div',{text:'На зберіганні: '+x.s})]))),
    el('div',{class:'dz-resp'},el('span',{class:'dz-li',style:'padding:0;grid-template-columns:12px auto'},el('i',{style:'background:'+cU}),el('span',{text:'В експлуатації'})),el('span',{class:'dz-li',style:'padding:0;grid-template-columns:12px auto'},el('i',{style:'background:'+cS}),el('span',{text:'На зберіганні'}))));
  const own=INV_OWNS.concat([...new Set(rows.map(r=>r.owner).filter(o=>o&&!INV_OWNS.includes(o)))]).map(o=>({o,n:rows.filter(r=>r.owner===o).length})).filter(x=>x.n);
  const ownCard=el('div',{class:'card dz-card'},el('div',{class:'dz-ch'},el('b',{text:'Балансоутримувач'}),el('span',{class:'muted small',text:'з файлу, колонка «Примітка»'})),
    el('div',{class:'dz-stack'},own.map(x=>hov(el('span',{style:'flex:'+x.n+';background:'+invOwnCol(x.o)}),()=>[el('b',{text:x.o}),el('div',{text:x.n+' позицій · '+Math.round(x.n/rows.length*100)+'%'})]))),
    el('div',{class:'dz-leg'},own.map(x=>el('button',{type:'button',class:'dz-li','aria-pressed':String(S.invOwn===x.o),onclick:()=>{S.invOwn=S.invOwn===x.o?'':x.o;render();}},el('i',{style:'background:'+invOwnCol(x.o)}),el('span',{text:x.o}),el('b',{text:String(x.n)}),el('small',{text:Math.round(x.n/rows.length*100)+'%'})))),
    (()=>{const dup={};rows.forEach(r=>{const k=lc(r.name).replace(/\s*(sp|сп)-?1$/,' sp1');(dup[k]=dup[k]||[]).push(r);});const dd=Object.values(dup).filter(a=>a.length>1);const notes=rows.filter(r=>/дубл/i.test(r.note||''));
      return dd.length||notes.length?el('div',{class:'imp-warn'},el('div',{text:'Перевірте можливі дублікати:'}),...(dd.length?dd:notes.map(r=>[r])).map(a=>el('div',{text:'• '+a.map(r=>'№'+(r.n||'')+' '+r.name).join(' / ')}))):null;})());
  out.push(el('div',{class:'dz-grid'},catCard,ownCard));
  // filters + list
  const q=lc(S.invQ);const vis=rows.filter(r=>(S.invCat==='all'||!S.invCat||r.cat===S.invCat)&&(!S.invOwn||r.owner===S.invOwn)&&(!S.invKind||r.kind===S.invKind)&&(!q||lc([r.name,r.note,r.place,r.owner].join(' ')).includes(q)));
  const qi=el('input',{type:'search',placeholder:'Пошук інвентарю…',value:S.invQ||'','aria-label':'Пошук інвентарю'});qi.addEventListener('input',()=>{S.invQ=qi.value;const p=qi.selectionStart;render();const n=document.querySelector('.inv-tools input[type=search]');if(n){n.focus();n.setSelectionRange(p,p);}});
  out.push(el('div',{class:'dz-tbl-wrap inv-list'},el('div',{class:'row between'},el('h2',{text:'Інвентар'}),el('span',{class:'muted small',text:vis.length+' з '+rows.length})),
    el('div',{class:'dz-chips'},[['all','Усі'],...INV_CATS.filter(c=>rows.some(r=>r.cat===c[0])).map(c=>[c[0],c[2]+' '+c[1]])].map(([k,l])=>el('button',{type:'button',class:'dz-chip','aria-pressed':String((S.invCat||'all')===k),onclick:()=>{S.invCat=k;render();}},l))),
    el('div',{class:'dz-tools inv-tools'},qi,el('div',{class:'sg sm'},[['','Усі'],['use','В роботі'],['store','Склад']].map(([k,l])=>el('button',{type:'button','aria-pressed':String((S.invKind||'')===k),onclick:()=>{S.invKind=k;render();}},l))),
      S.invOwn?el('button',{class:'btn ghost sm',type:'button',onclick:()=>{S.invOwn='';render();}},'✕ '+S.invOwn):null),
    el('div',{class:'inv-groups'},INV_CATS.map(c=>{const rs=vis.filter(r=>r.cat===c[0]);if(!rs.length)return null;
      return el('section',{class:'inv-g2'},el('div',{class:'inv-gh'},el('span',{class:'inv-gi',text:c[2]}),el('b',{text:c[1]}),el('span',{class:'muted small',text:rs.length+' поз. · '+rs.filter(r=>r.kind!=='store').length+' в роботі'})),
        el('div',{class:'inv-cards'},rs.map(r=>el('button',{type:'button',class:'inv-c'+(r.cond==='fix'?' fix':''),onclick:()=>can?invEdit(r):invInfo(r)},
          el('span',{class:'inv-ct'},el('b',{text:r.name}),el('span',{class:'inv-cq',text:r.qtyText&&r.qty!=null?String(r.qty).replace('.',',')+' '+(r.unit||'шт'):invQtyS(r)})),
          (r.note||r.place||(r.qtyText&&r.qty!=null))?el('span',{class:'inv-cs'},[r.qtyText&&r.qty!=null?r.qtyText:'',r.place?'📍 '+r.place:''].filter(Boolean).join(' · '),r.note?el('em',{text:(r.qtyText||r.place?' · ':'')+r.note}):null):null,
          el('span',{class:'inv-cm'},el('span',{class:'inv-st2 '+(r.kind==='store'?'st':'use')},el('i'),r.kind==='store'?'Склад':'В роботі'),r.cond&&r.cond!=='ok'?el('span',{class:'inv-st2 '+(r.cond==='fix'?'fix':'mute')},el('i'),INV_COND[r.cond]):null,
            el('span',{class:'inv-own2',style:'--oc:'+invOwnCol(r.owner)},r.owner||'—'))))));})),
    !vis.length?el('div',{class:'card empty'},el('p',{class:'muted',text:'Нічого не знайдено'})):null));
  return out;}
function invInfo(r){const c=invCat(r.cat);openSheet(el('h2',{text:r.name}),el('p',{class:'muted',style:'margin:0',text:c[2]+' '+c[1]}),
  el('div',{class:'dz-info'},[['Кількість',invQtyS(r)],['Тип',INV_KIND[r.kind]||'—'],['Балансоутримувач',r.owner||'—'],['Стан',INV_COND[r.cond]||'Справне'],['Місце',r.place||'—'],['№ в інвентаризації',r.n?String(r.n):'—']].map(([a,b])=>el('div',{},el('small',{text:a}),el('b',{text:b})))),
  r.note?el('p',{style:'margin:0',text:r.note}):null,el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Закрити'));}
function invEdit(r){const isNew=!r;r=r||{cat:S.invCat&&S.invCat!=='all'?S.invCat:'other',kind:'use',cond:'ok',unit:'шт',owner:'УК'};
  const inp=(id,lbl,val,o)=>{const i=el('input',{id,value:val==null?'':String(val),...(o||{})});return [i,el('label',{for:id},lbl,i)];};
  const sel=(id,lbl,opts,val)=>{const s=el('select',{id},opts.map(([v,t])=>el('option',{value:v,text:t})));s.value=val||opts[0][0];return [s,el('label',{for:id},lbl,s)];};
  const [nm,nmL]=inp('ivN','Назва',r.name);const [ct,ctL]=sel('ivC','Категорія',INV_CATS.map(c=>[c[0],c[2]+' '+c[1]]),r.cat);const [q,qL]=inp('ivQ','Кількість',r.qty==null?'':String(r.qty).replace('.',','),{inputmode:'decimal'});
  const [u,uL]=inp('ivU','Одиниця',r.unit||'шт',{list:'ivUl'});const [qt,qtL]=inp('ivQt','Уточнення кількості (необов’язково)',r.qtyText,{placeholder:'напр. 3 по 20 л та 3 по 10 л'});
  const [ow,owL]=inp('ivO','Балансоутримувач',r.owner,{list:'ivOl'});const [kd,kdL]=sel('ivK','Тип',Object.entries(INV_KIND),r.kind);const [cd,cdL]=sel('ivCd','Стан',Object.entries(INV_COND),r.cond);
  const [pl,plL]=inp('ivP','Місце зберігання',r.place,{placeholder:'напр. склад Буд. 4'});const [nt,ntL]=inp('ivNt','Коментар',r.note);
  nm.addEventListener('change',()=>{if(isNew&&ct.value==='other')ct.value=invGuess(nm.value);});
  openSheet(el('h2',{text:isNew?'Нова позиція':'Редагувати позицію'}),el('datalist',{id:'ivUl'},['шт','м','пари','ящик','мішки','компл'].map(x=>el('option',{value:x}))),el('datalist',{id:'ivOl'},INV_OWNS.map(x=>el('option',{value:x}))),
    nmL,ctL,el('div',{class:'grid2'},qL,uL),qtL,el('div',{class:'grid2'},kdL,cdL),el('div',{class:'grid2'},owL,plL),ntL,
    el('div',{class:'row'},el('button',{class:'btn',type:'button',style:'flex:1',onclick:()=>{const qty=numP(q.value);if(q.value.trim()&&qty==null){toast('Кількість: введіть число');return;}if(!nm.value.trim()){toast('Вкажіть назву');return;}
      const d={name:nm.value.trim(),cat:ct.value,qty,unit:u.value.trim()||'шт',qtyText:qt.value.trim(),owner:ow.value.trim(),kind:kd.value,cond:cd.value,place:pl.value.trim(),note:nt.value.trim(),at:Date.now(),by:S.myId};closeSheet();
      if(isNew){const rs=invRows();d.order=rs.reduce((a,x)=>Math.max(a,x.order||0),0)+1;d.n=rs.reduce((a,x)=>Math.max(a,x.n||0),0)+1;write(()=>S.db.doc('inv/main').update({rows:{['i'+Date.now().toString(36)]:d}}),'Додано');}
      else write(()=>S.db.doc('inv/main').update({rows:{[r.id]:d}}),'Збережено');}},isNew?'Додати':'Зберегти'),
      !isNew?el('button',{class:'btn danger',type:'button',onclick:()=>confirmSheet('Видалити «'+r.name+'» з інвентарю?','Видалити',()=>write(()=>S.db.doc('inv/main').update({rows:{[r.id]:null}}),'Видалено'))},'Видалити'):null),
    el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'));}
async function invExport(){toast('Готую файл…');let X;try{X=await loadXlsx();}catch(e){toast('Не вдалося завантажити модуль Excel');return;}const d=invDoc()||{};const rows=invRows();
  const dt=d.date?dm(d.date)+'.'+d.date.slice(0,4):dm(ymd(new Date()))+'.'+new Date().getFullYear();
  const aoa=[['Інвентеризація інвентаря '+dt],['№ п/п','Назва інвентаря ','Кількість шт','Примітка','Категорія','Тип','Стан','Місце зберігання','Коментар']];
  INV_CATS.forEach(c=>rows.filter(r=>r.cat===c[0]).forEach(r=>aoa.push([aoa.length-1,r.name,r.qtyText||((r.qty==null?'':String(r.qty).replace('.',','))+' '+(r.unit||'шт')),r.owner||'',c[1],INV_KIND[r.kind]||'',INV_COND[r.cond]||'Справне',r.place||'',r.note||''])));
  const ws=X.utils.aoa_to_sheet(aoa);ws['!merges']=[{s:{r:0,c:0},e:{r:0,c:3}}];ws['!cols']=[{wch:7},{wch:44},{wch:22},{wch:12},{wch:28},{wch:16},{wch:16},{wch:20},{wch:30}];
  const wb=X.utils.book_new();X.utils.book_append_sheet(wb,ws,'Аркуш1');const buf=X.write(wb,{bookType:'xlsx',type:'array'});const dl=await claude.use('downloads').catch(()=>null);if(!dl){toast('Завантаження файлів тут недоступне');return;}
  try{await dl.save({filename:'Інвентаризація '+dt+'.xlsx',data:new Blob([buf])});}catch(e){if(e&&e.code!=='declined')toast('Не вдалося зберегти файл');}}
async function invImport(){const f=await xlsxPick();if(!f)return;const {wb,X}=f;const a=sheetAoa(X,wb.Sheets[wb.SheetNames[0]]);let hr=-1,date=null;
  for(let i=0;i<Math.min(a.length,10);i++){const row=(a[i]||[]).map(strP);const t=row.join(' ');const m=t.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);if(m&&!date)date=m[3]+'-'+m[2].padStart(2,'0')+'-'+m[1].padStart(2,'0');if(row.some(x=>/назва/i.test(x))){hr=i;break;}}
  if(hr<0){toast('Не знайшов рядка з колонкою «Назва»');return;}const H=(a[hr]||[]).map(x=>lc(strP(x)));const col=re=>H.findIndex(h=>re.test(h));
  const cN=col(/^№|п\/п/),cName=col(/назва/),cQ=col(/кільк/),cO=col(/примітка|баланс/),cC=col(/категор/),cT=col(/^тип/),cS=col(/^стан/),cP=col(/місце/),cK=col(/коментар/);
  const ex=invRows();const used=new Set();const rows={};const st={nw:0,ch:0,del:0};const warn=[];let k=0;
  for(let i=hr+1;i<a.length;i++){const R=a[i]||[];const name=strP(R[cName]);if(!name)continue;if(/(^|\s)(сіль|добрив|пакет|миюч|хімі|рукавиц)/i.test(name)){warn.push('«'+name+'» — витратний матеріал, пропущено (окремий розділ)');continue;}k++;const qq=invQtyP(cQ>=0?R[cQ]:null);
    const catS=cC>=0?lc(strP(R[cC])):'';const cat=(INV_CATS.find(c=>lc(c[1])===catS)||[])[0];const typS=cT>=0?lc(strP(R[cT])):'';const condS=cS>=0?lc(strP(R[cS])):'';
    const m=ex.find(x=>!used.has(x.id)&&lc(x.name)===lc(name));const base=m||{};
    const r={n:numP(R[cN])||k,name,qty:qq.qty,unit:qq.unit,qtyText:qq.qtyText,owner:cO>=0?strP(R[cO]):(base.owner||''),cat:cat||base.cat||invGuess(name),
      kind:typS?(/збер|склад/.test(typS)?'store':'use'):(base.kind||(['elec','decor','eng','clim'].includes(cat||invGuess(name))?'store':'use')),
      cond:condS?(Object.entries(INV_COND).find(([,v])=>lc(v)===condS)||['ok'])[0]:(base.cond||'ok'),place:cP>=0?strP(R[cP]):(base.place||''),note:cK>=0?strP(R[cK]):(base.note||''),order:k};
    if(qq.qty==null&&!qq.qtyText)warn.push('«'+name+'»: кількість не розпізнано');
    let id;if(m){id=m.id;used.add(id);if(['qty','unit','owner','cat','kind','cond','place','note','qtyText'].some(x=>String(m[x]??'')!==String(r[x]??'')))st.ch++;}else{id='i'+Date.now().toString(36)+'_'+i;st.nw++;}rows[id]=r;}
  st.del=ex.filter(x=>!used.has(x.id)).length;if(!k){toast('У файлі немає позицій');return;}
  const byCat=INV_CATS.map(c=>[c[2]+' '+c[1],String(Object.values(rows).filter(r=>r.cat===c[0]).length),'sub']).filter(x=>x[1]!=='0');
  impPreview('Оновити інвентар',f.name,[['Дата інвентаризації',date?dm(date)+'.'+date.slice(0,4):'—'],['Позицій',String(k)],...byCat,['Зміни',chg(st)]],warn,async()=>{await S.db.doc('inv/main').set({date:date||(invDoc()||{}).date||ymd(new Date()),rows,at:Date.now(),by:S.myId});});}
