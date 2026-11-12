// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Дебіторська заборгованість

/* ---------- Дебіторська заборгованість ---------- */
const DZ_SHEETS=[{id:'opex',name:'OPEX',xl:'ДЗ OPEX',charge:'Платежі OPEX',c:['#2a78d6','#3987e5']},{id:'util',name:'Комунальні',xl:'ДЗ Комунальні',charge:'Нараховано за комунальні послуги',c:['#eb6834','#d95926']},
  {id:'park',name:'Паркомісця',xl:'Оренда_Паркомісць',charge:'Платіж за оренду паркомісця',park:true,c:['#1baf7a','#199e70']},{id:'mkt',name:'Маркетинг',xl:'ДЗ Маркетинг',charge:'Маркетинговий платіж',c:['#eda100','#c98500']}];
const DZ_B=[{k:'ok',name:'Строк ще не настав',c:'#8FA3A8'},{k:'b0',name:'0–5 днів · технічний борг',c:'#fab219'},{k:'b1',name:'6–15 днів · обдзвін (Богдан К.)',c:'#ec835a'},{k:'b2',name:'16–30 днів · претензія юриста',c:'#d03b3b'},{k:'b3',name:'Понад 30 днів або старий борг · критичний / суд',c:'#8E1F2B'}];
const DZ_SM={'Сплачено':['Сплачено','ok'],'Частково сплачено':['Частково','warn'],'Повідомлено про борг':['Повідомлено','warn'],'Передано інформацію про несплату до Юриста':['У юриста','law'],'Рахунок ще не виставлявся':['Без рахунку','info'],'Під господарські потреби':['Госп. потреби','mute'],'Паркомісце не орендоване':['Не орендоване','mute']};
function dzPill(st){if(!st)return null;const m=DZ_SM[st]||[st,/[Юю]рист|суд/.test(st)?'law':/сплач/i.test(st)?'ok':'mute'];return el('span',{class:'pill t-'+m[1],title:st},el('i'),m[0]);}
const DZ_ST=['Сплачено','Повідомлено про борг','Передано інформацію про несплату до Юриста','Рахунок ще не виставлявся'];
function dzDark(){return isDarkNow();}
function sheetCol(sh){return sh.c[dzDark()?1:0];}
function dzPers(){return [...new Set(Object.values(S.dz).map(d=>d.per).filter(Boolean))].sort();}
function dzCurPer(){const ps=dzPers();if(S.dzPer&&ps.includes(S.dzPer))return S.dzPer;return ps.length?ps[ps.length-1]:ymd(new Date()).slice(0,7);}
const DZ_ALIAS={'Карпач Б.':'Богдан К.','Карпач Богдан':'Богдан К.'};function dzResp(x){x=String(x||'').trim();return DZ_ALIAS[x]||x;}
function dzBld(b){return String(b||'').replace(/^\s*буд(инок|\.)?\s*/i,'').trim();}
function dzRows(per,sheet){const d=S.dz[per+'_'+sheet];if(!d||!d.rows)return [];return Object.entries(d.rows).filter(([,r])=>r&&!r.deleted).map(([id,r])=>({id,sheet,...r,bld:dzBld(r.bld),resp:dzResp(r.resp)})).filter(r=>!(sheet==='park'&&(DZ_NOREC.includes(r.status)||!r.tenant))).sort((a,b)=>(a.order||0)-(b.order||0));}
/* Debt Aging — рахується на льоту від сьогоднішньої дати:
   борг погашено → без категорії й дати; старий борг (сальдо на початок не покрите оплатою) → критичний/суд;
   до дедлайну → поточна заборгованість; прострочка 0–5 / 6–15 / 16–30 / понад 30 днів */
function dzCalc(r){const start=+r.start||0;const total=start+(+r.charge||0);const debt=Math.round((total-(+r.paid||0))*100)/100;let days=null,b=null;
  const old=debt>0.004&&start>0.004&&start-(+r.paid||0)>0.004;
  if(debt>0.004&&r.due){days=Math.floor((Date.now()-parseYmd(r.due).getTime())/864e5);}
  if(debt>0.004)b=old?'b3':days==null||days<0?'ok':days<=5?'b0':days<=15?'b1':days<=30?'b2':'b3';return {total,debt,days,b,old};}
