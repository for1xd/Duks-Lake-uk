// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Вода: Excel-звіти (ExcelJS). Чиста функція: на вході дані, на виході книга.

/* WXL:BEGIN — Вода: Excel-звіти (ExcelJS). Чиста функція: на вході дані, на виході книга. */
const WXL={NAVY:'FF1A365D',FONT:'Calibri',NUM:'#,##0.00',
  C:{ok:'FF1E7B3C',bad:'FFB42318',badFill:'FFFDE7E7',zebra:'FFF5F8FC',sec:'FFE6EDF5',main:'FFEEF4E8',tot:'FFDCE6F1',note:'FF6B7280',line:'FFB8C4D2'}};
WXL.border=()=>{const s={style:'thin',color:{argb:WXL.C.line}};return {top:s,left:s,bottom:s,right:s};};
WXL.sheetName=(n,used)=>{let s=String(n).replace(/[\\/?*\[\]:]/g,' ').trim().slice(0,31)||'Аркуш';let k=2;const b=s;while(used.has(s)){s=(b.slice(0,27)+' ('+k+++')');}used.add(s);return s;};
WXL.num=v=>v==null||v===''||isNaN(+v)?null:+v;
WXL.diff=m=>{const s=WXL.num(m.start),e=WXL.num(m.end);return s!=null&&e!=null?Math.round((e-s)*1000)/1000:null;};
/* Розбивка об'єктів на аркуші: об'єкт із частинами («Будинки 2 і 4») дає аркуш на кожну частину */
WXL.units=function(data){const out=[];data.buildings.forEach(b=>{const secs=[...new Set(b.meters.filter(m=>m.section).map(m=>m.section))];
  if(!secs.length){out.push({obj:b.id,objName:b.name,name:b.name,meters:b.meters});return;}
  const shared=b.meters.filter(m=>!m.section);if(shared.length)out.push({obj:b.id,objName:b.name,name:b.name,meters:shared,mainsOf:secs});
  secs.forEach(s=>out.push({obj:b.id,objName:b.name,name:s,meters:b.meters.filter(m=>m.section===s),sharedMainsWith:shared.some(m=>m.type==='common')?b.name:null}));});return out;};
/* спільна клітинка таблиці: межа, шрифт, заливка, вирівнювання, формат */
WXL.put=function(ws,r,c,v,st){st=st||{};const x=ws.getCell(r,c);x.value=v;x.border=WXL.border();x.font={name:WXL.FONT,size:10,...(st.font||{})};x.alignment={vertical:'middle',...(st.align||{})};
  if(st.fill)x.fill={type:'pattern',pattern:'solid',fgColor:{argb:st.fill}};if(st.fmt)x.numFmt=st.fmt;return x;};
/* кількість: цілі без «,00», дробові до 2 знаків */
WXL.qty=v=>Number.isInteger(+v)?'#,##0':'#,##0.##';
WXL.page=function(ws,lastCol,titleRows,foot){ws.pageSetup={paperSize:9,orientation:'portrait',fitToPage:true,fitToWidth:1,fitToHeight:0,horizontalCentered:true,
  margins:{left:0.4,right:0.4,top:0.5,bottom:0.6,header:0.3,footer:0.3},printTitlesRow:titleRows};
  ws.headerFooter={oddFooter:'&L&8Duck’s Lake · '+(foot||'облік води')+'&R&8Сторінка &P з &N'};};
WXL.title=function(ws,text,cols,sub){ws.mergeCells(1,1,1,cols);const c=ws.getCell(1,1);c.value=text;c.font={name:WXL.FONT,size:14,bold:true,color:{argb:WXL.NAVY}};
  c.alignment={vertical:'middle',horizontal:'left',indent:1};ws.getRow(1).height=30;
  [].concat(sub||[]).forEach((t,i)=>{ws.mergeCells(2+i,1,2+i,cols);const s=ws.getCell(2+i,1);s.value=t;s.font={name:WXL.FONT,size:9,italic:true,color:{argb:WXL.C.note}};s.alignment={indent:1};});};
WXL.head=function(ws,row,labels){const r=ws.getRow(row);labels.forEach((h,i)=>{const c=r.getCell(i+1);c.value=h;c.font={name:WXL.FONT,size:10,bold:true,color:{argb:'FFFFFFFF'}};
  c.fill={type:'pattern',pattern:'solid',fgColor:{argb:WXL.NAVY}};c.alignment={vertical:'middle',horizontal:'center',wrapText:true};c.border=WXL.border();});r.height=34;};
