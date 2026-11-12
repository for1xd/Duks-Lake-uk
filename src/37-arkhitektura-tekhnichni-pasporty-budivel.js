// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Архітектура: технічні паспорти будівель

/* ---------- Архітектура: технічні паспорти будівель ---------- */
const AR_COL={b1:['#1F6F78','#3aa7a0'],b2:['#5B6CD9','#8A9BF2'],b3:['#C2416B','#EA7E9E'],b4:['#B0742A','#E2A75A'],b5:['#2E8B5E','#7BC47F']};
const AR_MAIN=new Set(['нежитлове','офісне приміщення','машиномісце','паркінг','зал кафетерію']);
const AR_TECH=/трансформатор|РУ|ССМ|вузол вводу|вводу кабелів|насосна|щитова/;
const AR_KIND={office:'Оренда',park:'Паркінг',tech:'Технічне',common:'МЗК'};
/* Паркінг під Будинками 2 і 4 — один простір: Будинку 2 лишаємо машиномісця з техпаспорта, решту з модуля «Паркінг» відносимо до Будинку 4 */
function arPkTotal(){const rs=((S.pk||{}).main||{}).rows||{};return Object.values(rs).filter(r=>r&&(r.tp||r.no||r.status!==undefined)).length;}
function arSpots(b){const b2=ARCH.find(x=>x.fac==='2');const own=n=>n.floors.reduce((t,f)=>t+f.u.filter(u=>u[0].startsWith('П/М')).length,0);const n2=b2?own(b2):0;
  if(b.fac==='2')return n2;if(b.fac==='4')return Math.max(0,arPkTotal()-n2);return own(b);}
function arFacKey(b){return b.fac.split('.').map(Number).reduce((a,x,i)=>a+x/Math.pow(100,i),0);}
ARCH.sort((a,b)=>arFacKey(a)-arFacKey(b));
(function arPrep(){ARCH.forEach(b=>b.floors.forEach(fl=>{if(fl.u.length)return;const keep=[];
  fl.c.forEach(r=>{if(AR_MAIN.has(r[1]))fl.u.push([r[1]==='паркінг'?'Паркінг':'№'+r[0],[[r[0],r[1],r[2]]]]);else keep.push(r);});fl.c=keep;}));})();
function arN(v){return (Math.round(v*10)/10).toLocaleString('uk-UA',{minimumFractionDigits:1,maximumFractionDigits:1});}
function arM2(v){return arN(v)+' м²';}
function arSum(a){return a.reduce((t,r)=>t+r[2],0);}
function arKind(u){if(u[0].startsWith('П/М')||u[0]==='Паркінг')return 'park';if(u[1].every(r=>AR_TECH.test(r[1])))return 'tech';return 'office';}
function arFName(f){return f==='пд'?'Підвал':f+' поверх';}
function arFShort(f){return f==='пд'?'Пд':String(f);}
function arUName(u){const k=arKind(u);if(u[0].startsWith('П/М'))return 'Машиномісце '+u[0];if(u[0]==='Паркінг')return 'Паркінг';if(u[0].startsWith('№'))return (u[1][0][1]==='зал кафетерію'?'Зал кафетерію ':'Приміщення ')+u[0];return (k==='tech'?'Технічне приміщення ':'Приміщення ')+u[0];}
function arFStat(fl){const s={total:0,common:arSum(fl.c),office:0,park:0,tech:0,main:0,units:0,spots:0};
  fl.u.forEach(u=>{const a=arSum(u[1]),k=arKind(u);s[k]+=a;if(k==='office')s.units++;if(u[0].startsWith('П/М'))s.spots++;u[1].forEach(r=>{if(AR_MAIN.has(r[1]))s.main+=r[2];});});
  s.total=s.common+s.office+s.park+s.tech;return s;}