function uah(v,short){if(v==null||isNaN(v))return '—';if(short&&Math.abs(v)<0.005)return '0';const a=Math.abs(v);if(short&&a>=1e6)return (v/1e6).toLocaleString('uk-UA',{maximumFractionDigits:2})+' млн';if(short&&a>=1e4)return Math.round(v/1e3).toLocaleString('uk-UA')+' тис';return v.toLocaleString('uk-UA',{minimumFractionDigits:2,maximumFractionDigits:2});}
function canDz(){return isDev();}
const DZ_NOREC=['Паркомісце не орендоване','Під господарські потреби'];
const DZ_ACTS=['Нагадування в месенджері','Телефонний дзвінок','Офіційний лист-повідомлення','Претензія юриста','Графік погашення погоджено','Часткова оплата, контроль залишку','Підготовка позову','Позов подано до суду','Обмеження доступу / послуг'];
function dzAll(per){const out=[];for(const sh of DZ_SHEETS){if(S.dzCat!=='all'&&S.dzCat!==sh.id)continue;dzRows(per,sh.id).forEach(r=>{if(S.dzBld&&r.bld!==S.dzBld)return;
  if(S.dzSt&&(S.dzSt==='__none'?!!r.status:r.status!==S.dzSt))return;if(S.dzAct&&(S.dzAct==='__none'?!!r.act:r.act!==S.dzAct))return;if(S.dzResp&&(S.dzResp==='__none'?!!r.resp:r.resp!==S.dzResp))return;out.push(r);});}return out;}
function selOther(id,label,opts,val,none){const s=el('select',{id},el('option',{value:'',text:none}),opts.map(o=>el('option',{value:o,text:o})),el('option',{value:'__other',text:'Інше… (ввести вручну)'}));
  const o=el('input',{id:id+'_o',placeholder:'Введіть свій варіант',value:val&&!opts.includes(val)?val:'',hidden:true});s.value=val?(opts.includes(val)?val:'__other'):'';o.hidden=s.value!=='__other';
  s.addEventListener('change',()=>{o.hidden=s.value!=='__other';if(!o.hidden)o.focus();});
  const proxy={get value(){return s.value==='__other'?o.value:s.value;},addEventListener:(e,f)=>{s.addEventListener(e,f);o.addEventListener('input',f);}};
  return [proxy,el('label',{for:id},label,s,o)];}
function plural(n,a,b,c){const m=n%10,h=n%100;return m===1&&h!==11?a:m>=2&&m<=4&&(h<10||h>=20)?b:c;}
function dzSel(label,key,opts,none){const s=el('select',{class:'dz-bsel','aria-label':label},el('option',{value:'',text:label}),none?el('option',{value:'__none',text:none}):null,opts.map(o=>el('option',{value:o,text:o})));s.value=S[key]||'';
  if(S[key])s.classList.add('on');s.addEventListener('change',()=>{S[key]=s.value;render();});return s;}
function dzTip(e,html){let t=document.getElementById('dzTip');if(!t){t=el('div',{id:'dzTip',class:'dz-tip'});document.body.append(t);}t.replaceChildren(...html);t.style.display='block';
  const x=Math.min(innerWidth-t.offsetWidth-8,Math.max(8,e.clientX+12)),y=Math.max(8,e.clientY-t.offsetHeight-12);t.style.left=x+'px';t.style.top=y+'px';}