/* Аркуш будинку. full=true — додаються загальнобудинкові лічильники й рядок відхилення */
WXL.buildingSheet=function(wb,u,data,full,used){const res=u.meters.filter(m=>m.type!=='common');const mains=full?u.meters.filter(m=>m.type==='common'):[];
  if(!res.length&&!mains.length)return null;const name=WXL.sheetName(u.name,used);
  const ws=wb.addWorksheet(name,{properties:{tabColor:{argb:full?'FF2F855A':WXL.NAVY}},views:[{state:'frozen',ySplit:3,xSplit:0,showGridLines:false}]});
  const H=['Поверх','Номер приміщення','Резидент','Номер лічильника','Показник на початок (м³)','Показник на кінець (м³)','Спожито (м³)'];
  ws.columns=[{width:9},{width:13},{width:34},{width:20},{width:15},{width:15},{width:14}];
  WXL.title(ws,'Облік води | '+u.name+' | '+data.period.label,7,'Сформовано '+data.generatedAt+(u.sharedMainsWith&&full?' · загальнобудинкові лічильники — на аркуші «'+u.sharedMainsWith+'»':'')+(u.mainsOf?' · спільні лічильники для: '+u.mainsOf.join(', '):''));
  WXL.head(ws,3,H);let r=4;const B=WXL.border();
  const put=(row,col,v,st)=>WXL.put(ws,row,col,v,st);
  const meterRow=(m,fill,label)=>{const noSer=!String(m.serial||'').trim();const hasRd=[m.start,m.end].some(v=>WXL.num(v));const noMeter=noSer&&!hasRd;const st={fill};
    put(r,1,m.floor===''||m.floor==null?null:(isNaN(+m.floor)?String(m.floor):+m.floor),{...st,align:{horizontal:'center'}});
    put(r,2,m.room===''||m.room==null?null:(isNaN(+m.room)?String(m.room):+m.room),{...st,align:{horizontal:'center'}});
    put(r,3,label||m.tenant||'',{...st,align:{wrapText:true}});
    if(noSer)put(r,4,noMeter?'немає лічильника':'номер не вказано',{...st,font:{italic:true,color:{argb:WXL.C.note}},align:{horizontal:'center'}});else put(r,4,String(m.serial),{...st,align:{horizontal:'center'}});
    const s=noMeter?null:WXL.num(m.start),e=noMeter?null:WXL.num(m.end);
    put(r,5,s,{...st,fmt:WXL.NUM,align:{horizontal:'right'}});put(r,6,e,{...st,fmt:WXL.NUM,align:{horizontal:'right'}});
    const d=s!=null&&e!=null?Math.round((e-s)*1000)/1000:'';
    put(r,7,noMeter?null:{formula:'IF(AND(ISNUMBER(E'+r+'),ISNUMBER(F'+r+')),F'+r+'-E'+r+',"")',result:d},{...st,fmt:WXL.NUM,font:{bold:true},align:{horizontal:'right'}});
    return r++;};
  const section=text=>{ws.mergeCells(r,1,r,7);const c=put(r,1,text,{fill:WXL.C.sec,font:{bold:true,color:{argb:WXL.NAVY}}});c.alignment={vertical:'middle',indent:1};ws.getRow(r).height=20;r++;};
  const total=(label,formula,result,fill)=>{ws.mergeCells(r,1,r,6);const c=put(r,1,label,{fill,font:{bold:true}});c.alignment={vertical:'middle',horizontal:'right',indent:1};
    for(let k=2;k<=6;k++){const x=ws.getCell(r,k);x.border=B;x.fill={type:'pattern',pattern:'solid',fgColor:{argb:fill}};}
    put(r,7,{formula,result},{fill,fmt:WXL.NUM,font:{bold:true},align:{horizontal:'right'}});ws.getRow(r).height=20;return 'G'+(r++);};
  const sumOf=rows=>{if(!rows.length)return {f:'0',v:0};const parts=[];let a=rows[0],p=rows[0];rows.slice(1).forEach(x=>{if(x===p+1){p=x;return;}parts.push(a===p?'G'+a:'G'+a+':G'+p);a=p=x;});parts.push(a===p?'G'+a:'G'+a+':G'+p);return 'SUM('+parts.join(',')+')';};
  const val=ms=>Math.round(ms.reduce((t,m)=>t+(WXL.diff(m)||0),0)*1000)/1000;
  let mainRows=[],resRows=[];const out={obj:u.obj,objName:u.objName,sheet:name,name:u.name,res:null,main:null,resV:val(res),mainV:val(mains.filter(m=>m.active!==false)),hasRes:res.length>0,hasMain:mains.length>0};
  if(mains.length){section('Загальнобудинкові лічильники');mains.forEach(m=>{const rr=meterRow(m,WXL.C.main,(m.tenant||'Загальнобудинковий')+(m.active===false?' (не діючий)':''));if(m.active!==false)mainRows.push(rr);});}
  if(res.length){if(full)section('Резиденти');res.forEach((m,i)=>resRows.push(meterRow(m,i%2?WXL.C.zebra:null)));}
  ws.getRow(r).height=6;r++;
  if(res.length)out.res=total('Разом по резидентах',sumOf(resRows),out.resV,WXL.C.tot);
  if(full&&mains.length){out.main=total('Загальнобудинкові (діючі)',sumOf(mainRows),out.mainV,WXL.C.main);
    if(res.length){const dev=Math.round((out.mainV-out.resV)*1000)/1000;const at=total('Відхилення (загальнобудинкові − резиденти)',out.main+'-'+out.res,dev,WXL.C.sec);
      ws.addConditionalFormatting({ref:at,rules:[{type:'cellIs',operator:'lessThan',formulae:['0'],priority:1,style:{font:{color:{argb:WXL.C.bad},bold:true},fill:{type:'pattern',pattern:'solid',bgColor:{argb:WXL.C.badFill}}}},
        {type:'cellIs',operator:'greaterThan',formulae:['0'],priority:2,style:{font:{color:{argb:WXL.C.ok},bold:true}}}]});}}
  WXL.page(ws,7,'1:3');return out;};