function arBStat(b){const t={total:0,common:0,office:0,park:0,tech:0,main:0,units:0,spots:0};b.floors.forEach(fl=>{const s=arFStat(fl);for(const k in t)t[k]+=s[k];});return t;}
function arTotalAll(){return ARCH.reduce((t,b)=>t+arBStat(b).total,0);}
function arFloorsLbl(b){const n=b.floors.filter(f=>f.f!=='пд').length;return n+' пов.'+(b.floors.some(f=>f.f==='пд')?' + підвал':'');}
function arTitle(){const b=ARCH.find(x=>x.id===S.arB);return b?b.name+' · Буд. '+b.fac:'Архітектура';}
function arOpen(id,f,hi){S.hist.push(snap());S.arB=id;S.arF=f!=null?f:null;S.arT='fl';S.arHi=hi||null;SC().scrollTop=0;render();animIn(1);
  if(hi)setTimeout(()=>{const n=document.querySelector('.ar-u.hi');if(n){n.open=true;n.scrollIntoView({behavior:'smooth',block:'center'});}},120);}
function arBar(s,c1){const seg=[[s.office,c1],[s.park,'#5C8DF0'],[s.tech,'#E0A21A'],[s.common,'var(--duck-off)']];
  return el('div',{class:'ar-bar','aria-hidden':'true'},seg.filter(x=>x[0]>0).map(([v,c])=>el('span',{style:'flex:'+v+';background:'+c})));}
function arLegend(c1,s){return el('div',{class:'ar-leg'},[['Оренда',c1,s.office],['Паркінг','#5C8DF0',s.park],['Технічні','#E0A21A',s.tech],['МЗК','var(--duck-off)',s.common]].filter(x=>x[2]>0).map(([l,c,v])=>el('span',{},el('i',{style:'background:'+c}),l+' ',el('b',{text:arM2(v)}))));}
function arBadge(b,big){const c=AR_COL[b.id];return el('span',{class:'ar-lt'+(big?' big':''),style:'--c1:'+c[0]+';--c2:'+c[1],title:'Будинок '+b.fac,text:b.fac});}
function arFacTag(b){return el('span',{class:'ar-fac',style:'--c1:'+AR_COL[b.id][0]},'Будинок '+b.fac);}
function arSearch(q){q=q.trim().toLowerCase().replace(/\s+/g,' ');if(!q)return [];const out=[];
  ARCH.forEach(b=>b.floors.forEach(fl=>{fl.u.forEach(u=>{const id=u[0].toLowerCase();if(id.includes(q)||(b.lt.toLowerCase()+id)===q.replace(/[\s·-]/g,'')||u[1].some(r=>r[1].includes(q)))out.push({b,fl,u});});
    fl.c.forEach(r=>{if(r[1].includes(q))out.push({b,fl,r});});}));return out;}