function dzTipOff(){clearTimeout(dzTipOff.t);const t=document.getElementById('dzTip');if(t)t.style.display='none';}
function hov(node,fn){node.addEventListener('pointermove',e=>{if(e.pointerType==='mouse')dzTip(e,fn());});node.addEventListener('pointerleave',dzTipOff);node.addEventListener('pointercancel',dzTipOff);
  node.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'){e.stopPropagation();dzTip(e,fn());clearTimeout(dzTipOff.t);dzTipOff.t=setTimeout(dzTipOff,2500);}});return node;}
addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')dzTipOff();},true);addEventListener('scroll',()=>dzTipOff(),true);addEventListener('blur',()=>dzTipOff());
/* Верхній ряд дебіторки як рівняння: на початок + за місяць = всього − сплачено → борг на кінець */
/* Підсумки верхнього ряду: один розрахунок для вкладки й звіту. prevRows — рядки попереднього місяця з тими самими фільтрами */
function dzEqCalc(per,rows,prevRows){const sum=f=>rows.reduce((a,r)=>a+(f(r)||0),0);
  const hasStart=rows.some(r=>r.start!=null&&r.start!=='');const prevPer=perShift(per,-1);
  let start=null,startSub='',startN=0;
  if(hasStart){start=sum(r=>+r.start||0);startN=rows.filter(r=>(+r.start||0)>0.004).length;startSub='станом на 01.'+per.slice(5,7)+' · '+startN+' '+plural(startN,'боржник','боржники','боржників');}
  else if(prevRows&&prevRows.length){start=prevRows.reduce((a,r)=>a+(r.debt||0),0);startN=prevRows.filter(r=>r.debt>0.004).length;startSub='станом на 01.'+per.slice(5,7)+' · з '+mtMonLow(prevPer)+' · '+startN+' '+plural(startN,'боржник','боржники','боржників');}
  else startSub='немає даних за попередній місяць';
  const month=sum(r=>+r.charge||0),charged=sum(r=>r.total),paid=sum(r=>+r.paid||0),debt=sum(r=>r.debt>0?r.debt:0),over=sum(r=>r.debt<0?-r.debt:0);
  const debtors=rows.filter(r=>r.debt>0.004).length;const overdue=sum(r=>r.b&&r.b!=='ok'?r.debt:0);const rate=charged?paid/charged:0;
  return {start,startSub,startN,month,charged,paid,debt,over,debtors,overdue,rate};}
function dzEquation(per,rows){const loading=!S.dzLoaded;
  const prevPer=perShift(per,-1);const prevRows=dzPers().includes(prevPer)?dzAll(prevPer).map(r=>({...r,...dzCalc(r)})):null;
  const {start,startSub,month,charged,paid,debt,over,debtors,overdue,rate}=dzEqCalc(per,rows,prevRows);
  if(!loading&&(isDev()||S.isOwner)){if(start!=null&&Math.abs(start+month-charged)>1)console.warn('[ДЗ] на початок + за місяць ≠ нараховано всього',{per,start,month,charged,diff:start+month-charged});
    if(Math.abs(charged-paid-(debt-over))>1)console.warn('[ДЗ] нараховано всього − сплачено ≠ борг на кінець',{per,charged,paid,debt,over,diff:charged-paid-(debt-over)});}
  const full=v=>uah(v)+' гривень';const val=(v,txt)=>loading?el('b',{class:'dzq-sk','aria-hidden':'true'},' '):el('b',{text:txt!=null?txt:uah(v,true)+' ₴'});
  const card=(cls,area,title,v,txt,aria,...subs)=>el('div',{class:'card dzq-c '+cls,style:'grid-area:'+area,role:'group','aria-label':loading?title+': завантаження':aria},el('span',{class:'dzq-t',text:title}),val(v,txt),el('div',{class:'dzq-s'},subs.filter(Boolean)));
  const op=(sym,area)=>el('span',{class:'dzq-op',style:'grid-area:'+area,'aria-hidden':'true',text:sym});const mon=perLabel(per).toLowerCase();
  return el('div',{class:'dzq'},
    card('','a','Дебіторська заборгованість на початок періоду',start,start==null?'—':null,'Дебіторська заборгованість на початок періоду: '+(start==null?'немає даних':full(start)),el('small',{text:startSub})),op('+','o1'),
    card('','b','Нараховано поточного місяця',month,null,'Нараховано поточного місяця: '+full(month),el('small',{text:'за '+mon})),op('=','o2'),
    card('','c','Нараховано всього',charged,null,'Нараховано всього: '+full(charged),el('small',{text:'початок періоду + місяць'})),op('−','o3'),
    card('','d','Сплачено',paid,null,'Сплачено: '+full(paid)+', зібрано '+Math.round(rate*100)+'%',el('div',{class:'dz-rate'},el('div',{class:'w-prog'},el('i',{style:'width:'+Math.round(Math.min(1,rate)*100)+'%;background:linear-gradient(90deg,#1baf7a,#0ca30c)'})),el('small',{text:Math.round(rate*100)+'% зібрано'}))),op('→','o4'),
    card('res','r','Дебіторська заборгованість',debt,null,'Дебіторська заборгованість на кінець: '+full(debt)+', боржників '+debtors+(over?', переплата '+full(over):''),el('small',{text:debtors+' '+plural(debtors,'боржник','боржники','боржників')+' · прострочено '+uah(overdue,true)+' ₴'}),over?el('small',{text:'переплата: '+uah(over,true)+' ₴'}):null));}
