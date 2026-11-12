// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: порівняння дебіторки з минулим періодом.

/* DZCMP:BEGIN — порівняння дебіторки з минулим періодом.
   Один розрахунок (dzCmp) і один компонент (dzCmpBlock) для панелі модуля та звіту для інвестора.
   Минулий період: дані модуля за місяць (dz/<per>_<type>) або збережений знімок (колекція dzSnap:
   {per, asOf:'YYYY-MM-DD', src, types:{opex:{charged,paid,debt},…}}). */
function dzSnaps(){return Object.entries(S.dzSnap||{}).filter(([,s])=>s&&s.per&&s.asOf&&s.types).map(([id,s])=>({id,...s}));}
function dzYmdDMY(s){const d=parseYmd(s);return dmy(d);}
/* Дата поточних даних місяця: остання зміна документів/рядків цього місяця */
function dzAsOf(per){let t=0;DZ_SHEETS.forEach(sh=>{const d=S.dz[per+'_'+sh.id];if(!d)return;t=Math.max(t,+d.at||0);Object.values(d.rows||{}).forEach(r=>{if(r)t=Math.max(t,+r.osvAt||0,+r.updatedAt||0);});});
  if(!t){const end=new Date(+per.slice(0,4),+per.slice(5,7),0);return ymd(end<new Date()?end:new Date());}return ymd(new Date(t));}
function dzCmpLabel(key){if(!key)return '';if(key.startsWith('snap:')){const s=(S.dzSnap||{})[key.slice(5)];return s?perLabel(s.per)+' · станом на '+dzYmdDMY(s.asOf):'';}
  const p=key.slice(4);return perLabel(p)+' · станом на '+dzYmdDMY(dzAsOf(p));}
/* Варіанти «Порівняти з» для поточного місяця: знімки й місяці модуля, крім самого поточного */
function dzCmpOpts(cur){const o=[];dzSnaps().filter(s=>s.per<=cur).forEach(s=>o.push({key:'snap:'+s.id,per:s.per,asOf:s.asOf}));
  dzPers().filter(p=>p<cur).forEach(p=>o.push({key:'per:'+p,per:p,asOf:dzAsOf(p)}));
  return o.sort((a,b)=>b.asOf.localeCompare(a.asOf)||(a.key<b.key?-1:1));}
/* За замовчуванням — попередній місяць: знімок за реєстрами, якщо є, інакше дані модуля; інакше найближчий ранній період */
function dzCmpDef(cur){const o=dzCmpOpts(cur);if(!o.length)return null;const pm=perShift(cur,-1);
  return (o.find(x=>x.per===pm&&x.key.startsWith('snap:'))||o.find(x=>x.per===pm)||o[0]).key;}
/* Фільтри модуля (будинок, статус, відповідальний) — без фільтра типу платежу */
function dzCmpF(){return {bld:S.dzBld||'',st:S.dzSt||'',resp:S.dzResp||''};}
function dzCmpHasF(F){return !!(F&&(F.bld||F.st||F.resp));}
function dzCmpRowOk(r,F){if(!F)return true;if(F.bld&&r.bld!==F.bld)return false;if(F.st&&(F.st==='__none'?!!r.status:r.status!==F.st))return false;
  if(F.resp&&(F.resp==='__none'?!!r.resp:r.resp!==F.resp))return false;return true;}
/* Одна сторона порівняння: {kind, per, asOf, types:{id:{debt,charged,paid}}} — лише типи, за якими є дані */
function dzCmpSide(key,F){if(key.startsWith('snap:')){const s=(S.dzSnap||{})[key.slice(5)];if(!s)return null;const types={};
    DZ_SHEETS.forEach(sh=>{const x=s.types[sh.id];if(x&&x.debt!=null)types[sh.id]={debt:+x.debt||0,charged:x.charged!=null?+x.charged:null,paid:x.paid!=null?+x.paid:null};});
    return {kind:'snap',per:s.per,asOf:s.asOf,src:s.src||'',types};}
  const per=key.slice(4);const types={};
  DZ_SHEETS.forEach(sh=>{const all=dzRows(per,sh.id);if(!all.length)return;let debt=0,charged=0,paid=0;
    all.filter(r=>dzCmpRowOk(r,F)).forEach(r=>{const x=dzCalc(r);if(x.debt>0)debt+=x.debt;charged+=x.total;paid+=+r.paid||0;});types[sh.id]={debt,charged,paid};});
  return {kind:'per',per,asOf:dzAsOf(per),types};}
/* Порівняння. Погашено = борг минулий − борг зараз; зміна % = (зараз − минулий) / минулий.
   «Разом» і картки — тільки типи, що є в обох періодах; тип без поточних даних не рахується. */
function dzCmp(prevKey,curPer,F){if(!prevKey||!curPer)return null;
  const snap=prevKey.startsWith('snap:');const fIgn=snap&&dzCmpHasF(F);const Fe=fIgn?null:F;
  const prev=dzCmpSide(prevKey,Fe),cur=dzCmpSide('per:'+curPer,Fe);if(!prev||!cur)return null;
  const rows=DZ_SHEETS.filter(sh=>prev.types[sh.id]).map(sh=>{const p=prev.types[sh.id].debt,c=cur.types[sh.id]?cur.types[sh.id].debt:null;
    return {id:sh.id,name:sh.name,col:sh.c[0],prev:p,cur:c,repaid:c==null?null:p-c,chg:c==null||!p?null:(c-p)/p};});
  const both=rows.filter(r=>r.cur!=null);const tp=both.reduce((a,r)=>a+r.prev,0),tc=both.reduce((a,r)=>a+r.cur,0);
  return {prev,cur,rows,both,tot:{prev:tp,cur:tc,repaid:tp-tc,chg:tp?(tc-tp)/tp:null},
    notInPrev:DZ_SHEETS.filter(sh=>!prev.types[sh.id]&&cur.types[sh.id]).map(sh=>sh.name),noCur:rows.filter(r=>r.cur==null).map(r=>r.name),
    filtered:!!Fe&&dzCmpHasF(Fe),fIgn};}
/* Формат: картки й таблиця — «2,35 млн ₴» / «160,24 тис ₴»; примітка — повні суми */
function dzcS(v){if(v==null||isNaN(v))return '—';const a=Math.abs(v),f=n=>n.toLocaleString('uk-UA',{minimumFractionDigits:2,maximumFractionDigits:2});
  return (v<0?'−':'')+(a>=1e6?f(a/1e6)+' млн ₴':a>=1e3?f(a/1e3)+' тис ₴':f(a)+' ₴');}