function arHome(){const out=[];const g=FG.find(x=>x.id==='arch');
  out.push(el('section',{class:'uk-head',style:'--c1:'+g.c1+';--c2:'+g.c2},el('span',{class:'uk-ic big'},svg(g.ic)),el('div',{},el('span',{class:'eyebrow',text:'Facility відділ'}),el('h2',{text:'Архітектура та інформація'}),el('p',{text:'Будівлі Duck’s Lake за технічними паспортами: поверхи, приміщення, площі, інженерія.'}))));
  const all=ARCH.map(arBStat);const sum=k=>all.reduce((t,s)=>t+s[k],0);
  out.push(el('div',{class:'ar-kpi'},
    el('div',{class:'card ar-k'},el('span',{text:'Будівель'}),el('b',{text:String(ARCH.length)}),el('small',{text:ARCH.map(b=>b.fac).join(' · ')})),
    el('div',{class:'card ar-k'},el('span',{text:'Загальна площа'}),el('b',{text:Math.round(sum('total')).toLocaleString('uk-UA')}),el('small',{text:'м² за експлікаціями'})),
    el('div',{class:'card ar-k'},el('span',{text:'Під оренду'}),el('b',{text:Math.round(sum('office')).toLocaleString('uk-UA')}),el('small',{text:sum('units')+' приміщень'})),
    el('div',{class:'card ar-k'},el('span',{text:'Паркінг'}),el('b',{text:String(ARCH.reduce((t,b)=>t+arSpots(b),0))}),el('small',{text:'машиномісць · Буд. 2 і 4, з модуля «Паркінг»'}))));
  const q=S.arQ||'';
  out.push(el('label',{class:'ar-search'},svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>'),
    el('input',{type:'search','data-k':'arQ',value:q,placeholder:'Пошук: 301, П/М-5, санвузол, тераса…','aria-label':'Пошук приміщення',oninput:e=>{S.arQ=e.target.value;render();}}),
    q?el('button',{type:'button',class:'ar-clr','aria-label':'Очистити',onclick:()=>{S.arQ='';render();}},svg('<path d="M6 6l12 12M18 6 6 18"/>')):null));
  if(q.trim()){const res=arSearch(q);const shown=res.slice(0,80);
    out.push(el('div',{class:'row between'},el('h2',{text:'Знайдено'}),el('span',{class:'muted small',text:res.length+(res.length>shown.length?' · показано '+shown.length:'')})));
    if(!res.length)out.push(el('div',{class:'card empty'},el('p',{class:'muted',text:'Нічого не знайдено. Спробуйте номер приміщення (301) або назву (тераса).'})));
    else out.push(el('div',{class:'ar-res'},shown.map(x=>{const u=x.u;const a=u?arSum(u[1]):x.r[2];
      return el('button',{type:'button',class:'card ar-ri',onclick:()=>arOpen(x.b.id,x.fl.f,u?u[0]:null)},arBadge(x.b),
        el('span',{class:'ar-rt'},el('b',{text:u?arUName(u):(x.r[1][0].toUpperCase()+x.r[1].slice(1)+(x.r[0]?' · '+x.r[0]:''))}),el('small',{text:arFName(x.fl.f)+(u?'':' · МЗК')+' · '+x.b.name})),
        el('b',{class:'ar-ra',text:arM2(a)}));})));
    return out;}
  out.push(el('div',{class:'row between'},el('h2',{text:'Будівлі'}),el('span',{class:'muted small',text:'натисніть, щоб відкрити'})));
  out.push(el('div',{class:'ar-grid'},ARCH.map((b,i)=>{const s=all[i];const c=AR_COL[b.id];
    return el('button',{type:'button',class:'card ar-b',style:'--c1:'+c[0]+';--c2:'+c[1],onclick:()=>arOpen(b.id)},
      el('div',{class:'ar-bh'},arBadge(b,true),el('span',{class:'ar-bt'},el('b',{text:b.name}),arFacTag(b),el('small',{text:b.addr})),el('span',{class:'uk-go'},svg('<path d="m9 6 6 6-6 6"/>'))),
      el('div',{class:'ar-bn'},el('b',{text:arN(s.total)}),el('span',{text:'м²'})),
      arBar(s,c[0]),
      el('div',{class:'ar-chips'},el('span',{text:arFloorsLbl(b)}),s.units?el('span',{text:s.units+' прим. в оренду'}):null,arSpots(b)?el('span',{class:'ar-pk',text:'🅿 '+arSpots(b)+' машиномісць'}):null,el('span',{class:'ar-doc'+(b.doc.reg?'':' plan'),text:b.doc.reg?'Техпаспорт':'Плани'})));})));
  out.push(el('h2',{text:'Порівняння'}));
  out.push(el('div',{class:'tbl ar-cmp'},el('table',{},el('thead',{},el('tr',{},['Будівля','Поверхи','Загальна','Оренда','МЗК','Приміщень'].map((t,i)=>el('th',{class:i?'':'nm',text:t})))),
    el('tbody',{},ARCH.map((b,i)=>{const s=all[i];return el('tr',{onclick:()=>arOpen(b.id)},el('td',{class:'nm'},el('span',{class:'ar-tn'},arBadge(b),b.name+' · Буд. '+b.fac)),el('td',{text:arFloorsLbl(b)}),el('td',{text:arN(s.total)}),el('td',{text:arN(s.office)}),el('td',{text:arN(s.common)}),el('td',{text:String(s.units)}));}),
      el('tr',{class:'tot'},el('td',{class:'nm',text:'Разом'}),el('td',{}),el('td',{text:arN(sum('total'))}),el('td',{text:arN(sum('office'))}),el('td',{text:arN(sum('common'))}),el('td',{text:String(sum('units'))}))))));
  return out;}
