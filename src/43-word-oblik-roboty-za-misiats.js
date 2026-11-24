// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Word: облік роботи за місяць

/* ---------- Word: облік роботи за місяць ---------- */
function wlReportSheet(){const now=new Date();const cur=ymd(now).slice(0,7);const ids=wlStaff().map(s=>s.id);const mons=[...new Set([cur,...(S.wl||[]).filter(x=>ids.includes(x.sid)||(x.with||[]).some(i=>ids.includes(i))).map(x=>x.date.slice(0,7))])].sort().reverse();
  let mon=now.getDate()<=5&&mons.includes(ymd(new Date(now.getFullYear(),now.getMonth()-1,1)).slice(0,7))?ymd(new Date(now.getFullYear(),now.getMonth()-1,1)).slice(0,7):cur;let who='all';
  const ppl=wlStaff();
  const go=el('button',{class:'btn',type:'button',onclick:async()=>{go.disabled=true;go.textContent='Формую…';const ok=await wlWord(mon,who==='all'?ppl.map(s=>s.id):[who]);if(ok)closeSheet();else{go.disabled=false;go.textContent='Сформувати Word';}}},'Сформувати Word');
  openSheet(el('h2',{text:'Звіт обліку роботи (Word)'}),el('p',{class:'muted',style:'margin:0',text:'Усі дні місяця по порядку, від першого до останнього числа; кожен працівник з нової сторінки.'}),
    el('span',{class:'flabel',text:'Місяць'}),wlPick(mons.map(k=>[k,perLabel(k)+(k===cur?' · поточний':'')]),mon,k=>{mon=k;},'Місяць'),
    el('span',{class:'flabel',text:'Про кого'}),wlPick([['all','Усі · '+ppl.length],...ppl.map(s=>[s.id,s.name])],who,k=>{who=k;},'Працівник'),
    el('div',{class:'btn-pair'},el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'),go));}
async function wlWord(mon,sids){toast('Готую Word-звіт…');let D;try{D=await loadDocx();}catch(e){toast('Не вдалося завантажити модуль Word. Перевірте зв’язок і спробуйте ще раз.');return false;}
  try{const one=sids.length===1&&staffById(sids[0]);const blob=await wlDocx(D,mon,sids);await saveFile('Облік_роботи_'+mon+'_'+(one?one.name.replace(/\s+/g,'_'):'усі')+'.docx',blob);return true;}
  catch(e){logErr('Word обліку: '+((e&&e.message)||e));toast('Не вдалося сформувати звіт. Спробуйте ще раз.');return false;}}
async function wlDocx(D,mon,sids){const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,WidthType,AlignmentType,Header,Footer,PageNumber,ShadingType,BorderStyle,VerticalAlign,PageOrientation}=D;
  const C={acc:'3E5F8A',ink:'0F2A33',mut:'53686F',soft:'E4ECF4',bg:'F4F7FA',ok:'2E7D4F',warn:'B4232A',warnS:'F8DEDF',amb:'8A5A12',ambS:'F6E3C4',line:'D3DCE4'};const F='Calibri';
  const T=(t,x)=>new TextRun(Object.assign({text:String(t==null?'':t),font:F,size:20,color:C.ink},x||{}));
  const P=(runs,x)=>new Paragraph(Object.assign({children:Array.isArray(runs)?runs:[runs],spacing:{after:60}},x||{}));
  const H=(t,x)=>P([T(t,{bold:true,size:32,color:C.acc})],Object.assign({spacing:{before:120,after:100}},x||{}));
  const b1={style:BorderStyle.SINGLE,size:4,color:C.line};const bd={top:b1,bottom:b1,left:b1,right:b1};
  const cell=(c,x)=>new TableCell(Object.assign({children:Array.isArray(c)?c:[c instanceof Paragraph?c:P(T(c))],borders:bd,margins:{top:50,bottom:50,left:90,right:90},verticalAlign:VerticalAlign.CENTER},x||{}));
  const fill=f=>({shading:{type:ShadingType.CLEAR,color:'auto',fill:f}});
  const hcell=t=>cell(P(T(t,{bold:true,color:'FFFFFF',size:18})),fill(C.acc));
  const tbl=(rows,w)=>new Table({rows,width:{size:100,type:WidthType.PERCENTAGE},columnWidths:w});
  const [y,m]=mon.split('-').map(Number);const last=new Date(y,m,0).getDate();const from=mon+'-01',to=mon+'-'+pad(last);const per=perLabel(mon);const today=ymd(new Date());
  const days=Array.from({length:last},(_,i)=>mon+'-'+pad(i+1));const ppl=sids.map(staffById).filter(Boolean);const all=ppl.map(s=>({s,L:wlOf(s.id,from,to)}));
  const uniq=[...new Map(all.flatMap(x=>x.L).map(x=>[x.id,x])).values()];const tot=uniq.length;const me=myStaff();const kids=[];
  const role=s=>ROLE_NAME[s.role]||'';const slaN=k=>({A:'А',B:'В',C:'С'})[k]||'В';
  /* 1. титул */
  kids.push(P(T('DUCK’S LAKE · FACILITY ВІДДІЛ',{bold:true,color:C.acc,size:20}),{spacing:{before:1800,after:200}}),P(T('Облік роботи за місяць',{bold:true,size:56})),P(T(per,{size:34,color:C.acc}),{spacing:{after:500}}),
    P([T(ppl.length===1?'Працівник: ':'Працівники: ',{color:C.mut}),T(ppl.map(s=>s.name).join(', '))]),
    P([T('Записів у звіті: ',{color:C.mut}),T(String(tot))]),P([T('Дата формування: ',{color:C.mut}),T(dmy(new Date()))]),P([T('Сформував: ',{color:C.mut}),T(me?me.name:'—')]));
  /* 2. зведення */
  kids.push(H('Зведення',{pageBreakBefore:true}));
  kids.push(tbl([new TableRow({tableHeader:true,children:['Працівник','Записів','Днів із записами','Термінових (А)','Не завершено'].map(hcell)}),
    ...all.map(({s,L})=>{const dd=new Set(L.map(x=>x.date)).size;const a=L.filter(x=>x.sla==='A').length;const op=L.filter(x=>x.st&&x.st!=='done').length;
      return new TableRow({children:[cell(P([T(s.name,{bold:true}),T(role(s)?'  ·  '+role(s):'',{color:C.mut,size:18})])),cell(String(L.length)),cell(String(dd)+' з '+last),cell(P(T(String(a),{bold:!!a,color:a?C.warn:C.ink}))),cell(P(T(String(op),{bold:!!op,color:op?C.amb:C.ink})))]});})],[5200,1700,2400,2300,2200]));
  const byCat=WL_CAT.map(c=>[c,uniq.filter(z=>z.cat===c[0]).length]).filter(z=>z[1]);
  if(byCat.length){kids.push(P(T('За категоріями',{bold:true,size:24,color:C.acc}),{spacing:{before:260,after:80}}));
    kids.push(tbl([new TableRow({tableHeader:true,children:['Категорія','Записів','Частка'].map(hcell)}),...byCat.map(([c,n])=>new TableRow({children:[cell(P([T('■  ',{color:c[2].slice(1),size:22}),T(c[1])])),cell(String(n)),cell(Math.round(n*100/Math.max(1,tot))+'%')]}))],[8600,2600,2600]));}
  /* 3. по працівниках: кожен день місяця по порядку */
  const W=[500,2100,2300,1500,6000,900,1300];
  for(const {s,L} of all){kids.push(H(s.name,{pageBreakBefore:true}),P([T(role(s)?role(s)+'  ·  ':'',{color:C.mut}),T(per+'  ·  '+L.length+' '+plural(L.length,'запис','записи','записів'),{color:C.mut})],{spacing:{after:160}}));
    const rows=[new TableRow({tableHeader:true,children:['№','Джерело','Категорія','Де','Що зроблено','Пріор.','Статус'].map(hcell)})];
    for(const d of days){const xs=L.filter(x=>x.date===d);const dt=parseYmd(d);const we=dt.getDay()===0||dt.getDay()===6;
      rows.push(new TableRow({children:[cell(P([T(DS[(dt.getDay()+6)%7]+', '+dmy(dt),{bold:true,color:we?C.amb:C.acc}),T(xs.length?'   ·   '+xs.length+' '+plural(xs.length,'запис','записи','записів'):'',{color:C.mut,size:18})],{spacing:{after:0}}),Object.assign({columnSpan:7},fill(we?C.ambS:C.soft)))]}));
      if(!xs.length){rows.push(new TableRow({children:[cell(P(T(d>today?'—':wlOff(s.id,d)?'Вихідний за графіком':'Записів немає',{color:C.mut,italics:true,size:18}),{spacing:{after:0}}),{columnSpan:7})]}));continue;}
      xs.forEach((x,i)=>{const c=wlCat(x.cat);const w=[x.sid,...(x.with||[])].filter(id=>id!==s.id).map(staffById).filter(Boolean);
        const desc=[P(T(x.text),{spacing:{after:0}})];const sub=[x.by&&x.by!==WL_REG?'Призначив: '+x.by:'',w.length?'Разом: '+w.map(z=>z.name).join(', '):''].filter(Boolean).join('   ·   ');if(sub)desc.push(P(T(sub,{color:C.mut,size:17}),{spacing:{after:0}}));
        rows.push(new TableRow({children:[cell(P(T(String(i+1),{color:C.mut}),{alignment:AlignmentType.CENTER,spacing:{after:0}})),cell(P(T(x.src,{size:18}),{spacing:{after:0}})),
          cell(P([T('■ ',{color:c[2].slice(1)}),T(c[1],{size:18})],{spacing:{after:0}})),cell(P(T(x.loc,{size:18}),{spacing:{after:0}})),cell(desc),
          cell(P(T(slaN(x.sla),{bold:x.sla==='A',color:x.sla==='A'?C.warn:C.ink}),{alignment:AlignmentType.CENTER,spacing:{after:0}})),
          cell(P(T(wlStN(x.st),{size:18,color:x.st&&x.st!=='done'?C.amb:C.ok,bold:!!(x.st&&x.st!=='done')}),{spacing:{after:0}}))]}));});}
    kids.push(tbl(rows,W));}
  const doc=new Document({creator:'Duck’s Lake',title:'Облік роботи · '+per,styles:{default:{document:{run:{font:F}}}},
    sections:[{properties:{page:{size:{orientation:PageOrientation.LANDSCAPE},margin:{top:900,bottom:900,left:900,right:900}}},
      headers:{default:new Header({children:[P([T('Duck’s Lake · Facility відділ   ',{bold:true,color:C.acc,size:17}),T('Облік роботи · '+per,{color:C.mut,size:17})],{alignment:AlignmentType.RIGHT})]})},
      footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[T('стор. ',{size:17,color:C.mut}),new TextRun({children:[PageNumber.CURRENT],size:17,color:C.mut,font:F}),T(' з ',{size:17,color:C.mut}),new TextRun({children:[PageNumber.TOTAL_PAGES],size:17,color:C.mut,font:F})]})]})},
      children:kids}]});
  return await Packer.toBlob(doc);}

