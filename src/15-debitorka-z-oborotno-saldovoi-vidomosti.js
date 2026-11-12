// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Дебіторка з Оборотно-сальдової відомості 1С/BAS

/* OSV:BEGIN — Дебіторка з Оборотно-сальдової відомості 1С/BAS */
/* --- Зіставлення назв (нечіткий пошук + аліаси) --- */
const NM={STOP:new Set(['фоп','тов','пп','ат','пат','прат','кп','тзов','фг','ор','ооо','чп','llc','ltd','та','і','й','and','the','дог','договір','фізична','особа','підприємець','товариство','з','обмеженою','відповідальністю','приватне','підприємство','компанія']),
  TR:{а:'a',б:'b',в:'v',г:'h',ґ:'g',д:'d',е:'e',є:'e',ж:'zh',з:'z',и:'y',і:'i',ї:'i',й:'i',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'s',ч:'ch',ш:'sh',щ:'sh',ь:'',ю:'iu',я:'ia',ъ:'',ы:'y',э:'e',ё:'e'}};
NM.clean=s=>String(s==null?'':s).toLowerCase().replace(/[’'`ʼ"«»“”„]/g,'').replace(/(^|[^0-9a-zа-яіїєґ])3(?=[а-яіїєґ])/g,'$1з').replace(/[^0-9a-zа-яіїєґ]+/g,' ').trim();
NM.skel=w=>{let s='';for(const ch of w)s+=NM.TR[ch]!=null?NM.TR[ch]:ch;return s.replace(/ph/g,'f').replace(/ck/g,'k').replace(/q/g,'k').replace(/x/g,'ks').replace(/w/g,'v').replace(/c(?=[eiy])/g,'s').replace(/ch/g,'\u0001').replace(/c/g,'k').replace(/\u0001/g,'ch').replace(/kh/g,'h').replace(/g/g,'h').replace(/ts/g,'s').replace(/y/g,'i').replace(/ii+/g,'i').replace(/([a-z])\1+/g,'$1');};
NM.toks=s=>NM.clean(s).split(' ').filter(t=>t&&!NM.STOP.has(t)).map(NM.skel).filter(t=>t.length>1);
NM.key=s=>NM.toks(s).join(' ');
NM.jw=(a,b)=>{if(a===b)return 1;const la=a.length,lb=b.length;if(!la||!lb)return 0;const md=Math.max(0,Math.floor(Math.max(la,lb)/2)-1);const ma=Array(la).fill(0),mb=Array(lb).fill(0);let m=0;
  for(let i=0;i<la;i++){for(let j=Math.max(0,i-md);j<Math.min(i+md+1,lb);j++){if(mb[j]||a[i]!==b[j])continue;ma[i]=mb[j]=1;m++;break;}}if(!m)return 0;let t=0,k=0;
  for(let i=0;i<la;i++){if(!ma[i])continue;while(!mb[k])k++;if(a[i]!==b[k])t++;k++;}const j=(m/la+m/lb+(m-t/2)/m)/3;let p=0;while(p<4&&p<la&&p<lb&&a[p]===b[p])p++;return j+p*.1*(1-j);};
/* Схожість: частка значущих слів одного імені, знайдених в іншому (бере більшу з двох сторін) + бонус за вкладення */
NM.score=(a,b)=>{const A=NM.toks(a),B=NM.toks(b);if(!A.length||!B.length)return 0;const ts=(x,y)=>{const s=NM.jw(x,y);if(s>=.9)return s;const p=x.length<y.length?x:y,q=x.length<y.length?y:x;return p.length>=4&&q.includes(p)?.9:0;};
  const cov=(X,Y)=>{let w=0,acc=0;X.forEach(x=>{const k=x.length>=4?1:.4;w+=k;acc+=k*Math.max(...Y.map(y=>ts(x,y)));});return w?acc/w:0;};
  const fa=A.join(''),fb=B.join('');let fl=NM.jw(fa,fb);const p=fa.length<fb.length?fa:fb,q=fa.length<fb.length?fb:fa;if(p.length>=5&&q.includes(p))fl=Math.max(fl,.92);
  return Math.max(fl,Math.max(cov(A,B),cov(B,A))*.97);};
/* --- Парсер ОСВ --- */
function osvNum(v){if(v==null||v==='')return 0;if(typeof v==='number')return Math.round(v*100)/100;const t=String(v).replace(/[\s ]/g,'').replace(',','.');const n=parseFloat(t);return isNaN(n)?0:Math.round(n*100)/100;}
function osvParse(a){const txt=c=>c==null?'':String(c instanceof Date?ymd(c):c).replace(/\s+/g,' ').trim();
  /* 1. Шапка: рядок із «Сальдо на початок / Обороти / Сальдо на кінець», під ним — «Дебет / Кредит» */
  let hr=-1,grp={};for(let i=0;i<Math.min(a.length,60);i++){const R=a[i]||[];R.forEach((c,j)=>{const t=txt(c).toLowerCase();if(/сальдо\s+на\s+поч/.test(t))grp.s=j;else if(/оборот/.test(t))grp.t=j;else if(/сальдо\s+на\s+кін/.test(t))grp.e=j;});if(grp.s!=null&&grp.t!=null&&grp.e!=null){hr=i;break;}grp={};}
  if(hr<0)throw new Error('Не знайдено шапку ОСВ («Сальдо на початок», «Обороти за період», «Сальдо на кінець»)');
  let dr=-1;const dc=[],cc=[];for(let i=hr;i<Math.min(a.length,hr+4);i++){const R=a[i]||[];R.forEach((c,j)=>{const t=txt(c).toLowerCase();if(/^дебет/.test(t))dc.push(j);else if(/^кредит/.test(t))cc.push(j);});if(dc.length>=3&&cc.length>=3){dr=i;break;}dc.length=cc.length=0;}
  if(dr<0)throw new Error('Не знайдено колонки «Дебет / Кредит»');
  const pick=(arr,from)=>arr.filter(j=>j>=from).sort((x,y)=>x-y)[0];
  const C={sD:pick(dc,grp.s),sC:pick(cc,grp.s),tD:pick(dc,grp.t),tC:pick(cc,grp.t),eD:pick(dc,grp.e),eC:pick(cc,grp.e)};
  /* колонка назв — найлівіша непорожня текстова в рядках даних */
  const head=a.slice(0,hr).map(R=>(R||[]).map(txt).join(' ')).join(' ');const pm=head.match(/(?:за|період[:\s]*)\s*(\d{2})\.(\d{2})\.(\d{4})\s*[-–]\s*(\d{2})\.(\d{2})\.(\d{4})/i);
  const MON={січ:1,лют:2,бер:3,кві:4,тра:5,чер:6,лип:7,сер:8,вер:9,жов:10,лис:11,гру:12};const mm=head.toLowerCase().match(/(січ|лют|бер|кві|тра|чер|лип|сер|вер|жов|лис|гру)[а-яії]*\s+(\d{4})/);
  const period=pm?pm[6]+'-'+pm[5]:mm?mm[2]+'-'+String(MON[mm[1]]).padStart(2,'0'):null;
  const isContract=t=>/^№|^дог|договір|від\s+\d{1,2}\.\d{1,2}\.\d{2,4}|^б\/н|^без\s+договору|^основний|^рах(унок)?\s*№/i.test(t);
  const isSkip=t=>!t||/^(разом|всього|підсумок|итого|усього)/i.test(t)||/^\d{2,4}(\.\d+)?$/.test(t)||/^(рахунок|контрагенти?|договори?|показники|субконто)$/i.test(t);
  const items=[];let cur=null;let started=false;
  for(let i=dr+1;i<a.length;i++){const R=a[i]||[];const nc=Math.min(C.sD,C.sC,C.tD);let name='';for(let j=0;j<nc;j++){const t=txt(R[j]);if(t&&isNaN(+t.replace(',','.'))){name=t;break;}if(t&&/^\d{2,4}(\.\d+)?$/.test(t)){name=t;break;}}
    if(/^контрагент/i.test(name)){started=true;continue;}
    const v={sD:osvNum(R[C.sD]),sC:osvNum(R[C.sC]),tD:osvNum(R[C.tD]),tC:osvNum(R[C.tC]),eD:osvNum(R[C.eD]),eC:osvNum(R[C.eC])};
    if(/^(разом|всього|підсумок|итого|усього)/i.test(name)){cur=null;continue;}
    if(isSkip(name))continue;started=true;
    if(isContract(name)){if(cur)cur.contracts.push({name,...v});continue;}
    cur={name,row:i+1,...v,contracts:[]};items.push(cur);}
  items.forEach(x=>{x.start=Math.round((x.sD-x.sC)*100)/100;x.end=Math.round((x.eD-x.eC)*100)/100;x.charge=x.tD;x.paid=x.tC;
    x.check=Math.abs(x.start+x.charge-x.paid-x.end)<0.02;});
  return {cols:C,period,items,head};}
/* --- Правило дедлайну --- */
function osvDue(per,row,x){if(x.end<=0.004)return null;if(row&&row.dueManual&&row.due)return row.due;const base=per+'-10';
  if(x.start>0.004){const prevDue=perShift(per,-1)+'-10';return row&&row.due&&row.due<=base?row.due:prevDue;}return base;}
/* --- Імпорт: вибір файлу → розбір → зіставлення → перевірка → запис --- */
/* Тип рахунку в ОСВ: за назвою аркуша або текстом шапки */
const OSV_TYPE={opex:/opex|опекс|експлуатаці/i,util:/комунал|електроенерг|водопостач|теплопостач/i,park:/паркомісц|паркінг|машино-?місц/i,mkt:/маркетинг|рекламн/i};
function osvDetect(t){t=String(t||'');for(const k in OSV_TYPE)if(OSV_TYPE[k].test(t))return k;return null;}
function osvShName(id){return (DZ_SHEETS.find(s=>s.id===id)||{}).name||id;}
const OSV_PO={opex:'OPEX',util:'Комунальних',park:'Паркомісцях',mkt:'Маркетингу'};
/* Крок 1: вибір типу рахунку та місяця — до вибору файлу */
function osvImport(per){let sel=S.dzCat&&S.dzCat!=='all'&&DZ_SHEETS.some(s=>s.id===S.dzCat)?S.dzCat:null;
  const opts=el('div',{class:'osv-types',role:'radiogroup','aria-label':'Тип рахунку'});
  const go=el('button',{class:'btn',type:'button',style:'flex:1',disabled:sel?null:true,onclick:()=>{closeSheet();osvPickFile(per,sel);}},svg(IC_UP),' Вибрати файл');
  const draw=()=>{opts.replaceChildren(...DZ_SHEETS.map(s=>{const rs=dzRows(per,s.id);const debt=rs.reduce((a,r)=>{const c=dzCalc(r);return a+(c.debt>0?c.debt:0);},0);
    return el('button',{type:'button',class:'osv-ty',role:'radio','aria-checked':String(sel===s.id),style:'--tc:'+s.c[dzDark()?1:0],onclick:()=>{sel=s.id;go.disabled=false;draw();}},
      el('i'),el('span',{class:'osv-tyn'},el('b',{text:s.name}),el('small',{text:rs.length?rs.length+' рядків · борг '+uah(debt,true)+' ₴':'ще немає даних за місяць'})));}));};
  draw();
  openSheet(el('h2',{text:'Імпорт ОСВ'}),el('p',{class:'muted',style:'margin:0'},'Місяць: ',el('b',{text:perLabel(per)})),
    el('span',{class:'flabel',text:'Який тип рахунку оновлюємо?'}),opts,
    el('p',{class:'muted small',style:'margin:0',text:'Буде змінено лише вибраний тип за цей місяць. Інші типи дебіторки не зміняться.'}),
    el('div',{class:'row'},go,el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати')));}
/* Крок 2: файл → дані лише для вибраного типу */
async function osvPickFile(per,sheet){const f=await xlsxPick();if(!f)return;const {wb,X}=f;const parsed=[];let err='';
  for(const nm of wb.SheetNames){try{const r=osvParse(sheetAoa(X,wb.Sheets[nm]));if(r.items.length)parsed.push({nm,r,type:osvDetect(nm)||osvDetect(r.head)});}catch(e){err=e.message;}}
  if(!parsed.length){toast(err||'У файлі не знайдено даних ОСВ — нічого не змінено');return;}
  let hit=parsed.find(x=>x.type===sheet);let untyped=false;
  if(!hit){if(parsed.some(x=>x.type)){const has=[...new Set(parsed.map(x=>x.type).filter(Boolean))].map(osvShName).join(', ');
      openSheet(el('h2',{text:'Немає даних по '+(OSV_PO[sheet]||osvShName(sheet))}),el('p',{style:'margin:0',text:'У файлі «'+f.name+'» немає даних по '+(OSV_PO[sheet]||osvShName(sheet))+' — нічого не змінено.'}),
        el('p',{class:'muted small',style:'margin:0',text:'Знайдено дані по: '+has+'. Оберіть відповідний тип або інший файл.'}),el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Зрозуміло'));return;}
    hit=parsed[0];untyped=true;}
  let al={};try{const sn=await S.db.doc('resolve/osv').get();const m=sn.exists?(sn.data().map||{}):{};Object.keys(m).forEach(k=>{const i=k.indexOf(':');if(k.slice(0,i)===sheet)al[k.slice(i+1)]=m[k];});}catch(e){}
  S.osv={per,file:f.name,sheetName:hit.nm,P:hit.r,al,sheet,untyped,pick:{}};osvSheetUi();}
function osvTargets(){const o=S.osv;return dzRows(o.per,o.sheet).filter(r=>r.tenant);}
function osvMatch(x){const o=S.osv;const rows=osvTargets();const k=NM.key(x.name);const pk=o.pick[x.row];
  if(pk==='__skip')return {st:'skip'};if(pk==='__new')return {st:'new'};
  if(pk){const r=rows.find(y=>y.id===pk);if(r)return {st:'ok',r,s:1,how:'вручну'};}
  const a=o.al[k];if(a){const r=rows.find(y=>y.id===a.id)||rows.find(y=>NM.key(y.tenant)===a.tk&&dzBld(y.bld)===a.bld);if(r)return {st:'ok',r,s:1,how:'аліас'};}
  const sc=rows.map(r=>({r,s:Math.max(NM.score(x.name,r.tenant),...String(r.tenant).split(/[()]/).filter(p=>p.trim().length>2).map(p=>NM.score(x.name,p)))})).sort((p,q)=>q.s-p.s);
  const t=sc[0];if(!t||t.s<.72)return {st:'none',alt:sc.slice(0,3)};const amb=sc[1]&&t.s-sc[1].s<.05;
  return {st:t.s>=.86&&!amb?'ok':'review',r:t.r,s:t.s,how:'схожість',amb:amb?sc[1].r:null};}
function osvSheetUi(){const o=S.osv;const P=o.P;const rows=osvTargets();const ms=P.items.map(x=>({x,m:osvMatch(x)}));
  const cnt={ok:0,review:0,none:0,skip:0,new:0};ms.forEach(z=>cnt[z.m.st]++);
  const wrongPer=P.period&&P.period!==o.per;
  const list=el('div',{class:'osv-list'},ms.map(({x,m})=>{const sel=el('select',{class:'osv-sel','aria-label':'Резидент для '+x.name,onchange:e=>{o.pick[x.row]=e.target.value||undefined;osvSheetUi();}},
      el('option',{value:'',text:m.r?(m.st==='ok'?'✓ ':'? ')+m.r.tenant+(m.r.room?' · '+m.r.room:''):'— оберіть резидента —'}),
      rows.map(r=>el('option',{value:r.id,selected:o.pick[x.row]===r.id?true:null,text:r.tenant+' · буд. '+dzBld(r.bld)+(r.room?' / '+r.room:'')})),
      el('option',{value:'__new',selected:o.pick[x.row]==='__new'?true:null,text:'+ Додати новим рядком'}),el('option',{value:'__skip',selected:o.pick[x.row]==='__skip'?true:null,text:'— Не розносити'}));
    const st=m.st==='review'&&!o.pick[x.row]?'review':m.st;
    return el('div',{class:'osv-it osv-'+st},
      el('div',{class:'osv-top'},el('span',{class:'osv-nm'},el('b',{text:x.name}),el('small',{class:'muted',text:x.contracts.length?x.contracts.map(c=>c.name).join(' · '):'без договорів'})),
        el('span',{class:'osv-tag',text:{ok:'зіставлено'+(m.how?' · '+m.how:''),review:(m.amb?'кілька схожих · ':'перевірте · ')+Math.round((m.s||0)*100)+'%',none:'не знайдено',skip:'пропущено',new:'новий рядок'}[st]})),
      el('div',{class:'osv-nums'},[['Поч. сальдо',x.start],['Нараховано',x.charge],['Оплачено',x.paid],['Кін. сальдо',x.end]].map(([l,v])=>el('span',{},el('small',{text:l}),el('b',{class:l==='Кін. сальдо'&&v>0?'neg':'',text:uah(v)})))),
      x.check?null:el('small',{class:'osv-warn',text:'Сальдо не сходиться: поч. + нарах. − опл. ≠ кін.'}),
      st==='review'&&m.r?el('div',{class:'row',style:'gap:6px'},sel,el('button',{class:'btn sm',type:'button',onclick:()=>{o.pick[x.row]=m.r.id;osvSheetUi();}},'Підтвердити')):sel);}));
  const go=el('button',{class:'btn',type:'button',disabled:cnt.ok+cnt.new?null:true,onclick:()=>osvApply()},'Рознести ('+(cnt.ok+cnt.new)+')');
  openSheet(el('h2',{text:'Імпорт ОСВ · '+osvShName(o.sheet)}),el('p',{class:'muted small',style:'margin:0',text:'Файл: '+o.file+' · контрагентів: '+P.items.length}),
    wrongPer?el('p',{class:'osv-warn',style:'margin:0',text:'Увага: ОСВ за '+perLabel(P.period)+', а відкрито '+perLabel(o.per)+'.'}):null,
    el('div',{class:'osv-target'},el('span',{},'Тип: ',el('b',{text:osvShName(o.sheet)})),el('span',{},'Місяць: ',el('b',{text:perLabel(o.per)})),el('span',{class:'muted',text:'аркуш «'+o.sheetName+'»'})),
    o.untyped?el('p',{class:'osv-warn',style:'margin:0',text:'У файлі не вказано тип рахунку — дані буде записано як «'+osvShName(o.sheet)+'». Переконайтесь, що це правильна ОСВ.'}):null,
    el('div',{class:'osv-sum'},[['ok','Зіставлено'],['review','Перевірити'],['none','Не знайдено'],['new','Нові'],['skip','Пропущено']].map(([k,l])=>el('span',{class:'osv-c osv-'+k},el('b',{text:String(cnt[k])}),l))),
    el('p',{class:'muted small',style:'margin:0',text:'Сальдо = Дебет − Кредит (передоплата зменшує борг). Дедлайн: 10-те число місяця; зі старим боргом — дата не відсувається; ручні дати менеджера не перезаписуються.'}),
    list,el('div',{class:'row'},go,el('button',{class:'btn ghost',type:'button',onclick:()=>{S.osv=null;closeSheet();}},'Скасувати')));}
async function osvApply(){const o=S.osv;if(!o)return;const P=o.P;const rows=osvTargets();const acc={};const neu={};const al={...o.al};const now=Date.now();
  P.items.forEach(x=>{const m=osvMatch(x);const pk=o.pick[x.row];
    if(m.st==='ok'){const a=acc[m.r.id]=acc[m.r.id]||{r:m.r,start:0,charge:0,paid:0,end:0,names:[],contracts:[]};['start','charge','paid','end'].forEach(k=>a[k]+=x[k]);a.names.push(x.name);a.contracts.push(...x.contracts.map(c=>c.name));
      if(pk&&pk!=='__new'&&pk!=='__skip')al[NM.key(x.name)]={id:m.r.id,tk:NM.key(m.r.tenant),bld:dzBld(m.r.bld),name:x.name,at:now,sheet:o.sheet};}
    else if(m.st==='new')neu['r'+now.toString(36)+'_'+x.row]={x};});
  const upd={};const r2=v=>Math.round(v*100)/100;
  Object.entries(acc).forEach(([id,a])=>{const x={start:r2(a.start),charge:r2(a.charge),paid:r2(a.paid),end:r2(a.end)};const due=osvDue(o.per,a.r,x);
    upd[id]={start:x.start,charge:x.charge,paid:x.paid,due,osvEnd:x.end,osvName:a.names.join('; '),osvContracts:[...new Set(a.contracts)].slice(0,10),osvAt:now,
      status:x.end<=0.004?'Сплачено':(a.r.status==='Сплачено'?'':a.r.status||''),updatedAt:now,updatedBy:S.myId};});
  let ord=rows.reduce((m,r)=>Math.max(m,r.order||0),0);
  Object.entries(neu).forEach(([id,{x}])=>{upd[id]={bld:'',room:'',tenant:x.name,start:x.start,charge:x.charge,paid:x.paid,due:osvDue(o.per,null,x),osvEnd:x.end,osvName:x.name,osvContracts:x.contracts.map(c=>c.name).slice(0,10),osvAt:now,status:x.end<=0.004?'Сплачено':'',order:++ord,updatedAt:now,updatedBy:S.myId};});
  const n=Object.keys(upd).length;if(!n){toast('Немає що розносити — нічого не змінено');return;}closeSheet();
  const docId=o.per+'_'+o.sheet;const before=dzRows(o.per,o.sheet).reduce((a,r)=>{const c=dzCalc(r);return a+(c.debt>0?c.debt:0);},0);
  const merged={};Object.entries(((S.dz[docId]||{}).rows)||{}).forEach(([id,r])=>{if(r&&!r.deleted)merged[id]={...r};});Object.entries(upd).forEach(([id,r])=>{merged[id]={...(merged[id]||{}),...r};});
  const after=Object.values(merged).filter(r=>!(o.sheet==='park'&&(DZ_NOREC.includes(r.status)||!r.tenant))).reduce((a,r)=>{const c=dzCalc(r);return a+(c.debt>0?c.debt:0);},0);
  const nNew=Object.keys(upd).filter(id=>!(((S.dz[docId]||{}).rows||{})[id])).length;const name=osvShName(o.sheet);
  let ok=true;try{await (S.dz[docId]?S.db.doc('dz/'+docId).update({rows:upd}):S.db.doc('dz/'+docId).set({per:o.per,sheet:o.sheet,rows:upd}));}catch(e){ok=false;logErr&&logErr('ОСВ '+name+': '+((e&&(e.code||e.message))||e));}
  if(!ok){toast('Не вдалося записати — нічого не змінено');S.osv=null;return;}
  devLog('ОСВ → '+name+' · '+perLabel(o.per)+': оновлено '+(n-nNew)+', нових '+nNew+'; борг '+uah(before,true)+' → '+uah(after,true)+' ₴',null,'файл: '+o.file+' · аркуш: '+o.sheetName);
  try{const sn=await S.db.doc('resolve/osv').get();const all=sn.exists?(sn.data().map||{}):{};Object.entries(al).forEach(([k,v])=>{if(v&&v.at===now)all[o.sheet+':'+k]=v;});await S.db.doc('resolve/osv').set({map:all,at:now});}catch(e){}
  S.osv=null;
  openSheet(el('div',{class:'osv-done'},el('span',{class:'osv-dic'},svg('<path d="m5 12 5 5 9-10"/>')),el('div',{},el('h2',{style:'margin:0',text:'ОСВ імпортовано'}),el('span',{class:'muted small',text:o.file}))),
    el('div',{class:'dz-info'},[['Тип рахунку',name],['Місяць',perLabel(o.per)],['Оновлено рядків',String(n-nNew)+(nNew?' + '+nNew+' нових':'')],['Борг по «'+name+'»',uah(after)+' ₴'],['Було до імпорту',uah(before)+' ₴']].map(([a,b])=>el('div',{},el('small',{text:a}),el('b',{text:b})))),
    el('p',{class:'muted small',style:'margin:0',text:'Інші типи дебіторки не змінювались.'}),el('button',{class:'btn',type:'button',onclick:()=>{closeSheet();S.dzCat=o.sheet;render();}},'Показати «'+name+'»'));}
/* OSV:END */
async function dzImport(per){const f=await xlsxPick();if(!f)return;const {wb,X}=f;const res={};const warn=[];const lines=[];
  const pat={opex:/opex/i,util:/комун/i,park:/парко/i,mkt:/маркет/i};
  for(const sh of DZ_SHEETS){const nm=wb.SheetNames.find(n=>n===sh.xl)||wb.SheetNames.find(n=>pat[sh.id].test(n));if(!nm){warn.push('Немає аркуша «'+sh.xl+'» — '+sh.name+' не змінюю');continue;}
    const a=sheetAoa(X,wb.Sheets[nm]);const o=sh.park?1:0;const ex=dzRows(per,sh.id);const key=r=>[dzBld(r.bld),lc(r.room),lc(r.tenant)].join('|');const used=new Set();const rows={};const st={nw:0,ch:0,del:0};let n=0;
    for(let i=1;i<a.length;i++){const R=a[i]||[];if(/^всього/i.test(strP(R[0])))break;let b=R[0];if(b instanceof Date){const d=new Date(b.getTime()+12*36e5);b=d.getDate()+'.'+(d.getMonth()+1);}
      const r={bld:dzBld(strP(b)),room:strP(R[1]),tenant:strP(R[2+o]),start:numP(R[3+o]),charge:numP(R[4+o]),paid:numP(R[6+o]),due:dateP(R[12+o]),status:strP(R[13+o]),resp:strP(R[14+o])};{const p=r.status.split(' / ');if(p.length>1){r.status=p[0].trim();r.act=p.slice(1).join(' / ').trim();}else r.act='';}if(sh.park)r.no=strP(R[2]);
      if(!r.tenant&&!r.status&&!(r.start||r.charge||r.paid))continue;n++;
      const m=ex.find(x=>!used.has(x.id)&&key(x)===key(r));let id;
      if(m){id=m.id;used.add(id);if(['start','charge','paid','due','status','resp','act'].some(k=>String(m[k]??'')!==String(r[k]??'')))st.ch++;}else{id='r'+Date.now().toString(36)+'_'+i;st.nw++;}
      r.order=i;rows[id]=r;}
    st.del=ex.filter(x=>!used.has(x.id)).length;res[sh.id]=rows;const debt=Object.values(rows).reduce((s,r)=>{const c=dzCalc(r);return s+(c.debt>0?c.debt:0);},0);
    lines.push([sh.name,n+' рядків · борг '+uah(debt,true)+' ₴']);lines.push(['зміни',chg(st),'sub']);}
  if(!Object.keys(res).length){toast('У файлі немає аркушів дебіторки');return;}
  impPreview('Оновити дебіторку · '+perLabel(per),f.name,lines,warn,async()=>{for(const id in res)await S.db.doc('dz/'+per+'_'+id).set({per,sheet:id,rows:res[id],at:Date.now(),by:S.myId});});}

/* імпорт: сміття */
async function wsImport(per){const f=await xlsxPick();if(!f)return;const {wb,X}=f;const got=[];const warn=[];
  for(const nm of wb.SheetNames){const a=sheetAoa(X,wb.Sheets[nm]);
    if(/локац/i.test(nm)){for(let i=1;i<a.length;i++){const R=a[i]||[];const t=strP(R[0]);if(!t||/^(сума|разом)/i.test(t))continue;got.push({bld:WS_LOC,floor:'',tenant:t,vol:numP(R[1],1)});}continue;}
    for(let i=0;i<a.length;i++)for(let c=0;c<(a[i]||[]).length;c++){const m=strP(a[i][c]).match(/^буд(?:инок|\.)?\s*([\d][\d.,\s]*)$/i);if(!m)continue;const b=m[1].replace(/\s/g,'');
      for(let j=i+2;j<a.length;j++){const R=a[j]||[];const fl=strP(R[c]),t=strP(R[c+1]);if(/^(буд|сума|разом)/i.test(fl))break;if(!t){if(!fl&&!strP(R[c+2]))break;continue;}got.push({bld:b,floor:fl,tenant:t,vol:numP(R[c+2],1)});}}}
  if(!got.length){toast('Не знайшов таблиці сміття у файлі');return;}
  const ex=wsRows(per);const used=new Set();const rows={};const st={nw:0,ch:0,del:0};
  got.forEach((r,i)=>{const m=ex.find(x=>!used.has(x.id)&&x.bld===r.bld&&lc(x.tenant)===lc(r.tenant));let id;if(m){id=m.id;used.add(id);if((m.vol??null)!==(r.vol??null)||String(m.floor||'')!==r.floor)st.ch++;}else{id='w'+Date.now().toString(36)+'_'+i;st.nw++;}rows[id]={...r,order:i+1};});
  st.del=ex.filter(x=>!used.has(x.id)).length;const tot=got.reduce((s,r)=>s+(+r.vol||0),0);const bl=wsBlds(got);
  impPreview('Оновити облік сміття · '+perLabel(per),f.name,[['Резидентів',String(got.length)],['Разом',fl(tot)+' л'],...bl.map(b=>[wsName(b),fl(got.filter(r=>r.bld===b).reduce((s,r)=>s+(+r.vol||0),0))+' л','sub']),['Зміни',chg(st)]],warn,
    async()=>{await S.db.doc('waste/'+per).set({per,rows,at:Date.now(),by:S.myId});});}

/* імпорт: вода */
async function wImport(per){if(!S.wPerD[per]){toast('Спочатку створіть період «'+perLabel(per)+'»');return;}const f=await xlsxPick();if(!f)return;const {wb,X}=f;
  const reads={},upd=[],adds=[],warn=[];let nObj=0,nM=0,nF=0;const sn=x=>x.replace(/[\\/?*\[\]:]/g,' ').slice(0,31);
  for(const nm of wb.SheetNames){if(/підсумок/i.test(nm))continue;const o=S.wObj.find(x=>sn(x.name)===nm||x.name===nm||lc(sn(x.name))===lc(nm));if(!o){warn.push('Аркуш «'+nm+'»: такого об’єкта немає — пропущено');continue;}nObj++;
    const a=sheetAoa(X,wb.Sheets[nm]);const ms=S.wMet.filter(m=>m.obj===o.id);const used=new Set();
    for(let i=1;i<a.length;i++){const R=a[i]||[];const typ=strP(R[0]);if(!typ||/^(всього|відхилення)|^загальнобудинкові \(/i.test(typ)||!/резидент|загальнобуд/i.test(typ))continue;
      const d={kind:/резидент/i.test(typ)?'res':'main',section:strP(R[1]),floor:strP(R[2]),room:strP(R[3]),tech:strP(R[4]),tenant:strP(R[5]),serial:strP(R[6]),note:strP(R[7])};const s=numP(R[8],3),e=numP(R[9],3);nM++;if(s!=null&&e!=null)nF++;
      let m=d.serial?ms.find(x=>!used.has(x.id)&&String(x.serial||'').trim()===d.serial):null;if(!m)m=ms.find(x=>!used.has(x.id)&&x.kind===d.kind&&lc(x.tenant)===lc(d.tenant)&&String(x.room||'')===d.room);
      if(!m)m=ms.find(x=>!used.has(x.id)&&x.kind===d.kind&&lc(x.tenant)===lc(d.tenant));
      if(m){used.add(m.id);const diff={};['section','floor','room','tech','tenant','serial','note'].forEach(k=>{if(String(m[k]??'')!==d[k])diff[k]=d[k];});if(Object.keys(diff).length)upd.push([m.id,diff]);reads[m.id]={s,e};}
      else adds.push({d:{...d,obj:o.id,active:true,order:(ms.length?Math.max(...ms.map(x=>x.order||0)):0)+adds.length+1},s,e});}}
  if(!nObj){toast('У файлі немає аркушів з об’єктами обліку води');return;}
  impPreview('Оновити облік води · '+perLabel(per),f.name,[['Об’єктів',String(nObj)],['Лічильників у файлі',String(nM)],['З показниками',String(nF)],['Змінено дані лічильників',String(upd.length)],['Нових лічильників',String(adds.length)]],warn,
    async()=>{const ad={};adds.forEach((x,k)=>{const id='m'+Date.now().toString(36)+k;ad[id]=x;});for(const id in ad)await S.db.doc('wMeters/'+id).set({...ad[id].d,at:Date.now()});
      for(const [id,diff] of upd)await S.db.doc('wMeters/'+id).update(diff);const r2={...reads};for(const id in ad)r2[id]={s:ad[id].s,e:ad[id].e};await S.db.doc('wPeriods/'+per).update({reads:r2});});}