function arBuilding(){const b=ARCH.find(x=>x.id===S.arB);if(!b){S.arB=null;return arHome();}const c=AR_COL[b.id];const bs=arBStat(b);const t=S.arT||'fl';
  const out=[el('section',{class:'ar-head',style:'--c1:'+c[0]+';--c2:'+c[1]},arBadge(b,true),el('div',{class:'ar-ht'},arFacTag(b),el('h2',{text:b.name}),el('p',{text:'м. Львів, '+b.addr}),el('small',{class:'muted',text:'За техпаспортом: '+b.full+' · літера '+b.lt+(b.gen?' · генплан '+b.gen:'')+(arSpots(b)?' · паркінг: '+arSpots(b)+' машиномісць':'')})),
    el('div',{class:'ar-hn'},el('b',{text:arN(bs.total)}),el('small',{text:'м² · '+arFloorsLbl(b)})))];
  out.push(el('div',{class:'ar-seg',role:'tablist'},[['fl','Поверхи та приміщення'],['ps','Паспорт']].map(([k,l])=>el('button',{type:'button',role:'tab','aria-selected':String(t===k),onclick:()=>{S.arT=k;render();}},l))));
  if(t==='ps')return out.concat(arPassport(b));
  const fls=b.floors;if(S.arF==null||!fls.some(f=>String(f.f)===String(S.arF)))S.arF=(fls.find(f=>f.f!=='пд')||fls[0]).f;
  const fl=fls.find(f=>String(f.f)===String(S.arF));const fs=arFStat(fl);const maxT=Math.max(...fls.map(f=>arFStat(f).total));
  const stack=el('div',{class:'card ar-stack'},el('div',{class:'ar-sh'},el('b',{text:'Розріз будівлі'}),el('small',{class:'muted',text:'оберіть поверх'})),
    el('div',{class:'ar-floors'},fls.slice().reverse().map(f=>{const s=arFStat(f);const on=String(f.f)===String(S.arF);
      return el('button',{type:'button',class:'ar-fl'+(on?' on':'')+(f.f==='пд'?' ug':''),'aria-pressed':String(on),onclick:()=>{S.arF=f.f;S.arHi=null;render();if(!WIDE.matches){const d=document.querySelector('.ar-det');if(d)d.scrollIntoView({behavior:'smooth',block:'start'});}}},
        el('span',{class:'ar-fn',text:arFShort(f.f)}),el('span',{class:'ar-fw'},el('span',{class:'ar-fb',style:'width:'+(s.total/maxT*100)+'%'},arBar(s,c[0]))),el('span',{class:'ar-fa',text:arN(s.total)}));})),
    arLegend(c[0],bs));
  const det=[el('div',{class:'ar-det'},el('div',{class:'ar-fh'},el('h2',{text:arFName(fl.f)}),el('span',{class:'ar-pill',text:arM2(fs.total)})),
    el('div',{class:'ar-fk'},[['Оренда',fs.office,fs.units?fs.units+' прим.':''],['Паркінг',fs.park,fs.spots?fs.spots+' місць':''],['Технічні',fs.tech,''],['МЗК',fs.common,fl.c.length+' прим.']].filter(x=>x[1]>0).map(([l,v,n])=>el('div',{class:'ar-fkc'},el('small',{text:l}),el('b',{text:arN(v)}),n?el('small',{class:'muted',text:n}):null))))];
  const offs=fl.u.filter(u=>arKind(u)!=='park'||u[0]==='Паркінг'),spots=fl.u.filter(u=>u[0].startsWith('П/М'));
  if(offs.length){det.push(el('h3',{class:'ar-h3',text:'Приміщення'}));det.push(el('div',{class:'ar-units'},offs.map(u=>{const a=arSum(u[1]),k=arKind(u),m=u[1].filter(r=>AR_MAIN.has(r[1])).reduce((t,r)=>t+r[2],0);const hi=S.arHi===u[0];
    return el('details',{class:'card ar-u k-'+k+(hi?' hi':''),open:hi?true:null,style:'--c1:'+c[0]},
      el('summary',{},el('span',{class:'ar-uid',text:u[0].replace('№','')}),el('span',{class:'ar-ut'},el('b',{text:arUName(u)}),el('small',{text:(m&&m!==a?'основна '+arM2(m)+' · ':'')+u[1].length+' '+(u[1].length===1?'кімната':u[1].length<5?'кімнати':'кімнат')})),
        el('span',{class:'ar-ua'},el('b',{text:arN(a)}),el('small',{text:'м²'}))),
      el('div',{class:'ar-rooms'},u[1].map(r=>el('div',{class:'ar-room'+(AR_MAIN.has(r[1])?' main':'')},el('span',{class:'ar-rn',text:r[0]||'—'}),el('span',{text:r[1]}),el('b',{text:arN(r[2])})))));})));}
  if(spots.length){det.push(el('h3',{class:'ar-h3',text:'Машиномісця'}));det.push(el('div',{class:'ar-spots'},spots.map(u=>{const hi=S.arHi===u[0];return el('div',{class:'ar-spot'+(hi?' hi ar-u':'')},el('b',{text:u[0].replace('П/М-','')}),el('small',{text:arN(arSum(u[1]))+' м²'}));})));}
  if(fl.c.length){det.push(el('h3',{class:'ar-h3',text:'Місця загального користування'}));det.push(el('div',{class:'card ar-common'},fl.c.map(r=>el('div',{class:'ar-room'},el('span',{class:'ar-rn',text:r[0]||'—'}),el('span',{text:r[1]}),el('b',{text:arN(r[2])}))),
    el('div',{class:'ar-room tot'},el('span',{}),el('span',{text:'Разом МЗК'}),el('b',{text:arN(fs.common)}))));}
  out.push(el('div',{class:'ar-cols'},stack,el('div',{class:'stack ar-right'},det)));
  return out;}