function openFg(id){S.hist.push(snap());S.fg=id;S.arB=null;S.arHi=null;SC().scrollTop=0;render();animIn(1);}
function openUk(id){S.hist.push(snap());S.ukSec=id;S.fg='obl';SC().scrollTop=0;render();animIn(1);}
function viewUK(){if(!isUK()&&inspIsWalker()){S.fg='insp';S.ukSec=null;return inspView();}if(!isUK())return [el('div',{class:'card empty'},el('p',{class:'muted',text:'Цей розділ доступний лише для управлінської компанії.'}))];
  if(S.ukSec==='water')return S.wObjSel?waterObject(S.wObjSel):waterHome();
  if(S.ukSec==='debt')return debtView();
  if(S.ukSec==='waste')return wasteView();
  if(S.ukSec==='park')return pkView();
  if(S.ukSec==='res')return resView();
  if(S.ukSec&&UKS[S.ukSec])return ukSection(S.ukSec);
  if(!S.fg)return fgHome();
  if(S.fg==='insp')return inspView();
  if(S.fg==='dev')return devView();
  if(S.fg==='arch')return S.arB?arBuilding():arHome();
  if(S.fg==='docs')return dkView();
  if(S.fg==='clean')return clView();
  if(S.fg==='wlog')return wlView();
  if(S.fg!=='obl')return fgSection(S.fg);
  const out=[el('section',{class:'uk-hero'},el('span',{class:'eyebrow',text:'Facility відділ'}),el('h2',{text:'Облік'}),el('p',{text:'Вода, сміття, дебіторка, паркінг, інвентар та електроенергія Duck’s Lake. Оберіть блок, щоб відкрити.'}))];
  out.push(el('div',{class:'uk-grid'},Object.entries(UKS).map(([id,u])=>{const st=ukStat(id);return el('button',{type:'button',class:'uk-tile'+(st?'':' soon-t'),style:'--c1:'+u.c1+';--c2:'+u.c2,onclick:()=>openUk(id)},
    el('div',{class:'uk-tt'},el('span',{class:'uk-ic'},svg(u.ic)),st?null:el('span',{class:'soon',text:'скоро'}),el('span',{class:'uk-go'},svg('<path d="m9 6 6 6-6 6"/>'))),
    el('span',{class:'uk-t'},el('b',{text:u.name}),el('small',{text:u.sub})),
    el('span',{class:'uk-st'},st?[el('b',{text:st[0]}),el('small',{text:st[1]})]:el('small',{text:'Блок у розробці'})));})));
  return out;}
function ukSection(id){const u=UKS[id];
  return [el('section',{class:'uk-head',style:'--c1:'+u.c1+';--c2:'+u.c2},el('span',{class:'uk-ic big'},svg(u.ic)),el('div',{},el('span',{class:'eyebrow',text:'Облік'}),el('h2',{text:u.name}),el('p',{text:u.sub}))),
    el('div',{class:'card uk-soon'},el('span',{class:'soon',text:'у розробці'}),el('p',{style:'margin:0',text:'Структуру цього блоку наповнюємо поступово. Ось що тут планується:'})),
    el('div',{class:'uk-plan'},u.plan.map(([e,t,d])=>el('div',{class:'card uk-pi'},el('span',{class:'uk-pe',text:e}),el('div',{},el('b',{text:t}),el('small',{text:d})),el('span',{class:'soon',text:'скоро'}))))];}