/* Дашборд для «Повного обліку» */
WXL.dashboard=function(ws,data,sums){const q=s=>"'"+s.replace(/'/g,"''")+"'!";
  ws.columns=[{width:56},{width:20},{width:20},{width:18},{width:14}];const B=WXL.border();
  WXL.title(ws,'Облік води | Зведення | '+data.period.label,5,'Сформовано '+data.generatedAt+' · формули посилаються на аркуші будинків');
  const put=(r,c,v,st)=>WXL.put(ws,r,c,v,st);
  const block=(r,text)=>{ws.mergeCells(r,1,r,5);const c=ws.getCell(r,1);c.value=text;c.font={name:WXL.FONT,size:12,bold:true,color:{argb:WXL.NAVY}};c.border={bottom:{style:'medium',color:{argb:WXL.NAVY}}};ws.getRow(r).height=22;};
    /* Блок 2 спершу рахуємо, щоб Блок 1 міг на нього посилатися */
  const by={};sums.filter(Boolean).forEach(x=>{const g=by[x.obj]=by[x.obj]||{name:x.objName,sheet:x.sheet,mains:[],ress:[],mainV:0,resV:0};
    if(x.main){g.mains.push(q(x.sheet)+x.main);g.mainV+=x.mainV;}if(x.res){g.ress.push(q(x.sheet)+x.res);g.resV+=x.resV;}});
  const rows=Object.values(by).map(g=>({...g,main:g.mains.join('+'),res:g.ress.join('+'),hasMain:g.mains.length>0,hasRes:g.ress.length>0,mainV:Math.round(g.mainV*1000)/1000,resV:Math.round(g.resV*1000)/1000}));
  const r2=12;const first=r2+2,last=first+rows.length-1,totR=last+1;
  /* Блок 1 */
  block(4,'1. Рахунок Водоканалу vs фактичне споживання комплексу');
  WXL.head(ws,5,['Показник','м³','грн']);
  const billM=WXL.num(data.bill&&data.bill.m3),billU=WXL.num(data.bill&&data.bill.uah);const fact=rows.reduce((t,x)=>t+(x.hasMain?x.mainV:x.resV),0);
  put(6,1,'Рахунок Водоканалу');put(6,2,billM,{fmt:WXL.NUM,align:{horizontal:'right'},fill:'FFFFF8E1'});put(6,3,billU,{fmt:WXL.NUM,align:{horizontal:'right'},fill:'FFFFF8E1'});
  put(7,1,'Фактичне споживання комплексу (загальнобудинкові лічильники)');put(7,2,{formula:'B'+totR,result:Math.round(fact*1000)/1000},{fmt:WXL.NUM,align:{horizontal:'right'},font:{bold:true}});
  put(7,3,{formula:'IF(AND(ISNUMBER(B6),B6<>0,ISNUMBER(C6)),B7*C6/B6,"")',result:billM&&billU!=null?Math.round(fact*billU/billM*100)/100:''},{fmt:WXL.NUM,align:{horizontal:'right'}});
  put(8,1,'Різниця: рахунок − фактичне',{font:{bold:true}});put(8,2,{formula:'IF(ISNUMBER(B6),B6-B7,"")',result:billM!=null?Math.round((billM-fact)*1000)/1000:''},{fmt:WXL.NUM,align:{horizontal:'right'},font:{bold:true}});
  put(8,3,{formula:'IF(AND(ISNUMBER(B6),B6<>0,ISNUMBER(C6)),B8*C6/B6,"")',result:billM&&billU!=null?Math.round((billM-fact)*billU/billM*100)/100:''},{fmt:WXL.NUM,align:{horizontal:'right'},font:{bold:true}});
  put(9,1,'Ціна 1 м³ за рахунком, грн');put(9,2,null);put(9,3,{formula:'IF(AND(ISNUMBER(B6),B6<>0,ISNUMBER(C6)),C6/B6,"")',result:billM&&billU!=null?Math.round(billU/billM*100)/100:''},{fmt:WXL.NUM,align:{horizontal:'right'}});
  ws.addConditionalFormatting({ref:'B8:C8',rules:[{type:'cellIs',operator:'greaterThan',formulae:['0'],priority:1,style:{font:{color:{argb:WXL.C.bad},bold:true},fill:{type:'pattern',pattern:'solid',bgColor:{argb:WXL.C.badFill}}}},
    {type:'cellIs',operator:'lessThanOrEqual',formulae:['0'],priority:2,style:{font:{color:{argb:WXL.C.ok},bold:true}}}]});
  ws.mergeCells('D6:E6');ws.getCell('D6').value='← жовті клітинки можна редагувати';ws.getCell('D6').font={name:WXL.FONT,size:9,italic:true,color:{argb:WXL.C.note}};
  /* Блок 2 */
  block(r2-1,'2. Зведення по будинках');
  WXL.head(ws,r2+1,['Назва об’єкту','Загальнобудинковий лічильник (м³)','Сума по резидентах (м³)','Відхилення (м³)','Відхилення, %']);
  put(r2,4,'Допустима похибка, %',{align:{horizontal:'right'},font:{italic:true,color:{argb:WXL.C.note}}}).border={};
  const tol=put(r2,5,data.tolerancePct!=null?+data.tolerancePct:5,{fmt:'0.0',fill:'FFFFF8E1',align:{horizontal:'center'},font:{bold:true}});
  rows.forEach((x,i)=>{const r=first+i;const fill=i%2?WXL.C.zebra:null;
    put(r,1,{text:x.name,hyperlink:'#'+q(x.sheet)+'A1'},{font:{color:{argb:'FF1F4E79'},underline:true},fill});
    put(r,2,x.main?{formula:x.main,result:x.mainV}:null,{fmt:WXL.NUM,align:{horizontal:'right'},fill});
    put(r,3,x.res?{formula:x.res,result:x.resV}:null,{fmt:WXL.NUM,align:{horizontal:'right'},fill});
    const both=x.main&&x.res;const dv=both?Math.round((x.mainV-x.resV)*1000)/1000:'';
    put(r,4,both?{formula:'B'+r+'-C'+r,result:dv}:null,{fmt:WXL.NUM,align:{horizontal:'right'},font:{bold:true},fill});
    put(r,5,both?{formula:'IF(B'+r+'<>0,D'+r+'/B'+r+',"")',result:x.mainV?dv/x.mainV:''}:null,{fmt:'0.0%',align:{horizontal:'right'},fill});});
  put(totR,1,'Разом по комплексу',{font:{bold:true},fill:WXL.C.tot});
  const tM=rows.reduce((t,x)=>t+(x.main?x.mainV:0),0),tR=rows.reduce((t,x)=>t+(x.res?x.resV:0),0),tD=rows.reduce((t,x)=>t+(x.main&&x.res?x.mainV-x.resV:0),0);
  ['B','C','D'].forEach((L,k)=>put(totR,2+k,{formula:'SUM('+L+first+':'+L+last+')',result:Math.round([tM,tR,tD][k]*1000)/1000},{fmt:WXL.NUM,align:{horizontal:'right'},font:{bold:true},fill:WXL.C.tot}));
  put(totR,5,{formula:'IF(B'+totR+'<>0,D'+totR+'/B'+totR+',"")',result:tM?tD/tM:''},{fmt:'0.0%',align:{horizontal:'right'},font:{bold:true},fill:WXL.C.tot});
  /* Умовне форматування відхилення: поза допуском — червоний фон; від'ємне — червоний текст; додатне — зелений */
  const ref='D'+first+':D'+totR,tA='$E$'+r2;
  ws.addConditionalFormatting({ref,rules:[
    {type:'expression',priority:1,formulae:['AND(ISNUMBER(D'+first+'),ISNUMBER(B'+first+'),B'+first+'<>0,ABS(D'+first+')>ABS(B'+first+')*'+tA+'/100)'],style:{fill:{type:'pattern',pattern:'solid',bgColor:{argb:WXL.C.badFill}}}},
    {type:'cellIs',operator:'lessThan',formulae:['0'],priority:2,style:{font:{color:{argb:WXL.C.bad},bold:true}}},
    {type:'cellIs',operator:'greaterThan',formulae:['0'],priority:3,style:{font:{color:{argb:WXL.C.ok},bold:true}}}]});
  let r=totR+2;const note=t=>{ws.mergeCells(r,1,r,5);const c=ws.getCell(r,1);c.value=t;c.font={name:WXL.FONT,size:9,italic:true,color:{argb:WXL.C.note}};c.alignment={wrapText:true,vertical:'top'};ws.getRow(r).height=42;r++;};
  note('Відхилення = загальнобудинковий лічильник − сума по резидентах. Зелений — у будинку витрачено більше, ніж зафіксовано у резидентів (втрати, загальні потреби). Червоний текст — резиденти показали більше, ніж загальнобудинковий (ймовірна помилка показників). Червоний фон — відхилення більше допустимої похибки.');
  /* Блок 3: перевірка даних */
  const ch=data.checks||{};r++;block(r,'3. Перевірка даних');r++;
  const line=(label,v,bad)=>{put(r,1,label);const c=put(r,2,v,{align:{horizontal:'center'},font:{bold:true,color:{argb:bad?WXL.C.bad:WXL.C.ok}}});ws.mergeCells(r,2,r,5);r++;return c;};
  line('Лічильників без показників за період',(ch.missing||[]).length?ch.missing.length+' шт.':'усі внесено',(ch.missing||[]).length>0);
  line('Номери лічильників, що повторюються',(ch.dupSerials||[]).length?ch.dupSerials.join(', '):'немає',(ch.dupSerials||[]).length>0);
  line('Від’ємне споживання (кінець < початку)',(ch.negative||[]).length?ch.negative.join('; '):'немає',(ch.negative||[]).length>0);
  ws.pageSetup={paperSize:9,orientation:'landscape',fitToPage:true,fitToWidth:1,fitToHeight:1,horizontalCentered:true,margins:{left:0.4,right:0.4,top:0.5,bottom:0.5,header:0.3,footer:0.3}};
  ws.headerFooter={oddFooter:'&L&8Duck’s Lake · облік води&R&8&D'};return ws;};
/* Головна функція: mode = 'acc' («Для бухгалтерії») | 'full' («Повний облік») */
WXL.build=function(ExcelJS,data,mode){const wb=new ExcelJS.Workbook();wb.creator='Duck’s Lake';wb.created=new Date();const used=new Set(['Дашборд']);const full=mode==='full';
  if(!data.checks)data={...data,checks:WXL.checks(data)};
  const dws=full?wb.addWorksheet('Дашборд',{properties:{tabColor:{argb:'FFB7791F'}},views:[{showGridLines:false}]}):null;
  const sums=WXL.units(data).map(u=>WXL.buildingSheet(wb,u,data,full,used));
  if(dws)WXL.dashboard(dws,data,sums);wb.views=[{activeTab:0,firstSheet:0,visibility:'visible'}];return wb;};
/* Перевірки, що потрапляють на дашборд */
WXL.checks=function(data){const all=data.buildings.flatMap(b=>b.meters.map(m=>({...m,obj:b.name})));const seen={},dup=new Set();
  all.forEach(m=>{const k=String(m.serial||'').toUpperCase().replace(/[^0-9A-ZА-ЯІЇЄҐ]/g,'');if(!k)return;if(seen[k]&&seen[k]!==m.id)dup.add(m.serial);seen[k]=m.id;});
  return {dupSerials:[...dup],missing:all.filter(m=>m.serial&&m.active!==false&&(WXL.num(m.start)==null||WXL.num(m.end)==null)).map(m=>m.obj+' · '+(m.tenant||m.serial)),
    negative:all.filter(m=>{const d=WXL.diff(m);return d!=null&&d<0;}).map(m=>m.obj+' · '+(m.tenant||'')+' № '+m.serial)};};
/* WXL:END */
