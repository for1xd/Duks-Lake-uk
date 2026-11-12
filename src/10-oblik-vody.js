// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Облік води

/* ---------- Облік води ---------- */
const MON_NOM=['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];
function perLabel(p){const [y,m]=p.split('-').map(Number);return MON_NOM[m-1]+' '+y;}
function perShift(p,k){let [y,m]=p.split('-').map(Number);m+=k;while(m<1){m+=12;y--;}while(m>12){m-=12;y++;}return y+'-'+pad(m);}
function wCurPer(){if(S.wPer)return S.wPer;const now=ymd(new Date()).slice(0,7);const ks=Object.keys(S.wPerD).filter(k=>k<=now).sort();return S.wPerD[now]?now:(ks.length?ks[ks.length-1]:now);}
function wRead(per,mid){const d=S.wPerD[per];return d&&d.reads&&d.reads[mid]||null;}
function wCons(per,mid){const r=wRead(per,mid);if(!r||r.s==null||r.e==null||r.s===''||r.e==='')return null;return Math.round((+r.e-+r.s)*1000)/1000;}
function fm3(v){if(v==null)return '—';const r=Math.round(v*100)/100;return r.toLocaleString('uk-UA',{maximumFractionDigits:2});}
function wStats(per,oid){const ms=S.wMet.filter(m=>m.obj===oid);const sum=a=>a.reduce((t,m)=>t+(wCons(per,m.id)||0),0);
  const main=ms.filter(m=>m.kind==='main'&&m.active!==false),res=ms.filter(m=>m.kind==='res');const withSerial=ms.filter(m=>m.serial);
  const filled=withSerial.filter(m=>{const r=wRead(per,m.id);return r&&r.e!=null&&r.e!=='';}).length;
  const bad=ms.filter(m=>{const c=wCons(per,m.id);return c!=null&&c<0;}).length;
  const M=sum(main),R=sum(res);return {main:M,res:R,dev:res.length?M-R:null,actual:res.length?R:M,filled,total:withSerial.length,bad,n:ms.length,hasRes:res.length>0};}
function canW(){return isUK();}
function wSetRead(per,mid,field,val){const v=val===''?null:Math.round(parseFloat(String(val).replace(',','.'))*1000)/1000;if(val!==''&&isNaN(v)){toast('Введіть число');return;}
  if(field==='e'){const old=(wRead(per,mid)||{}).e;const nx=perShift(per,1);const nd=S.wPerD[nx];if(nd){const nr=(nd.reads||{})[mid]||{};if(nr.s==null||nr.s===''||(old!=null&&+nr.s===+old)){nd.reads=nd.reads||{};nd.reads[mid]={...nr,s:v};write(()=>S.db.doc('wPeriods/'+nx).update({reads:{[mid]:{s:v}}}));}}}
  S.wPerD[per]=S.wPerD[per]||{reads:{}};S.wPerD[per].reads=S.wPerD[per].reads||{};S.wPerD[per].reads[mid]={...(S.wPerD[per].reads[mid]||{}),[field]:v};
  write(()=>S.db.doc('wPeriods/'+per).update({reads:{[mid]:{[field]:v}},updatedAt:Date.now(),updatedBy:S.myId}));}
function wNewPeriod(per){const ks=Object.keys(S.wPerD).filter(k=>k<per).sort();const prev=ks[ks.length-1];const reads={};
  if(prev){const pr=S.wPerD[prev].reads||{};for(const m of S.wMet){const r=pr[m.id];if(r&&r.e!=null)reads[m.id]={s:r.e,e:null};}}
  write(()=>S.db.doc('wPeriods/'+per).set({reads,bill:null,at:Date.now(),by:S.myId}),'Період «'+perLabel(per)+'» створено');}
function wPerBar(per){const exists=!!S.wPerD[per];return el('div',{class:'w-per card'},
  el('button',{class:'iconbtn',type:'button','aria-label':'Попередній місяць',onclick:()=>{S.wPer=perShift(per,-1);render();}},svg('<path d="M15 5l-7 7 7 7"/>')),
  el('div',{class:'w-per-c'},el('b',{text:perLabel(per)}),el('span',{class:'muted small',text:exists?'звітний період':'ще не створено'})),
  el('button',{class:'iconbtn',type:'button','aria-label':'Наступний місяць',onclick:()=>{S.wPer=perShift(per,1);render();}},svg('<path d="m9 5 7 7-7 7"/>')));}
/* Зведення та баланс: скільки води з рахунку Водоканалу перевиставлено резидентам, а скільки — нестача УК */
function wBalance(per,actual,mains,billIn,uahIn){const P=S.wPerD[per]||{};const norm=P.tolPct!=null&&!isNaN(+P.tolPct)?+P.tolPct:5;
  const R=54,C=2*Math.PI*R;const NS='http://www.w3.org/2000/svg';const mk=(t,a)=>{const n=document.createElementNS(NS,t);for(const k in a)n.setAttribute(k,a[k]);return n;};
  const svgEl=mk('svg',{viewBox:'0 0 140 140',class:'wb-donut',role:'img'});const track=mk('circle',{cx:70,cy:70,r:R,class:'wb-track'});
  const arcA=mk('circle',{cx:70,cy:70,r:R,class:'wb-a','stroke-dasharray':'0 '+C,transform:'rotate(-90 70 70)'});const arcL=mk('circle',{cx:70,cy:70,r:R,class:'wb-l','stroke-dasharray':'0 '+C,transform:'rotate(-90 70 70)'});
  svgEl.append(track,arcL,arcA);const cPct=el('b',{class:'wb-pct'}),cLbl=el('small',{class:'wb-cl'});
  const donut=el('div',{class:'wb-dwrap'},svgEl,el('div',{class:'wb-center'},cPct,cLbl));
  const rowA=el('div',{class:'wb-li a'}),rowL=el('div',{class:'wb-li l'}),hint=el('p',{class:'wb-hint'}),split=el('div',{class:'wb-split'});
  const parse=inp=>{const t=String(inp.value||'').trim().replace(/\s/g,'').replace(',','.');if(t==='')return null;const v=parseFloat(t);return isNaN(v)?NaN:v;};
  const pct=v=>(Math.round(v*10)/10).toLocaleString('uk-UA',{maximumFractionDigits:1})+'%';
  const li=(row,cls,name,m3,p,extra)=>row.replaceChildren(el('i',{class:'wb-sw '+cls}),el('span',{class:'wb-ln'},el('span',{text:name}),extra?el('small',{text:extra}):null),el('span',{class:'wb-lv'},el('b',{text:m3}),el('small',{text:p})));
  const card=el('div',{class:'card wb'});
  const upd=()=>{const bill=parse(billIn),uah=parse(uahIn);const ok=bill!=null&&!isNaN(bill)&&bill>0;card.classList.toggle('wb-empty',!ok);
    if(!ok){arcA.setAttribute('stroke-dasharray','0 '+C);arcL.setAttribute('stroke-dasharray','0 '+C);cPct.textContent='—';cLbl.textContent='немає рахунку';
      li(rowA,'a','Зібрана вода (розподілено)',fm3(actual)+' м³','');rowL.replaceChildren();split.replaceChildren();
      hint.textContent=bill!=null&&isNaN(bill)?'Введіть число в полі рахунку.':'Введіть дані рахунку Водоканалу (м³) — побачите, яку частку води перевиставлено резидентам, а яка є нестачею УК.';svgEl.setAttribute('aria-label','Баланс: немає даних рахунку');return;}
    const got=Math.max(0,Math.min(actual,bill)),loss=bill-actual,lossP=Math.max(0,loss)/bill*100,gotP=got/bill*100;const over=loss<0;const bad=lossP>norm;
    card.classList.toggle('bad',bad);card.classList.toggle('over',over);
    const la=C*gotP/100,ll=C*lossP/100,gap=la&&ll?1.5:0;arcA.setAttribute('stroke-dasharray',Math.max(0,la-gap)+' '+C);arcL.setAttribute('stroke-dasharray',Math.max(0,ll-gap)+' '+C);arcL.setAttribute('stroke-dashoffset',String(-la));
    cPct.textContent=pct(gotP);cLbl.textContent='зібрано';
    const price=uah!=null&&!isNaN(uah)&&uah>0?uah/bill:null;const money=v=>price?'≈ '+Math.round(v*price).toLocaleString('uk-UA')+' грн':'';
    li(rowA,'a','Зібрана вода (розподілено)',fm3(got)+' м³',pct(gotP),money(got));
    if(over)li(rowL,'o','Перевиставлено понад рахунок',fm3(-loss)+' м³','+'+pct(-loss/bill*100),'резиденти показали більше, ніж у рахунку');
    else li(rowL,'l'+(bad?' bad':''),'Нестача / втрати УК',fm3(loss)+' м³',pct(lossP),[money(loss),'норма ≤ '+pct(norm)].filter(Boolean).join(' · '));
    hint.textContent=over?'Сума по резидентах більша за рахунок — перевірте показники або рахунок.':bad?'Втрати вище норми — варто перевірити об’єкти з найбільшим відхиленням.':'Втрати в межах норми.';
    const net=bill-mains,inn=mains-actual;split.replaceChildren(el('span',{class:'muted small',text:'Звідки різниця:'}),
      el('span',{class:'small'},'рахунок − загальнобудинкові ',el('b',{class:net>0?'neg':'',text:(net>0?'+':'')+fm3(net)+' м³'})),
      el('span',{class:'small'},'загальнобудинкові − резиденти ',el('b',{class:inn>0?'neg':'',text:(inn>0?'+':'')+fm3(inn)+' м³'})));
    svgEl.setAttribute('aria-label','Зібрано '+pct(gotP)+', '+(over?'перевиставлено понад рахунок':'нестача '+pct(lossP)));};
  billIn.addEventListener('input',upd);uahIn.addEventListener('input',upd);
  card.append(el('div',{class:'wb-h'},el('b',{text:'Зведення та баланс'}),el('span',{class:'muted small',text:perLabel(per)})),
    el('div',{class:'wb-in'},el('span',{class:'muted small',text:'Рахунок Водоканалу'}),el('label',{class:'wb-f'},billIn,el('small',{text:'м³'})),el('label',{class:'wb-f'},uahIn,el('small',{text:'грн'}))),
    el('div',{class:'wb-body'},donut,el('div',{class:'wb-legend'},rowA,rowL,split)),hint);
  upd();return card;}
function waterHome(){const per=wCurPer();const out=[wPerBar(per)];
  if(!S.wPerD[per]){out.push(el('div',{class:'card empty'},el('span',{class:'w-drop big'},svg(UKS.water.ic)),el('h2',{text:'Період ще не створено'}),
    el('p',{class:'muted',text:'Початкові показники візьмемо з кінцевих попереднього місяця — залишиться внести нові.'}),canW()?el('button',{class:'btn',type:'button',onclick:()=>wNewPeriod(per)},'Створити «'+perLabel(per)+'»'):null));
    if(!S.wObj.length)return out;}
  const st=S.wObj.map(o=>[o,wStats(per,o.id)]);const actual=st.reduce((a,[,x])=>a+x.actual,0),mains=st.reduce((a,[,x])=>a+x.main,0);
  const filled=st.reduce((a,[,x])=>a+x.filled,0),total=st.reduce((a,[,x])=>a+x.total,0);const bill=S.wPerD[per]&&S.wPerD[per].bill;
  if(S.wPerD[per]){const billIn=el('input',{type:'text',inputmode:'decimal',value:bill==null?'':String(bill),placeholder:'м³',class:'w-bill','aria-label':'Рахунок Водоканалу, м³',disabled:canW()?null:true});
    const billUah=S.wPerD[per].billUah;const billUahIn=el('input',{type:'text',inputmode:'decimal',value:billUah==null?'':String(billUah),placeholder:'грн',class:'w-bill','aria-label':'Рахунок Водоканалу, грн',disabled:canW()?null:true});
    billUahIn.addEventListener('change',()=>{const t=billUahIn.value.trim().replace(/\s/g,'').replace(',','.');const v=t===''?null:parseFloat(t);if(t!==''&&isNaN(v)){toast('Введіть число');return;}write(()=>S.db.doc('wPeriods/'+per).update({billUah:v}),'Збережено');});
    billIn.addEventListener('change',()=>{const v=billIn.value.trim()===''?null:parseFloat(billIn.value.replace(',','.'));if(billIn.value.trim()!==''&&isNaN(v)){toast('Введіть число');return;}write(()=>S.db.doc('wPeriods/'+per).update({bill:v}),'Збережено');});
    const kMain=el('div',{class:'card w-k main'},el('span',{class:'muted small',text:'Фактичне споживання'}),el('b',{},fm3(actual),el('small',{text:' м³'})),el('span',{class:'muted small',text:'сума по резидентах і окремих лічильниках'}));
    const kMains=el('div',{class:'card w-k'},el('span',{class:'muted small',text:'По загальнобудинкових'}),el('b',{},fm3(mains),el('small',{text:' м³'})));
    const kFill=el('div',{class:'card w-k'},el('span',{class:'muted small',text:'Внесено показників'}),el('b',{},filled+' / '+total),el('div',{class:'w-prog'},el('i',{style:'width:'+(total?Math.round(filled/total*100):0)+'%'})));
    out.push(el('div',{class:'w-top'},el('div',{class:'w-kpi3'},kMain,kMains,kFill),wBalance(per,actual,mains,billIn,billUahIn)));}
  out.push(el('div',{class:'row between'},el('h2',{text:'Об’єкти'}),el('div',{class:'row',style:'gap:6px'},canW()&&S.wPerD[per]?el('button',{class:'btn sm wp-btn',type:'button',onclick:()=>wPhotoImport(per)},svg('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),' З фото'):null,...ioBtns(()=>wExportMenu(per),canW()?()=>wImport(per):null),canW()?el('button',{class:'btn ghost sm',type:'button',onclick:()=>wObjSheet(null)},'+ Об’єкт'):null)));
  out.push(el('div',{class:'w-objs'},st.map(([o,x])=>el('button',{type:'button',class:'card w-obj',onclick:()=>{S.hist.push(snap());S.wObjSel=o.id;S.wQ='';SC().scrollTop=0;render();animIn(1);}},
    el('div',{class:'w-oh'},el('span',{class:'w-drop'},svg(UKS.water.ic)),el('b',{text:o.name}),x.bad?el('span',{class:'w-badge bad',text:'⚠ '+x.bad}):null,el('span',{class:'uk-go'},svg('<path d="m9 6 6 6-6 6"/>'))),
    el('div',{class:'w-ostats'},
      el('span',{},el('small',{text:x.hasRes?'Загальнобудинковий':'Лічильники'}),el('b',{text:fm3(x.main)+' м³'})),
      x.hasRes?el('span',{},el('small',{text:'Резиденти'}),el('b',{text:fm3(x.res)+' м³'})):null,
      x.hasRes?el('span',{class:x.dev<0?'neg':x.dev>0?'warn':''},el('small',{text:'Відхилення'}),el('b',{text:(x.dev>0?'+':'')+fm3(x.dev)+' м³'})):null),
    el('div',{class:'w-prog'},el('i',{style:'width:'+(x.total?Math.round(x.filled/x.total*100):0)+'%'})),el('span',{class:'muted small',text:'внесено '+x.filled+' з '+x.total+' лічильників'})))));
  return out;}
function wNumIn(per,m,field,ro){const r=wRead(per,m.id)||{};const v=r[field];const i=el('input',{type:'text',inputmode:'decimal',class:'w-in','data-k':m.id+'.'+field,'aria-label':(field==='s'?'Початок':'Кінець')+' '+(m.tenant||m.serial),value:v==null?'':String(v).replace('.',','),placeholder:'—',disabled:ro?true:null});
  i.addEventListener('focus',()=>i.select());i.addEventListener('change',()=>wSetRead(per,m.id,field,i.value.trim()));i.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();const all=[...document.querySelectorAll('.w-in:not([disabled])')];const k=all.indexOf(i);if(all[k+1])all[k+1].focus();else i.blur();}});return el('label',{class:'w-cell '+field},el('small',{text:field==='s'?'Початок':'Кінець'}),i);}
function waterObject(oid){const o=S.wObj.find(x=>x.id===oid);if(!o)return [el('div',{class:'card empty'},el('p',{text:'Об’єкт не знайдено'}))];const per=wCurPer();const ro=!canW()||!S.wPerD[per];
  const ms=S.wMet.filter(m=>m.obj===oid);const x=wStats(per,oid);const q=(S.wQ||'').toLowerCase();
  const match=m=>!q||[m.tenant,m.serial,m.room,m.tech,m.floor,m.note].join(' ').toLowerCase().includes(q);
  const out=[wPerBar(per)];
  if(!S.wPerD[per])out.push(el('div',{class:'card',style:'display:flex;gap:10px;align-items:center'},el('span',{class:'muted',style:'flex:1',text:'Період «'+perLabel(per)+'» ще не створено.'}),canW()?el('button',{class:'btn sm',type:'button',onclick:()=>wNewPeriod(per)},'Створити'):null));
  out.push(el('div',{class:'w-sum card'},el('div',{},el('small',{text:x.hasRes?'Загальнобудинковий':'Разом'}),el('b',{text:fm3(x.main)+' м³'})),x.hasRes?el('div',{},el('small',{text:'Резиденти'}),el('b',{text:fm3(x.res)+' м³'})):null,
    x.hasRes?el('div',{class:x.dev<0?'neg':x.dev>0?'warn':''},el('small',{text:'Відхилення'}),el('b',{text:(x.dev>0?'+':'')+fm3(x.dev)+' м³'})):null,el('div',{},el('small',{text:'Внесено'}),el('b',{text:x.filled+'/'+x.total}))));
  const qi=el('input',{type:'search',placeholder:'Пошук: орендар, лічильник, приміщення',value:S.wQ||'','aria-label':'Пошук'});qi.addEventListener('input',()=>{S.wQ=qi.value;const p=qi.selectionStart;render();const n=document.querySelector('.w-tools input');if(n){n.focus();n.setSelectionRange(p,p);}});
  out.push(el('div',{class:'w-tools'},qi,canW()?el('button',{class:'btn sm',type:'button',onclick:()=>wMeterSheet(null,oid)},'+ Резидент / лічильник'):null,canW()?el('button',{class:'btn ghost sm',type:'button',onclick:()=>wObjSheet(o)},'⚙'):null));
  const tbl=el('div',{class:'w-tbl'},el('div',{class:'w-tr w-th'},['Пов.','Прим.','Орендар / власник','№ лічильника','Початок, м³','Кінець, м³','Спожито, м³',''].map(t=>el('span',{text:t}))));
  const row=m=>{const c=wCons(per,m.id);const noM=!m.serial;
    return el('div',{class:'w-tr'+(m.kind==='main'?' main':'')+(m.active===false?' off':'')+(noM?' nometer':'')+(c!=null&&c<0?' bad':'')},
      el('span',{class:'w-fl',text:m.floor||''}),el('span',{class:'w-rm',text:[m.room,m.tech].filter(Boolean).join(' · ')}),
      el('span',{class:'w-tn'},el('b',{text:m.tenant||(m.kind==='main'?'Загальнобудинковий':'—')}),m.note?el('small',{text:m.note}):null,m.kind==='main'?el('em',{text:m.active===false?'не діючий':'загальнобудинковий'}):null),
      el('span',{class:'w-sn',text:m.serial||'немає лічильника'}),
      noM?el('span',{class:'w-nm'}):wNumIn(per,m,'s',ro),noM?el('span',{class:'w-nm'}):wNumIn(per,m,'e',ro),
      el('span',{class:'w-c'},c==null?'—':fm3(c),c!=null&&c<0?el('small',{text:'кінець < початку'}):null,(()=>{const rd=wRead(per,m.id)||{};return rd.ph?el('button',{type:'button',class:'w-phb',title:'Фото лічильника','aria-label':'Фото лічильника',onclick:()=>viewPhoto(rd.ph.id)},svg('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>')):null;})()),
      canW()?el('button',{type:'button',class:'w-ed','aria-label':'Редагувати',onclick:()=>wMeterSheet(m,oid)},svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>')):el('span'));};
  const mains=ms.filter(m=>m.kind==='main'&&match(m));if(mains.length)tbl.append(el('div',{class:'w-grp',text:'Загальнобудинкові лічильники'}),...mains.map(row));
  const secs=o.sections&&o.sections.length?o.sections:[null];
  for(const sec of secs){const rs=ms.filter(m=>m.kind==='res'&&(sec==null||m.section===sec));const vis=rs.filter(match);if(!vis.length&&q)continue;
    tbl.append(el('div',{class:'w-grp',text:(sec||'Резиденти')+' · '+rs.length}));
    let i=0;while(i<vis.length){const t=vis[i].tenant;let j=i;while(j<vis.length&&vis[j].tenant===t&&t)j++;if(j-i>1){vis.slice(i,j).forEach(m=>tbl.append(row(m)));const sub=vis.slice(i,j).reduce((a,m)=>a+(wCons(per,m.id)||0),0);tbl.append(el('div',{class:'w-sub'},el('span',{text:'Разом '+t}),el('b',{text:fm3(sub)+' м³'})));i=j;}else{tbl.append(row(vis[i]));i++;}}
    if(sec)tbl.append(el('div',{class:'w-tot'},el('span',{text:'Всього по '+sec.toLowerCase()}),el('b',{text:fm3(rs.reduce((a,m)=>a+(wCons(per,m.id)||0),0))+' м³'})));}
  tbl.append(el('div',{class:'w-tot big'},el('span',{text:'Всього по резидентах'}),el('b',{text:fm3(x.res)+' м³'})));
  if(x.hasRes){const miss=S.wMet.filter(m=>m.obj===oid&&m.kind==='res'&&m.serial&&!(m.note||'').match(/закрит|нема/i)).filter(m=>{const r=wRead(per,m.id)||{};return r.e==null||r.e===''||r.s==null||r.s==='';});
    const expl=x.dev>0.004?'Загальнобудинковий лічильник показав на '+fm3(x.dev)+' м³ більше, ніж сума резидентів: це вода, яку не розподілено між резидентами (немає показника, немає лічильника, загальні потреби або втрати).':x.dev<-0.004?'Резиденти разом спожили на '+fm3(-x.dev)+' м³ більше, ніж показав загальнобудинковий: найчастіше це помилка в показнику або лічильник іншого будинку.':'Загальнобудинковий і сума резидентів збігаються.';
    tbl.append(el('div',{class:'w-tot dev '+(x.dev<0?'neg':x.dev>0?'warn':'')},el('span',{},el('span',{text:'Відхилення загальнобудинкового від резидентів'}),el('small',{class:'w-dexp',text:expl}),
      miss.length?el('small',{class:'w-dmiss',text:'⚠ Не внесено показники: '+[...new Set(miss.map(m=>m.tenant||m.serial))].join(', ')+' — відхилення поки неточне.'}):null),el('b',{text:(x.dev>0?'+':'')+fm3(x.dev)+' м³'})));}
  out.push(tbl);return out;}
function wMeterSheet(m,oid){const o=S.wObj.find(x=>x.id===oid)||{};const isNew=!m;m=m||{obj:oid,kind:'res',active:true};
  const f=(id,lbl,val,ph)=>{const i=el('input',{id,value:val||'',placeholder:ph||''});return [i,el('label',{for:id},lbl,i)];};
  const [ten,tenL]=f('wmT','Орендар / власник',m.tenant,'Напр.: Mushlya');const [ser,serL]=f('wmS','№ лічильника',m.serial,'Порожньо — лічильника немає');
  const [fl,flL]=f('wmF','Поверх',m.floor);const [rm,rmL]=f('wmR','Приміщення (арх.)',m.room);const [te,teL]=f('wmTe','№ по техпаспорту',m.tech);const [nt,ntL]=f('wmN','Примітка',m.note,'Напр.: Наукова / Буд 1.2');
  const kind=el('select',{id:'wmK'},el('option',{value:'res',text:'Лічильник резидента'}),el('option',{value:'main',text:'Загальнобудинковий / окремий'}));kind.value=m.kind||'res';
  const act=el('input',{type:'checkbox',id:'wmA'});act.checked=m.active!==false;
  const sec=o.sections&&o.sections.length?el('select',{id:'wmSe'},o.sections.map(x=>el('option',{value:x,text:x}))):null;if(sec)sec.value=m.section||o.sections[0];
  openSheet(el('h2',{text:isNew?'Новий резидент / лічильник':'Редагувати'}),tenL,serL,el('div',{class:'grid2'},flL,rmL),el('div',{class:'grid2'},teL,ntL),
    el('label',{for:'wmK'},'Тип',kind),sec?el('label',{for:'wmSe'},'Будинок',sec):null,el('label',{class:'row',style:'gap:8px;align-items:center'},act,'Діючий лічильник'),
    el('div',{class:'row'},el('button',{class:'btn',type:'button',style:'flex:1',onclick:()=>{const d={obj:oid,kind:kind.value,tenant:ten.value.trim(),serial:ser.value.trim(),floor:fl.value.trim(),room:rm.value.trim(),tech:te.value.trim(),note:nt.value.trim(),active:act.checked,section:sec?sec.value:null};
      if(!d.tenant&&!d.serial){toast('Вкажіть орендаря або номер лічильника');return;}closeSheet();
      if(isNew){const mx=S.wMet.filter(x=>x.obj===oid&&(sec?x.section===d.section:true)).reduce((a,x)=>Math.max(a,x.order||0),0);write(()=>S.db.collection('wMeters').add({...d,order:mx+0.5,at:Date.now()}),'Додано');}
      else write(()=>S.db.doc('wMeters/'+m.id).update(d),'Збережено');}},isNew?'Додати':'Зберегти'),
      !isNew?el('button',{class:'btn danger',type:'button',onclick:()=>confirmSheet('Видалити «'+(m.tenant||m.serial)+'»? Показники цього лічильника в історії залишаться.','Видалити',()=>write(()=>S.db.doc('wMeters/'+m.id).delete(),'Видалено'))},'Видалити'):null),
    el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'));}
function wObjSheet(o){const isNew=!o;const nm=el('input',{id:'woN',value:o?o.name:'',placeholder:'Напр.: Будинок 5'});const sc=el('input',{id:'woS',value:o&&o.sections?o.sections.join(', '):'',placeholder:'Необов’язково: Будинок 2, Будинок 4'});
  openSheet(el('h2',{text:isNew?'Новий об’єкт':'Налаштування об’єкта'}),el('label',{for:'woN'},'Назва',nm),el('label',{for:'woS'},'Частини (через кому)',sc),
    el('div',{class:'row'},el('button',{class:'btn',type:'button',style:'flex:1',onclick:()=>{const n=nm.value.trim();if(!n){toast('Вкажіть назву');return;}const secs=sc.value.split(',').map(x=>x.trim()).filter(Boolean);closeSheet();
      if(isNew)write(()=>S.db.collection('wObjects').add({name:n,sections:secs.length?secs:null,order:S.wObj.length+1}),'Об’єкт додано');else write(()=>S.db.doc('wObjects/'+o.id).update({name:n,sections:secs.length?secs:null}),'Збережено');}},isNew?'Додати':'Зберегти'),
      !isNew?el('button',{class:'btn danger',type:'button',onclick:()=>confirmSheet('Видалити об’єкт «'+o.name+'» разом з усіма його лічильниками?','Видалити',()=>write(async()=>{for(const m of S.wMet.filter(x=>x.obj===o.id))await S.db.doc('wMeters/'+m.id).delete();await S.db.doc('wObjects/'+o.id).delete();S.wObjSel=null;back();},'Видалено'))},'Видалити'):null),
    el('button',{class:'btn ghost',type:'button',onclick:closeSheet},'Скасувати'));}
let _xlsxP=null;function loadXlsx(){if(window.XLSX)return Promise.resolve(window.XLSX);if(!_xlsxP)_xlsxP=new Promise((res,rej)=>{const sc=document.createElement('script');sc.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';sc.onload=()=>res(window.XLSX);sc.onerror=()=>{_xlsxP=null;rej(new Error('xlsx'));};document.head.append(sc);});return _xlsxP;}