function arPassport(b){const out=[];const d=b.doc;
  out.push(el('div',{class:'card ar-docc'},el('div',{class:'ar-sh'},el('b',{text:d.kind}),d.reg?el('span',{class:'ar-ok',text:'Діючий'}):el('span',{class:'ar-doc plan',text:'Додаток'})),
    d.reg?el('dl',{class:'ar-dl'},[['Реєстраційний номер',d.reg],['Документ',d.no],['Ідентифікатор об’єкта',d.obj],['Замовник',d.client],['Дозвіл на будівельні роботи',d.permit],['Виконавець','ФОП Потинський А. М. (серт. АЕ 005365)']].map(([k,v])=>[el('dt',{text:k}),el('dd',{},el('span',{text:v}),/^[A-ZА-Я]{2}\d|^TI01|^01\./.test(v)?el('button',{type:'button',class:'ar-cp','aria-label':'Скопіювати',onclick:()=>{try{navigator.clipboard.writeText(v);toast('Скопійовано');}catch(e){}}},svg('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>')):null)]).flat())
      :el('p',{class:'muted',style:'margin:0',text:'Для цієї будівлі є поверхові плани та експлікація приміщень. Повний техпаспорт ще не додано.'})));
  out.push(el('div',{class:'ar-pgrid'},
    el('div',{class:'card'},el('div',{class:'ar-sh'},el('b',{text:'Техніко-економічні показники'})),el('dl',{class:'ar-tep'},b.tep.map(([k,v])=>[el('dt',{text:k}),el('dd',{text:v})]).flat())),
    el('div',{class:'stack'},
      b.eng?el('div',{class:'card'},el('div',{class:'ar-sh'},el('b',{text:'Інженерне забезпечення'})),el('div',{class:'ar-eng'},b.eng.map(([k,v])=>el('span',{class:'ar-e'+(v===0?' no':'')},v===0?svg('<path d="M6 6l12 12M18 6 6 18"/>'):svg('<path d="m5 12 5 5 9-10"/>'),k+(typeof v==='string'?': '+v:''))))):null,
      b.cons?el('div',{class:'card'},el('div',{class:'ar-sh'},el('b',{text:'Конструкції'})),el('dl',{class:'ar-tep'},b.cons.map(([k,v])=>[el('dt',{text:k}),el('dd',{text:v})]).flat())):null)));
  if(b.land&&b.land.length){out.push(el('h2',{text:'Земельні ділянки'}));out.push(el('div',{class:'ar-land'},b.land.map(l=>el('div',{class:'card ar-li'},el('div',{class:'ar-sh'},el('b',{class:'ar-mono',text:l.cad}),el('span',{class:'ar-pill',text:String(l.ha).replace('.',',')+' га'})),el('p',{class:'muted small',style:'margin:0',text:l.use})))));}
  out.push(el('h2',{text:'Площі по поверхах'}));
  out.push(el('div',{class:'tbl ar-cmp'},el('table',{},el('thead',{},el('tr',{},['Поверх','Загальна','Оренда','Паркінг','Технічні','МЗК'].map((t,i)=>el('th',{class:i?'':'nm',text:t})))),
    el('tbody',{},b.floors.map(f=>{const s=arFStat(f);return el('tr',{onclick:()=>{S.arT='fl';S.arF=f.f;render();}},el('td',{class:'nm',text:arFName(f.f)}),[s.total,s.office,s.park,s.tech,s.common].map(v=>el('td',{text:v?arN(v):'—'})));}),
      (()=>{const s=arBStat(b);return el('tr',{class:'tot'},el('td',{class:'nm',text:'Разом'}),[s.total,s.office,s.park,s.tech,s.common].map(v=>el('td',{text:v?arN(v):'—'})));})()))));
  return out;}
function fgSection(id){const g=FG.find(x=>x.id===id);if(!g)return [];
  return [el('section',{class:'uk-head',style:'--c1:'+g.c1+';--c2:'+g.c2},el('span',{class:'uk-ic big'},svg(g.ic)),el('div',{},el('span',{class:'eyebrow',text:'Facility відділ'}),el('h2',{text:g.name}),el('p',{text:g.sub}))),
    id==='clean'&&inspCan()?el('button',{type:'button',class:'card ip-link',onclick:()=>openFg('insp')},el('span',{},el('b',{text:'Фотозвіти обходу →'}),el('small',{class:'muted',text:'Щоденні фото будівель і території — у розділі «Обхід будівель»'}))):null,
    el('div',{class:'card uk-soon'},el('span',{class:'soon',text:'у розробці'}),el('p',{style:'margin:0',text:'Розділ наповнюємо поступово. Ось що тут буде:'})),
    el('div',{class:'uk-plan'},(g.plan||[]).map(([e,t,d])=>el('div',{class:'card uk-pi'},el('span',{class:'uk-pe',text:e}),el('div',{},el('b',{text:t}),el('small',{text:d})),el('span',{class:'soon',text:'скоро'}))))];}
