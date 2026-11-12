// ЗГЕНЕРОВАНО з index.html (tools/split_src.py). Не редагуйте вручну — правки робляться в index.html.
// Розділ: Вода: Excel-звіти «Для бухгалтерії» і «Повний облік»

/* ---------- Вода: Excel-звіти «Для бухгалтерії» і «Повний облік» ---------- */
let _xjP=null;function loadExcelJS(){if(window.ExcelJS)return Promise.resolve(window.ExcelJS);
  const urls=['https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js','https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js'];
  if(!_xjP)_xjP=urls.reduce((pr,u)=>pr.catch(()=>new Promise((res,rej)=>{const sc=document.createElement('script');sc.src=u;sc.onload=()=>window.ExcelJS?res(window.ExcelJS):rej(new Error('exceljs'));sc.onerror=()=>{sc.remove();rej(new Error('exceljs'));};document.head.append(sc);})),Promise.reject()).catch(e=>{_xjP=null;throw e;});
  return _xjP;}
/* Дані для звітів (формат описано в docs/water-export.md) */
function wExportData(per){const P=S.wPerD[per]||{};const n=v=>v==null||v===''||isNaN(+v)?null:+v;const d=new Date();
  return {period:{key:per,label:perLabel(per)},generatedAt:pad(d.getDate())+'.'+pad(d.getMonth()+1)+'.'+d.getFullYear()+' '+pad(d.getHours())+':'+pad(d.getMinutes()),
    bill:{m3:n(P.bill),uah:n(P.billUah)},tolerancePct:n(P.tolPct)!=null?n(P.tolPct):5,
    buildings:S.wObj.map(o=>({id:o.id,name:o.name,meters:S.wMet.filter(m=>m.obj===o.id).sort((a,b)=>(a.order||0)-(b.order||0)).map(m=>{const r=wRead(per,m.id)||{};let s=n(r.s);const e=n(r.e);if(s==null&&e!=null)s=wPrevVal(per,m.id);
      return {id:m.id,type:m.kind==='main'?'common':'resident',active:m.active!==false,section:m.section||null,floor:m.floor||'',room:m.room||'',tenant:m.tenant||'',serial:m.serial||'',start:s,end:e};})})).filter(b=>b.meters.length)};}
async function wExportX(per,mode){if(!S.wPerD[per]){toast('Період «'+perLabel(per)+'» ще не створено');return;}
  toast(mode==='full'?'Готую повний облік…':'Готую файл для бухгалтерії…');let EJ;try{EJ=await loadExcelJS();}catch(e){toast('Не вдалося завантажити модуль Excel — перевірте інтернет');return;}
  try{const data=wExportData(per);const ch=WXL.checks(data);if(ch.dupSerials.length)toast('Увага: номери лічильників повторюються — '+ch.dupSerials.slice(0,3).join(', '));
    const wb=WXL.build(EJ,{...data,checks:ch},mode);const buf=await wb.xlsx.writeBuffer();
    await saveFile('Облік води — '+perLabel(per)+' — '+(mode==='full'?'повний облік':'для бухгалтерії')+'.xlsx',new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));}
  catch(e){console.error(e);if(typeof logErr==='function')try{logErr('xlsx: '+(e&&e.message||e));}catch(_){}toast('Не вдалося сформувати файл');}}