function dzcF(v){return (v<0?'−':'')+uah(Math.abs(v))+' ₴';}
function dzcP(p){if(p==null||!isFinite(p))return '—';const n=Math.round(p*100);return (n>0?'+':n<0?'−':'')+Math.abs(n)+'%';}
function dzcAnd(a){return a.length<2?a.join(''):a.slice(0,-1).join(', ')+' та '+a[a.length-1];}
function dzcDM(s){return dm(s);}
/* Компонент блоку: pdf=true — стиль звіту (rp-*), інакше — екран; hl — id типу, який підсвітити */
function dzCmpBlock(C,opt){opt=opt||{};const pdf=!!opt.pdf;const u=UKS.debt;const pa=C.prev.asOf,ca=C.cur.asOf;
  const head=el('div',{class:pdf?'rp-sh':'mt-sh'},el('span',{class:pdf?'rp-ic':'uk-ic',style:pdf?'background:linear-gradient(135deg,'+u.c1+','+u.c2+')':'--c1:'+u.c1+';--c2:'+u.c2},svg(u.ic)),
    el('div',{},el('h3',{text:'Порівняння з минулим періодом'}),el('small',{class:pdf?null:'muted',text:'стан на '+dzYmdDMY(pa)+' → станом на '+dzYmdDMY(ca)})));
  const srcTxt=C.prev.kind==='snap'?'за реєстрами':'за даними модуля';const t=C.tot;const grew=t.repaid<-0.004;
  const cards=el('div',{class:pdf?'rp-ks dzc-ks':'mt-ks dzc-ks'},
    mtKpi('Борг на '+dzcDM(pa),dzcS(t.prev),C.both.length?C.both.map(r=>r.name).join(' + ')+', '+srcTxt:'немає спільних типів'),
    mtKpi('Борг зараз',dzcS(t.cur),'станом на '+dzYmdDMY(ca)),
    grew?mtKpi('Приріст боргу',dzcS(-t.repaid),dzcP(t.chg)+' до рівня '+dzcDM(pa),'bad'):mtKpi('Погашено за період',dzcS(t.repaid),dzcP(t.chg)+' до рівня '+dzcDM(pa),'good'));
  const bar=chg=>{const sh=chg==null?0:Math.max(0,Math.min(1,-chg));return el('span',{class:'dzc-chg'+(chg>0?' up':'')},el('span',{class:'dzc-bar',role:'img','aria-label':'погашено '+Math.round(sh*100)+'%'},el('i',{style:'width:'+Math.round(sh*100)+'%'})),el('b',{text:dzcP(chg)}));};
  const dot=r=>el('span',{class:'dzc-tn'},el('i',{style:'background:'+r.col}),r.name);
  const tbl=el('table',{class:'dzc-t'},el('thead',{},el('tr',{},el('th',{text:'Тип платежу'}),el('th',{class:'num',text:'Борг на '+dzcDM(pa)}),el('th',{class:'num',text:'Борг зараз'}),el('th',{class:'num',text:'Погашено'}),el('th',{class:'num',text:'Зміна'}))),
    el('tbody',{},C.rows.map(r=>el('tr',{class:(opt.hl===r.id?'hl':'')+(r.cur==null?' na':'')},el('td',{},dot(r)),el('td',{class:'num','data-l':'Борг на '+dzcDM(pa),text:dzcS(r.prev)}),
      r.cur==null?el('td',{class:'num dzc-na',colspan:'3',text:'немає поточних даних'}):null,
      r.cur!=null?el('td',{class:'num','data-l':'Борг зараз',text:dzcS(r.cur)}):null,
      r.cur!=null?el('td',{'data-l':r.repaid<-0.004?'Приріст':'Погашено',class:'num '+(r.repaid<-0.004?'dzc-up':'dzc-ok'),text:r.repaid<-0.004?'+'+dzcS(-r.repaid).replace('−',''):dzcS(r.repaid)}):null,
      r.cur!=null?el('td',{class:'num','data-l':'Зміна'},bar(r.chg)):null)),
      el('tr',{class:'dzc-tot'},el('td',{text:'Разом'}),el('td',{class:'num','data-l':'Борг на '+dzcDM(pa),text:dzcS(t.prev)}),el('td',{class:'num','data-l':'Борг зараз',text:dzcS(t.cur)}),el('td',{'data-l':grew?'Приріст':'Погашено',class:'num '+(grew?'dzc-up':'dzc-ok'),text:grew?'+'+dzcS(-t.repaid).replace('−',''):dzcS(t.repaid)}),el('td',{class:'num','data-l':'Зміна'},bar(t.chg)))));
  const n=[];const pd=dzYmdDMY(pa);
  n.push('Борг на '+pd+' '+srcTxt+': '+C.rows.map(r=>r.name+' — '+dzcF(r.prev)).join(', ')+(C.rows.length>1?'; разом '+dzcF(C.rows.reduce((a,r)=>a+r.prev,0)):'')+'.');
  if(C.notInPrev.length)n.push(dzcAnd(C.notInPrev)+(C.prev.kind==='snap'?' у реєстрах на '+pd+' не подавались':' у даних на '+pd+' не було')+', тому в порівнянні не враховані.');
  if(C.noCur.length)n.push('За '+dzcAnd(C.noCur)+' немає поточних даних (реєстр не завантажено) — у «Разом» не враховано.');
  if(C.fIgn)n.push('Знімок містить лише підсумки за реєстрами, тому фільтри будинків, статусів і відповідальних до порівняння не застосовано.');
  else if(C.filtered)n.push('Враховано фільтри модуля (будинок, статус, відповідальний).');
  return el('div',{class:(pdf?'rp-card':'card mt-card')+' dzc'},head,cards,el('div',{class:'dzc-tw'},tbl),el('div',{class:'dzc-note'},n.map(x=>el('p',{text:x}))));}
/* Збережений вибір для звіту: {cur, prev} */
function dzCmpRpKey(cur){let s=null;try{s=JSON.parse(localStorage.getItem('dl.dzCmp')||'null');}catch(e){}
  if(s&&s.cur===cur&&dzCmpOpts(cur).some(o=>o.key===s.prev))return s.prev;return dzCmpDef(cur);}
function dzCmpPanel(per){let cur=per,prev=dzCmpDef(per);const F=dzCmpF();
  const curOpts=dzPers();const box=el('div',{});
  const prevSel=el('select',{id:'dzcPrev'});const curSel=el('select',{id:'dzcCur'},curOpts.slice().reverse().map(p=>el('option',{value:p,text:perLabel(p)+' · станом на '+dzYmdDMY(dzAsOf(p))})));curSel.value=cur;
  const fillPrev=()=>{const o=dzCmpOpts(cur);prevSel.replaceChildren(...(o.length?o.map(x=>el('option',{value:x.key,text:dzCmpLabel(x.key)+(x.key.startsWith('snap:')?' (знімок)':'')})):[el('option',{value:'',text:'Немає даних за попередній період'})]));
    if(!o.some(x=>x.key===prev))prev=dzCmpDef(cur);prevSel.value=prev||'';};
  const draw=()=>{const C=dzCmp(prev,cur,F);box.replaceChildren(C?dzCmpBlock(C,{hl:S.dzCat!=='all'?S.dzCat:null}):el('p',{class:'muted',text:'Немає даних за попередній період.'}));addB.disabled=!C;};
  const addB=el('button',{class:'btn',type:'button',onclick:()=>{try{localStorage.setItem('dl.dzCmp',JSON.stringify({cur,prev}));const o=JSON.parse(localStorage.getItem('dl.mtOpt')||'null')||{};o.debt=true;o.debtCmp=true;localStorage.setItem('dl.mtOpt',JSON.stringify(o));}catch(e){}
    closeSheet();toast('Порівняння додано у звіт: '+perLabel(cur)+(dzCmpHasF(F)?' (у звіті — без фільтрів)':''));}},'Додати у звіт');
  prevSel.addEventListener('change',()=>{prev=prevSel.value;draw();});curSel.addEventListener('change',()=>{cur=curSel.value;fillPrev();prevSel.dispatchEvent(new Event('change'));});
  fillPrev();
  openSheet(el('h2',{style:'margin:0',text:'Порівняння з минулим періодом'}),
    el('div',{class:'grid2'},el('label',{for:'dzcPrev'},'Порівняти з',prevSel),el('label',{for:'dzcCur'},'Поточний стан',curSel)),box,
    el('div',{class:'row'},addB,el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Закрити')));
  const shEl=document.querySelector('#sheetRoot .sheet');if(shEl)shEl.classList.add('wide');draw();}
function dzCmpBtn(per){const ok=dzCmpOpts(per).length>0;const b=el('button',{class:'btn ghost sm',type:'button',title:ok?'Порівняти з минулим періодом':'Немає даних за попередній період','aria-label':'Порівняти з минулим періодом',disabled:ok?null:true,onclick:()=>dzCmpPanel(per)},el('span',{'aria-hidden':'true',text:'⇄'}),' Порівняти');
  return ok?b:el('span',{class:'dzc-dis',title:'Немає даних за попередній період'},b);}
/* DZCMP:END */
function debtView(){const per=dzCurPer();const ps=dzPers();const out=[];const dev=canDz();
  out.push(el('div',{class:'w-per card'},el('button',{class:'iconbtn',type:'button','aria-label':'Попередній місяць',disabled:ps.indexOf(per)<=0?true:null,onclick:()=>{S.dzPer=ps[ps.indexOf(per)-1];render();}},svg('<path d="M15 5l-7 7 7 7"/>')),
    el('div',{class:'w-per-c'},el('b',{text:perLabel(per)}),el('span',{class:'muted small',text:'станом на '+dm(ymd(new Date()))})),
    el('button',{class:'iconbtn',type:'button','aria-label':'Наступний місяць',disabled:ps.indexOf(per)>=ps.length-1?true:null,onclick:()=>{S.dzPer=ps[ps.indexOf(per)+1];render();}},svg('<path d="m9 5 7 7-7 7"/>'))));
  if(!ps.length){out.push(el('div',{class:'card empty'},el('p',{class:'muted',text:'Даних дебіторської заборгованості ще немає.'})));return out;}
  const blds=[...new Set(DZ_SHEETS.flatMap(sh=>dzRows(per,sh.id).map(r=>r.bld)).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'uk',{numeric:true}));
  const bsel=el('select',{class:'dz-bsel','aria-label':'Будинок'},el('option',{value:'',text:'Усі будинки'}),blds.map(b=>el('option',{value:b,text:b})));bsel.value=S.dzBld||'';bsel.addEventListener('change',()=>{S.dzBld=bsel.value;render();});
  const allR=DZ_SHEETS.flatMap(sh=>dzRows(per,sh.id));const stOpts=[...new Set([...DZ_ST.filter(x=>!DZ_NOREC.includes(x)),...allR.map(r=>r.status).filter(Boolean)])];
  const actOpts=[...new Set([...DZ_ACTS,...allR.map(r=>r.act).filter(Boolean)])];const respOpts=[...new Set(allR.map(r=>r.resp).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'uk'));
  const fsel=el('div',{class:'dz-fsel'},bsel,dzSel('Усі статуси','dzSt',stOpts,'Без статусу'),dzSel('Усі заходи','dzAct',actOpts,'Заходів не вжито'),dzSel('Усі відповідальні','dzResp',respOpts,'Не призначено'),
    (S.dzBld||S.dzSt||S.dzAct||S.dzResp||S.dzBuck)?el('button',{class:'btn ghost sm',type:'button',onclick:()=>{S.dzBld='';S.dzSt='';S.dzAct='';S.dzResp='';S.dzBuck=null;render();}},'✕ Скинути фільтри'):null);
  out.push(el('div',{class:'dz-filters'},el('div',{class:'dz-chips'},[['all','Усі'],...DZ_SHEETS.map(x=>[x.id,x.name])].map(([k,l])=>{const sh=DZ_SHEETS.find(x=>x.id===k);return el('button',{type:'button',class:'dz-chip','aria-pressed':String(S.dzCat===k),onclick:()=>{S.dzCat=k;render();}},sh?el('i',{style:'background:'+sheetCol(sh)}):null,l);})),
    el('div',{class:'dz-acts'},dev?el('button',{class:'btn sm',type:'button',title:'Завантажити оборотно-сальдову відомість 1С/BAS',onclick:()=>osvImport(per)},svg('<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h8M9 17h5"/>'),' З ОСВ'):null,dzCmpBtn(per),...ioBtns(()=>dzExport(per),dev?()=>dzImport(per):null),dev?el('button',{class:'btn ghost sm',type:'button',onclick:()=>dzNewMonth(per)},WIDE.matches?'+ Новий місяць':'+ Місяць'):null)));
  out.push(fsel);
  const rows=dzAll(per).map(r=>({...r,...dzCalc(r)}));
  const sum=f=>rows.reduce((a,r)=>a+(f(r)||0),0);const charged=sum(r=>r.total),paid=sum(r=>+r.paid||0),debt=sum(r=>r.debt>0?r.debt:0),over=sum(r=>r.debt<0?-r.debt:0),newCh=sum(r=>+r.charge||0);
  const debtors=rows.filter(r=>r.debt>0.004);const rate=charged?paid/charged:0;const overdue=sum(r=>r.b&&r.b!=='ok'?r.debt:0);const crit=sum(r=>r.b==='b3'?r.debt:0);
  out.push(dzEquation(per,rows));
  // aging
  const ag=DZ_B.map(b=>({...b,v:sum(r=>r.b===b.k?r.debt:0),n:rows.filter(r=>r.b===b.k).length}));const agT=ag.reduce((a,x)=>a+x.v,0)||1;
  const agBar=el('div',{class:'dz-stack',role:'img','aria-label':'Структура боргу за строками'},ag.filter(x=>x.v>0).map(x=>hov(el('span',{style:'flex:'+x.v+';background:'+x.c}),()=>[el('b',{text:x.name}),el('div',{text:uah(x.v)+' ₴ · '+x.n+' резид.'}),el('div',{class:'muted',text:Math.round(x.v/agT*100)+'% боргу'})])));
  const agCard=el('div',{class:'card dz-card'},el('div',{class:'dz-ch'},el('b',{text:'Строки заборгованості'}),el('span',{class:'muted small',text:'від прогнозної дати сплати'})),agBar,
    el('div',{class:'dz-leg'},ag.map(x=>el('button',{type:'button',class:'dz-li',onclick:()=>{S.dzBuck=S.dzBuck===x.k?null:x.k;render();setTimeout(()=>{const t=document.querySelector('.dz-tbl-wrap');if(t)t.scrollIntoView({behavior:'smooth'});},50);},'aria-pressed':String(S.dzBuck===x.k)},el('i',{style:'background:'+x.c}),el('span',{text:x.name}),el('b',{text:uah(x.v,true)}),el('small',{text:x.n})))));
  // categories
  const cat=DZ_SHEETS.filter(sh=>S.dzCat==='all'||S.dzCat===sh.id).map(sh=>{const rs=rows.filter(r=>r.sheet===sh.id);return {sh,debt:rs.reduce((a,r)=>a+(r.debt>0?r.debt:0),0),ch:rs.reduce((a,r)=>a+r.total,0),pd:rs.reduce((a,r)=>a+(+r.paid||0),0),n:rs.filter(r=>r.debt>0.004).length};});
  const cMax=Math.max(1,...cat.map(c=>c.debt));
  const catCard=el('div',{class:'card dz-card'},el('div',{class:'dz-ch'},el('b',{text:'Борг за видами платежів'})),el('div',{class:'dz-bars'},cat.map(c=>hov(el('div',{class:'dz-br'},el('span',{class:'dz-bl'},el('i',{style:'background:'+sheetCol(c.sh)}),c.sh.name),el('div',{class:'dz-bt'},el('span',{style:'width:'+Math.max(c.debt>0?2:0,c.debt/cMax*100)+'%;background:'+sheetCol(c.sh)})),el('b',{text:uah(c.debt,true)})),
    ()=>[el('b',{text:c.sh.name}),el('div',{text:'Борг: '+uah(c.debt)+' ₴'}),el('div',{text:'Нараховано: '+uah(c.ch)+' ₴'}),el('div',{text:'Сплачено: '+uah(c.pd)+' ₴ ('+(c.ch?Math.round(c.pd/c.ch*100):0)+'%)'}),el('div',{class:'muted',text:c.n+' боржників'})]))));
  // top debtors
  const byT={};debtors.forEach(r=>{const k=(r.tenant||'—').trim();(byT[k]=byT[k]||{n:k,v:0,parts:{},worst:-1}).v+=r.debt;byT[k].parts[r.sheet]=(byT[k].parts[r.sheet]||0)+r.debt;byT[k].worst=Math.max(byT[k].worst,DZ_B.findIndex(b=>b.k===r.b));});
  const top=Object.values(byT).sort((a,b)=>b.v-a.v).slice(0,8);const tMax=Math.max(1,...top.map(t=>t.v));
  const topCard=el('div',{class:'card dz-card'},el('div',{class:'dz-ch'},el('b',{text:'Найбільші боржники'}),el('span',{class:'muted small',text:'топ-'+top.length})),top.length?el('div',{class:'dz-top'},top.map((t,i)=>hov(el('button',{type:'button',class:'dz-tr',onclick:()=>{S.dzQ=t.n;S.dzBuck=null;render();setTimeout(()=>{const x=document.querySelector('.dz-tbl-wrap');if(x)x.scrollIntoView({behavior:'smooth'});},50);}},
      el('span',{class:'dz-tn'},el('em',{text:String(i+1)}),el('span',{text:t.n}),el('i',{class:'dz-dot',style:'background:'+DZ_B[t.worst].c,title:DZ_B[t.worst].name})),
      el('div',{class:'dz-seg'},DZ_SHEETS.filter(sh=>t.parts[sh.id]).map(sh=>el('span',{style:'width:'+(t.parts[sh.id]/tMax*100)+'%;background:'+sheetCol(sh)}))),el('b',{text:uah(t.v,true)})),
      ()=>[el('b',{text:t.n}),...DZ_SHEETS.filter(sh=>t.parts[sh.id]).map(sh=>el('div',{text:sh.name+': '+uah(t.parts[sh.id])+' ₴'})),el('div',{class:'muted',text:'найгірший строк: '+DZ_B[t.worst].name})]))):el('p',{class:'muted',text:'Боржників немає 🎉'}));
  // by building & responsible
  const byB={};debtors.forEach(r=>{const k=r.bld||'—';byB[k]=(byB[k]||0)+r.debt;});const bE=Object.entries(byB).sort((a,b)=>b[1]-a[1]);const bMax=Math.max(1,...bE.map(x=>x[1]));
  const byR={};debtors.forEach(r=>{const k=r.resp||'Не призначено';(byR[k]=byR[k]||{v:0,n:0,k:r.resp?k:'__none'}).v+=r.debt;byR[k].n++;});
  const recRows=rows.filter(r=>!DZ_NOREC.includes(r.status));const byS={};recRows.forEach(r=>{const k=r.status||'Без статусу';const x=(byS[k]=byS[k]||{v:0,n:0,d:0,k:r.status?k:'__none'});x.n++;if(r.debt>0.004){x.d++;x.v+=r.debt;}});
  const sMax=Math.max(1,...Object.values(byS).map(x=>x.n));
  const sideCard=el('div',{class:'card dz-card'},el('div',{class:'dz-ch'},el('b',{text:'За будинками'})),el('div',{class:'dz-bars'},bE.map(([k,v])=>el('div',{class:'dz-br'},el('span',{class:'dz-bl',text:k}),el('div',{class:'dz-bt'},el('span',{style:'width:'+(v/bMax*100)+'%;background:var(--accent)'})),el('b',{text:uah(v,true)})))),
    el('div',{class:'dz-ch',style:'margin-top:8px'},el('b',{text:'Відповідальні'})),el('div',{class:'dz-resp'},Object.entries(byR).sort((a,b)=>b[1].v-a[1].v).map(([k,x])=>el('button',{type:'button',class:'dz-rc rc-btn','aria-pressed':String(S.dzResp===x.k),onclick:()=>{S.dzResp=S.dzResp===x.k?'':x.k;render();}},el('b',{text:k}),el('small',{text:x.n+' '+plural(x.n,'боржник','боржники','боржників')+' · '+uah(x.v,true)+' ₴'})))),
    el('div',{class:'dz-ch',style:'margin-top:8px'},el('b',{text:'Статуси'}),el('span',{class:'muted small',text:'натисніть, щоб відфільтрувати'})),
    el('div',{class:'dz-sts'},el('div',{class:'dz-sr h'},el('span',{text:'Статус'}),el('span',{text:'Записів'}),el('span',{text:'З боргом'}),el('span',{text:'Сума боргу'})),
      Object.entries(byS).sort((a,b)=>b[1].v-a[1].v||b[1].n-a[1].n).map(([k,x])=>el('button',{type:'button',class:'dz-sr','aria-pressed':String(S.dzSt===x.k),onclick:()=>{S.dzSt=S.dzSt===x.k?'':x.k;render();}},
        el('span',{class:'dz-sr-n'},k==='Без статусу'?el('span',{class:'pill t-mute'},el('i'),k):dzPill(k),el('span',{class:'dz-sr-bar'},el('i',{style:'width:'+(x.n/sMax*100)+'%'}))),
        el('span',{class:'dz-sr-c',text:String(x.n)}),el('span',{class:'dz-sr-c'+(x.d&&k==='Сплачено'?' warn':''),text:x.d?String(x.d):'—',title:x.d&&k==='Сплачено'?'Статус «Сплачено», але є залишок боргу — перевірте':''}),
        el('b',{class:x.v?'':'muted',text:x.v?uah(x.v,true)+' ₴':'0 ₴'})))),
    el('p',{class:'muted small',style:'margin:0',text:'«Записів» — скільки рядків таблиці мають цей статус; «З боргом» — у скількох із них ще є несплачена сума. Вільні паркомісця й госп. потреби сюди не входять.'}));
  out.push(el('div',{class:'dz-grid'},agCard,catCard,topCard,sideCard));
  out.push(dzTable(per,rows));
  return out;}
function dzTable(per,rows){const dev=canDz();const q=(S.dzQ||'').toLowerCase();
  const vis=rows.filter(r=>(!S.dzOnly||r.debt>0.004)&&(!S.dzBuck||r.b===S.dzBuck)&&(!q||[r.tenant,r.room,r.bld,r.status,r.resp,r.no,r.act].join(' ').toLowerCase().includes(q)));
  const qi=el('input',{type:'search',placeholder:'Пошук: резидент, приміщення, статус…',value:S.dzQ||'','aria-label':'Пошук боржників'});qi.addEventListener('input',()=>{S.dzQ=qi.value;const p=qi.selectionStart;render();const n=document.querySelector('.dz-tools input[type=search]');if(n){n.focus();n.setSelectionRange(p,p);}});
  const only=el('input',{type:'checkbox'});only.checked=S.dzOnly;only.addEventListener('change',()=>{S.dzOnly=only.checked;render();});
  const wrap=el('div',{class:'dz-tbl-wrap'},el('div',{class:'row between'},el('h2',{text:'Боржники за видами платежів'}),el('span',{class:'muted small',text:vis.length+' з '+rows.length})),
    el('div',{class:'dz-tools'},qi,el('label',{class:'dz-only'},only,'Лише з боргом'),S.dzBuck?el('button',{class:'btn ghost sm',type:'button',onclick:()=>{S.dzBuck=null;render();}},'✕ '+DZ_B.find(b=>b.k===S.dzBuck).name.split(' · ')[0]):null,
      dev?el('button',{class:'btn sm',type:'button',onclick:()=>dzEdit(per,null,S.dzCat!=='all'?S.dzCat:'opex')},'+ Рядок'):null));
  S.dzOpen=S.dzOpen||{};const filt=!!(q||S.dzBuck);
  for(const sh of DZ_SHEETS){if(S.dzCat!=='all'&&S.dzCat!==sh.id)continue;const rs=vis.filter(r=>r.sheet===sh.id);if(!rs.length&&S.dzCat==='all')continue;
    const all=rows.filter(r=>r.sheet===sh.id);const G=f=>all.reduce((a,r)=>a+(f(r)||0),0);const gDebt=G(r=>r.debt>0?r.debt:0),gTot=G(r=>r.total),gPd=G(r=>+r.paid||0),gN=all.filter(r=>r.debt>0.004).length,gWorst=Math.max(-1,...all.map(r=>DZ_B.findIndex(b=>b.k===r.b)));
    const open=S.dzOpen[sh.id]!=null?S.dzOpen[sh.id]:(filt||S.dzCat===sh.id);
    const grp=el('section',{class:'dzg'+(open?' open':''),style:'--gc:'+sheetCol(sh)});
    const hd=el('button',{type:'button',class:'dzg-h','aria-expanded':String(open),onclick:()=>{const o=!grp.classList.contains('open');grp.classList.toggle('open',o);hd.setAttribute('aria-expanded',String(o));S.dzOpen[sh.id]=o;}},
      el('span',{class:'dzg-ic'},el('i')),el('span',{class:'dzg-t'},el('b',{text:sh.name}),el('small',{text:all.length+' '+plural(all.length,'запис','записи','записів')+' · '+gN+' '+plural(gN,'боржник','боржники','боржників')})),
      el('span',{class:'dzg-m'},el('small',{text:'Нараховано'}),el('b',{text:uah(gTot,true)})),el('span',{class:'dzg-m'},el('small',{text:'Сплачено'}),el('b',{text:uah(gPd,true)}),el('span',{class:'dzg-bar'},el('i',{style:'width:'+(gTot?Math.min(100,gPd/gTot*100):0)+'%'}))),
      el('span',{class:'dzg-m debt'},el('small',{text:'Борг'}),el('b',{text:uah(gDebt,true)+' ₴'})),gWorst>0?el('span',{class:'dzg-w',style:'--bc:'+DZ_B[gWorst].c,title:DZ_B[gWorst].name}):el('span',{class:'dzg-w ok'}),
      el('span',{class:'tg-chev'},svg('<path d="m6 9 6 6 6-6"/>')));
    const t=el('div',{class:'dz-tbl'},el('div',{class:'dz-th-t'},el('span',{class:'muted small',text:'Показано '+rs.length+' з '+all.length+(S.dzOnly?' · лише з боргом':'')}),dev?el('button',{class:'btn ghost sm',type:'button',style:'margin-left:auto',onclick:()=>dzEdit(per,null,sh.id)},'+ Рядок у «'+sh.name+'»'):null),
      el('div',{class:'dz-r dz-h'+(sh.park?' park':'')},[sh.park?'Буд. · місце':'Буд. · прим.','Резидент','Борг на поч.',sh.id==='util'?'Комунальні':sh.id==='park'?'Оренда':sh.id==='mkt'?'Маркетинг':'Платежі OPEX','Всього','Сплачено','Борг','Строк · дата','Статус','Відпов.'].map((x,i)=>el('span',{class:i>=2&&i<=6?'c-n':'',text:x}))));
    rs.forEach(r=>{const B=r.b?DZ_B.find(b=>b.k===r.b):null;
      t.append(el('button',{type:'button',class:'dz-r'+(sh.park?' park':'')+(r.debt<-0.004?' over':'')+(r.b?' has-'+r.b:''),onclick:()=>dev?dzEdit(per,r,sh.id):dzInfo(r,sh)},
        el('span',{class:'c-loc'},el('b',{text:r.bld||'—'}),el('span',{text:sh.park?[r.room,r.no].filter(Boolean).join(' · '):r.room||''})),el('span',{class:'c-ten'},el('b',{text:r.tenant||'—'})),
        el('span',{class:'c-n c-st',text:r.start?uah(+r.start):''}),el('span',{class:'c-n c-ch',text:r.charge?uah(+r.charge):''}),el('span',{class:'c-n c-tot',text:uah(r.total)}),el('span',{class:'c-n c-pd',text:r.paid?uah(+r.paid):''}),
        el('span',{class:'c-n c-debt'},el('b',{text:r.debt<-0.004?'−'+uah(-r.debt):uah(Math.max(0,r.debt))}),r.debt<-0.004?el('small',{text:'переплата'}):null),
        el('span',{class:'c-b'},B?el('span',{class:'dz-bk',style:'--bc:'+B.c},r.days!=null&&r.days>=0?r.days+' дн.':'до строку'):null,r.due&&r.debt>0.004?el('small',{text:'до '+dm(r.due)+'.'+r.due.slice(2,4)+(r.old?' · старий борг':'')+(r.dueManual?' · вручну':'')}):null),el('span',{class:'c-sts'},dzPill(r.status),r.act?el('small',{class:'c-act',text:'↳ '+r.act}):null),el('span',{class:'c-resp',text:r.resp||''})));});
    const T=f=>all.reduce((a,r)=>a+(f(r)||0),0);
    t.append(el('div',{class:'dz-r dz-f'+(sh.park?' park':'')},el('span',{class:'c-loc'},el('b',{text:'ВСЬОГО'})),el('span',{class:'c-ten'}),el('span',{class:'c-n',text:uah(T(r=>+r.start))}),el('span',{class:'c-n',text:uah(T(r=>+r.charge))}),el('span',{class:'c-n',text:uah(T(r=>r.total))}),el('span',{class:'c-n',text:uah(T(r=>+r.paid))}),el('span',{class:'c-n c-debt'},el('b',{text:uah(T(r=>r.debt>0?r.debt:0))})),el('span'),el('span'),el('span')));
    grp.append(hd,el('div',{class:'tg-body'},el('div',{class:'tg-in'},t)));wrap.append(grp);}
  if(!vis.length)wrap.append(el('div',{class:'card empty'},el('p',{class:'muted',text:'Нічого не знайдено'})));
  return wrap;}
function dzInfo(r,sh){openSheet(el('h2',{text:r.tenant||'—'}),el('p',{class:'muted',style:'margin:0',text:sh.name+' · '+[r.bld,r.room].filter(Boolean).join(' · ')}),
  el('div',{class:'dz-info'},[['Борг на початок',uah(+r.start||0)],[sh.charge,uah(+r.charge||0)],['Всього нараховано',uah(r.total)],['Фактично сплачено',uah(+r.paid||0)],['Заборгованість',r.debt<0?'переплата '+uah(-r.debt):uah(r.debt)],['Прогнозна дата',r.due&&r.debt>0.004?dm(r.due)+'.'+r.due.slice(0,4)+(r.dueManual?' (змінено вручну)':''):'—'],['Статус',r.status||'—'],['Вжиті заходи',r.act?(r.act+(r.actDate?' · '+dm(r.actDate):'')):'—'],['Відповідальний',r.resp||'—']].map(([a,b])=>el('div',{},el('small',{text:a}),el('b',{text:b})))),
  el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Закрити'));}
function dzEdit(per,r,sheet){const isNew=!r;r=r||{};let shId=r.sheet||sheet;const sh=()=>DZ_SHEETS.find(x=>x.id===shId);
  const inp=(id,lbl,val,o)=>{const i=el('input',{id,value:val==null?'':String(val),...(o||{})});return [i,el('label',{for:id},lbl,i)];};
  const [bl,blL]=inp('dzB','Будинок',r.bld,{list:'dzBl'});const [rm,rmL]=inp('dzR',shId==='park'?'Паркомісце за техпаспортом':'Приміщення',r.room);const [no,noL]=inp('dzNo','№ з/п',r.no);
  const [tn,tnL]=inp('dzT','Резидент',r.tenant);const [st,stL]=inp('dzS','Борг на початок місяця, ₴',r.start,{inputmode:'decimal'});const [ch,chL]=inp('dzC',sh().charge+', ₴',r.charge,{inputmode:'decimal'});
  const [pd,pdL]=inp('dzP','Фактично сплачено, ₴',r.paid,{inputmode:'decimal'});const [du,duL]=inp('dzD','Прогнозна дата сплати',r.due,{type:'date'});
  const UKR=['manager','senior','engineer','director','dev'];const resps=[...new Set(S.staff.filter(x=>UKR.includes(x.role)||UKR.includes(x.extraRole)).map(x=>x.name).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'uk'));
  const allSt=[...new Set([...DZ_ST.slice(0,1),'Частково сплачено',...DZ_ST.slice(1),...Object.values(S.dz).flatMap(d=>Object.values(d.rows||{}).map(x=>x.status)).filter(Boolean)])].filter(x=>!DZ_NOREC.includes(x));
  const allAct=[...new Set([...DZ_ACTS,...Object.values(S.dz).flatMap(d=>Object.values(d.rows||{}).map(x=>x.act)).filter(Boolean)])];
  const [ss,ssL]=selOther('dzSt','Поточний статус',allSt,r.status,'— без статусу —');const [ac,acL]=selOther('dzAc','Вжиті заходи',allAct,r.act,'— заходів ще не вжито —');
  const [ad,adL]=inp('dzAd','Дата заходу',r.actDate,{type:'date'});const [rp,rpL]=selOther('dzRp','Відповідальний за погашення',resps,r.resp,'— не призначено —');
  const lists=[el('datalist',{id:'dzBl'},['1.1','1.2','1.3','2','4','2, 4','Інші резиденти'].map(x=>el('option',{value:x})))];
  const live=el('div',{class:'dz-live'});const num=v=>{const t=String(v).trim().replace(/\s/g,'').replace(',','.');return t===''?null:Math.round(parseFloat(t)*100)/100;};
  const upd=()=>{const c=dzCalc({start:num(st.value),charge:num(ch.value),paid:num(pd.value),due:du.value||null});const kids=[el('span',{},'Всього: ',el('b',{text:uah(c.total)})),el('span',{},c.debt<0?'Переплата: ':'Борг: ',el('b',{class:c.debt>0?'neg':'',text:uah(Math.abs(c.debt))}))];
    if(c.b)kids.push(el('span',{class:'dz-bk',style:'--bc:'+DZ_B.find(b=>b.k===c.b).c},DZ_B.find(b=>b.k===c.b).name));else if(c.total>0&&c.debt<=0.004)kids.push(el('span',{class:'pill t-ok'},el('i'),'Погашено'));
    if(c.total>0&&c.debt<=0.004&&ss.value&&ss.value!=='Сплачено')kids.push(el('small',{class:'muted',style:'flex-basis:100%',text:'Борг погашено — при збереженні статус зміниться на «Сплачено».'}));live.replaceChildren(...kids);};
  [st,ch,pd,du].forEach(i=>i.addEventListener('input',upd));ss.addEventListener('change',upd);upd();
  const shSel=isNew?el('select',{id:'dzSh'},DZ_SHEETS.map(x=>el('option',{value:x.id,text:x.name}))):null;if(shSel){shSel.value=shId;shSel.addEventListener('change',()=>{shId=shSel.value;closeSheet();dzEdit(per,null,shId);});}
  openSheet(el('h2',{text:isNew?'Новий рядок':'Редагувати рядок'}),...lists,shSel?el('label',{for:'dzSh'},'Вид платежу',shSel):el('p',{class:'muted',style:'margin:0',text:sh().name}),
    tnL,el('div',{class:'grid2'},blL,rmL),shId==='park'?noL:null,el('div',{class:'grid2'},stL,chL),el('div',{class:'grid2'},pdL,duL),live,ssL,el('div',{class:'grid2'},acL,adL),rpL,
    el('div',{class:'row'},el('button',{class:'btn',type:'button',style:'flex:1',onclick:()=>{for(const [i,n] of [[st,'Борг на початок'],[ch,'Нарахування'],[pd,'Сплачено']])if(i.value.trim()!==''&&isNaN(num(i.value))){toast(n+': введіть число');return;}
      const d={bld:dzBld(bl.value),room:rm.value.trim(),tenant:tn.value.trim(),start:num(st.value),charge:num(ch.value),paid:num(pd.value),due:du.value||null,dueManual:(du.value||null)!==(r.due||null)?!!du.value:!!r.dueManual,status:ss.value.trim(),act:ac.value.trim(),actDate:ad.value||'',resp:dzResp(rp.value),updatedAt:Date.now(),updatedBy:S.myId};
      {const c=dzCalc(d);if((d.charge||d.start)&&c.debt<=0.004&&d.status!=='Сплачено')d.status='Сплачено';if(c.debt>0.004&&d.status==='Сплачено')d.status=d.paid?'Частково сплачено':'Повідомлено про борг';}if(shId==='park')d.no=no.value.trim();
      if(!d.tenant&&!d.room){toast('Вкажіть резидента або приміщення');return;}closeSheet();const docId=per+'_'+shId;
      if(isNew){const mx=dzRows(per,shId).reduce((a,x)=>Math.max(a,x.order||0),0);const id='r'+Date.now().toString(36);d.order=mx+1;
        write(()=>S.dz[docId]?S.db.doc('dz/'+docId).update({rows:{[id]:d}}):S.db.doc('dz/'+docId).set({per,sheet:shId,rows:{[id]:d}}),'Додано');}
      else write(()=>S.db.doc('dz/'+docId).update({rows:{[r.id]:d}}),'Збережено');}},isNew?'Додати':'Зберегти'),
      !isNew?el('button',{class:'btn danger',type:'button',onclick:()=>confirmSheet('Видалити рядок «'+(r.tenant||r.room)+'»?','Видалити',()=>write(()=>S.db.doc('dz/'+per+'_'+shId).update({rows:{[r.id]:null}}),'Видалено'))},'Видалити'):null),
    el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'));}
function dzNewMonth(per){const next=perShift(dzPers().slice(-1)[0]||per,1);if(dzPers().includes(next)){toast('Місяць уже створено');return;}const src=dzPers().slice(-1)[0];
  confirmSheet('Створити «'+perLabel(next)+'»? Залишок боргу кожного резидента стане «боргом на початок», нарахування й оплати будуть порожні, а дати сплати зсунуться на місяць.','Створити',()=>write(async()=>{
    for(const sh of DZ_SHEETS){const rows={};dzRows(src,sh.id).forEach(r=>{const c=dzCalc(r);const nd=r.due?(()=>{const d=parseYmd(r.due);d.setMonth(d.getMonth()+1);return ymd(d);})():null;
      const x={bld:r.bld||'',room:r.room||'',tenant:r.tenant||'',start:Math.abs(c.debt)>0.004?c.debt:0,charge:null,paid:null,due:nd,status:c.debt>0.004?(r.status||''):'',act:c.debt>0.004?(r.act||''):'',resp:c.debt>0.004?(r.resp||''):'',order:r.order||0};if(sh.park){x.no=r.no||'';if(r.status==='Паркомісце не орендоване'||r.status==='Під господарські потреби')x.status=r.status;}rows[r.id]=x;});
      await S.db.doc('dz/'+next+'_'+sh.id).set({per:next,sheet:sh.id,rows,at:Date.now(),by:S.myId});}
    S.dzPer=next;},'Місяць «'+perLabel(next)+'» створено'));}
async function dzExport(per){toast('Готую файл…');let X;try{X=await loadXlsx();}catch(e){toast('Не вдалося завантажити модуль Excel');return;}
  const wb=X.utils.book_new();const today=new Date();
  for(const sh of DZ_SHEETS){const P=sh.park;const H=P?['Будинок','Паркомісце за техпаспортом','№ з/п','Резидент','Дебіторська заборгованість на початок місяця','Платіж за оренду паркомісця','Всього нараховано (грн)','Фактично сплачено (грн)','Фактична дебіторська заборгованість','0-5 днів (Технічний борг)','6-15 днів (Обзвін Карпача)','16-30 днів (Претензія Юриста)','Понад 30 днів (Критичний/Суд)','Прогнозна дата сплати','Поточний статус / Вжиті заходи','Відповідальний за погашення','Поточна дата']
      :['Будинок','Приміщення','Резидент','Дебіторська заборгованість на початок місяця',sh.id==='opex'?'Платежі OPEX':sh.id==='util'?'Нараховано за комунальні послуги':'Маркетинговий платіж','Всього нараховано (грн)','Фактично сплачено (грн)','Фактична дебіторська заборгованість','0-5 днів (Технічний борг)','6-15 днів (Обзвін Карпача)','16-30 днів (Претензія Юриста)','Понад 30 днів (Критичний/Суд)','Прогнозна дата сплати','Поточний статус / Вжиті заходи',sh.id==='mkt'?'Відповідальний за погашення':'Відпов. за погашення','','Поточна дата'];
    const aoa=[H];const rs=dzRows(per,sh.id);const o=P?1:0;const L=c=>String.fromCharCode(65+c);
    rs.forEach((r,i)=>{const n=i+2;const D=L(3+o),E=L(4+o),F=L(5+o),G=L(6+o),Hh=L(7+o),M=L(12+o);
      const row=P?[r.bld||'',r.room||'',r.no||'',r.tenant||'']:[r.bld||'',r.room||'',r.tenant||''];
      row.push(r.start==null?null:+r.start,r.charge==null?null:+r.charge,{f:D+n+'+'+E+n},r.paid==null?null:+r.paid,{f:F+n+'-'+G+n},
        {f:'IF(AND($Q$2-$'+M+n+'>=0,$Q$2-$'+M+n+'<=5,'+Hh+n+'>0),'+Hh+n+',0)'},{f:'IF(AND($Q$2-$'+M+n+'>=6,$Q$2-$'+M+n+'<=15,'+Hh+n+'>0),'+Hh+n+',0)'},{f:'IF(AND($Q$2-$'+M+n+'>=16,$Q$2-$'+M+n+'<=30,'+Hh+n+'>0),'+Hh+n+',0)'},{f:'IF(AND($Q$2-$'+M+n+'>30,'+Hh+n+'>0),'+Hh+n+',0)'},
        r.due?parseYmd(r.due):null,[r.status,r.act].filter(Boolean).join(' / '),r.resp||'');if(!P)row.push('');if(i===0)row.push({f:'TODAY()'});aoa.push(row);});
    const N=rs.length+1;const tot=P?['ВСЬОГО','','','']:['ВСЬОГО','',''];for(let c=3+o;c<=11+o;c++){const col=L(c);tot.push(c===7+o?{f:'SUMIF('+col+'2:'+col+N+',">0")'}:c===5+o-0&&false?null:{f:'SUM('+col+'2:'+col+N+')'});}aoa.push(tot);
    const ws=X.utils.aoa_to_sheet(aoa,{cellDates:true,dateNF:'dd\\.mm\\.yyyy'});const M=L(12+o);for(let n=2;n<=N;n++){const c=ws[M+n];if(c&&c.t==='d')c.z='dd\\.mm\\.yyyy';}if(ws['Q2'])ws['Q2'].z='dd\\.mm\\.yyyy';
    ws['!cols']=(P?[10,22,16,26]:[10,12,32]).map(w=>({wch:w})).concat(Array(9).fill({wch:15}),[{wch:13},{wch:34},{wch:18},{wch:4},{wch:12}]);
    X.utils.book_append_sheet(wb,ws,sh.xl);}
  const buf=X.write(wb,{bookType:'xlsx',type:'array',cellDates:true});const dl=await claude.use('downloads').catch(()=>null);if(!dl){toast('Завантаження файлів тут недоступне');return;}
  try{await dl.save({filename:'Дебіторська заборгованість '+perLabel(per)+'.xlsx',data:new Blob([buf])});}catch(e){if(e&&e.code!=='declined')toast('Не вдалося зберегти файл');}}
